var gulp = require('gulp')
  , connect = require('gulp-connect')
  , typescript = require('gulp-tsc')
  , concat = require('gulp-concat')
  , build = require('./builder/builder.js')
  , paths = {
        ts: './typescript/**/*.ts',
        config: './src/game.json',
        src: './src/',
        js: './src/js/**/*.js',
        css: './src/css/**/*.css'
    };

exports.name = 'task';
exports.alias = 't';
exports.description = 'Run tasks';
exports.options = {
    game: {
        description: 'Start up the game',
        call: startGame
    },
    compile: {
        description: 'Compile typescript files',
        call: compileTypescript
    },
    build: {
        description: 'Build your game (Creates a .zip file ready for uploading to Zap)',
        call: build.buildGame
    },
    test: {
        description: 'Build your game (Creates a .zip file ready for uploading to Zap)',
        call: build.test
    }
}

function startGame() {
    gulp.start('default', function(err) {
        if( err ) 
            console.log(err);
    });
}

function compileTypescript() {
    gulp.start('typescript', function(err) {
        if( err ) 
            console.log(err);
    });
}

gulp.task('typescript', function() {
    return gulp.src(paths.ts)
        .pipe(typescript())
        .pipe(concat('game.js'))
        .pipe(gulp.dest(paths.src+'js/'));
});

gulp.task('connect', connect.server({
    root: ['./src/'],
    port: 9000,
    livereload: true,
    open: {
        browser: 'google-chrome' // Change this to your browser of choice
    }
}));

gulp.task('watch', function() {
    gulp.watch([paths.js, paths.css, paths.config], function() {
        gulp.src(paths.src+'index.html')
            .pipe(connect.reload());
    });
});

gulp.task('default', ['connect', 'watch']);
