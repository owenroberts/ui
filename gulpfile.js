/*
	build and provide export for other modules
*/

const { src, dest, watch, series, parallel, task } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const merge = require('merge-stream');

const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const files = [
	'src/ui/Element.js',
	'src/ui/Collection.js',
	'src/ui/Input.js',
	'src/ui/Text.js',
	'src/**/*.js',
];

function jsTask(sourcePath, buildPath, includeCool) {
	if (includeCool) files.unshift('lib/cool/cool.js')
	return src(files.map(f => sourcePath + f))
		.pipe(sourcemaps.init())
		.pipe(concat('ui.min.js'))
		.pipe(terser().on('error', function(err) {
			console.error('* gulp-terser error', err.message, err.filename, err.line, err.col, err.pos);
		}))
		.pipe(sourcemaps.write('./src_maps'))
		.pipe(dest(buildPath));
}

function sassTask(sourcePath, buildPath) {
	return src(sourcePath)
		.pipe(sourcemaps.init()) 
		.pipe(sass()) 
		.pipe(postcss([autoprefixer(), cssnano()])) 
		.pipe(sourcemaps.write('./src_maps'))
		.pipe(dest(buildPath))
}

function exportTask(includeCool) {
	return jsTask('./ui/', './ui/build', includeCool);
}

task('js', () => { return jsTask('./', './build'); });
task('sass', () => { return sassTask('./css/style.scss', './css'); });
task('css', series('sass'));
task('build', series(jsTask, sassTask));

module.exports = {
	exportTask: exportTask
}



