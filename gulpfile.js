var gulp = require('gulp'),
	stylus = require('gulp-stylus'),
	fs = require('fs'),
	source = require('vinyl-source-stream'),
	browserify = require('browserify');

gulp.task('css', function () {
  return gulp.src('./src/styl/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./public/compiled/css/'));
});

gulp.task('js', function(){

	browserify('./src/js/notes-app.js')
		// .transform("babelify", {presets: ["es2015"]}) TODO - should i use it? what are the deps?
		.bundle()
		.pipe(source('notes-app.bundle.js'))
		.pipe(gulp.dest('./public/compiled/js/'));
});

gulp.task('move-templates',function(){
	gulp.src('./src/js/**/*.html')
		.pipe(gulp.dest('./public/compiled/templates/'));
});

var js_task_list = 'js',
	styl_task_list = 'css',
	move_template_list = 'move-templates',
	js_watcher   = gulp.watch('src/js/**/*.js', [js_task_list]),
	styl_watcher = gulp.watch('src/styl/**/*.styl', [styl_task_list]),
	html_watcher = gulp.watch('src/js/**/*.html', [move_template_list]);

console.log("watching js files for changes ...");
js_watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running [' + js_task_list + '] tasks ...');
});

console.log("watching styl files for changes ...");
styl_watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running [' + styl_task_list + '] tasks ...');
});

console.log("watching html/templates files for changes ...");
html_watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running [' + move_template_list + '] tasks ...');
});

gulp.task('default', ['css','js', 'move-templates']);

/*
TODO
- dev vs prod
	- minify
	- sourcemaps
- compiling jade templates?
*/