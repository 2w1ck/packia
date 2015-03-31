/*jslint node: true */
/*jshint esnext: true */
'use strict';

/*
	main entry point file for client side JS.
*/

// libs
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

// set backbone's jquery reference
Backbone.$ = $;

// backbone
var router = require('./various/Router');

// check jquery
$('.jqueryCheck').text('jQuery is loaded and works');

// start backbone history
Backbone.history.start();