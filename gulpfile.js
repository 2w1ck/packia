var gulp = require('gulp');
var out = require('gulp-out');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var newer = require('gulp-newer');
var watch = require('gulp-watch');
var babel = require('gulp-babel');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var notify = require("gulp-notify");
var buffer = require('vinyl-buffer');
var plumber = require('gulp-plumber');
var browserify   = require('browserify');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');

// source paths
var sourcePaths = {
	client: {
		css: 'src/client/css/**/*.scss',
		js: 'src/client/js/**/*.js'
	},
	server: {
		js: 'src/server/**/*.js'
	}
};

// destination paths
var destPaths = {
	client: {
		css: 'target/client/css',
		js: 'target/client/js',
		jsTargets: ['target/client/js/**/*.js', '!target/client/js/client.js'],
		entryPoint: './target/client/js/app.js',
		browserifyTarget: 'target/client/js'
	},
	server: {
		js: 'target/server'
	}
};

// tasks
gulp.task('transpileClientCSS', function () {
	watch(sourcePaths.client.css, function(){
	    gulp.src(sourcePaths.client.css)
	    .pipe(plumber())
	    .pipe(newer(destPaths.client.css))
	    .pipe(sass({errLogToConsole: true}))
	    .pipe(gulp.dest(destPaths.client.css))
	    .pipe(notify('transpiled client scss files'));
	});
});

gulp.task('transpileClientJS', function(){
	watch(sourcePaths.client.js, function(){
	    gulp.src(sourcePaths.client.js)
	    .pipe(plumber())
	    .pipe(newer(destPaths.client.js))
	    .pipe(babel())
	    .pipe(gulp.dest(destPaths.client.js))
	    .pipe(notify('transpiled client js6 files'));
	});
});

gulp.task('transpileServerJS', function(){
	watch(sourcePaths.server.js, function(){
		gulp.src(sourcePaths.server.js)
		.pipe(plumber())
		.pipe(newer(destPaths.server.js))
		.pipe(babel())
		.pipe(gulp.dest(destPaths.server.js))
		.pipe(notify('transpiled server js6 files'));
	});
});

// browserify gets a little more complicated
var bundler = watchify(browserify(watchify.args));
bundler.add(destPaths.client.entryPoint);
bundler.on('update', bundle);
bundler.on('log', gutil.log);

function bundle(){
	return bundler.bundle()
	.on('error', gutil.log.bind(gutil, 'Browserify Error'))
	.pipe(plumber())
	.pipe(source('bundle.js'))
	/*
	.pipe(buffer())
	.pipe(uglify())
	*/
	.pipe(gulp.dest(destPaths.client.browserifyTarget))
	.pipe(notify('browserified client js files'));
}

gulp.task('browserifyClientJS', bundle);

gulp.task('watch', function(){

});

// default: watch over source directories and compile files in case of changes
gulp.task('default', ['watch', 'transpileClientCSS', 'transpileClientJS', 'transpileServerJS', 'browserifyClientJS']);