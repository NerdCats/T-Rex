'use strict'
const gulp = require('gulp')
const del = require('del');
const templateCache = require('gulp-angular-templatecache')
const minifyHtml = require('gulp-minify-html')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const ngannotate = require('gulp-ng-annotate')
const closure = require('gulp-jsclosure')
const p = require('path')
const runSequence = require('run-sequence');

const jsFilePaths = [
	'app/*.js',
	'app/directives/**/*.js',
	'app/services/*.js', 
	'app/controllers/*.js'
];

const jsLibFilePaths = [
	"node_modules/jquery/dist/jquery.min.js",
	"node_modules/jQuery.print/jQuery.print.js",
	"node_modules/moment/min/moment.min.js",
	"node_modules/bootstrap/dist/js/bootstrap.min.js",
	"node_modules/eonasdan-bootstrap-datetimepicker-npm/build/js/bootstrap-datetimepicker.min.js",
	"node_modules/angular/angular.min.js",
	"node_modules/angular-route/angular-route.min.js",
	"node_modules/angular-animate/angular-animate.min.js",
	"node_modules/angular-aria/angular-aria.min.js",
	"node_modules/angular-messages/angular-messages.min.js",
	"node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
	"node_modules/angular-file-upload/dist/angular-file-upload.min.js",
	"node_modules/mdPickers/dist/mdPickers.min.js",
	"node_modules/clipboard/dist/clipboard.min.js",
	"node_modules/ngclipboard/dist/ngclipboard.min.js",
	"node_modules/angular-local-storage/dist/angular-local-storage.min.js",
	"node_modules/ms-signalr-client/jquery.signalR.min.js",
	"node_modules/angular-signalr-hub/signalr-hub.min.js"
]

gulp.task('dist', function () {
	//first load the services, then the directives and then the controller
	return gulp.src(jsFilePaths)			
			.pipe(ngannotate())
			.pipe(concat('main.js'))
			.pipe(uglify())
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest('dist/app'));
})

gulp.task('clean', function (cb) {
	del(['dist']).then(function (paths) {
		console.log('Deleted files and folders:\n', paths.join('\n'));
        cb();
	});
});

gulp.task('copy-assets', function(){
	return gulp.src(['app/content/**/**/*'])
			.pipe(gulp.dest('dist/app/content/'))
});

gulp.task('copy-libs', function(){
	return gulp.src(jsLibFilePaths)
		.pipe(concat('lib.js'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/app'));
})









