var fs = require('fs')
  , mkdirp = require('mkdirp')
  , path = require('path')
  , dir = require('node-dir')
  , zlib = require('zlib')
  , crypto = require('crypto')
  , prompt = require('prompt')
  , assetEncoders = require('./asset-encoders.js')
  , util = require('../util.js')
  , config = require('../../src/game.json')
  , connection = require('../remote/connection.js')
  , buildDir = './build'
  , buildFile = config.name + '.zap'
  , assetId = 0
  , sections = {
  	images: 0x0001,
  	fonts: 0x0002,
  	audio: 0x0003,
  	config: 0x0004,
  	code: 0x0005
  }
  , currentData = []
  , buffers = []
  , stream;

exports.buildGame = function() {
	mkdirp(buildDir, function(err) {
		stream = fs.createWriteStream(path.join(buildDir, buildFile));
		processImages();
		processFonts();
		processAudio();
		processConfig();
		processCode();
		buildFiles();
	});
}

/*
exports.deployGame = function() {
	var userData = connection.user();
	if(userData) {
		util.log('You are logged in as '+userData.user[0].username);
		var properties = {
	        cont: {
                validator: '^(n|N|y|Y)$',
                warning: util.styles.warning('Please enter either Y or N'),
	        	required: true,
	            message: util.styles.prompt("Change user? (Y/N)")
	        }
	    };
		prompt.start();

		prompt.get({properties: properties}, function(err, result) {
	        if(err) throw err;
	        if(result.cont.toUpperCase() == 'N') {
	        	deploy(userData.user);
	        } else {
	        	connection.logout();
		        connection.prompt(function(res) {
					if(res == false) {
						util.log('Login failed!');
						return;
					}
					deploy(res.user);
				});
	    	}
	    });
	} else {
		util.log('You need to login to continue');
		connection.prompt(function(res) {
			if(res == false) {
				util.log('Login failed!');
				return;
			}
			deploy(res.user);
		});
	}
}

function deploy(user) {
	exports.buildGame(function() {
		var stream = fs.createReadStream(path.join(buildDir, buildFile));
		connection.streamFile(stream, 'files/graphics');
	});
}
*/

function processImages() {
	var images = config.assets.img
	  , buffers = []
	  , count = 0;

	beginSection('images');
	util.log((count) + '/'+Object.keys(images).length+' images', 'Processed', true);
	for(var key in images) {
		if(images.hasOwnProperty(key)) {
			var id = assetId++;
			var encoder = new assetEncoders.EncodedImageAssetBuilder();
			var data = encoder.id(id).key(key).image(images[key]).encode();
			buffers.push(data);


			images[key] = id;
			util.log((++count) + '/'+Object.keys(images).length+' images', 'Processed', true);
		}
	}
	util.nl();
	writeContent(Buffer.concat(buffers));
	endSection();
}

function processFonts() {
	var fonts = config.assets.fonts
	  , buffers = []
	  , count = 0;

	beginSection('fonts');
	util.log((count) + '/'+Object.keys(fonts).length+' fonts', 'Processed', true);
	for(var key in fonts) {
		if(fonts.hasOwnProperty(key)) {
			var imageId = assetId++;
			var dataId = assetId++;
			var encoder = new assetEncoders.EncodedFontAssetBuilder();
			var data = encoder.imageId(imageId).image(fonts[key].image)
				.dataId(dataId).data(fonts[key].data).key(key).encode();
			buffers.push(data);

			fonts[key].image = imageId;
			fonts[key].data = dataId;
			util.log((++count) + '/'+Object.keys(fonts).length+' fonts', 'Processed', true);
		}
	}
	util.nl();
	writeContent(Buffer.concat(buffers));

	endSection();
}

function processAudio() {
	var audio = config.assets.audio
	  , buffers = []
	  , count = 0;

	beginSection('audio');
	util.log((count) + '/'+Object.keys(audio).length+' tracks', 'Processed', true);
	for(var key in audio) {
		if(audio.hasOwnProperty(key)) {
			var id = assetId++;
			var encoder = new assetEncoders.EncodedAudioAssetBuilder();
			var data = encoder.id(id).key(key).audio(audio[key]).encode();
			buffers.push(data);

			audio[key] = id;
			util.log((++count) + '/'+Object.keys(audio).length+' tracks', 'Processed', true);
		}
	}
	util.nl();
	writeContent(Buffer.concat(buffers));
	endSection();
}

function processConfig() {
	beginSection('config');

	var conf = new Buffer(JSON.stringify(config, null, 2));
	var b = new Buffer(conf.length + 4);

	b.writeUInt32BE(conf.length, 0);
	conf.copy(b, 4);

	writeContent(b);

	util.log('Game configuration', 'Processed');

	endSection();
}

function processCode() {
	beginSection('code');

	var code = new Buffer(fs.readFileSync(path.join('src', 'js', 'game.js')));
	var b = new Buffer(code.length + 4);

	b.writeUInt32BE(code.length, 0);
	code.copy(b, 4);

	writeContent(b);

	util.log('Game code', 'Processed');

	endSection();
}

function writeContent(content) {
	var data = new Buffer(4 + content.length);
	console.log(content.length);
	data.writeUInt32BE(content.length, 0);
	content.copy(data, 4);
	currentData.push(data);
}

function beginSection(section) {
	currentData = [];
	var b = new Buffer(2);
	b.writeUInt16BE(sections[section], 0);
	currentData.push(b);
}

function endSection() {
	var b = new Buffer(1);
	b.writeUInt8(0xff, 0);
	currentData.push(b);
	buffers.push(Buffer.concat(currentData));
	currentData = [];
}

function buildFiles() {
	var b = Buffer.concat(buffers);
	console.log(b.slice(b.length - 10, b.length));
	var md5 = crypto.createHash('md5').update(b).digest();
	var stream2 = fs.createWriteStream(path.join(buildDir, buildFile)+'.open');
	stream2.write(b);
	stream2.end();
	zlib.gzip(b, function(err, buf) {
		if(err) {
			console.log(err);  return;
		}

		stream.write(md5);
		stream.write(buf);
		stream.end();
		util.created(path.join(buildDir, buildFile));

		b = null;
		buffers = [];
	});
}