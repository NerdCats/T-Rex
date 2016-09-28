var gulp = require('gulp');
var ngmin = require('gulp-ngmin');

gulp.task('prod', function () {
	return gulp.src('app/**/**/*.js')			
			.pipe(gulp.dest('dist'));
})