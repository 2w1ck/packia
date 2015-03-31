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
var livereload = require('gulp-livereload');
var autoprefixer = require('gulp-autoprefixer');

// source paths
var sourcePaths = {
	client: {
		img: [
			'src/client/imgs/**/*.png',
			'src/client/imgs/**/*.jpg',
			'src/client/imgs/**/*.ico'
		],
		css: 'src/client/css/**/*.scss',
		js: 'src/client/js/**/*.js'
	},
	config: 'src/config/**/*.json',
	server: {
		js: 'src/server/**/*.js',
		views: 'src/server/**/*.jade'
	}
};

// destination paths
var destPaths = {
	client: {
		img: 'target/client/imgs',
		css: 'target/client/css',
		js: 'target/client/js',
		jsTargets: ['target/client/js/**/*.js', '!target/client/js/client.js'],
		entryPoint: './target/client/js/client.js',
		browserifyTarget: 'target/client/js'
	},
	config: 'target/config',
	server: {
		js: 'target/server',
		views: 'target/server'
	}
};

// tasks
gulp.task('transpileClientCSS', function () {
	gulp.src(sourcePaths.client.css)
	.pipe(watch(sourcePaths.client.css))
	.pipe(plumber())
	.pipe(sass({errLogToConsole: true}))
	.pipe(autoprefixer())
	.pipe(gulp.dest(destPaths.client.css))
	.pipe(notify('transpiled client scss files'))
	.pipe(livereload());
});

gulp.task('transpileClientJS', function(){
	gulp.src(sourcePaths.client.js)
	.pipe(watch(sourcePaths.client.js))
	.pipe(plumber())
	.pipe(babel())
	.pipe(gulp.dest(destPaths.client.js))
	.pipe(notify('transpiled client js6 files'));
});

gulp.task('transpileServerJS', function(){
	gulp.src(sourcePaths.server.js)
	.pipe(watch(sourcePaths.server.js))
	.pipe(plumber())
	.pipe(babel())
	.pipe(gulp.dest(destPaths.server.js))
	.pipe(notify('transpiled server js6 files'));
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
	.pipe(livereload())
	.pipe(notify('browserified client js files'));
}

gulp.task('browserifyClientJS', bundle);

// simple copy tasks
gulp.task('copyConfig', function(){
	gulp.src(sourcePaths.config)
	.pipe(watch(sourcePaths.config))
	.pipe(gulp.dest(destPaths.config))
	.pipe(notify('copied config files to target'));
});

gulp.task('copyJadeViews', function(){
	gulp.src(sourcePaths.server.views)
	.pipe(watch(sourcePaths.server.views))
	.pipe(gulp.dest(destPaths.server.views))
	.pipe(notify('copied jade views files to target'))
	.pipe(livereload());
});

gulp.task('copyImages', function(){
	gulp.src(sourcePaths.client.img)
	.pipe(watch(sourcePaths.client.img))
	.pipe(gulp.dest(destPaths.client.img))
	.pipe(notify('copied image files to target'))
	.pipe(livereload());
});

gulp.task('livereload', function(){
	livereload.listen({start: true});
});

// default: watch over source directories and compile files in case of changes
gulp.task('default', [
	'livereload', 
	'transpileClientCSS', 
	'transpileClientJS', 
	'transpileServerJS', 
	'browserifyClientJS', 
	'copyConfig', 
	'copyJadeViews',
	'copyImages'
]);