var fs = require('fs')
  , dir = require('node-dir')
  , util = require('../util.js')

var imgDir = './src/assets/img';
var update = false;

exports.sync = function(data, callback) {
    util.log('Synchronizing images...');
    var game = require('../../src/game.json');

    if(!game.assets.img) 
        game.assets.img = {};

    var img = game.assets.img;
    dir.files(imgDir, function(err, files) {
        for(var i = 0; i < files.length; i++ ){
            var file = files[i].replace(/^src/, '');

            var name = file.replace(/^\/assets\/img\//,'').replace(/\..+$/, '').replace('/', '.');

            var fileFound = false;
            util.foreach(img, function(key, value) {
                if( value == file ) {
                    fileFound = true;    
                    util.log(file+' --> already exists "'+key+'"', 'Skipping');
                    return false;
                }
            });

            if(!fileFound) {
                util.log(name+' --> '+file, 'Synced');
                update = true;
                img[name] = file;
            }
        }

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
