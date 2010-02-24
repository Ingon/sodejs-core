var resp = {
	write : function(text) {
		_res.getWriter().write(text);
	},

	flush : function() {
		_res.getWriter().flush();
		_res.getWriter().close();
	},
}