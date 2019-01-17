// gulp.task("", function() {
// 	return gulp.src("")
// 	.pipe()
// 	.pipe(gulp.dest())
// })
"use strict";
// Подключение пакетов
var gulp 					= require("gulp");
var sass 					= require("gulp-sass");
var svgmin 					= require("gulp-svgmin");
var csso 					= require("gulp-csso");
var concat 					= require("gulp-concat");
var browserSync 			= require("browser-sync").create();
var spritesmith 			= require("gulp-spritesmith");
var notify 					= require("gulp-notify");
var tinypng 				= require("gulp-tinypng");
var autoprefixer 			= require("autoprefixer");
var pug 					= require("gulp-pug");
var plumber					= require("gulp-plumber");
var rename 					= require("gulp-rename");
var postcss					= require("gulp-postcss");
var del						= require("del");
//var jq					= require("jquery");
var flatten					= require("gulp-flatten");
var browserify 				= require("browserify");
var watchify				= require("watchify");
var uglify					= require("gulp-uglify");

// Обработка sass файлов в css
gulp.task("sass", function() {
	return gulp.src("dev/static/sass/main.scss")
	.pipe(plumber())
	.pipe(sass())
	//.pipe(postcss([autoprefixer(["last 8 versions"], {cascade:true})]))
	//.pipe(csso())
	.pipe(gulp.dest("build/css"))
	.pipe(browserSync.stream());
});

// Обработка pug файлов в html
gulp.task("pug", function() {
	return gulp.src("dev/pug/pages/*.pug")
	.pipe(plumber())
	.pipe(pug({
		pretty:true,
	}))
	.pipe(gulp.dest("build"))
	.pipe(browserSync.stream());
});

gulp.task("copyImg", function() {
	return gulp.src([
        "dev/static/img/content/*.+(jpg|jpeg|png)",
        "dev/static/img/general/*.+(jpg|jpeg|png)"
	])
	.pipe(flatten({subPath: [1,1]}))
	.pipe(gulp.dest("build/"));
});

// Автообновление страницы
gulp.task("browserSync", function() {
	browserSync.init({
		server: {
			baseDir: "./build"
		},
		notify: false,
	});
	browserSync.watch("build", browserSync.stream());
});

//Сборка js
gulp.task("js", function() {
	return gulp.src("dev/pug/js/common.js")
	.pipe(uglify())
	.pipe(concat("common.js"))
	.pipe(gulp.dest("build/js"))
	.pipe(browserSync.stream());
});

gulp.task("browserify", function() {
	return browserify("dev/static/js/main.js")
	.bundle()
	.pipe(source("dev/static/js/common.js"))
	.pipe(gulp.dest("dev/static/js"));
});

// Удаление собранного проекта
gulp.task("clear", function() {
	return del("build");
});

//gulp.task("build", gulp.series("clear", gulp.parallel("pug", "sass",) ));

gulp.task("watch", function() {
	gulp.watch("dev/static/sass/**/*.scss", gulp.series("sass"));
	gulp.watch("dev/pug/**/*.pug", gulp.series("pug"));
	//gulp.watch("dev/static/js/common.js");
 });

gulp.task("default", gulp.series(
	//gulp.parallel("pug", "sass"),
    gulp.parallel("browserSync", "watch"),
));