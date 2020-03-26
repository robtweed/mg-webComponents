export function assembly(webComponents, QEWD) {

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
          QEWD.send({
            type: 'testMessage'
          }, function(responseObj) {
            let div = _this.getComponentByName('tutorial-div', 'display');
            div.setState({text: JSON.stringify(responseObj)});
          });
        };
        this.addHandler(fn, this.rootElement);
      }
    }
  };

  return {component, hooks};
};
