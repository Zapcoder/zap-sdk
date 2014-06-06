var Auth = function(driver) {
	
	this.driver = null;

	switch(driver) {
		case 'token':
			this.driver = require('./auth/token.js');
		break;
	}
}

Auth.prototype = {

	check: function() {
		return this.driver.check();
	},
	store: function(data){
		return this.driver.store(data);
	},
	remove: function() {
		return this.driver.remove();
	}
}

exports.driver = function(driver) {
	return new Auth(driver);
}