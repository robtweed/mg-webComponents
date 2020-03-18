import {webComponents} from '../../mg-webComponents.js';
import {define_step6} from './step6.js';

document.addEventListener('DOMContentLoaded', function() {

  webComponents.addComponent('step6', define_step6());
  let context = {
    path: './components/tutorial/'
  };
  webComponents.setLog(true);
  webComponents.loadGroup(webComponents.components.step6, document.getElementsByTagName('body')[0], context);

});
