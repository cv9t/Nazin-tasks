var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var cssmin = require('gulp-cssmin');



gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "dist"
        }
    });

    gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('styles', function() {

    return gulp.src("src/scss/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());

});

gulp.task('watch', function() {
    gulp.watch("src/scss/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    gulp.watch("src/*.html").on('change', gulp.parallel('html'));
});

gulp.task('html', function() {
    return gulp.src("src/*.html")
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("dist/"));
});

gulp.task('mincss', function() {
    return gulp.src("dist/css/*.css")
        .pipe(cssmin())
        .pipe(gulp.dest("dist/css/"));
});

gulp.task('svg', function() {
    return gulp.src("src/assets/svg/*")
        .pipe(gulp.dest("dist/assets/svg/"));
});

gulp.task('minimg', function() {
    return gulp.src("src/assets/img/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/assets/img/"));
});

gulp.task('default', gulp.parallel('watch', 
                                    'server', 
                                    'styles', 
                                    'html', 
                                    'mincss', 
                                    'svg', 
                                    'minimg'));