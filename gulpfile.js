/*
	build and provide export for other modules
*/

const { src, dest, watch, series, parallel, task } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const merge = require('merge-stream');
const iife = require("gulp-iife");

const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const logger = require('node-color-log');

const files = [
	'src/ui.js',
	'src/elements/Element.js',
	'src/elements/Collection.js',
	'src/elements/ListAdd.js',
	'src/elements/InputList.js',
	'src/elements/Input.js',
	'src/elements/Text.js',
	'src/**/*.js',
];

function jsTask(sourcePath, buildPath, includeCool) {
	if (includeCool) files.unshift('lib/cool/cool.js')
	return src(files.map(f => sourcePath + f))
		.pipe(sourcemaps.init())
		.pipe(concat('ui.min.js'))
		.pipe(iife())
		.pipe(terser().on('error', function(err) {
			logger.color('red')
				.log('* gulp-terser error', err.message, err.filename, err.line, err.col, err.pos);
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
task('build', series('js', 'sass'));

module.exports = {
	exportTask: exportTask
}



