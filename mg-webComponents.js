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

 28 February 2020

 */

let registry = {};
let log = false;

let webComponents = {
  register: function(name, config) {
    registry[name] = config;
  },
  setLog: function (state) {
    log = state;
  },
  getFromRegistry: function(name) {
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
  load: async function(componentName, targetElement, options, callback) {
    let _this = this;
    if (options && !callback && typeof options === 'function') {
      callback = options;
      options = {};
    }
    if (!options && !callback && typeof targetElement === 'function') {
      callback = targetElement;
      targetElement = false;
      options = {};
    }
    let jsPath = options.path || './';

    function invokeComponent(elementClass) {
      let element = new elementClass();
      targetElement.appendChild(element);
      if (element.setState) {
        element.setState({
          webComponents: _this,
          options: {path: jsPath}
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
  loadGroup: async function(configArr, targetElement, options) {

    // The array of components share the same target and must be appended
    // in strict sequence, so this is enforced by this logic..
    options = options || {};

    let _this = this;
    let noOfComponents = configArr.length;

    function loadComponent(no) {
      if (no === noOfComponents) return;
      var config = configArr[no];
      if (config.componentName) {
        _this.load(config.componentName, targetElement, options, function(element) {
          if (log) {
            console.log('load element:');
            console.log(element);
            console.log(targetElement);
          } 
          if (config.state) {
            element.setState(config.state, function() {
              // the setState callback ensures that the next component isn't
              // processed until the current one is completely appended to the target
              if (element.onLoaded) {
                element.onLoaded();
              }
              loadComponent(no + 1);
            });
          }
          else {
            loadComponent(no + 1);
          }
        });
      }
      else if (options.QEWD && config.fragmentName) {
        let span = document.createElement('span');
        span.id = 'inserted-fragment-' + no;
        console.log('targetElement');
        console.log(targetElement);
        targetElement.appendChild(span);
        options.QEWD.getFragment({
          name: config.fragmentName,
          targetId: span.id
        }, function(file) {
        });
        loadComponent(no + 1);
      }
    }
    loadComponent(0);
  }
};

export {webComponents};
