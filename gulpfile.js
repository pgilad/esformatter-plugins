var http = require('http');
var gulp = require('gulp');
var del = require('del');
var plugins = require('gulp-load-plugins')({
    laze: false
});
var saveLicense = require('uglify-save-license');
var ecstatic = require('ecstatic');
var autoprefixer = require('autoprefixer-core');
var lrserver = require('tiny-lr')();

var livereloadport = 35729;
var serverport = 5000;

gulp.task('build', ['clean'], function () {
    var ourScripts = 'scripts/**/*.js';
    var assets = plugins.useref.assets();

    return gulp.src('src/index.html')
        .pipe(assets)
        .pipe(plugins.if(ourScripts, plugins.ngAnnotate()))
        .pipe(plugins.if(ourScripts, plugins.uglify({
            mangle: false,
            preserveComments: saveLicense
        })))
        .pipe(plugins.if('*.css', plugins.postcss([
            autoprefixer({
                browsers: ['last 3 versions', 'ie >= 8', '> 1%', 'Safari >= 6'],
                cascade: false
            })
        ])))
        .pipe(plugins.if('*.css', plugins.minifyCss({
            rebase: false,
            aggressiveMerging: false
        })))
        .pipe(assets.restore())
        .pipe(plugins.useref())
        .pipe(gulp.dest('dist'))
        .pipe(plugins.livereload());
});

gulp.task('assets', ['clean'], function () {
    return gulp.src([
            'src/favicon.ico',
            'src/logo.svg',
            'src/opensearch.xml',
            'src/README.md'
        ], {
            base: 'src'
        })
        .pipe(gulp.dest('dist'))
        .pipe(plugins.livereload());
});

gulp.task('serve', function () {
    http.createServer(ecstatic({
        root: __dirname + '/dist'
    })).listen(serverport);

    lrserver.listen(livereloadport);
});

gulp.task('clean', function (cb) {
    del('./dist', cb);
});

gulp.task('default', ['build', 'assets']);
gulp.task('dev', ['default', 'watch']);

gulp.task('watch', function () {
    gulp.watch('src/**/*', ['build', 'assets']);
});

gulp.task('deploy', ['default'], function () {
    return gulp.src('dist/**/*')
        .pipe(plugins.ghPages('git@github.com:pgilad/esformatter-plugins.git'));
});
