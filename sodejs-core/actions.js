var actions = {};

exports.register = function(name, obj) {
	actions[name] = obj;
};

exports.execute = function() {
	var pinfo = require('request').pathInfo();
	var info = pinfo.split('/');
	
	var action = null;
	for each(var part in info) {
		if(part == '') {
			action = actions;
			continue;
		}
		action = action[part];
		if(action == null) {
			break;
		}
	}

	if(action == null) {
		throw 'Unable to find action for: ' + pinfo;
	}
	
	if(! (action instanceof Function)) {
		action = action.index;
	}

	if(action == null) {
		throw 'Unable to find action for: ' + pinfo;
	}
	
	return action();
};