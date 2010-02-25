exports.pgLoad = function() {
	Packages.java.lang.Class.forName("org.postgresql.Driver");
}

exports.pgConnect = function(db, user, pass, host, port) {
	user = user || db;
	pass = pass || db;
	host = host || "localhost";
	port = port || "5432";
	var url = "jdbc:postgresql://" + host + ":" + port + "/" + db;
	Packages.java.sql.DriverManager.getConnection(url, user, pass);
}
