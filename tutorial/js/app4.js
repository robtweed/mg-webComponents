import {webComponents} from '../../mg-webComponents.js';
import {define_step4} from './step4.js';

document.addEventListener('DOMContentLoaded', function() {

  webComponents.addComponent('step4', define_step4());
  let context = {
    path: './components/tutorial/'
  };
  webComponents.setLog(true);
  webComponents.loadGroup(webComponents.components.step4, document.getElementsByTagName('body')[0], context);

});
