var fs = require('fs')
  , prompt = require('prompt')
  , util = require('../util.js');

prompt.message = prompt.delimiter = '';

exports.generate = function(data) {
    var properties = {
        confirm: {
            required: true,
            description: util.styles.prompt("Are you sure? Your current game.json file will be deleted (y/n) "),
            pattern: /^(y|n)$/,
            message: util.styles.warning('Please enter "y" or "n"')
        }
    };
    prompt.get({properties: properties}, function(err, result) {
        if( err ) {
            console.log(err);
            return;
        }
        if(result.confirm == 'y') {
            generateGame();
        }
    });
}

function generateGame() {
    var properties = {
        name: {
            required: true,
            message: util.styles.prompt("Name")
        },
    }

    prompt.start();
    prompt.get({properties: properties}, function(err, result) {
        if( err ) {
            console.log(err);
            return;
        }
        var game = {
            name: result.name
        }

        game.assets = {
            img: {},
            audio: {}
        };

        game.objects = {};
        game.states = {
            game: {
                objects: [] ,
                groups: [],
                collisions: []
            }
        };
        game.start = 'game';

        var file = './src/game.json';
        fs.writeFile(file, JSON.stringify(game, null, 4), function(err) {
            if( err ) {
                console.log(err);
                return;
            }
            util.created(file);
        });

        fs.truncate('./src/js/game.js', 0, function(err) {
            if(err) console.log(err);
        });
    });
}
