var http = require('http')
  , prompt = require('prompt')
  , querystring = require('querystring')
  , request = require('request')
  , auth = require('./auth.js').driver('token')
  , util = require('../util.js');

var HOSTNAME = '192.168.33.10.xip.io';

exports.request = function(endpoint, method, data, callback) {
	if(!method) method = 'GET';

	var query = null;

	var options = {
		hostname: HOSTNAME,
		port: 80,
		path: '/api/v1/'+endpoint,
		method: method,
		headers: {}
	};

	if(data) {
		query = querystring.stringify(data);
		options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		options.headers['Content-Length'] = Buffer.byteLength(query);
	}

	var authInfo = auth.check();

	if(authInfo) {
		options.headers['X-Auth-Token'] = authInfo.token;
	}

	var req = http.request(options, function(res) {
		if(callback) callback(res);
	});

	req.on('error', function(e) {
	 	util.log('Problem with request: ' + e.message);
	});

	if(query) {
		req.write(query);
	}

	req.end();
}

exports.user = function() {
	return auth.check();
}

exports.login = function(username, password, callback) {
	exports.request('auth', 'POST', {
		username: username,
		password: password
	}, function(res) {
		if(res.statusCode == 401) {
			if(callback) callback(false);
			return;
		}
		var data = '';
		res.on('data', function(chunk) {
			data += chunk;
		});

		res.on('end', function() {
			var response = JSON.parse(data);
			auth.store(JSON.stringify(response.response));

			if(callback) callback(response.response);
		});
	});
}

exports.logout = function(callback) {
	exports.request('auth', 'DELETE', null, function(res) {
		if(callback) callback(res);
	});
	auth.remove();
}

exports.prompt = function(callback) {
	var properties = {
        username: {
            required: true,
            message: util.styles.prompt("Username")
        },
        password: {
        	required: true,
        	hidden: true,
            message: util.styles.prompt("Password")
        }
    };
	prompt.start();

	prompt.get({properties: properties}, function(err, result) {
        if(err) throw err;
        exports.login(result.username, result.password, callback);
    });
}

exports.streamFile = function(stream, endpoint) {
	stream.pipe(request.post(HOSTNAME+'/'+endpoint));
}