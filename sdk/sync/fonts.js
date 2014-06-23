var fs = require('fs')
  , dir = require('node-dir')
  , util = require('../util.js')
  , dotaccess = require('dotaccess');

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

            if(file.indexOf('.DS_Store') !== -1) continue;

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

    var flatFonts = util.flattenObject(fonts);
    var flatGameFonts = util.flattenObject(gameFonts);

    util.foreach(flatFonts, function(key, value) {

        var name = '';
        fileFound = false;

        if(key.indexOf('.image' !== -1)) {

            var matchingKey = key.replace('.image', '.data');
            name = key.replace('.image', '');

            if(typeof flatFonts[matchingKey] !== 'undefined') {

                util.foreach(flatGameFonts, function(key2, value2) {

                    if(flatFonts[key] == flatGameFonts[key] && flatFonts[matchingKey] == flatGameFonts[matchingKey]) {
                        fileFound = true;
                        util.log(dotaccess.get(fonts, key) + ' - ' + dotaccess.get(fonts, matchingKey) + ' --> already exists "'+ name +'"', 'Skipping');
                        return false;
                    }
                });
            
                delete flatFonts[matchingKey];
            }


        } else if( key.indexOf('.data' !== -1)) {

            var matchingKey = key.replace('.data', '.image');
            name = key.replace('.data', '');

            if(typeof flatFonts[matchingKey] !== 'undefined') {

                util.foreach(flatGameFonts, function(key2, value2) {

                    if(flatFonts[key] == flatGameFonts[key] && flatFonts[matchingKey] == flatGameFonts[matchingKey]) {

                        fileFound = true;
                        util.log(dotaccess.get(fonts, matching) + ' - ' + dotaccess.get(fonts, key) + ' --> already exists "'+ name +'"', 'Skipping');
                        return false;
                    }
                });

                delete flatFonts[matchingKey];
            }

        }

        if(!fileFound) {
            util.log(name +' --> '+dotaccess.get(fonts, name).image+' - '+dotaccess.get(fonts, name).data, 'Synced');
            update = true;
            dotaccess.set(gameFonts, name, dotaccess.get(fonts, name));
        }
    });

}

function addFontData(name, key, val) {
    if(!dotaccess.get(fonts, name)) {
        dotaccess.set(fonts, name, {});
    }
    dotaccess.get(fonts, name)[key] = val;

}
