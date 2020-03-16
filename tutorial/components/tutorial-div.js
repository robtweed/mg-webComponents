export function load() {

  let componentName = 'tutorial-div';

  customElements.define(componentName, class tutorial_div extends HTMLElement {
    constructor() {
      super();

      const html = `
<style>
.visible {
  display: inline;
}
.hidden {
  display: none;
}
</style>
<div></div>
      `;

      this.html = `${html}`;
    }

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
      if (state.cls) {
        let _this = this;
        state.cls.split(' ').forEach(function(cls) {
          _this.rootElement.classList.add(cls);
        });
      }
      if (state.text) {
        this.rootElement.textContent = state.text;
      }
      if (state.attributes) {
        for (let name in state.attributes) {
          this.rootElement.setAttribute(name, state.attributes[name]);
        }
      }
      if (state.hidden) {
        this.classList.remove('visible');
        this.classList.add('hidden');
      }
      if (state.visible) {
        this.classList.add('visible');
        this.classList.remove('hidden');

      }
    }

    show() {
      this.setState({visible: true});
    }

    hide() {
      this.setState({hidden: true});
    }

    connectedCallback() {
      this.innerHTML = this.html;
      this.rootElement = this.getElementsByTagName('div')[0];
      this.childrenTarget = this.rootElement;
    }

    disconnectedCallback() {
      if (this.onUnload) this.onUnload();
    }
  });

};
