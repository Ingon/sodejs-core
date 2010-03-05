var log = require('sys-log');

function ColumnMetadata(cols) {
	this.name = cols.getString('COLUMN_NAME');
	this.type = cols.getInt('DATA_TYPE');
	this.tojs = function(o) {
		return o;
	};
	
	if(this.type == Packages.java.sql.Types.CHAR || this.type == Packages.java.sql.Types.VARCHAR) {
		this.tojs = function(o) {
			return "" + o;
		};
	} else if(this.type == Packages.java.sql.Types.TIMESTAMP) {
		this.tojs = function(o) {
			if(o == null) {
				return null;
			}
			return new Date(o.getTime());
		};
	}
}

function TableMetadata(meta, tables) {
	this.name = tables.getString('TABLE_NAME');
	this.columns = {};
	this.columns_ordered = [];
	
	var cols = meta.getColumns(null, null, this.name, null);
	while(cols.next()) {
		var c = new ColumnMetadata(cols);
		this.columns[c.name] = c;
		this.columns_ordered.push(c);
	}
}

function Connection(jcon) {
	this.jcon = jcon;
	
	this.tables = {};
	var dbmeta = jcon.getMetaData();
	var tables = dbmeta.getTables(null, 'public', null, ['TABLE']);
	while(tables.next()) {
		var t = new TableMetadata(dbmeta, tables)
		this.tables[t.name] = t;
	}
}

function createStatement(jcon, sql, arguments) {
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

Connection.prototype.query = function(sql) {
	log.info('Query SQL: ' + sql);
	return createStatement(this.jcon, sql, arguments).executeQuery();
};

Connection.prototype.update = function(sql) {
	log.info('Update SQL: ' + sql);
	return createStatement(this.jcon, sql, arguments).executeUpdate();
};

Connection.prototype.close = function() {
	this.jcon.close();
};

var pgDriverLoaded = false;
exports.pgConnect = function(db, user, pass, host, port) {
	if(! pgDriverLoaded) {
		Packages.java.lang.Class.forName('org.postgresql.Driver');
		pgDriverLoaded = true;
	}
	
	user = user || db;
	pass = pass || db;
	host = host || 'localhost';
	port = port || '5432';
	var url = 'jdbc:postgresql://' + host + ':' + port + '/' + db;
	var jcon = Packages.java.sql.DriverManager.getConnection(url, user, pass);
	return new Connection(jcon);
}
