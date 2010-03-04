exports.pathInfo = function() {
	return org.mozilla.javascript.Context.toObject(_req.getPathInfo(), this);
};
	
exports.get = function(name) {
	return _req.getParameter(name);
};
	
exports.geti = function(name) {
	var i = this.get(name);
	if(i != null) {
		i = parseInt(i);
	}
	return i;
};

exports.getAll = function(name) {
	return _req.getParameterValues(name);
};