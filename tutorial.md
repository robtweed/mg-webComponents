# mg-webComponents: Tutorial
 

# What is mg-webComponents?

*mg-webComponents* is a module that allows you to build web applications from hierarchical sets
of WebComponents.

*mg-webComponents* is designed to be completely dynamic, avoiding the need for bundling or compiling.
Everything is fetched from the web server as and when needed.


*mg-webComponents* makes use of the built-in capabilities of modern browsers, and therefore requires no other
framework in order to work.  It is a very lightweight and high-performance solution to web application
development.

# Getting Started

The easiest way to try out *mg-webComponents* is to download and start the latest Dockerised version
of QEWD, eg see [QEWD-JSdb](https://github.com/robtweed/qewd-jsdb) or [QEWD-baseline](https://github.com/robtweed/qewd-baseline).

However, *mg-webComponents* has no dependency on QEWD, and can be installed and used standalone.

To prepare your own *mg-webComponents* system, simply copy the file 
[mg-webComponents.js](https://github.com/robtweed/mg-webComponents/blob/master/mg-webComponents.js)
to your web server's root directory.

To fetch the *mg-webComponents* repository, either:

        git clone https://github.com/robtweed/mg-webComponents*

or:

        npm install mg-webcomponents


# Setting up the Tutorial Examples

## Using the QEWD-Server Docker Container

If you are using the Dockerised version of QEWD:

- shell into the running container, eg:

        docker exec -it jsdb bash

- switch to the *mapped* directory:

        cd mapped

- Run the install script:

        source install_wc_tutorial.sh


## Standalone Installation

- In the *mg-webComponents* repository, you'll find a folder named *tutorial*

- Create two sub-folders under your web server's root directory:

    - components
    - tutorial

- Create a further sub-folder named *tutorial* under the *components* folder you created above

- From the *mg-webComponents* repository:

  - move/copy the contents of its */tutorial/components* folder into your
newly-created */components/tutorial* folder

  - move/copy the HTML files and */js* folder to your newly created */tutorial* folder

So, for example, if your web server root directory was /opt/nginx/www, you should now have:

        /opt/nginx/www
         |
         |- mg-webComponents.js
         |
         |- components
         |     |
         |     |- tutorial
         |           |
         |           |- tutorial-template.js
         |           |- tutorial-div.js
         |           |- ...etc
         |
         |- tutorial
              |
              |- js
              |   |
              |   |- app1.js
              |   |- step1.js
              |   |-  ..etc
              |
              |- step1.html
              |- step2.html
              |-  ...etc


You're now ready to begin the Tutorial

# The WebComponents Pattern to use with *mg-webComponents*

The */components/tutorial* folder that you created above will contain some
simple examples of WebComponents, created for use with *mg-webComponents*

The basic pattern to follow is shown in *tutorial-template.js*:

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


Let's go through the important pieces of this pattern:

## Your WebComponents should export a function named *load*


Always wrap your WebComponents inside:

        export function load() {
        };

## The first part of your WebComponent name is its namespace

WebComponent tag names must always be hyphenated: that's part of the standard.  However, in
*mg-webComponents*, the convention is that the first part of your WebComponent names defines its
namespace. You can have as many namespaces as you like.  In our case, we're going to just use one:
*tutorial*.  So all our WebComponents will be named *tutorial-{{something}}*, eg in the above case,
*tutorial-template*.


Define your WebComponent's name as shown:


          let componentName = 'tutorial-template';

Then use a version of this name that uses underscores instead of hyphens for the 
WebComponent's class name.  So we'll use *tutorial_template* for our example above:


          customElements.define(componentName, class tutorial_template extends HTMLElement {

## YOu Don't Need to use Shadow DOM

In all the examples we're going to use, we **won't** be using the Shadow DOM capability of 
WebComponents.  You *can* use the Shadow DOM with *mg-webComponents*, but it isn't essential,
and, if using *mg-webComponents* with a framework such as [Bootstrap 4](https://getbootstrap.com/), 
you'll find it all a lot simpler without Shadow DOM.


## Define the HTML for your WebComponent

You'll find that, typically, most of your WebComponents will actually contain very little
HTML.  Often they will just contain a single tag, as in our example which just contains a
single <div> tag.  

Define the markup using the following pattern:

      const html = `
<div></div>
      `;

      this.html = `${html}`;

## Always add a method named *setState*

All your WebComponents should include this method, via which you will be able to control and modify
the internal state of the WebComponent.

At the very least I recommend that you include, within the *setState* method, the means to set/change
the component's *name* property.  You'll see later why this is important.

So, for example:

    setState(state) {
      if (state.name) {
        this.name = state.name;
      }
    }

## Always add the *connectedCallback* method

The *connectedCallback* method is a standard part of WebComponents - this method, if defined,
is fired when the WebComponent is attached to the DOM (eg using *appendChild*).

In the *connectedCallback* method, you should **ALWAYS**:

- if you're not using Shadow DOM, add the HTML you defined for the WebComponent 
as its *innerHTML* property 

      this.innerHTML = this.html;

- define a *rootElement* property which should be the root (or outermost) tag of the 
HTML within your WebComponent.  So in our example it will be the <div> tag itself:

      this.rootElement = this.getElementsByTagName('div')[0];

- If you want to be able to nest other WebComponents within your WebComponent, define a
property named *childrenTarget* which will be the actual HTML tag within your WebComponent
within which you want that nesting to occur.

  In our case, that will be the <div> tag itself, so:

      this.childrenTarget = this.rootElement;

- make sure you always define at least a default name to your WebComponent.  The pattern I'd
recommend is:

  - at the top of your component, outside its class definition, define a *counter* variable with
an initial value of -1:

        let count = -1;

  - inside the WebComponent's constructor, increment that counter:

        count++;

    Every time an instance of this WebComponent is created, this counter will therefore increment

  - within the *connectedCallback* method, define the WebComponent's default *name* property
using this counter in conjunction with the WebComponent's name:

        this.name = componentName + '-' + count;


## Always add the *disconnectedCallback* method

The *disconnectedCallback* method is a standard part of WebComponents - this method, if defined,
is fired when the WebComponent is detached from the DOM (eg using *removeChild*).

This callback method is used to garbage-collect any resources, in particular event handlers,
to avoid memory leaks.

You should **ALWAYS** use this pattern:

    disconnectedCallback() {
      if (this.onUnload) this.onUnload();
    }

*mg-webComponents* automatically adds the *onUnload()* method to each of your WebComponents, and this
*onUnload()* method will automatically destroy any handler methods that were created using its own
special functionality (see later).


# Create your WebComponent

Take a look at */components/tutorial-div-simple.js* which is based on the template
described above.  The only difference is that its *setState()* method adds a *text*
property which will allow us to add a text string inside the <div> tag 
(via *this.rootElement.textContent*):

        setState(state) {
          if (state.name) {
            this.name = state.name;
          }
          // add text
          if (state.text) {
            this.rootElement.textContent = state.text;
          }
        }


# Using your WebComponents (Part 1)

The next step is to define how you're going to use one or more of your WebComponents.  You do this
by defining a JSON object that defines a set of one or more WebComponents.

Take a look at your */js/step1.js* file for a simple example:

        export function define_step1() {
        
          let component = {
            componentName: 'tutorial-div-simple',
            state: {
              text: 'Hello World'
            }
          }

          return {component};
        };


Note the following key parts of the pattern above:

## Your definition should export a uniquely-named function

In our case we'll call that function *define_step1*.

        export function define_step1() {
          // ...etc
        };


## Define a JSON Object named *component*

This JSON object will define the WebComponent(s) we want to use, and apply state properties to it/then
when they are loaded.

So in our example above, we're just using/loading a single WebComponent - our *tutorial-dev-simple*
one, and then setting its *text* state property.  Doing so will cause the *tutorial-dev-simple*
WebComponent's *setState()* method to fire.

          let component = {
            componentName: 'tutorial-div-simple',
            state: {
              text: 'Hello World'
            }
          }

## Return the component object on completion of the exported function

          return {component};


# Using your WebComponents (Part 2)

The next step is to apply the JSON *component* object you created in the previous step using the
*mg-webComponents* module.  To do this we'll create an ES6 Module that will be loaded into our
web page.  Once again, just follow the pattern I'll describe and explain below.

Take a look at the simple example in */js/app1.js*.  Here's an uncommented version which I'll 
step you through:


        import {webComponents} from '../../mg-webComponents.js';
        import {define_step1} from './step1.js';
        document.addEventListener('DOMContentLoaded', function() {
          webComponents.addComponent('step1', define_step1());
          let context = {
            path: './components/tutorial/'
          };
          webComponents.setLog(true);
          webComponents.loadGroup(webComponents.components.step1, document.getElementsByTagName('body')[0], context);
        document.addEventListener('DOMContentLoaded', function() {

## Import the *mg-webComponents.js* Module

  The first step is to import the *mg-webComponents* module from the Web Server's root directory.

        import {webComponents} from '../../mg-webComponents.js';


## Next, import the module that you created in the previous step which contained the definition of how you
want to use your WebComponents.


        import {define_step1} from './step1.js';

## Make sure you wait until all the resources are loaded into the DOM

Wrap all subsequent logic in the following wrapper:

        document.addEventListener('DOMContentLoaded', function() {
          // ...etc
        });

## Add your JSON component definition to *mg-webComponents* using the latter's *addComponent* method.

The *addComponent()* method takes two arguments:

- name: a name you specify for your JSON component.
- the output from the exported function defined in the component definition module that you imported

So in our example:

          webComponents.addComponent('step1', define_step1());

We're calling the component *step1*, and it's defined by what is returned when *define_step1* is invoked.

The added component assembly will now be accessible via *webComponents.component[name]*, ie in our case:

        webComponents.components.step1


## Define a context object 

This context object will be used by *mg-webComponents* to provide the context for various
actions it takes.  In our simple example, the only context we need to provide where to 
physically find your library of WebComponents.

          let context = {
            path: './components/tutorial/'
          };


## Optionally turn console logging on

During development, it's a good idea to turn on console logging, to see the progress of
how your components are loaded and rendered.  Do this by turning *mg-webComponents* logging on:

          webComponents.setLog(true);


## Loading your assembly of WebComponents

The final step is to tell *mg-webComponents* to load your component assembly by invoking its
*loadGroup()* method.

The *loadGroup()* method takes three arguments:

- the component you added to *mg-webComponents* in the step above, ie in our case when we did this:

          webComponents.addComponent('step1', define_step1());

- the DOM element to which your assembly of components is to be appended.  In our case we'll add
our component assembly to the <body> tag of our web page.  

- the context object that we defined in the earlier step above.
  
So, in our example, we invoke:


          webComponents.loadGroup(webComponents.components.step1, document.getElementsByTagName('body')[0], context);



# Define the Web Page for your Components

Now that everything else is prepared and built, you finaly need to create the base HTML file that you will
load into your web server.  Take a look at the */tutorial/step1.html* file.  This shows the
pattern that you should always follow:

        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>mg-WebComponents Tutorial Step 1</title>
          </head>
          <body>
            <script type="module" src="js/app1.js"></script>
          </body>
        </html>

Note the key step within the <body> tag which loads the *app1.js* module described in the previous section
above.


# Load the Web Page

You're ready to run the test example.  Load the page into your browser, eg:

        http://localhost/tutorial/step1.html

Make sure you've enabled the browser's JavaScript console

In the browser you should see:

        Hello World

and in the JavaScript console:

*** load tutorial-div-simple
** component tutorial-div-simple had to be loaded
load element:
 <tutorial-div-simple>?…?</tutorial-div-simple>?
 <body>?…?</body>?

Next, click on the *Elements* (or equivalent) tab of your JavaScript console to see the actual DOM elements.
You should see:

<html lang="en">
  <head>
    <title>mg-WebComponents Tutorial Step 1</title>
    <style type="text/css"></style>
  </head>

  <body>
    <script type="module" src="js/app1.js"></script>
    <tutorial-div-simple>
     <div>Hello World</div>
    </tutorial-div-simple>
  </body>
</html>


So the key thing is that you can see that the <tutorial-div-simple> tag was loaded, containing
the <div> tag it defines, with the text value defined by the state we specified in our Component
assembly definition.

In other words, our assembly definition:

          let component = {
            componentName: 'tutorial-div-simple',
            state: {
              text: 'Hello World'
            }
          }

resolved into:

        <tutorial-div-simple>
         <div>Hello World</div>
        </tutorial-div-simple>


Of course, this is a very simple trivial example, and it would appear to be complete overkill if
all we want to do is create a <div> tag with some text.  However, this trivially simple example
has already demonstrated most of the key steps that you can use to build out complex, dynamic, 
highly interactive web applications.

In the next part of the Tutorial we'll build on this simple example, and hopefully the benefits
of this WebComponent approach will begin to become clear.























