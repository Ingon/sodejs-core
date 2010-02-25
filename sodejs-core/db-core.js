function Table(tables) {
	this.name = tables.getString('TABLE_NAME');
}

function Connection(jcon) {
	this.jcon = jcon;
	
	this.tables = {};
	var dbmeta = jcon.getMetaData();
	var tables = dbmeta.getTables(null, 'public', null, ['TABLE']);
	while(tables.next()) {
		var t = new Table(tables)
		this.tables[t.name] = t;
	}

	function createStatement(sql, arguments) {
		var arr = arguments;
		if(arguments.length == 2 && (arguments[1] instanceof Array)) {
			arr = arguments[1];
			var stat = jcon.prepareStatement(sql);
			for(var i = 0; i < arr.length;i++) {
				stat.setObject(i + 1, arr[i]);
			}
			return stat;
		} else {
			var stat = jcon.prepareStatement(sql);
			for(var i = 1; i < arr.length;i++) {
				stat.setObject(i, arr[i]);
			}
			return stat;
		}
	};
	
	this.query = function(sql) {
		return createStatement(sql, arguments).executeQuery();
	};
	
	this.update = function(sql) {
		return createStatement(sql, arguments).executeUpdate();
	};
}

exports.pgLoad = function() {
	Packages.java.lang.Class.forName('org.postgresql.Driver');
}

exports.pgConnect = function(db, user, pass, host, port) {
	user = user || db;
	pass = pass || db;
	host = host || 'localhost';
	port = port || '5432';
	var url = 'jdbc:postgresql://' + host + ':' + port + '/' + db;
	var jcon = Packages.java.sql.DriverManager.getConnection(url, user, pass);
	return new Connection(jcon);
}
