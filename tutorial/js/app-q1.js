import {webComponents} from '../../mg-webComponents.js';
import {QEWD} from '../../qewd-client.js';
import {assembly} from './step-q1.js';
        
document.addEventListener('DOMContentLoaded', function() {
  QEWD.on('ewd-registered', function() {
    QEWD.log = true;
    webComponents.addComponent('buttonDemo', assembly(webComponents, QEWD));
    let context = {
      path: './components/tutorial/'
    };
    webComponents.setLog(true);
    let body = document.getElementsByTagName('body')[0];
    webComponents.loadGroup(webComponents.components.buttonDemo, body, context);
  });

  QEWD.start({
    application: 'tutorial'
  });

});
