# mg-webComponents: Framework for Dynamic WebComponents
 
Rob Tweed <rtweed@mgateway.com>  
29 November 2019, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)


# About *mg-webComponents

mg-webComponents is a module that allows you to build web applications 
from hierarchical assemblies of WebComponents.

mg-webComponents is designed to be completely dynamic, avoiding the need for 
bundling or pre-compiling. As per the true spirit of the web architecture, 
everything is fetched from the web server dynamically as and when needed.

mg-webComponents makes use of the built-in capabilities of modern browsers, 
and therefore requires no other framework in order to work. It is a very 
lightweight and high-performance solution to web application development,
 and is based on a deliberately very small but powerful set of patterns which allow you 
to quickly and simply build applications of any degree of complexity.

Note that this Module requires a browser with support for ES6 Modules and
WebComponents.  It has been tested with the latest versions of Chrome, Firefox and
Safari (desktop and iOS versions).


# Back-End Compatibility

*mg-webComponents* has no other dependencies, and can be used with any back-end
platform technology or stack.  Your WebComponents can communicate and interact via any
standard means, eg REST, Ajax, WebSockets.

However, *mg-webComponents* works particularly well with the [QEWD](https://github.com/robtweed/qewd)
framework and its integrated [QEWD-JSdb](https://github.com/robtweed/qewd-jsdb) multi-model database.


# Getting Started

All the information you need to get started is in [the Tutorial document](./TUTORIAL.md).

Read [this tutorial](./QEWD.md) to learn how to use *mg-webComponents* with QEWD.


# Existing *mg-webComponent* Module Libraries

Rather than building your own *mg-webComponent* Modules, you can make use of an extensive
library of pre-built WebComponent Modules that have been built around the Bootstrap 4-based
[SB Admin 2 Theme](https://startbootstrap.com/themes/sb-admin-2/).

See the [wc-adminui Github repository](https://github.com/robtweed/wc-admin-ui).

This webComponent Module library allows you to build powerful SB Admin 2-themed web applications
extremely quickly.  Its repository's README file provides a comprehensive tutorial on its use.

Alternatively, use this library of WebComponent Modules as a useful set of examples to guide
the development of your own ones.



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
