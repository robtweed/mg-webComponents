# mg-webComponents: Tutorial
 

# What is mg-webComponents?

*mg-webComponents* is a module that allows you to build web applications from hierarchical assemblies
of WebComponents.

*mg-webComponents* is designed to be completely dynamic, avoiding the need for bundling or pre-compiling.
As per the true spirit of the web architecture, everything is fetched from the web server dynamically as and when needed.


*mg-webComponents* makes use of the built-in capabilities of modern browsers, and therefore requires no other
framework in order to work.  It is a very lightweight and high-performance solution to web application
development, and is based on a deliberately very small set of patterns which allow you to quickly and simply build applications of any degree of complexity.

# Getting Started

The easiest way to try out *mg-webComponents* is to download and start the latest Dockerised version
of QEWD, eg see [QEWD-JSdb](https://github.com/robtweed/qewd-jsdb) or [QEWD-baseline](https://github.com/robtweed/qewd-baseline).

However, *mg-webComponents* has no dependency on QEWD, and can be installed and used standalone with any web server.

To prepare your own *mg-webComponents* system, simply copy the file 
[mg-webComponents.js](https://github.com/robtweed/mg-webComponents/blob/master/mg-webComponents.js)
to your web server's root directory.

To fetch the *mg-webComponents* repository, either:

        git clone https://github.com/robtweed/mg-webComponents

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

- In the copy of the *mg-webComponents* repository that you've installed, you'll find a folder named *tutorial*

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

# The *mg-webComponents* Layers

*mg-webComponent*s is based around 4 layers, each of which adheres to a relatively small set of patterns,
reserved propert names and reserved method names.


          -------------------
          | HTML Loader Page |
          -------------------
                   |
           -------------------
           | mg-webComponents |
           |  Load/Render     |
           |   ES6 Module     |
            ------------------
                   |
          ---------------------
         |   WebComponents     |
         | Assembly Definition |
         |    ES6 Module       |
          ---------------------
                  /|\
          ---------------------
         |   WebComponents     |
         |   Module Library    |
         |                     |
          ---------------------

The idea of *mg-webComponents* is to build a library of basic (and usually individually pretty simple)
WebComponents that are used as re-usable buidling blocks that you assemble in whatever
ways you require.  Your Assemblies are then passed into APIs provided by *mg-webComponents*
which loads and renders them into the Web Page you load into your browser.


Let's first go through these one by one, starting a the bottom layer and working our way up.



# The WebComponents Pattern

At the bottom of the 4 layers is a collection of individual WebComponent files, either pre-built
ones (such as the ones you'll find at */www/components/tutorial* and 
*/www/components/adminui*), or ones you create yourself.

*mg-webComponents* uses standard WebComponents.  However, it expects them to be defined and
used according to a specific pattern.  Let's take a look at that pattern.

The */components/tutorial* folder that you created in the previous step contains some
simple examples of WebComponents, created for use with *mg-webComponents*.

The basic pattern to always follow is shown in *tutorial-template.js*:

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

## 1) Your WebComponents should be defined as an ES6 Module

This module MUST export a function named *load*, so you always wrap your WebComponents inside:

        export function load() {
        };


## 2) The first part of your WebComponent name is its namespace

WebComponent tag names must always be hyphenated: that's part of the standard.  However, in
*mg-webComponents*, the convention is that the first part of your WebComponent names defines its
*namespace*. You can have as many namespaces as you like.  In our case, we're going to just use one:
*tutorial*.  So all our WebComponents will be named *tutorial-{{something}}*, eg in the above case,
*tutorial-template*.


Define your WebComponent's name as shown:


          let componentName = 'tutorial-template';

Then use a version of this name that uses underscores instead of hyphens for the 
WebComponent's class name.  So we'll use *tutorial_template* for our example above:


          customElements.define(componentName, class tutorial_template extends HTMLElement {


## 3) You Don't Need to use Shadow DOM

In all the examples we're going to use, we **won't** be using the Shadow DOM capability of 
WebComponents.  You *can* use the Shadow DOM with *mg-webComponents*, but it isn't essential,
and, if using *mg-webComponents* with a framework such as [Bootstrap 4](https://getbootstrap.com/), 
you'll find it all a lot simpler without Shadow DOM.

Using Shadow DOM is an advanced topic, and examples of its use will be covered later in the tutorial.
For now, its use is neither relevant nor helpful to understanding the *mg-webComponents* framework.


## 4) Define the HTML for your WebComponent

You'll find that, typically, most of your WebComponents will actually contain very little
HTML.  Often they will just contain a single tag, as in our example which just contains a
single &lt;div&gt; tag.  

Define the markup using the following pattern:

        const html = `
          <div></div>
        `;

        this.html = `${html}`;


## 5) Always add a method named *setState*

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

What state properties should be made available for each WebComponent will vary from WebComponent to WebComponent,
depending on what the markup within them does and the degree of control you require over the
behaviour and appearance of the WebComponent.  You are
likely to find that as you begin to develop applications using WebComponents that you've created, you'll need
to add more and more state properties.  So initially start with the most obvious ones you're likely to need,
and add new ones as necessary later.


## 6) Always add the *connectedCallback* method

The *connectedCallback* method is a standard part of WebComponents - this method, if defined,
is fired when the WebComponent is attached to the DOM (eg using *appendChild*).

Within the *connectedCallback* method, you should **ALWAYS** do the following as a minimum:

- if you're not using Shadow DOM, add the HTML you defined for the WebComponent 
as its *innerHTML* property 

      this.innerHTML = this.html;

- define a *rootElement* property which should be the root (or outermost) tag of the 
HTML within your WebComponent.  So in our example it will be the &lt;div&gt; tag itself:

      this.rootElement = this.getElementsByTagName('div')[0];

- If you want to be able to nest other WebComponents within your WebComponent (which will almost always be the case), define a
property named *childrenTarget* which will be the actual HTML tag within your WebComponent
within which you want that nesting to occur.  *mg-webComponents* will look for this property when
trying to render your nested assemblies of WebComponents.

  In our case, we will want to be able to nest the &lt;div&gt; tag itself, so we specify:

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

    This will mean that each instance of the WebComponent will have a unique name property.


## 7) Always add the *disconnectedCallback* method

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


# Create your WebComponent Module

Pulling together everything described in the previous section, we can now
construct a WebComponent module to use in our examples.

Take a look at */components/tutorial-div-simple.js* which is based on the template
described above.  

        export function load() {
        
          let componentName = 'tutorial-div-simple';
          let count = -1;
        
          customElements.define(componentName, class tutorial_div_simple extends HTMLElement {
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
              // add text
              if (state.text) {
                this.rootElement.textContent = state.text;
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



if you look carefully, you'll see that the only difference between this and the template is that its *setState()* method adds a *text* property that will allow us to add a text string inside the &lt;div&gt; tag 
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


# Define your WebComponent Assembly

The next step is to define how you're going to use one or more of your WebComponents.  You do this
by defining a JSON object that defines an Assembly of one or more nested WebComponents.

Take a look at your */js/step1.js* file for a very simple example that is just going to define an
Assembly consisting of a single (un-nested) instance of the *tutorial-div-simple* WebComponent
that we described in the previous section:


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

## 1) Your definition is an ES6 Module

This module MUST export a uniquely-named function.  The name of the function is up to you.

In our case we'll call that function *define_step1*.

        export function define_step1() {
          // ...etc
        };


## 2) Define your Assembly as a JSON Object named *component*

This JSON object will define the Assembly of WebComponent(s) you want to use, and optionally apply state properties to it/them when loaded.

In our simple example above, we're just using/loading a single WebComponent - our *tutorial-dev-simple*
one, and then setting its *text* state property.  Doing so will cause the *tutorial-dev-simple*
WebComponent's *setState()* method to fire.

          let component = {
            componentName: 'tutorial-div-simple',
            state: {
              text: 'Hello World'
            }
          }

## 3) Return the component object on completion of the exported function

          return {component};


# Loading/Rendering your WebComponent Assembly

The next step is to load and render the WebComponent assembly *component* JSON object you created in the previous step using the
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

## 1) Import the *mg-webComponents.js* Module

  The first step is to import the *mg-webComponents* module from the Web Server's root directory.

        import {webComponents} from '../../mg-webComponents.js';


## 2) Import your Component Assembly Module

Next, import the module that you created in the previous step which contained the definition of your WebComponent Assembly.


        import {define_step1} from './step1.js';


The imported name must match the exported funtion name of your Assembly module, which, if you remember from above, was:

        export function define_step1() {


## 3) Wait for the DOM to Fully Load

Make sure you wait until all the resources are loaded into the DOM.  Do this by wrapping all subsequent logic in the following event handler:

        document.addEventListener('DOMContentLoaded', function() {
          // ...etc
        });

## 4) Add Your WebComponent Assembly to *mg-webComponents*

Add your WebComponent Assembly definition to *mg-webComponents* using the latter's *addComponent* method.

The *addComponent()* method takes two arguments:

- name: a name you specify for your WebComponent Assembly.
- the output from the exported function defined in the component definition module that you imported

So in our example:

          webComponents.addComponent('step1', define_step1());

Here, we're calling the WebComponent Assembly *step1*, and it's defined by what is returned when *define_step1* is invoked.

The added WebComponent assembly will now be accessible via the reference *webComponents.component[name]*, ie in our case:

        webComponents.components.step1


## 5) Define a Context Object 

This context object will be used by *mg-webComponents* to provide the context for various
actions it takes.  In our simple example, the only context we need to provide is where to 
physically find your library of WebComponents.

          let context = {
            path: './components/tutorial/'
          };


## 6) Optionally Turn Console Logging On

During development, it's a good idea to turn on console logging, to see the progress of
how your components are loaded and rendered.  Do this by turning *mg-webComponents* logging on:

          webComponents.setLog(true);


## 9) Load and Render your WebComponent Assembly

The final step is to tell *mg-webComponents* to load and render your component assembly by invoking its
*loadGroup()* method.

The *loadGroup()* method takes three arguments:

- the component you added to *mg-webComponents* in the step above, ie in our case when we did this:

          webComponents.addComponent('step1', define_step1());

- the DOM element to which your assembly of components is to be appended.  In our case we'll add
our component assembly to the &lt;body&gt; tag of our web page.  

- the context object that we defined in the earlier step above.
  
So, in our example, we invoke:


          webComponents.loadGroup(webComponents.components.step1, document.getElementsByTagName('body')[0], context);



# Define the Web Page for your Components

Now that everything else is prepared and built, you finally need to create the base HTML file that you will
load into your web server.  Take a look at the */tutorial/step1.html* file.  This shows the
very simple pattern that you should always follow:

        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>mg-WebComponents Tutorial Step 1</title>
          </head>
          <body>
            <script type="module" src="js/app1.js"></script>
          </body>
        </html>

Note the key step within the &lt;body&gt; tag which loads the *app1.js* module described in the previous section
above:

            <script type="module" src="js/app1.js"></script>



# Load the Web Page

You're now ready to run the test example.  Load the page into your browser, eg:

        http://localhost/tutorial/step1.html

Make sure you've enabled the browser's JavaScript console

In the browser you should see:

        Hello World

and in the JavaScript console:

        *** load tutorial-div-simple
        ** component tutorial-div-simple had to be loaded
        load element:
         <tutorial-div-simple> </tutorial-div-simple>
         <body> </body>

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


So the key thing to observe is that the &lt;tutorial-div-simple&gt; tag was loaded into the &lt;body&gt; tag.
It, in turn, contains the &lt;div&gt; tag that we defined in the *tutorial-div-simple* WebComponent.
Finally, the  &lt;div&gt; tag has been given the text value defined by the state we specified in our 
WebComponent Assembly definition.

in other words, this WebComponent Assembly definition:

          let component = {
            componentName: 'tutorial-div-simple',
            state: {
              text: 'Hello World'
            }
          }

was resolved into:

        <tutorial-div-simple>
         <div>Hello World</div>
        </tutorial-div-simple>


Of course, this is a very simple trivial example, and, at this stage you're probably thinking
 this is complete overkill if
all we want to do is create a &lt;div&gt;  tag with some text in it!  

However, this trivially simple example
has already demonstrated most of the key steps that you can use to build out complex, dynamic, 
highly interactive web applications.

The real power and flexibility of the *mg-webComponents* framework comes from being able to define
hierarchical assemblies of (usually individually very simple) WebComponents.  Each individual
WebComponent can be used and re-used within Assemblies, and you can build your application from
multiple Assemblies.  Furthermore, for even more power, each Web Assembly can be defined as a template assembly that can be applied and modified through its state.

In the next part of the Tutorial we'll build on this simple example, and hopefully the benefits
of this WebComponent approach will begin to become clear.


# Nesting WebComponents

Take a look at the WebComponent Assembly module you'll find at */www/tutorial/js/step2.js*.  Here's
what it contains:

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

This extends the first example by nesting two instances of the *tutorial-div-simple* 
Webcomponent.  This is done using the *children* property which you use to define an array
of WebComponents that you want to nest within the parent WebComponent.

You'll notice that we've chosen not to set any state values for the outermost 
*tutorial-div-simple* Webcomponent, but we *are* setting state for the innermost one.

If you use the *children* property within a WebComponent Assembly definition, *mg-webComponents*
will expect to find *this.childrenTarget* defined in the WebComponent to which you're applying
the *children property.  If you look back through this tutorial above, you'll see that we did this
for the *tutorial-div-simple* Webcomponent.

The file */www/tutorial/js/app2.js* defines how this WebComponent Assembly is to be loaded and rendered.
In fact it's no different from the first example (*app1.js*), except it's now loading the file
shown above:

        import {webComponents} from '../../mg-webComponents.js';
        import {define_step2} from './step2.js';
        
        document.addEventListener('DOMContentLoaded', function() {
        
          webComponents.addComponent('step2', define_step2());
          let context = {
            path: './components/tutorial/'
          };
          webComponents.setLog(true);
          webComponents.loadGroup(webComponents.components.step2, document.getElementsByTagName('body')[0], context);
        
        });


And finally, this is loaded into the browser using the HTML page defined in */www/tutorial/step2.html*
which is the same as the first example (*step1.html*):

        <!DOCTYPE html>
        <html lang="en">
        
          <head>
            <title>mg-WebComponents Tutorial Step 2</title>
          </head>
        
          <body>
            <script type="module" src="js/app2.js"></script>
          </body>
        </html>


Try loading this page into your browser.  The result will appear identical to the first example, 
but if you use the browser's JavaScript console to inspect the elements, you'll find that it
has now nested the two &lt;div&gt; tags:

        <tutorial-div-simple>
          <div>
            <tutorial-div-simple>
              <div>Hello World</div>
            </tutorial-div-simple>
          </div>
        </tutorial-div-simple>

Note that the actual *&lt;tutorial-div-simple&gt;* WebComponent tags are completely benign as far as
layout is concerned: by default WebComponent tags behave like &lt;span&gt; tags, with a style
of *display: inline*.



# Applying State To Multiple WebComponents

Take a look at the WebComponent Assembly module you'll find at */www/tutorial/js/step3.js*.  Here's
what it contains:

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


There's two differences from the previous nested example:

- we're now using a different WebComponent: *tutorial-div*
- we're applying state to each of the instances of the *tutorial-div* WebComponent

Let's take a look at this *tutorial-div* WebComponent (you'll find a copy
at */www/components/tutorial/tutorial-div.js*):

The key differences are:

- the HTML includes a &lt;style&gt; tag that defines some CSS styles.  These will be available
specifically for this WebComponent:


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

- the *setState()* method now includes the ability to define attributes for the WebComponent's
main &lt;div&gt; tag, the ability to apply CSS classes to it, and to show or hide the
WebComponent:


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

  Note the way some of these are being applied to the WebComponent's &lt;div&gt; tag (via *this.rootElement*),
whilst others are applied to the top-level WebComponent (via *this*).

- two methods - *show()* and *hide()* are also defined.  These provide an alternative means of
setting the *visible* and *hidden* states respectively:

        show() {
          this.setState({visible: true});
        }
        
        hide() {
          this.setState({hidden: true});
        }

You can see from this that, having started with just a very simple &lt;div&gt; tag, this WebComponent
is beginning to provide a lot of ways of accessing, controlling and modifying it, making it a
very useful and powerful general-purpose way of defining and using the humble &lt;div&gt; tag.  

Note that it's entirely
up to you what functionality you define for your WebComponents.  You can add as many methods of your
own as you like, and make the *setState()* method as complex as you like.


So let's return to the WebComponent Assembly module we're using for this example:

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

You'll see that we're specifying both state and children properties to the outermost 
*tutorial-div* WebComponent, and applying different state to the innermost
*tutorial-div* WebComponent.

The WebComponent loader module and HTML file for this example (*/www/tutorial/js/app3.js* and
*/www/tutorial/step3.html*) are the same as before.  This time when you load the HTML file,
you should see the text *Hello World* appearing against a cyan-coloured background.

If you look at the elements view in the browser's JavaScript console, you should now see:

        <tutorial-div>
          <div style="background-color: cyan">
            <tutorial-div>
              <div>Hello World</div>
            </tutorial-div>
          </div>
        </tutorial-div></body>

Note that for clarity, I've removed the &lt;style&gt; tags that will also be shown in this view.

Something to note is that the *state* properties defined in your WebComponent Assembly
module JSON definition are applied after the respective WebComponent has been
appended to the DOM, actually immediately after the WebComponent's *connectedCallback()*
method has been invoked.

Also it's important to note that if you specify more than one WebComponent within a
*children* array, the child WebComponents are appended to the parent WebComponent in
strict sequence, as defined by each WebComponent's position in the array.


Of course, you can apply as many state properties as you like. Take a look at the
 WebComponent Assembly module you'll find at */www/tutorial/js/step4.js*.  You'll
see that it applies not only an *attributes* *states* property, but also the *hidden states*
property:

        componentName: 'tutorial-div',
        state: {
          attributes: {
            style: 'background-color: cyan'
          },
          hidden: true
        },


So when you load its HTML file (*/www/tutorial/step4.html*), you'll find that nothing is
displayed, though, when you inspect the elements in the browser's JavaScript console, you'll
see that the tags have been rendered, but of course the hidden CSS class has been applied:

        <tutorial-div class="hidden">
          <div style="background-color: cyan">
            <tutorial-div>
              <div>Hello World</div>
            </tutorial-div>
          </div>
        </tutorial-div>


# Adding Dynamic Behaviour Using Hooks

Although, within your WebComponent Assembly JSON definition, the *state* property allows 
you to apply state to a WebComponent, there may be times when you want to do more than that and invoke some
more extensive logic.

Take the previous example where the display was hidden when rendered.  Let's imagine we then want
to make it appear after 5 seconds.

To do that, we can define a method that is added to the WebComponent instance as a *hook*.  What you
do in that hook is up to you, and quite independent of the WebComponent's definition itself, though,
of course, it will almost certainly make use of the WebComponent's available properties and methods.

Take a look at the
 WebComponent Assembly module you'll find at */www/tutorial/js/step5.js*:

        export function define_step5() {
        
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
              }
            }
          };

          return {component, hooks};
        };


Notice the *hooks* property that is being applied to the outermost *tutorial-div* WebComponent:


            hooks: ['showAfterDelay']

This property defines an array of hook methods that you want to apply to the respective WebComponent.
Typically you'll only specify a single method, but you can specify as many as you like.

Each hook method name is up to you to define.  In the example above we're specifying that a single
hook method named *showAfterDelay()* is to be applied.

Your hook methods are normally defined within your WebComponent Assembly module, so you can easily
see the source code for the hooks being applied to your WebComponent Assembly.

You'll see this defined in our example:

          let hooks = {
            'tutorial-div': {
              showAfterDelay: function() {
                let _this = this;
                setTimeout(function() {
                  _this.show();
                }, 5000);
              }
            }
          };

You define your hook methods as an object named *hooks*, the first level of which defines the
WebComponent to which the hook method will apply (in this case the *tutorial-div* WebComponent),
and the second level of which defines the specific named hook method.

So you can see that in our simple example above, the *showAfterDelay* hook method will start a
*setTimeout* function which, after 5 seconds, will invoke the WebComponent's *show()* method.

Notice that the *this* context for a hook method is the instance of the WebComponent to which it applies.

Hence. the *show()* method will be invoked for only the outermost instance of the 
*tutorial-div* WebComponent.

Note that hook methods are invoked after the respective WebComponent has been attached to the DOM, and
after any state values have been applied.


If you specify any hooks in your WebComponent Assembly module, you must return them within the
module's funtion along with the WebComponent Assembly JSON document:


          return {component, hooks};


So now try loading the corresponding HTML page for this example (*/www/tutorial/step5.html*)

This time, you should see a blank screen, and after 5 seconds, *Hello World* should appear against a cyan
background.



# Using Multiple Hooks

You can specify and apply hooks to any of the WebComponents that you define in an Assembly.

Take a look at the
 WebComponent Assembly module you'll find at */www/tutorial/js/step6.js*:


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


So in this example, we're applying a different hook method to each of the *tutorial-div* WebComponents.

- *showAfterDelay* will be applied to the outermost WebComponent
- *changeTextAfterDelay* will be applied to the innermost WebComponent.

These hooks are defined as before:

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

So it's important to recognise that whilst each hook method is referring to *this*, they will be
dealing with different instances of the *tutorial-div* WebComponent.

Notice also that the *changeTextAfterDelay()* hook method is invoking the *setState()* method for
its corresponding WebComponent instance.  As you'll see, after a delay of 8 seconds, it will
change the text content of the WebComponent's *div* tag, and also change its *style* attribute to
a much larger font size.

As before, the WebComponent Assembly module must return both the JSON *component* assembly object
**and** the *hooks* object:

  return {component, hooks};


Try loading the HTML page for this example (*/www/tutorial/step6.html*) and see what happens this time.

The *Hello World* message should appear after 5 seconds, and then, 3 seconds later, the message will
change to *This is very cool stuff* in a much bigger font.


# Defining Your WebComponent Assembly as XML

## Why Use XML?

You can probably already envisage that if you have a large, complex and deeply-nested WebComponent
Assembly definition, then it will require a quite verbose JSON document to describe it.

Whilst many people will find this is quite satisfactory, *mg-webComponents* provides an alternative
way of describing your WebComponents Assembly: as a corresponding set of XML tags.

## How to Define and Assembly as XML

Take a look at the
 WebComponent Assembly module you'll find at */www/tutorial/js/step7.js*.  This is essentially the
same example as the previous one, but expressed using XML instead of JSON.  

So we first define the XML.  Using the *back-tick* syntax makes this clean and easy to do: 

        let config = `
          <tutorial-div attributes.style="background-color: cyan" hook="hideAfterDelay">
            <tutorial-div text="Hello World!" hook="changeTextAfterDelay" />
          </tutorial-div>
        `;

When using this approach, the WebComponent names are expressed as corresponding tag names, eg:

        <tutorial-div></tutorial-div>

which is the equivalent of the JSON syntax:


        componentName: 'tutorial-div'


Any *state* properties are expressed as attributes.  If the *state* property
is an object, then you can use *dot* notation in the attribute name, eg as here:

        attributes.style="background-color: cyan"

which is the equivalent of:

        state: {
          attributes: {
            style: "background-color: cyan"
          }
        }

Using this XML notation you can define a single hook using the *hook* attribute, eg:

        hook="hideAfterDelay"

The *children* array is, of course, substituted by nesting the WebComponent XML tags.

As you can see, this approach can be a lot less verbose and clearer to read than the JSON equivalent.


## Parsing the XML Assembly Definition


However, since *mg-webComponents* only understands the JSON syntax, you must convert the
XML syntax into the equivalent JSON syntax.  *mg-webComponents* provides a method called
*parse* for doing this:

        let component = webComponents.parse(`${config}`);


Now, in order to use this API, we need to pass the *webComponents* object to your
Assembly module.  So we first need to change its function interface at the top of the module:

        export function define_step7(webComponents) {

So you can see that we're now passing the webComponents as the first argument of the exported
function.

Secondly, in your Load/Render module, you need to make the following change.
(see */www/tutorial/app7.js*):

        webComponents.addComponent('step7', define_step7(webComponents));

So now your Assembly's *define_step7* function will be correctly passed the *webComponents* object,
which, in turn, was instantiated by:

        import {webComponents} from '../../mg-webComponents.js';


## Completing the Example


The hook methods in this example are only slightly modified from the previous example:

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

See if you can spot the difference.

## Running the Example

Try loading the corresponding HTML page (*/www/tutorial/step7.html*) to see this example
in action.



# Using Hooks to Define Event Handlers

## Background

So far, the examples of *hooks* have been of a pretty trivial nature.  One of the
more likely purposes you'll use for *hooks* is to define dynamic Event Handlers for your
WebComponents.

Although it's fairly common to define Event Handlers, eg how to handle a button click, within the
WebComponent definition itself, you will find that there will be circumstances where such a statically-defined
handler is insufficient for what you need, and instead you'll need one whose behaviour is determined at run-time, eg
to fetch data from a database and do something based on the characteristics of that data.

So, for example, you could define a general-purpose *button* WebComponent, whose *click* handler
is defined as a *hook* method and is therefore context-dependent rather than statically-defined.

## An Example Using a Button WebComponent

Take a look at the
 WebComponent Assembly module you'll find at */www/tutorial/js/step8.js*.

This uses the XML syntax described above to define the WebComponent Assembly:

        let config = `
          <tutorial-div>
            <tutorial-button text="Try me out" hook="buttonClick" />
            <tutorial-div name="display" />
          </tutorial-div>
        `;

This time we're using two instances of the *tutorial-div* WebComponent, but we're also
using a new WebComponent named *tutorial-button*.  

## The Button WebComponent

Let's take a look at its definition 
(see */www/components/tutorial/tutorial-button.js*).

This follows the usual pattern, but this time its HTML is a &lt;button&gt; tag:

        const html = `
          <button>Default Text</button>
        `;

        this.html = `${html}`;

Its *setState* method is pretty much identical to the one we defined for the
*tutorial-div* WebComponent, and it also has a show and hide method defined.

The *connectedCallback()* method sets the *rootElement* property to the &lt;button&gt; tag.

      this.rootElement = this.getElementsByTagName('button')[0];

but otherwise everything else in this WebComponent definition should look familiar.

## Defining the Button's Handler in the Hook Method

So now let's look at the hook that is to be applied to this button in our WebComponents
Assembly definition:

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

Always use the pattern shown above when creating handlers:

- create a function which defines the actual handler method.  In our case:

        let fn = function() {
          let div = _this.getComponentByName('tutorial-div', 'display');
          div.setState({text: 'Button was clicked at ' + new Date().toLocaleString()});
        };

- use *this.addHandler()* to create the actual Event Handler.

        this.addHandler(fn, this.rootElement);

The arguments for this method are:

- fn: the Event Handler function to trigger
- target element: the element within the WebComponent to which the Event Handler will be added (default is *this.rootElement*)
- the type of event that triggers the handler (default is 'click')

So, in our example above, we could have simply specified:

        this.addHandler(fn);


## Why Use *this.addHandler()*?


Why should you use this method instead of an explicit call to:

        this.rootElement.addEventListener('click', fn);

The answer is that by using *this.addHandler()*, *mg_webComponents* registers this handler and will
automatically remove it if the WebComponent instance is removed from the DOM.  This ensures you won't
suffer from any memory leaks.


## Accessing the Methods of Another WebComponent

Let's take a further look at the Event Handler function we've specified:

        let fn = function() {
          let div = _this.getComponentByName('tutorial-div', 'display');
          div.setState({text: 'Button was clicked at ' + new Date().toLocaleString()});
        };

This is using a method (*getComponentByName*) that *mg-webComponents* automatically 
adds to your WebComponents when they are loaded.  This method allows you to locate any of your
WebComponents within the DOM.  It requires two arguments:

- The name of the WebComponent you want to find: in our case *tutorial-div*
- the name property of the specific instance of the WebComponent you want to find.

Remember when we looked at the recommended template structure for your WebComponents, it provided a 
state property for defining a name for the WebComponent instance?  Now you can see how and when it
comes into play.

So if you look at the Assembly XML definition, you'll see this:

            <tutorial-div name="display" />

So the Event Handler is locating this WebComponent instance using:

          let div = _this.getComponentByName('tutorial-div', 'display');

Having located it, it can now set this WebComponent's text content using its *setState()* method:

          div.setState({text: 'Button was clicked at ' + new Date().toLocaleString()});

So you can see in this example how you can access and use the methods and properties of any
WebComponent within the DOM of your application.

## Run the Example

OK, let's try this example out by loading its HTML Page (*/www/tutorial/step8.html*),

You'll see the button appear.  Every time you click it, text should appear in the *div* tag
beneath it, updating the date/time it was clicked.

Spend some time studying the example code above to see why this is happening.  Hopefully it should
be fairly self-explanatory now.


# Methods Added to Your WebComponents by *mg_webComponents*

## Background

One of the interesting aspects of *mg_webComponents* is that it automatically augments your
WebComponent instances when they are loaded into the DOM.  These useful methods are
therefore available to all your WebComponents, and are particularly useful within the *Hook*
methods that you apply to your WebComponents within your Assembly modules.

## getComponentsByName

You've already seen in the previous example how to locate a WebComponent in the DOM from within
a WebComponent's *Hook* method:


          let component = this.getComponentByName(componentName, nameProperty);

See the previous example for details


## getParentComponent

Another useful method is *getParentComponent*, eg:

          let parentComponent = this.getParentComponent(componentName);

This method recursively searches up the DOM's parent nodes, starting from your current
WebComponent, for the specified WebComponent.

For example, let's say you have a form WebComponent, eg *tutorial-form*, and a 
form field component, eg *tutorial-form-field*.

Within your WebComponent Assembly module, you could add a *Hook* method 
to a *tutorial-form-field* WebComponent that locates the parent *tutorial-form* WebComponent.

eg let's say your Assembly definition was:

        <tutorial-form>
          <tutorial-form-field hook="getFormComponent" />
        </tutorial-form>

Then the *getFormComponent Hook* method might be:

        let hooks = {
          'tutorial-form-field': {
            getFormComponent: function() {
              let form = this.getParentComponent('tutorial-form');
              // you can now use any of the form component's methods or properties
            }
          }
        };

Note that when using the method, the WebComponent you're looking for doesn't need to
have had a name attribute assigned to it.

If the specified WebComponent can't be found up the parent node chain in the DOM, the
*getParentComponent* method will return *undefined*.


## Adding Event Handlers to WebComponents

We've already seen in a previous example how you can add Event Handlers to specific tags
within a WebComponent:

        this.addHandler(handlerFunction, targetElement, eventType);

eg:

        this.addHandler(fn, this.rootElement, 'click');

If the *eventType* is not specified, 'click' is assumed.

If the targetElement is not specified, *this.rootElement* is assumed.



## Removing a WebComponent from the DOM

You can instruct a WebComponent to remove itself from the DOM:

        this.remove();

In doing so, this method will recurse down through the DOM below the WebComponent defined
by *this*, and remove any lower-level WebComponents in an orderly fashion.  In doing so, their
*disconnectCallback()* methods are invoked and, in turn, any handlers etc that were added to them
using *this.addHandler()* will be cleanly removed.

The *disconnectCallback()* method of a WebComponent may, of course, also include other specific logic
defined by the WebComponent's author.  However, as described at the start of this tutorial,
you should always ensure that the
*disconnectCallback()* method of every WebComponent you use contains, as a minimum:


            disconnectedCallback() {
              if (this.onUnload) this.onUnload();
            }

The main purpose of *this.onUnload()* is to remove added Event Handlers.


## Registering Other Methods/Functions For Clean Unloading

In addition to Event Handlers, there may be other things that you want to assign to a
WebComponent that should be cleanly unloaded if the WebComponent is removed.

A good example is a timer using *setInterval* that you might want to intantiate and set going
when a particular WebComponent is loaded and rendered.

In your WebComponent's *Hook* method you might, therefore do the following:


        let hooks = {
          'tutorial-example-component': {
            startTimer: function() {
              this.timer = setInterval(function() {
                // do something
              }, 30000);
            }
          }
        };

So this will set your timed function firing every 30 seconds.  However, if the WebComponent
is removed from the DOM, either as a result of its *remove()* method being invoked, or one of
its parent WebComponents being removed, then you will want that timer stopped and removed.

The trick is to first define a function that will stop the timer:

        let hooks = {
          'tutorial-example-component': {
            startTimer: function() {
              let timer = setInterval(function() {
                // do something
              }, 30000);

              // *** add function to stop the timer

              let stopTimer = function() {
                clearInterval(timer);
              };

              // ***

            }
          }
        };

Finally, you can register this *stopTimer* function as a method that should be unloaded if the
WebComponent is removed from the DOM.  To do this, use the *registerUnloadMethod()* method, ie:

        this.registerUnloadMethod(unloadFunction);

So let's complete the example above:


        let hooks = {
          'tutorial-example-component': {
            startTimer: function() {
              let timer = setInterval(function() {
                // do something
              }, 30000);

              let stopTimer = function() {
                clearInterval(timer);
              };
              this.registerUnloadMethod(stopTimer);
            }
          }
        };



# Reserved Methods within WebComponents

*mg_webComponents expects to find and be capable of invoking a couple of specifically-named
methods within your WebComponents.

You've already come across the main one of these in this tutorial:

- setState()

You can also, optionally, define a method named *onLoaded()* within your WebComponents.
This method will be automatically invoked by *mg_webComponents*:

- after any state properties defined in the WebComponent Assembly are added for the WebComponent
- but **before** any *hook* method is invoked

What you do in an *onLoaded()* method is up to you.  Simply define it within your WebComponent using:


        onLoaded() {
          // your logic to be invoked when the WebComponent is loaded
        }



# Reserved Property Names within WebComponents

*mg_webComponents expects to find and be capable of using some specifically-named
properties within your WebComponents.  

You've already come across them in this tutorial:

- this.rootElement: this should be assigned to the outermost HTML tag in your WebComponent's markup

- this.childrenTarget: this should be assigned to the HTML tag within which other WebComponents will be nested

- this.name: a name property you can assign to a WebComponent instance.  The value should be unique across
instances of the same WebComponent.  This property is used by the *getComponentsByName()* method.

You are free to use any other property names for your own purposes.



# Methods Available to your Load/Render Module

*mg_webComponents provides a number of methods that are designed for use within your Load/Render Module. 

You've already come across two of these in this tutorial:

- addComponent(name, assemblyMethod): this invokes your WebComponent Assembly function and registers
the result using your specified name

- loadGroup(name, targetElement, context): this loads and renders your WebComponent assembly into the DOM
by appending it to the specified target element.  This target element may be a standard DOM element 
(eg the document's *body* tag), or another WebComponent (see the next method)

- getComponentByName(componentName, propertyName): This method is also available to you within your Load/Render module, for locating previously-loaded WebComponents.

- loadWebComponent(webComponentName, targetElement, context, callback): This method allows you to load a single named WebComponent rather than an Assembly. Its callback function is fired when the WebComponent is rendered
into the DOM.  The callback function passes the WebComponent instance as its argument, eg:

        let body = document.getElementsByTagName('body')[0];

        webComponents.loadWebComponent('adminui-root', body, context, function(root) {
          // root is the instance of the adminui-root WebComponent,
          //  so, eg, to set its state:
          //    root.setState({name: 'foo'});
        });


# Other Available Methods

*mg-webComponents* provides further methods that are available to your Load/Render Modules, your
Assembly Modules and also your WebComponent Modules.

## Methods for loading Resources

The resources needed by your WebComponents for their appearance and/or behaviour may only available
as old-style files that are loaded using &lt;script&gt; and &lt;link&gt; tags.  Rather than
loading them in the HTML file (which is, of course,  always an option, you can instead opt to
download them dynamically.  This is a particularly good idea if you're designing a WebComponent Module
Library from which many different applications could be built.  You can create a core/root WebComponent which
looks after the loading of all the necessary resources needed by all the other WebCompnents in the Library.
Users of the Library then don't need to worry about the resources: they are all included with the
WebComponent Library and automatically loaded as needed.

Take a look at the [wc-admin-ui](https://github.com/robtweed/wc-admin-ui) WebComponent Library which is built around a Bootstrap 4 and jQuery
Admin UI framework.  The *onLoaded()* method of its 
[*admninui-root*](https://github.com/robtweed/wc-admin-ui/blob/master/components/adminui-root.js)
 component looks after the downloading of the necessary resources,
all of which are also included with the WebComponent Library.

If you want to do something similar, you can make use of the following methods:

- webComponents.loadJSFile(src, loadCallback): Dynamically loads a JavaScript file from the specified *src* URI. When 
the JavaScript file has loaded, the optional callback function is invoked, allowing you to control the sequence
of loading of interdependent HJavaScript files.

- webComponents.loadCSSFile(src, loadCallback): Dynamically loads a CSS Stylesheet file from the specified *src* URI. When 
the CSS file has loaded, the optional callback function is invoked.


## Method for Adding *Meta* Tags

*mg-webComponents* also includes a method for optionally adding *meta* tags to the *head* section of the
HTML page.  Once again, you may choose to explicitly define such tags in the HTML file, but this method provides
the option of these tags being automatically and dynamically added, for example, by one of your WebComponent Modules.

- webComponents.addMetaTag(attributes_object): adds a *meta* tag using the information defined in an object passed as an 
argument.  The *attributes_object* structure is of the form:

        {
          name1: value1,
          name2: value2,
          ...etc
        }


creating a corrsponding *meta* tag:

        <meta name1="value1" name2="value2" ...etc >


For example, within a WebComponent Module:

        this.addMetaTag({
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, shrink-to-fit=no'
        });



