/*jslint node: true */
/*jshint esnext: true */
'use strict';

var Backbone = require('backbone');

// define routes of application here
var Router = Backbone.Router.extend({
	router: {
		'': 'home'
	}
});

var router = new Router();

// default home route
router.on('route:home', () => {

});

module.exports = router;