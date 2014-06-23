var fs = require('fs')
  , dir = require('node-dir')
  , util = require('../util.js')
  , dotaccess = require('dotaccess');

var audioDir = './src/assets/audio';

var audio = {};
var gameAudio = null;
var update = false;

exports.sync = function(data, callback){

    util.log('Synchronizing audio...');
    var game = require('../../src/game.json');

    if(!game.assets.audio)
        game.assets.audio = {};

    gameAudio = game.assets.audio;
    dir.files(audioDir, function(err, files) {
        for(var i = 0; i < files.length; i++) {
            var file = files[i].replace(/^src/, '');

            if(file.indexOf('.DS_Store') !== -1) continue;

            var name = file.replace(/^\/assets\/audio\//,'').replace(/\..+$/, '').replace('/', '.');

            addAudioData(name, file);
        }

        syncAudioData();

        if(update) {
            var file = './src/game.json';
            fs.writeFile(file, JSON.stringify(game, null, 4), function(err) {
                if(err) {
                    console.log(err);
                    return;
                }
                util.updated(file);
                if(typeof callback === 'function') {
                    callback();
                }
            });
        }
        else {
            if(typeof callback === 'function') {
                callback();
            }
        }
    });
}

function syncAudioData() {
    var fileFound = false;

    var flatAudio = util.flattenObject(audio);

    var flatGameAudio = util.flattenObject(gameAudio);

    util.foreach(flatAudio, function(key, value) {

        util.foreach(flatGameAudio, function(key2, value2) {

            if( util.compareArrays(value, value2) ) {
                fileFound = true;
                util.log(value+ ' --> already exists "'+key2+'"', 'Skipping');
            }
        });

        if(!fileFound) {
            dotaccess.set(gameAudio, key, value);
            util.log(key + ' --> ' + value, 'Synced');
            update = true;
        }
    });
}

function addAudioData(name, file) {

    if(!dotaccess.get(audio, name)) {
        dotaccess.set(audio, name, []);
    }
    dotaccess.get(audio, name).push(file);

}
