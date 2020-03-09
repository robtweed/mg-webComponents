/*

 ----------------------------------------------------------------------------
 | mg-webComponents: Dynamically-loading WebComponents Framework             |
 |                                                                           |
 | Copyright (c) 2020 M/Gateway Developments Ltd,                            |
 | Redhill, Surrey UK.                                                       |
 | All rights reserved.                                                      |
 |                                                                           |
 | http://www.mgateway.com                                                   |
 | Email: rtweed@mgateway.com                                                |
 |                                                                           |
 |                                                                           |
 | Licensed under the Apache License, Version 2.0 (the "License");           |
 | you may not use this file except in compliance with the License.          |
 | You may obtain a copy of the License at                                   |
 |                                                                           |
 |     http://www.apache.org/licenses/LICENSE-2.0                            |
 |                                                                           |
 | Unless required by applicable law or agreed to in writing, software       |
 | distributed under the License is distributed on an "AS IS" BASIS,         |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  |
 | See the License for the specific language governing permissions and       |
 |  limitations under the License.                                           |
 ----------------------------------------------------------------------------

 9 March 2020

 */

let registry = {};
let log = false;
let customComponents = {};
let count = 0;

let webComponents = {
  register: function(name, config) {
    registry[name] = config;
  },
  setLog: function (state) {
    log = state;
  },
  getInstanceFromRegistry: function(name) {
    if (!registry[name]) return false;
    return JSON.parse(JSON.stringify(registry[name]));
  },
  createCustomComponent: function(name, config) {
    this.register(name, config);
  },
  expandCustomComponent: function(useConfig) {
    //console.log('expand customComponent - registry: ' + JSON.stringify(registry, null, 2));
    //console.log('instance config: ' + JSON.stringify(useConfig, null, 2));
    let state = useConfig.state;
    let config = this.getInstanceFromRegistry(useConfig.componentName);
    //console.log('custom component config: ' + JSON.stringify(config, null, 2));

    function processChildren(_config) {
      if (_config.children && Array.isArray(_config.children)) {
        _config.children.forEach(function(childConfig) {
          if (childConfig.state) {
            let value;
            for (let name in childConfig.state) {
              value = childConfig.state[name];
              if (typeof value === 'string' && value.startsWith('__')) {
                value = value.split('__')[1];
                if (state[value]) {
                  childConfig.state[name] = state[value];
                }
                else {
                  delete childConfig.state[name];
                }
                delete state[value];
              }
            }
          }
          if (typeof childConfig.children === 'string' && childConfig.children == '__children') {
            if (useConfig.children) {
              childConfig.children = useConfig.children;
            }
            else {
              delete childConfig.children;
            } 
          }
          processChildren(childConfig);
        });
      }
    }

    processChildren(config);
    //console.log('state at end: ' + JSON.stringify(state, null, 2));
    config.state = state;

    //console.log('after expand customComponent - registry: ' + JSON.stringify(registry, null, 2));
    return config;

  },
  setCustomComponentElement: function(componentName, name, element) {
    if (!customComponents[componentName]) {
      customComponents[componentName] = {};
    }
    customComponents[componentName][name] = {
      element: element
    };
  },
  getCustomComponentElement: function(componentName, name) {
    if (customComponents[componentName] && customComponents[componentName][name]) {
      return customComponents[componentName][name].element;
    }
  },
  setCustomComponentChildrenTarget: function(componentName, name, element) {
    customComponents[componentName][name].childrenTarget = element;
  },
  getCustomComponentChildrenTarget: function(componentName, name) {
    return customComponents[componentName][name].childrenTarget;
  },
  getCustomComponent: function(name) {
    return registry[name];
  },
  loadJSFile: function(src, callback) {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src
    script.onload = function(){
      if (log) console.log('script ' + src + ' loaded');
      if (callback) callback(src);
    };
    document.body.appendChild(script);
  },
  loadCSSFile: function(src, target, callback) {
    if (!target) {
      target = document.getElementsByTagName('head')[0];
    }
    if (target && !callback && typeof target === 'function') {
      callback = target;
      target = document.getElementsByTagName('head')[0];
    }
    let head = target;
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.setAttribute('type', 'text/css');;
    link.href = src;
    link.onload = function() {
      if (log) console.log('CSS file ' + src + ' loaded');
      if (callback) callback(src);
    };
    head.appendChild(link);
  },
  addMetaTag: function(attributes) {
    let meta = document.createElement('meta');
    let name;
    for (name in attributes) {
      meta.setAttribute(name, attributes[name]);
    }
    document.getElementsByTagName('head')[0].appendChild(meta);
  }, 
  load: async function(componentName, targetElement, context, callback) {
    let namespace = componentName.split('-')[0];
    console.log('*** load ' + componentName);
    let _this = this;
    if (context && !callback && typeof context === 'function') {
      callback = context;
      context = {};
    }
    if (!context && !callback && typeof targetElement === 'function') {
      callback = targetElement;
      targetElement = false;
      context = {};
    }

    //console.log('namespace = ' + namespace);
    //console.log('context: ' + JSON.stringify(context, null, 2));
    let jsPath = context.path || './';
    if (context.paths && context.paths[namespace]) jsPath = context.paths[namespace];

    function invokeComponent(elementClass) {
      let element = new elementClass();
      targetElement.appendChild(element);
      element.context = context;
      element.isComponent = true;
      if (element.setState) {
        element.setState({
          webComponents: _this,
        });
      }
      if (callback) callback(element);
    }

    let elementClass = customElements.get(componentName);
    if (elementClass) {
      if (log) console.log('** component ' + componentName + ' already loaded');
      invokeComponent(elementClass, callback);
    }
    else {
      let _module = await import(jsPath + componentName + '.js');
      // check again in case loaded in the meantime by another async loop
      let elementClass = customElements.get(componentName);
      if (!elementClass) {
        _module.load();
        elementClass = customElements.get(componentName);
        if (log) console.log('** component ' + componentName + ' had to be loaded');
      }
      else {
        if (log) console.log('** component ' + componentName + ' loaded by another loop');
      }

      if (targetElement) {
        invokeComponent(elementClass, callback);
      }
      else {
        // just pre-loading
        if (callback) callback();
      }
    }
  },
  loadGroup: async function(configArr, targetElement, context, topComponent) {

    // The array of components share the same target and must be appended
    // in strict sequence, so this is enforced by this logic..
    context = context || {};

    if (!Array.isArray(configArr)) {
      configArr = [configArr];
    }

    let _this = this;
    let noOfComponents = configArr.length;

    function loadComponent(no) {
      if (no === noOfComponents) return;
      let config = Object.assign({}, configArr[no]);
      let targetEl = targetElement;
      // optional target override
      if (config.targetElement) targetEl = config.targetElement;
      if (config.componentName) {

        if (_this.getCustomComponent(config.componentName)) {
          config = _this.expandCustomComponent(config);
          //console.log('expanded: ' + JSON.stringify(config, null, 2));
        }

        _this.load(config.componentName, targetEl, context, function(element) {
          if (log) {
            console.log('load element:');
            console.log(element);
            console.log(targetElement);
          }
          if (topComponent) element.topComponent = topComponent;
          element.getParentComponent = _this.getParentComponent.bind(element);
          element.remove = _this.remove.bind(element);
          element.getComponentByName = _this.getComponentByName.bind(_this); 
          element.addHandler = _this.addHandler.bind(element);

          if (config.state  && element.setState) {
            element.setState(config.state);
          }
          if (element.onLoaded) {
            element.onLoaded();
          }
          // invoke any hooks
          if (config.hooks && context.hooks) {
            config.hooks.forEach(function(hook) {
              if (context.hooks[config.componentName] && context.hooks[config.componentName][hook]) {
                try {
                  context.hooks[config.componentName][hook].call(element, config.state);
                }
                catch(err) {
                  if (log) {
                    console.log('Unable to execute hook ' + name + ' for ' + config.componentName);
                    console.log(err);
                  }
                }
              }
            });
          }
          if (config.children && element.childrenTarget) {
            _this.loadGroup(config.children, element.childrenTarget, context, topComponent || element);
          }
          loadComponent(no + 1);
        });
      }
    }
    loadComponent(0);
  },
  getParentComponent(options) {
    options = options || {};
    let prefix = options.prefix || this.tagName.split('-')[0];
    function findParent(node) {
      node = node.parentNode;
      if (!node) return null;
      if (options.match) {
        if (node.tagName === options.match.toUpperCase()) return node;
      }
      else {
        if (node.tagName.startsWith(prefix)) return node;
      }
      return findParent(node);
    }
    return findParent(this);
  },
  getComponentByName(componentName, name) {
    let customComponentElement = this.getCustomComponentElement(componentName, name);
    if (customComponentElement) return customComponentElement;
    let modals = [...document.getElementsByTagName(componentName)];
    let i;
    for (i = 0; i < modals.length; i++) {
      if (modals[i].name === name) {
        return modals[i];
      }
    }
    return;
  },
  addHandler: function(fn, targetElement, type) {
    if (!type && typeof targetElement === 'string') {
      type = targetElement;
      targetElement = null;
    }
    type = type || 'click';
    targetElement = targetElement || this.rootElement;
    targetElement.addEventListener(type, fn);
    if (!this.listeners) this.listeners = [];
    this.listeners.push({
      type: type,
      fn: fn,
      target: targetElement
    });
    let _this = this;
    if (!this.onUnload) {
      this.onUnload = function() {
        if (_this.listeners) {
          _this.listeners.forEach(function(listener) {
            console.log('removing listener');
            console.log(listener);
            listener.target.removeEventListener(listener.type, listener.fn);
          });
        }
      }
    }
  },
  remove: function() {      
    // remove component and all its sub-components
    //  to ensure their disconnectedCallbacks fire
    function getChildren(node) {
      let children = [...node.childNodes];
      children.forEach(function(child) {
        if (child.nodeType === 1) {
          getChildren(child);
          if (child.isComponent) {
            child.parentNode.removeChild(child);
          }
        }
      });
    }
    getChildren(this);
    this.parentNode.removeChild(this);
  }
};

export {webComponents};
