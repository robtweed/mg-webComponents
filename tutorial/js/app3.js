import {webComponents} from '../../mg-webComponents.js';
import {define_step3} from './step3.js';

document.addEventListener('DOMContentLoaded', function() {

  webComponents.addComponent('step3', define_step3());
  let context = {
    path: './components/tutorial/'
  };
  webComponents.setLog(true);
  webComponents.loadGroup(webComponents.components.step3, document.getElementsByTagName('body')[0], context);

});
