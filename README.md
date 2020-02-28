# mg-webComponents: Framework for Dynamic WebComponents
 
Rob Tweed <rtweed@mgateway.com>  
29 November 2019, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)


# About this Repository

This repository contains an ES6 Module that creates the environment for
dynamically creating structures in the browser using hierarchies and sets of
WebComponents

# Using this Module

Create an index.html page:

        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>bsAdmin2 WebComponent Version</title>
          </head>
          <body>
            <script type="module" src="js/wc-demo.js"></script>
          </body>
        </html>

Then create your JavaScript module (ie *js/wc-demo.js* in the example above):


        import {webComponents} from '../../mg-webComponents.js';

        document.addEventListener('DOMContentLoaded', function() {
          webComponents.setLog(true);

          let options = {
            // specify the location of your WebComponents
            path: './demo/js/'
          };
          // here I'm kicking things off by loading a root component into which I'll
          //  subsequently attach my other components

          let body = document.getElementsByTagName('body')[0];
          webComponents.load('component-root', body, options, function(rootElement) {
            // then I might want to add a group of components (defined as an array - *sidebarConfigArray*) 
            // to this root structure

            webComponents.loadGroup(sidebarConfigArray, root.sidebarTarget, options);
          });
        });


# Methods

- setLog(status): (true | false) Turns console logging on and off
- register(componentName, configurationArray): adds a configuration array to the registry, allowing you to fetch it by a name
- getFromRegister(componentName): returns the named configuration array
- load(componentConfigurationObject, targetElement, options): loads a single WebComponent and sets its state as defined in the configuration object
- loadGroup(componentConfigurationArray, targetElement, opttions, callback): loads an array of WebComponents and appends them to a target element in sequence

- loadJSFile(srcUrl): dynamically loads a JavaScript file
- loadCSSFile(srcUrl): dynamically loads a CSS file
- addMetaTag(attributes): dynamically creates and adds a meta tag to the document head


## License

 Copyright (c) 2020 M/Gateway Developments Ltd,                           
 Redhill, Surrey UK.                                                      
 All rights reserved.                                                     
                                                                           
  http://www.mgateway.com                                                  
  Email: rtweed@mgateway.com                                               
                                                                           
                                                                           
  Licensed under the Apache License, Version 2.0 (the "License");          
  you may not use this file except in compliance with the License.         
  You may obtain a copy of the License at                                  
                                                                           
      http://www.apache.org/licenses/LICENSE-2.0                           
                                                                           
  Unless required by applicable law or agreed to in writing, software      
  distributed under the License is distributed on an "AS IS" BASIS,        
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
  See the License for the specific language governing permissions and      
   limitations under the License.      
