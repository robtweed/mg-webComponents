export function define_step8(webComponents) {

  let config = `
    <tutorial-div>
      <tutorial-button text="Try me out" hook="buttonClick" />
      <tutorial-div name="display" />
    </tutorial-div>
  `;

  let component = webComponents.parse(`${config}`);

  let hooks = {
    'tutorial-button': {
      buttonClick: function() {
        let _this = this;
        let fn = function() {
          let div = _this.getComponentByName('tutorial-div', 'display');
          div.setState({text: 'Button was clicked at ' + new Date().toLocaleString()});
        };
        this.addHandler(fn, this.rootElement);
      }
    }
  };

  return {component, hooks};
};
