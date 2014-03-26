var fs = require('fs')
  , dir = require('node-dir')
  , util = require('../util.js');

var fontDir = './src/assets/fonts';

var fonts = {};
var gameFonts = null;
var update = false;

exports.sync = function(data, callback){
    util.log('Synchronizing fonts...');
    var game = require('../../src/game.json');
    if(!game.assets.fonts) 
        game.assets.fonts = {};
    gameFonts = game.assets.fonts;

    dir.files(fontDir, function(err, files) {
        for(var i = 0; i < files.length; i++) {
            var file = files[i].replace(/^src/, '');
            var name = file.replace(/^\/assets\/fonts\//,'').replace(/\..+$/, '').replace('/', '.');
            var type = file.match(/\..+$/);

            if(type) {
                type = type[0];
            }

            if(type == '.png' || type == '.jpg' || type == '.jpeg') {
                addFontData(name, 'image', file);
            }
            else if(type == '.xml' || type == '.fnt') {
                addFontData(name, 'data', file);
            }
        }

        processFonts();

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

function processFonts() {
    for( var name in fonts ) {
        if(fonts.hasOwnProperty(name)) {
            if(fonts[name].data && fonts[name].image) {
                var fileFound = false;
                util.foreach(gameFonts, function(key, value) {
                    if(fonts[name].data == value.data && fonts[name].image == value.image) {
                        fileFound = true;
                        util.log(fonts[name].data + ' - ' + fonts[name].image + ' --> already exists "'+name+'"', 'Skipping');
                        return false;
                    }
                });

                if(!fileFound) {
                    util.log(name +' --> '+fonts[name].image+' - '+fonts[name].data, 'Synced');
                    update = true;
                    gameFonts[name] = fonts[name];
                }
            }
        }
    }
}

function addFontData(name, key, val) {
    if(!fonts[name]) {
        fonts[name] = {};
    }
    fonts[name][key] = val;

}
