function Dao(con, name) {
	this.con = con;
	this.table = con.tables[name];
}

Dao.prototype.all = function() {
	var rs = this.con.query('SELECT * FROM ' + this.table.name);
	return this.loadAll(rs);
};

Dao.prototype.get = function(id) {
	var rs = this.con.query('SELECT * FROM ' + this.table.name + ' WHERE id = ?', id);
	if(! rs.next()) {
		return null;
	}
	
	return this.loadObject(rs);
};

Dao.prototype.loadAll = function(rs) {
	var all = new Array();
	while(rs.next()) {
		all.push(this.loadObject(rs));
	}
	return all;
};

Dao.prototype.loadObject = function(rs) {
//	var cobj = {_parent : this}; // toSource not ok with this
	var cobj = {};
	var rsMeta = rs.getMetaData();
	for(var i = 0; i < rsMeta.getColumnCount(); i++) {
		var colName = rsMeta.getColumnName(i + 1);
		cobj[colName] = this.table.columns[colName].tojs(rs.getObject(colName));
	}
	return cobj;
};

function DaoConnection(con) {
	this.register = function(name) {
		this[name] = new Dao(con, name);
	};
};

exports.init = function(con) {
	return new DaoConnection(con);
};
