# Using *mg-webComponents* With QEWD
 
This tutorial will allow you to understand how to integrate *mg-webComponents* WebComponent
Modules and Assemblies with the [QEWD back-end framework](https://github.com/robtweed/qewd) 
and [QEWD-JSdb](https://github.com/robtweed/qewd-jsdb).

I'll assume that you've already read the avaiable tutorials on the use of QEWD and QEWD-JSdb so that you are
at least aware of their basic operation.  If not,
read these documents:

- [QEWD Interactive Application Tutorial](https://github.com/robtweed/qewd-baseline/blob/master/INTERACTIVE.md)
- [QEWD-JSdb Tutorial](https://github.com/robtweed/qewd-jsdb/blob/master/REPL.md)


# Your Web Server Folder Structure

If you're using QEWD with *mg-webComponents*, your QEWD environment's folder structure should look like this.

I'll assume your QEWD environment's root path is */opt/qewd* (Note, if you are using the QEWD Docker Container,
your QEWD environment folder will be your host's mapped directory, or, internally within
the container itself, the */opt/qewd/mapped* folder).


        /opt/qewd
         |
         |- www
         |   |
         |   |- mg-webComponents.js
         |   |
         |   |- qewd-client.js
         |   |
         |   |- components
         |   |   |
         |   |   |- tutorial
         |   |
         |   |- tutorial
         |
         |- qewd-apps
         |    |
         |    |- tutorial
         |
         |- configuration
         |   |
         |   |- config.json


If you've used QEWD before, then this structure should be largely familiar, but let's step through it from the top:

- /www: The QEWD Web Server root path
- /www/mg-webComponents.js: the core *mg-webComponents* Module which you'll have already installed
- /www/qewd-client.s: the latest [client module for QEWD](https://github.com/robtweed/qewd-client),
 now implemented as an ES6 module.
- /www/components: a folder you'll have created for your WebComponent Module Library or Libraries.  
  - /www/components/tutorial: If you've been following the basic tutorial, you'll have already created this sub-folder which
will contain a number of WebComponent Modules
- /www/tutorial: All your QEWD Application projects should be defined in appropriately-named folders under the QEWD
Web Server's root path.  If you've been following the basic tutorial, you'll have already created this sub-folder which
will contains the HTML, JavaScript and CSS resources of your project.
- /qewd-apps: A directory QEWD expects to find for your interactive applications.  
This directory will contain the QEWD message handler methods for your application.
  - /qewd-apps/tutorial: For example, we'll build out the QEWD message handler methods for this tutorial here
- /configuration: the QEWD Configuratio folder which QEWD will expect to find
  - /configuration/config.json: the JSON file defining your QEWD system's configuration.



# A Simple Example Using QEWD


The last example in the [basic Tutorial](./TUTORIAL.md#using-hooks-to-define-event-handlers) demonstrated
the basic use of *hooks* in your WebComponent Assemblies.

Let's quickly review that application.

## WebComponent Assembly Module

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

So this example displays a button with the text "Try me out", and, when clicked, it invokes a
*click* event handler which was defined by the hook named *buttonClick*,

Currently all the handler does is display the date and time in a *div* tag beneath the button.

## The HTML Loader Page

The HTML page that loads this application into the browser is the standard, very simple, structure for
all *mg-webComponent* applications:

        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>mg-WebComponents Tutorial Step 8</title>
          </head>
          <body>
            <script type="module" src="js/app8.js"></script>
          </body>
        </html>


## The Load/Render Module

Loading and Rendering the WebComponent Assembly is done by the *app8.js* file which the HTML page loads.

Again, it conforms to the usual structure for an *mg-webComponents* Load/Render file described in the basic
tutorial:

        import {webComponents} from '../../mg-webComponents.js';
        import {define_step8} from './step8.js';
        
        document.addEventListener('DOMContentLoaded', function() {
          webComponents.addComponent('step8', define_step8(webComponents));
        
          let context = {
            path: './components/tutorial/'
          };
        
          webComponents.setLog(true);
          webComponents.loadGroup(webComponents.components.step8, document.getElementsByTagName('body')[0], context);
        });


## Modifying the Application to use QEWD

So, instead of simply displaying the current date/time when the button is clicked, let's instead fetch some information
from the QEWD back-end.  This will require a QEWD WebSocket message to be sent when the button is clicked.  When the
response from QEWD is received, let's display that in the *div* beneath the button.

The first thing we'll need to do is to modify the Load/Render Module (*app8.js*).  Let's copy it to a new
file named *app-q1.js*.  Here's what it needs to contain:


        import {webComponents} from '../../mg-webComponents.js';

        import {QEWD} from '../../qewd-client.js';  // <===== (1)

        import {assembly} from './step-q1.js';      // <===== (5)
        
        document.addEventListener('DOMContentLoaded', function() {
          
          QEWD.on('ewd-registered', function() { // <===== (3)
          
            QEWD.log = true; // <===== (4)
             
            webComponents.addComponent('buttonDemo', assembly(webComponents, QEWD));  // <====== (6)
        
            let context = {
              path: './components/tutorial/'
            };
        
            webComponents.setLog(true);
            let body = document.getElementsByTagName('body')[0];
            webComponents.loadGroup(webComponents.components.buttonDemo, body, context); // <===== (7)
          });

          QEWD.start({                // <===== (2)
            application: 'tutorial'
          });

        });

I've added comments with numbered arrows highlighting the changes that we made which I'll explain below

- (1): We're now also loading the QEWD-Client ES6 Module.  This provides all the necessary methods for the browser to communicate
with the QEWD back-end.

- (2): Once the DOM is successfully loaded (ensured by the *DOMContentLoaded* Event Handler), we start the
QEWD Client.  That establishes a WebSocket connection with the QEWD back-end, and registers the application
on QEWD via WebSocket messages.  We've decided to name the application *tutorial*

- (3): Everything we subsequently do should wait for successful registration of the application.  We therefore use
the *QEWD.on('ewd-registered')* Event Handler, and everything else in the application is now moved inside its
callback function.  The QEWD object will now provide everything we need for secure communication with the QEWD back-end.

- (4): To help debug and also to see what's going on, we'll enable console logging in the QEWD Client.

- (5): We've not yet seen how the Assembly file needs to be modified, but we'll be loading it here from a file we'll name
*step-q1.js*

- (6): and its exported method is invoked and the result added to the *webComponents* object here.  Notice that we've
now added the QEWD Object as a second argument of its method.

- (7) The assembly (now named *buttonDemo* in the prevous step) is finally rendered as before.


All your QEWD Applications that make use of *mg-webComponents* WebComponent Modules and Assemblies should follow
this pattern.


## Assembly File

So now let's look at how the Assembly File should be modified.  You've already seen one change above: its
exported method should now include the QEWD object as a second argument.

Here's the modified Assembly File (now named *step-q1.js*):

        export function assembly(webComponents, QEWD) {  // <===== (1)
        
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
                let fn = async function() {              // <===== (3)
                  let responseObj = await QEWD.reply({   // <===== (2)
                    type: 'testMessage'                  // <===== (4)
                  });
                  let div = _this.getComponentByName('tutorial-div', 'display');
                  div.setState({text: JSON.stringify(responseObj)});    // <===== (5)
                };
                this.addHandler(fn, this.rootElement);
              }
            }
          };
        
          return {component, hooks};
        };


Again, I've added comments with numbered arrows highlighting the changes that we made which I'll explain below:

- (1): Notice that the QEWD Object is being passed into this Module's exported function

- (2): So now we can use it within the *click* handler's method.  The closure created by this handler function
 means that the QEWD Object will
be available to that handler method whenever the button is clicked.  Specifically, we'll send a WebSocket message to QEWD
by using the *QEWD.reply()* method.
- (3): The *QEWD.reply()* method uses async/await, so the handler function must be declared as
an async function.
- (4): The QEWD Message Type we'll send is up to us - here we'll send a type of *testMessage*.  For the purpose of this
demonnstration, we won't be sending any other parameters in the message, but we could, of course, add whatever additional
parameters we want/need.
- (4): In this simple example we'll simply display the raw response received back from the
QEWD back-end as the text of the *div* tag under the button.


## The HTML Loader File

Just one last step: create a new HTML Loader page file which picks up our new Load/Render module:

        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>mg-WebComponents Tutorial Using QEWD (1)</title>
          </head>
          <body>
            <script type="module" src="js/app-q1.js"></script>
          </body>
        </html>

Save it as *step-q1.html*



## Try it out

We've not yet created a back-end QEWD Handler method, but we can try out what we've done in these front-end files.
Make sure you've opened up the browser's JavaScript Console / Developer Tools. 
 Then simply load the HTML file above into your browser, eg:

        http://192.168.1.100:8080/tutorial/step-q1.html


You should now see in the console log that it first registered the application with QEWD before then loading the WebComponents:

        tutorial registered

        load element: tutorial-div
        load element: tutorial-button
        load element: tutorial-div


Now try clicking the button.  In the console you should see it sending the message to the QEWD back-end:

        sent: {"type":"testMessage"}

but you should see a rather unpleasant-looking error message appear beneath the button, eg:

        {"type":"testMessage","finished":true,"message":{"error":"Unable to 
        load handler module for: tutorial","reason":{"code":"MODULE_NOT_FOUND",
        "requireStack":["/opt/qewd/node_modules/qewd/lib/appHandler.js",
        "/opt/qewd/node_modules/qewd/lib/worker.js","/opt/qewd/node_modules/qewd/lib/qewd.js",
        "/opt/qewd/node_modules/qewd/index.js","/opt/qewd/node_modules/ewd-qoper8/lib/worker/proto/init.js",
        "/opt/qewd/node_modules/ewd-qoper8/lib/ewd-qoper8.js","/opt/qewd/node_modules/ewd-qoper8/index.js",
        "/opt/qewd/node_modules/ewd-qoper8-worker.js"]}},"responseTime":"5ms"}

Don't worry about that though - this is actualy good news: it's showing that our front-end logic is working
correctly.  It's sending a message to QEWD and it's getting back a response from the QEWD back-end and 
correctly displaying it!



## Add the QEWD Back-end Message Handler

You'll need to do the next steps in the *qewd-apps* directory, specifically for our *tutorial* application, ie:

        /opt/qewd
         |
         |
         |- qewd-apps
         |    |
         |    |- tutorial
                  |
                  |- {{Handler methods will go here}}


Our front-end's button *click* event hander is sending a QEWD message named *testMessage*, so let's now define it.

First, create a directory of the same name within the */qewd-apps/tutorial* folder, and then, within that folder,
create a file named *index.js*, ie:


        /opt/qewd
         |
         |
         |- qewd-apps
         |    |
         |    |- tutorial
                  |
                  |- testMessage
                       |
                       |- index.js


Let's create a very simple and completely standard QEWD message handlermfunction that just returns some
 information from the QEWD system's Node.js environment.

So your *index.js* file should look like this:


        const os = require('os');
        module.exports = function(messageObj, session, send, finished) {
          finished({cpus: os.cpus()});
        };


Now, because this is the first time we've created a handler method for this application (*tutorial*), QEWD won't load it because it
only registers applications defined in the *qewd-apps* folder when it is first started.  So you'll need to stop and restart your
QEWD system.  

Note that this is a one-time step per application.  If you subsequently add or edit further handler methods to 
the *tutorial* application, you'll just need to stop the QEWD Worker processes in order for them to be loaded by QEWD.  The
most convenient way to stop the QEWD Worker processes is to use the QEWD Monitor application.

The try re-loading the browser page and try clicking the button again.  This time you should get a proper response back from the
handler method we just created, eg:

        {"type":"testMessage","finished":true,"message":{"cpus":
        [{"model":"ARMv7 Processor rev 3 (v7l)","speed":600,"times":
        {"user":22034600,"nice":21500,"sys":15025400,"idle":38076195100,"irq":0}},
        {"model":"ARMv7 Processor rev 3 (v7l)","speed":600,"times":
        {"user":24418000,"nice":19100,"sys":14909300,"idle":38090356400,"irq":0}},
        {"model":"ARMv7 Processor rev 3 (v7l)","speed":600,"times":
        {"user":22708300,"nice":21600,"sys":14808100,"idle":38104984500,"irq":0}},
        {"model":"ARMv7 Processor rev 3 (v7l)","speed":600,"times":
        {"user":21485500,"nice":29000,"sys":13559300,"idle":38095269900,"irq":0}}]},
        "responseTime":"5ms"}


# Conclusions

Whilst the example we've created is pretty trivial,it actually provides the general pattern that you can use in
order to integrate *mg-webComponents* WebComponent modules and Assemblies with QEWD.  The trick is:

- pass the QEWD Object as an argument to your Assembly definition's exported function;
- within the Assembly logic, any of the *hooks* that you define can then make use of the
QEWD Object's methods and properties.  In the main you'll be using the *QEWD.reply()* method.

If you want to see some advanced examples that use the SB Admin 2 themed WebComponent Module library
wih QEWD, take a look at:

- the sB Admin 2-themed version of the [QEWD Monitor application](https://github.com/robtweed/qewd-monitor-adminui).  
This is pre-installed and configured for you to use in the latest QEWD Docker Containers.

- the [SB Admin 2-themed demo application](https://github.com/robtweed/wc-admin-ui/tree/master/examples/with_qewd)

You'll see that they all adhere very closely to the pattern described above in this tutorial.





