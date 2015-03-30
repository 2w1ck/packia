# packia
a simple web development boilerplate using: nodejs, express, backbone, gulp and browserify.

### files and dirs
`src` contains the source code of the whole application. `target` contains the transpiled and minified code.

all js files in the `src` directory can be written in ES6 and are transpiled through gulp+babel into ES5 
files into the target folder. gulp will bundle all client side js files into a `bundle.js` file through browserify.

all css files in the `src` directory can be written in SCSS and get transpiled through gulp+sass into CSS
files into the target folder.

### modules
packia uses models via CommonJS on the clientside and backend. `src/client/js/app.js` is the entry point for the clientside
and `src/server/app.js` for the backend.