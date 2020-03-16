export function define_step2() {

  let component = {
    componentName: 'tutorial-div-simple',
    children: [
      {
        componentName: 'tutorial-div-simple',
        state: {
          text: 'Hello World'
        }
      }
    ]
  };

  return {component};
};
