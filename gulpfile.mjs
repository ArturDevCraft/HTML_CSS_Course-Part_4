import { src, dest, series, parallel, watch } from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cssnano from 'gulp-cssnano';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import sourcemaps from 'gulp-sourcemaps';
import clean from 'gulp-clean';
import kit from 'gulp-kit';
import browserSyncImport from 'browser-sync';

const sass = gulpSass(dartSass);
const browserSync = browserSyncImport.create();
const reload = browserSync.reload;

const paths = {
	html: './html/**/*.kit',
	sass: './src/sass/**/*.scss',
	js: './src/js/**/*.js',
	img: './src/img/*',
	dist: './dist',
	sassDest: './dist/css',
	jsDest: './dist/js',
	imgDest: './dist/img',
};

function sassCompiler() {
	return src(paths.sass)
		.pipe(sourcemaps.init())
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cssnano())
		.pipe(
			rename({
				suffix: '.min',
			})
		)
		.pipe(sourcemaps.write())
		.pipe(dest(paths.sassDest));
}

function javaScript() {
	return src(paths.js)
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: ['@babel/env'],
			})
		)
		.pipe(uglify())
		.pipe(
			rename({
				suffix: '.min',
			})
		)
		.pipe(sourcemaps.write())
		.pipe(dest(paths.jsDest));
}

function convertImages() {
	return src(paths.img, { encoding: false })
		.pipe(imagemin())
		.pipe(dest(paths.imgDest));
}

function handleKits() {
	return src(paths.html).pipe(kit()).pipe(dest('./'));
}

function startBrowserSync() {
	browserSync.init({
		server: {
			baseDir: './',
		},
		browser: 'Firefox Developer Edition',
	});
}

function watchForChanges() {
	watch('./*.html').on('change', reload);
	watch(
		[paths.html, paths.sass, paths.js],
		parallel(handleKits, sassCompiler, javaScript)
	).on('change', reload);
	watch(paths.img, convertImages).on('change', reload);
}

const mainFunctions = series(
	handleKits,
	sassCompiler,
	javaScript,
	convertImages
);

export function cleanStuff() {
	return src(paths.dist, { read: false }).pipe(clean());
}

export default parallel(mainFunctions, startBrowserSync, watchForChanges);
