var fs = require('fs')
  , dir = require('node-dir')
  , util = require('../util.js');

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
    util.foreach(audio, function(key, value) {
        util.foreach(gameAudio, function(key2, value2) {
            if( util.compareArrays(value, value2) ) {
                fileFound = true;
                util.log(value+ ' --> already exists "'+key2+'"', 'Skipping');
            }
        });

        if(!fileFound) {
            gameAudio[key] = value;
            util.log(key + ' --> ' + value, 'Synced');
            update = true;
        }
    });
}

function addAudioData(name, file) {
    if(!audio[name]) {
        audio[name] = [];
    }
    audio[name].push(file);
}
