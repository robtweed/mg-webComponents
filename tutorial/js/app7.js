import {webComponents} from '../../mg-webComponents.js';
import {define_step7} from './step7.js';

document.addEventListener('DOMContentLoaded', function() {

  webComponents.addComponent('step7', define_step7(webComponents));

  let context = {
    path: './components/tutorial/',
    hooks: webComponents.hooks
  };

  webComponents.loadGroup(webComponents.components.step7, document.getElementsByTagName('body')[0], context);

});
