var fs = require('fs')
  , path = require('path')
  , util = require('../util.js');

exports.EncodedImageAssetBuilder = function(){

	this._dataSize = 0;
	this._data = null;
	this._keySize = null;
	this._key = null;
	this._id = null;

	this.image = function(image) {
		this._data = fs.readFileSync(path.join(__dirname, '..', '..', 'src', image));
		this._dataSize = this._data.length;
		return this;
	}

	this.id = function(id) {
		this._id = id;
		return this;
	}

	this.key = function(key) {
		this._key = key;
		this._keySize = Buffer.byteLength(key, 'utf8');
		return this;
	}

	this.encode = function() {
		var offset = 0;
		var b = new Buffer(8 + this._keySize + this._dataSize);

		util.debug('image - key size: '+this._keySize);
		b.writeUInt16BE(this._keySize, offset); 
		offset += 2; 

		util.debug('image - key: '+this._key);
		b.write(this._key, offset, this._keySize);
		offset += this._keySize

		util.debug('image - id: '+this._id);
		b.writeUInt16BE(this._id, offset);      
		offset += 2;

		util.debug('image - data size: '+this._dataSize);
		b.writeUInt32BE(this._dataSize, offset);
		offset += 4;
		
		this._data.copy(b, offset);

		return b;
	}
}

exports.EncodedFontAssetBuilder = function() {
	this._imageSize = 0;
	this._image = null;
	this._imageId = null;
	this._dataSize = 0;
	this._data = null;
	this._dataId = null;
	this._key = null;
	this._keySize = 0;

	this.image = function(image) {
		this._image = fs.readFileSync(path.join(__dirname, '..', '..', 'src', image));
		this._imageSize = this._image.length;
		return this;
	}

	this.data = function(data) {
		this._data = fs.readFileSync(path.join(__dirname, '..', '..', 'src', data));
		this._dataSize = this._data.length;
		return this;
	}

	this.imageId = function(id) {
		this._imageId = id;
		return this;
	}

	this.dataId = function(id) {
		this._dataId = id;
		return this;
	}

	this.key = function(key) {
		this._key = key;
		this._keySize = Buffer.byteLength(key, 'utf8');
		return this;
	}

	this.encode = function() {
		var offset = 0;
		var b = new Buffer(14 + this._imageSize + this._dataSize + this._keySize);

		util.debug('font - key size: '+this._keySize);
		b.writeUInt16BE(this._keySize, offset); 
		offset += 2; 

		util.debug('font - key: '+this._key);
		b.write(this._key, offset, this._keySize);
		offset += this._keySize

		util.debug('font - imageId: '+this._imageId);
		b.writeUInt16BE(this._imageId, offset);      
		offset += 2;

		util.debug('font - image size: '+this._imageSize);
		b.writeUInt32BE(this._imageSize, offset);
		offset += 4;

		this._data.copy(b, offset);
		offset += this._dataSize;

		util.debug('font - dataId: '+this._dataId);
		b.writeUInt16BE(this._dataId, offset);      
		offset += 2;

		util.debug('font - data size: '+this._dataSize);
		b.writeUInt32BE(this._dataSize, offset);
		offset += 4;

		this._data.copy(b, offset);
		return b;
	}
}