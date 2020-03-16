import {webComponents} from '../../mg-webComponents.js';
import {define_step2} from './step2.js';

document.addEventListener('DOMContentLoaded', function() {

  webComponents.addComponent('step2', define_step2());
  let context = {
    path: './components/tutorial/'
  };
  webComponents.setLog(true);
  webComponents.loadGroup(webComponents.components.step2, document.getElementsByTagName('body')[0], context);

});
