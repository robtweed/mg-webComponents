import {webComponents} from '../../mg-webComponents.js';
import {define_step5} from './step5.js';

document.addEventListener('DOMContentLoaded', function() {

  webComponents.addComponent('step5', define_step5());
  let context = {
    path: './components/tutorial/',
    // ** add support for hooks
    hooks: webComponents.hooks
  };
  webComponents.setLog(true);
  webComponents.loadGroup(webComponents.components.step5, document.getElementsByTagName('body')[0], context);

});
