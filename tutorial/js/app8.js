import {webComponents} from '../../mg-webComponents.js';
import {define_step8} from './step8.js';

document.addEventListener('DOMContentLoaded', function() {

  webComponents.addComponent('step8', define_step8(webComponents));

  let context = {
    path: './components/tutorial/',
    hooks: webComponents.hooks
  };

  webComponents.setLog(true);
  webComponents.loadGroup(webComponents.components.step8, document.getElementsByTagName('body')[0], context);

});
