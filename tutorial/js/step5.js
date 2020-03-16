export function define_step5() {

  let component = {
    componentName: 'tutorial-div',
    state: {
      attributes: {
        style: 'background-color: cyan'
      },
      hidden: true
    },
    children: [
      {
        componentName: 'tutorial-div',
        state: {
          text: 'Hello World'
        }
      }
    ],
    hooks: ['showAfterDelay']
  };

  let hooks = {
    'tutorial-div': {
      showAfterDelay: function() {
        let _this = this;
        setTimeout(function() {
          _this.show();
        }, 5000);
      }
    }
  };

  return {component, hooks};
};
