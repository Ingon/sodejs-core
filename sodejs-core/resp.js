exports.write = function(text) {
	_res.getWriter().write(text);
};

exports.flush = function() {
	_res.getWriter().flush();
	_res.getWriter().close();
};