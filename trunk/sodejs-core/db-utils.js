exports.toDate = function(jsdate) {
	return new Packages.java.sql.Date(jsdate.getTime());
};
