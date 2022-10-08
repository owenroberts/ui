/*
	build and provide export for other modules
*/

const { src, dest, watch, series, parallel, task } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const merge = require('merge-stream');
const rollup = require('gulp-better-rollup');

const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

function logError(err) {
	console.error('* gulp-terser error', err.message, err.filename, err.line, err.col, err.pos);
}

function jsTask(sourcePath, buildPath, coolPath) {
	let files = [sourcePath];
	if (coolPath) files.unshift(coolPath + 'lib/cool/cool.js')
	return src(files)
		.pipe(sourcemaps.init())
		.pipe(rollup({}, { file: 'ui.min.js' }, 'umd'))
		.pipe(terser().on('error', logError))
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

function exportTask(coolPath) {
	return jsTask('./ui/src/ui.js', './ui/build', coolPath);
}

task('js', () => { return jsTask('./src/ui.js', './build'); });
task('sass', () => { return sassTask('./css/style.scss', './css'); });
task('css', series('sass'));
task('build', series(jsTask, sassTask));

module.exports = {
	exportTask: exportTask
};



