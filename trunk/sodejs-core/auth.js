var log = require('sys-log');
var ses = require('session');

exports.login = function(users_table, name, pass) {
	var user = users_table.findSingle('name', name);
	if(user == null) {
		log.info('Login failed for ' + name);
		return false;
	}
	
	if(user.password == this.encrypt(pass)) {
		log.info('Login success for ' + name);
		ses.set('login.state', true);
		ses.set('login.user', user);
		return true;
	} else {
		log.info('Login failed for ' + name);
		return false;
	}
};
	
exports.logout = function() {
	ses.set('login.state', false);
	ses.set('login.user', null);
	ses.invalidate();
};
	
exports.isLogged = function() {
	return ses.get('login.state');
};
	
exports.getLogged = function() {
	return ses.get('login.user');
};
	
exports.encrypt = function(text) {
	var md = Packages.java.security.MessageDigest.getInstance("SHA");
	md.update(text.getBytes("UTF-8"));
	var raw = md.digest();
	return (new Packages.sun.misc.BASE64Encoder()).encode(raw);
};
