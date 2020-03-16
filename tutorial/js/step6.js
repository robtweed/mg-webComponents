export function define_step6() {

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
        },
        hooks: ['changeTextAfterDelay']
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
      },
      changeTextAfterDelay: function() {
        let _this = this;
        setTimeout(function() {
          _this.setState({
            text: 'This is very cool stuff!',
            attributes: {
              style: 'font-size: 24px'
            }
          });
        }, 8000);
      }
    }
  };

  return {component, hooks};
};
