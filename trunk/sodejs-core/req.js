var req = {
	pathInfo: function() {
		return org.mozilla.javascript.Context.toObject(_req.getPathInfo(), this);
	},
	
	get : function(name) {
		return _req.getParameter(name);
	},
	
	geti : function(name) {
		var i = this.get(name);
		if(i != null) {
			i = parseInt(i);
		}
		return i;
	},

	getAll : function(name) {
		return _req.getParameterValues(name);
	},
}