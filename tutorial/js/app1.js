// Change the paths below if needed

import {webComponents} from '../../mg-webComponents.js';

// import the individual component configuration files
//   they can be maintained independently as a result

import {define_step1} from './step1.js';

document.addEventListener('DOMContentLoaded', function() {

  // add each component to the webComponents object
  //  this adds each component to webComponents.component
  //  and adds any hooks to webComponents.hooks

  webComponents.addComponent('step1', define_step1());

  // create the context for running the web components

  let context = {
    path: './components/tutorial/'
  };

  webComponents.setLog(true);
    
  // now load up the initial view

  webComponents.loadGroup(webComponents.components.step1, document.getElementsByTagName('body')[0], context);

});
