String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g, "");
};

String.prototype.startsWith = function(t) {
	return this.indexOf(t) == 0;
};
