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
  , buildFile = 'build.zap'
  , assetId = 0
  , sections = {
  	images: 0x00,
  	fonts: 0x01,
  	audio: 0x02,
  }
  , currentData = []
  , buffers = []
  , stream
  , zstream;

exports.buildGame = function() {
	mkdirp(buildDir, function(err) {
		stream = fs.createWriteStream(path.join(buildDir, buildFile));
		zstream = fs.createWriteStream(path.join(buildDir, buildFile) + '.gz');
		processImages();
		processFonts();
		processAudio();

		buildFiles();
	});
}


function processImages() {
	var images = config.assets.img
	  , buffers = [];

	beginSection('images');

	for(var key in images) {
		if(images.hasOwnProperty(key)) {
			var id = assetId++;
			var encoder = new assetEncoders.EncodedImageAssetBuilder();
			var data = encoder.id(id).key(key).image(images[key]).encode();
			buffers.push(data);

			images[key] = id;
		}
	}

	writeContent(Buffer.concat(buffers));
	endSection();
}

function processFonts() {
	var fonts = config.assets.fonts
	  , buffers = [];

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
		}
	}

	writeContent(Buffer.concat(buffers));

	endSection();
}

function processAudio() {

}

function writeContent(content) {
	var data = new Buffer(4 + content.length);
	data.writeUInt32BE(content.length, 0);
	content.copy(data, 4);
	currentData.push(data);
}

function beginSection(section) {
	currentData = [];
	var b = new Buffer(1);
	b.writeUInt8(sections[section], 0);
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
	// Outputing raw and compresses while testing
	var b = Buffer.concat(buffers);
	var md5 = crypto.createHash('md5').update(b).digest();
	stream.write(b);
	stream.end();

	zlib.gzip(b, function(err, buf) {
		if(err) {
			console.log(err);  return;
		}
		console.log(md5);
		zstream.write(md5);
		zstream.write(buf);
		zstream.end();
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