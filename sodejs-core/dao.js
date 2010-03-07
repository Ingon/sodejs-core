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

Dao.prototype.findSingle = function(name, value) {
	// TODO should use functions based on data type - '=' for int, 'Like' for string
	var ors = con.query('SELECT * FROM ' + this.table.name + ' WHERE ' + name + ' = ?', value);
	if(! ors.next()) {
		return null;
	}
	
	return this.loadObject(ors);
};

Dao.prototype._buildWhere = function(example) {
	var sql = ' WHERE ';
	var values = [];
	
	var first = true;
	for(var e in example) {
		if(first == false) {
			sql += ' AND ';
		}
		first = false;
		var val = example[e];
		if(val) {
			sql += e + ' = ?';
			var jval = this.table.columns[e].toj(val);
			values.push(jval);
		} else {
			sql += e + ' IS NULL';
		}
	}
	return {sql : sql, values : values};
};

Dao.prototype.find = function(example) {
	var where = this._buildWhere(example);
	
	var sql = 'SELECT * FROM ' + this.table.name;
	sql += where.sql;
	
	var rs = this.con.query(sql, where.values);
	return this.loadAll(rs);
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

Dao.prototype.save = function(obj) {
	if(obj.id) {
		this.update(obj);
	} else {
		this.insert(obj);
	}
};

Dao.prototype.insert = function(obj) {
	var sql = 'INSERT INTO ' + this.table.name;
	
	sql += '(';
	vals = ' VALUES (';
	rvals = [];
	for each (var col in this.table.columns) {
		if(col.name == 'id') {
			continue;
		}
		
		sql += col.name;
		sql += ', ';
		
		vals += '?, ';
		rvals.push(col.toj(obj[col.name]));
	}
	
	sql = sql.slice(0, sql.length - 2);
	sql += ')';
	
	vals = vals.slice(0, vals.length - 2);
	vals += ')';
	
	sql += vals;
	
	con.update(sql, rvals);
	
	if(this.table.columns.id) {
		var ors = con.query("SELECT CURRVAL ('" + this.table.name + "_id_seq')");
		ors.next();
		return ors.getInt(1);
	} else {
		return null;
	}
};

Dao.prototype.update = function(obj) {
	var sql = 'UPDATE ' + this.table.name;
	
	sql += ' SET ';
	rvals = [];
	for each (var col in this.table.columns) {
		if(col.name == 'id') {
			continue;
		}
		
		sql += col.name + ' = ?';
		sql += ', ';
		
		rvals.push(col.toj(obj[col.name]));
	}
	
	sql = sql.slice(0, sql.length - 2);
	
	sql += ' WHERE id = ?';
	rvals.push(obj['id']);

	con.update(sql, rvals);
};

Dao.prototype.remove = function(id) {
	var sql = 'DELETE FROM ' + this.table.name + ' WHERE id = ?';
	con.update(sql, id);
};

function DaoConnection(con) {
	this.register = function(name) {
		this[name] = new Dao(con, name);
	};
};

exports.init = function(con) {
	return new DaoConnection(con);
};
