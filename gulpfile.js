const { notify } = require('browser-sync');
const {src, watch, dest, series, parallel} = require('gulp');

const   browserSync = require('browser-sync').create(),
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
                    assets: dest_folder + '/assets/'
            },
            src: {
                    html: [src_folder + '/*.html', "!" + src_folder + "/**/_*.html"],
                    style: src_folder + '/scss/*.+(scss|less|sass)',
                    assets: src_folder + '/assets/**/*'
            },
            watch: {
                    html: src_folder + '/**/*.html',
                    style: src_folder + '/scss/**/*.+(scss|less|sass)',
                    assets: src_folder + '/assets/**/*'
            }
};



function cleanDist() {
        return del(dest_folder);
}

function cleanAssets() {
        return del(path.dest.assets);
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
                .pipe(rename({
                        suffix: '.min'
                }))
                .pipe(dest(path.dest.style))
                .pipe(browserSync.stream());
}

function html() {
        return  src(path.src.html)
                .pipe(include())
                .pipe(htmlmin({collapseWhitespace: true}))
                .pipe(dest(path.dest.html))
}

function assets() {
        return src(path.src.assets)
                .pipe(imagemin([
                        imagemin.gifsicle({interlaced: true}),
                        imagemin.mozjpeg({quality: 80, progressive: true}),
                        imagemin.optipng({optimizationLevel: 5}),
                        imagemin.svgo({
                                plugins: [
                                        {removeViewBox: true},
                                        {cleanupIDs: false}
                                ]
                        })
                ]))
                .pipe(dest(path.dest.assets))
                .pipe(browserSync.stream());
}

function watchFiles() {
        watch([path.watch.html]).on('change', browserSync.reload);
        watch([path.watch.style], styles);
        watch([path.watch.html], html);
        watch([path.watch.assets], series(cleanAssets, assets));
}


const build = series(cleanDist, parallel(styles, html, assets));
const view = series(build, parallel(watchFiles, liveServer));

exports.build = build;
exports.default = view;