var fs = require('fs')
  , mkdirp = require('mkdirp')
  , path = require('path')
  , dir = require('node-dir')
  , zlib = require('zlib')
  , crypto = require('crypto')
  , assetEncoders = require('./asset-encoders.js')
  , util = require('../util.js')
  , config = require('../../src/game.json')
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


function processImages() {
	var images = config.assets.img
	  , buffers = []
	  , count = 0;

	beginSection('images');

	for(var key in images) {
		if(images.hasOwnProperty(key)) {
			var id = assetId++;
			var encoder = new assetEncoders.EncodedImageAssetBuilder();
			var data = encoder.id(id).key(key).image(images[key]).encode();
			buffers.push(data);


			images[key] = id;
			util.log('Processed '+ (++count) + '/'+Object.keys(images).length+' images', null, true);
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
			util.log('Processed '+ (++count) + '/'+Object.keys(fonts).length+' fonts', null, true);
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

	for(var key in audio) {
		if(audio.hasOwnProperty(key)) {
			var id = assetId++;
			var encoder = new assetEncoders.EncodedAudioAssetBuilder();
			var data = encoder.id(id).key(key).audio(audio[key]).encode();
			buffers.push(data);

			audio[key] = id;
			util.log('Processed '+ (++count) + '/'+Object.keys(audio).length+' tracks', null, true);
		}
	}
	util.nl();
	writeContent(Buffer.concat(buffers));
	endSection();
}

function processConfig() {
	beginSection('config');

	var conf = JSON.stringify(config, null, 2);
	var b = new Buffer(conf);
	writeContent(b);

	util.log('Processed game configuration');

	endSection();
}

function processCode() {
	beginSection('code');
	var code = fs.readFileSync(path.join('src', 'js', 'game.js'));
	var b = new Buffer(code);
	writeContent(code);

	util.log('Processed game code');

	endSection();
}

function writeContent(content) {
	var data = new Buffer(4 + content.length);
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
	var md5 = crypto.createHash('md5').update(b).digest();

	zlib.gzip(b, function(err, buf) {
		if(err) {
			console.log(err);  return;
		}
		stream.write(md5);
		stream.write(buf);
		stream.end();
		util.created(path.join(buildDir, buildFile));
	});
}

/**

.zap structure

Assets
- Images
- Audio
- Fonts
JS
CONFIG

*/

/*

Image
- Id (8b)
- Format (4b)
- - 0 (.png)
- - 1 (.jpg)
- - 2 (.jpeg)
- - 3 (.gif)
- Size (32b)
- Data

*/