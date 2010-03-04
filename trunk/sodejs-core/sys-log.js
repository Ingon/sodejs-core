exports.trace = function(str) {
	Packages.java.lang.System.out.println(str);
}

exports.info = function(str) {
	exports.trace(str);
}