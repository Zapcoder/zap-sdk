var img = require('./sync/img.js')
  , audio = require('./sync/audio.js')
  , fonts = require('./sync/fonts.js');

exports.name = 'sync';
exports.alias = 's';
exports.description = 'Perform tasks to synchronize the games configuration file with the correct data';

exports.options = {
    img: {
        description: 'Synchronize the images in the game.json file with those in the asset/img directory',
        call: img.sync
    },
    audio: {
        description: 'Synchronize the audio in the game.json file with those in the asset/audio directory',
        call: audio.sync
    },
    fonts: {
        description: 'Synchronize the fonts in the game.json file with those in the asset/fonts directory',
        call: fonts.sync
    },
    all: {
        description: 'Synchronize all assets',
        call: sync
    }
}

function sync(data) {
    img.sync(data, function(){
        audio.sync(data, function() {
            fonts.sync(data);
        });
    });
}

