export function define_step4() {

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
    ]
  };

  return {component};
};
