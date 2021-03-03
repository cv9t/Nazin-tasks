const { notify } = require('browser-sync');
const {src, watch, dest, series, parallel} = require('gulp');

const   gulp = require('gulp'),
        fileinclude = require('gulp-file-include'),
        browserSync = require('browser-sync').create(),
        sass = require('gulp-sass'),
        cleanCSS = require('gulp-clean-css'),
        autoprefixer = require('gulp-autoprefixer'),
        rename = require('gulp-rename'),
        imagemin = require('gulp-imagemin'),
        htmlmin = require('gulp-htmlmin'),
        del = require('del'),
        include = require('gulp-file-include');

const   src_folder = "src",
        dest_folder = "dist";

const   path = {
            dest: {
                    html: dest_folder + '/',
                    style: dest_folder + '/css/',
                    img: dest_folder + '/assets/img/',
                    icons: dest_folder + '/assets/icons/'
            },
            src: {
                    html: [src_folder + '/*.html', "!" + src_folder + "/**/_*.html"],
                    style: src_folder + '/scss/style.+(scss|less|sass)',
                    img: src_folder + '/assets/img/**/*.+(jpg|png|svg|gif|ico|webp|jpeg)',
                    icons: src_folder + '/assets/icons/**/*.+(jpg|png|svg|gif|ico|webp|jpeg)'
            },
            watch: {
                    html: src_folder + '/**/*.html',
                    style: src_folder + '/scss/**/*.+(scss|less|sass}',
                    assets: src_folder + '/assets/**/*'
            }
};



function cleanDist() {
        return del(dest_folder);
}

function liveServer() {
        browserSync.init({
                server: {
                        baseDir: dest_folder
                },

                port: 3000,
                notify: false
        });
}

function styles() {
        return  src(path.src.style)
                .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
                .pipe(autoprefixer())
                .pipe(cleanCSS({compatibility: 'ie8'}))
                .pipe(rename({suffix: '.min'}))
                .pipe(dest(path.dest.style))
                .pipe(browserSync.stream());
}

function html() {
        return  src(path.src.html)
                .pipe(include())
                .pipe(htmlmin({collapseWhitespace: true}))
                .pipe(dest(path.dest.html))
                .pipe(browserSync.stream());
}

function imgMin() {
        return src(path.src.img)
                .pipe(imagemin([
                        imagemin.gifsicle({interlaced: true}),
                        imagemin.mozjpeg({quality: 75, progressive: true}),
                        imagemin.optipng({optimizationLevel: 5}),
                        imagemin.svgo({
                                plugins: [
                                        {removeViewBox: true},
                                        {cleanupIDs: false}
                                ]
                        })
                ]))
                .pipe(dest(path.dest.img));
}

function iconsMin() {
        return src(path.src.icons)
                .pipe(imagemin([
                        imagemin.gifsicle({interlaced: true}),
                        imagemin.mozjpeg({quality: 75, progressive: true}),
                        imagemin.optipng({optimizationLevel: 5}),
                        imagemin.svgo({
                                plugins: [
                                        {removeViewBox: true},
                                        {cleanupIDs: false}
                                ]
                        })
                ]))
                .pipe(dest(path.dest.icons));
}

function watchFiles() {
        watch([path.watch.style], styles);
        watch([path.watch.html], html);
        watch([path.watch.html]).on('change', browserSync.reload);
        watch([path.watch.assets]).on('change', browserSync.reload);
}


const build = series(cleanDist, parallel(styles, html, imgMin, iconsMin));
const view = series(build, parallel(liveServer, watchFiles));

exports.build = build;
exports.default = view;