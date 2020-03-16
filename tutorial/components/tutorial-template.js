export function load() {

  let componentName = 'tutorial-template';
  let count = -1;

  customElements.define(componentName, class tutorial_template extends HTMLElement {
    constructor() {
      super();

      count++;

      const html = `
<div></div>
      `;

      this.html = `${html}`;
    }

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
    }

    connectedCallback() {
      this.innerHTML = this.html;
      this.rootElement = this.getElementsByTagName('div')[0];
      this.childrenTarget = this.rootElement;
      this.name = componentName + '-' + count;
    }

    disconnectedCallback() {
      if (this.onUnload) this.onUnload();
    }

  });
};
