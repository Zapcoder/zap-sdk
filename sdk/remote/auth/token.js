var fs = require('fs')
  , path = require('path')
  , zlib = require('zlib');


var filename = path.join(__dirname, '..', 'storage', 'auth-token');

exports.check = function() {
	if(!fs.existsSync(filename))
		return false;

	var data = JSON.parse(JSON.parse(fs.readFileSync(filename)));
	if(!data.token || !data.user) return false;
	return data;
}

exports.store = function(data) {
	fs.writeFile(filename, JSON.stringify(data), function(err) {
		if(err) throw err;
	})
}

exports.remove = function() {
	fs.unlink(filename, function(err) {
		if(err) throw err;
	});
}