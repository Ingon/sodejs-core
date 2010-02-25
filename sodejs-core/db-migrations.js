var versionTableName = 'sys_version';
var versions = [];

exports.version = function(ver, name, callback) {
	versions[ver] = {
		name : name,
		callback : callback
	};
};

exports.migrate = function(con) {
	var currentVersion = -1;
	if(con.tables[versionTableName]) {
		var rs = con.query('SELECT max(number) FROM ' + versionTableName);
		if(rs.next()) {
			currentVersion = rs.getInt(1);
		}
	} else {
		con.update('CREATE TABLE ' + versionTableName + ' (number INTEGER, name VARCHAR(255), PRIMARY KEY (number))')
	}
	
	require('sys-log').trace('Version: ' + currentVersion);
	
	for(var i = currentVersion + 1; i < versions.length; i++) {
		if(versions[i]) {
			versions[i].callback(con);
			con.update("INSERT INTO " + versionTableName + " (number, name) VALUES (?, ?)", i, versions[i].name);
		}
	}
};