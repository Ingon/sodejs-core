exports.get = function(name) {
	return _req.getSession().getAttribute(name);
};

exports.set = function(name, value) {
	_req.getSession().setAttribute(name, value);
};

exports.invalidate = function() {
	_req.getSession().invalidate();
};
