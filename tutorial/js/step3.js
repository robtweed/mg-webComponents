export function define_step3() {

  let component = {
    componentName: 'tutorial-div',
    state: {
      attributes: {
        style: 'background-color: cyan'
      }
    },
    children: [
      {
        componentName: 'tutorial-div',
        state: {
          text: 'Hello World'
        }
      }
    ]
  };

  return {component};
};
