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

const jsFilePaths = [
	'app/*.js',
	'app/directives/**/*.js',
	'app/services/*.js', 
	'app/controllers/*.js'
];

gulp.task('dist', function () {
	//first load the services, then the directives and then the controller
	return gulp.src(jsFilePaths)			
			.pipe(ngannotate())
			.pipe(concat('main.js'))
			.pipe(uglify())
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest('dist'));
})

gulp.task('clean', function (cb) {
	del(['dist']).then(function (paths) {
		console.log('Deleted files and folders:\n', paths.join('\n'));
        cb();
	});
});

