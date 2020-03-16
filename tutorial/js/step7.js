export function define_step7(webComponents) {

  let config = `
    <tutorial-div attributes.style="background-color: cyan" hook="hideAfterDelay">
      <tutorial-div text="Hello World!" hook="changeTextAfterDelay" />
    </tutorial-div>
  `;

  let component = webComponents.parse(`${config}`);

  let hooks = {
    'tutorial-div': {
      hideAfterDelay: function() {
        let _this = this;
        setTimeout(function() {
          _this.hide();
        }, 5000);
      },
      changeTextAfterDelay: function() {
        let _this = this;
        let parent = this.getParentComponent('tutorial-div');
        setTimeout(function() {
          _this.setState({
            text: 'This is very cool stuff!',
            attributes: {
              style: 'font-size: 24px'
            }
          });
          parent.show();
        }, 8000);
      }
    }
  };

  return {component, hooks};
};
