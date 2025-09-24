const LswSqlitePrototype_CrudInterface = class extends LswSqlitePrototype_SchemaHandlerInterface {

  static sqlOperators = {
    ">": ">",
    ">=": ">=",
    "<": "<",
    "<=": "<=",
    "=": "=",
    "!=": "!=",
    "in": "IN",
    "not in": "NOT IN",
    "is null": "IS NULL",
    "is not null": "IS NOT NULL",
    "like": "LIKE",
    "not like": "NOT LIKE"
  }

  translateSqlOperator(op) {
    if (!(op in this.constructor.sqlOperators)) {
      throw new Error(`Invalid sql operator «${op}» on «LswSqlite.translateSqlOperator»`);
    }
    return this.constructor.sqlOperators[op];
  }

  translateSqlWhere(where) {
    this.$trace("translateSqlWhere");
    let sql = "";
    for (let indexWhere = 0; indexWhere < where.length; indexWhere++) {
      const whereRule = where[indexWhere];
      if (indexWhere !== 0) {
        sql += "\n  AND ";
      }
      const [subj, op, compl] = whereRule;
      sql += subj;
      sql += " ";
      sql += this.translateSqlOperator(op);
      if (["is null", "is not null"].indexOf(op) !== -1) {
        // @OK
      } else if (["in", "not in"].indexOf(op) !== -1) {
        if (!Array.isArray(compl)) {
          throw new Error(`Invalid complement for sql operator ${op} because it must be an array (${typeof compl}) on «LswSqlite.translateSqlWhere»`);
        }
        sql += " (";
        sql += compl.map(it => this.sanitizeValue(it)).join(",");
        sql += ")";
      } else {
        sql += " ";
        sql += this.sanitizeValue(compl);
      }
    }
    return sql ?? "1 = 1";
  }

  translateSqlOrderBy(orderBy) {
    this.$trace("translateSqlOrderBy");
    let sql = "";
    for (let indexOrder = 0; indexOrder < orderBy.length; indexOrder++) {
      const orderRule = orderBy[indexOrder];
      if (indexOrder !== 0) {
        sql += ",\n    ";
      }
      if (orderRule.startsWith("!")) {
        sql += `${orderRule.substr(1)} DESC`;
      } else {
        sql += `${orderRule} ASC`;
      }
    }
    return sql;
  }

  translateSqlInsertIntoKeys(item) {
    this.$trace("translateSqlInsertIntoKeys");
    const keys = Object.keys(item);
    let sql = "";
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      if (index !== 0) {
        sql += `,`;
      }
      sql += `\n  ${this.sanitizeId(key)}`;
    }
    return sql;
  }

  translateSqlInsertValues(item) {
    this.$trace("translateSqlInsertValues");
    const values = Object.values(item);
    let sql = "";
    for (let index = 0; index < values.length; index++) {
      const value = values[index];
      if (index !== 0) {
        sql += `,`;
      }
      sql += `\n  ${this.sanitizeValue(value)}`;
    }
    return sql;
  }

  translateSqlInsertValuesList(list) {
    this.$trace("translateSqlInsertValuesList");
    let sql = "";
    for (let indexList = 0; indexList < list.length; indexList++) {
      const item = list[indexList];
      const values = Object.values(item);
      if (indexList !== 0) {
        sql += `,`;
      }
      sql += "(";
      for (let indexProp = 0; indexProp < values.length; indexProp++) {
        const value = values[indexProp];
        if (indexProp !== 0) {
          sql += `,`;
        }
        sql += `\n  ${this.sanitizeValue(value)}`;
      }
      sql += "\n)";
    }
    return sql;
  }

  translateSqlUpdateValues(values) {
    this.$trace("translateSqlUpdateValues");
    const keys = Object.keys(values);
    let sql = "";
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const value = values[key];
      sql += index === 0 ? "" : ",";
      sql += `\n    ${key} = ${this.sanitizeValue(value)}`;
    }
    return sql;
  }

  // CRUD methods:

  selectAny(where = [], separingTypes = false) {
    this.$trace("selectAny");
    const allTypes = Object.keys(this.getSchema());
    let allResults = !separingTypes ? [] : {};
    for (let index = 0; index < allTypes.length; index++) {
      const oneType = allTypes[index];
      let sql = "";
      sql += `SELECT`;
      sql += `\n    *`;
      sql += `\n  FROM ${this.sanitizeId(oneType)}`;
      if (where && where.length) {
        sql += `\n  WHERE ${this.translateSqlWhere(where)}`;
      }
      const oneResult = this.execute("\n\n" + sql);
      const typedResult = oneResult.map(row => {
        row.$table = oneType;
        return row;
      })
      if (!separingTypes) {
        allResults = allResults.concat(typedResult);
      } else {
        allResults[oneType] = oneResult;
      }
    }
    return allResults;
  }

  selectMany(table, where = [], order = ["id"], limit = false) {
    this.$trace("selectMany");
    let sql = "";
    sql += `SELECT`;
    sql += `\n    *`;
    sql += `\n  FROM ${this.sanitizeId(table)}`;
    if (where && where.length) {
      sql += `\n  WHERE ${this.translateSqlWhere(where)}`;
    }
    if (order) {
      sql += `\n  ORDER BY ${this.translateSqlOrderBy(order)}`;
    }
    if (limit) {
      sql += `\n  LIMIT ${limit}`;
    }
    return this.execute("\n\n" + sql);
  }

  insertOne(table, item = {}) {
    this.$trace("insertOne");
    if (this.$options.openTypes === true) {
      const keys = Object.keys(item);
      this.synchronizeSchema({
        [table]: keys.reduce((out, key) => {
          out[key] = "varchar";
          return out;
        }, {})
      })
    }
    let sql = "";
    sql += `INSERT INTO ${table} (${this.translateSqlInsertIntoKeys(item)}`;
    sql += `\n) VALUES (${this.translateSqlInsertValues(item)}`;
    sql += `\n);\n`;
    return this.execute("\n\n" + sql);
  }
  insertMany(table, list = []) {
    this.$trace("insertMany");
    const item = list[0];
    if (this.$options.openTypes === true) {
      const keys = Object.keys(item);
      this.synchronizeSchema({
        [table]: keys.reduce((out, key) => {
          out[key] = "varchar";
          return out;
        }, {})
      })
    }
    let sql = "";
    sql += `INSERT INTO ${table} (${this.translateSqlInsertIntoKeys(item)}`;
    sql += `\n) VALUES `;
    sql += this.translateSqlInsertValuesList(list);
    sql += `;\n`;
    return this.execute("\n\n" + sql);
  }

  updateMany(table, where = [], values = {}) {
    this.$trace("updateMany");
    let sql = "";
    sql += `UPDATE ${table} SET ${this.translateSqlUpdateValues(values)}`;
    sql += `\n  WHERE ${this.translateSqlWhere(where)}`;
    sql += `;\n`;
    return this.execute("\n\n" + sql);
  }
  updateOne(table, id, values = {}) {
    this.$trace("updateOne");
    let sql = "";
    sql += `UPDATE ${table}`;
    sql += `\n  SET ${this.translateSqlUpdateValues(values)}`;
    sql += `\n  WHERE id = ${this.sanitizeValue(id)}`;
    sql += `;\n`;
    return this.execute("\n\n" + sql);
  }

  deleteOne(table, id) {
    this.$trace("deleteOne");
    let sql = "";
    sql += `DELETE FROM ${table}`;
    sql += `\n  WHERE id = ${this.sanitizeValue(id)}`;
    sql += `;\n`;
    return this.execute("\n\n" + sql);
  }
  deleteMany(table, where) {
    this.$trace("deleteMany");
    let sql = "";
    sql += `DELETE FROM ${table}`;
    sql += `\n  WHERE ${this.translateSqlWhere(where)}`;
    sql += `;\n`;
    return this.execute("\n\n" + sql);
  }

  // Convenient methods:

  selectOne(table, id, order = ["id"]) {
    this.$trace("selectOne");
    const resultados = this.selectMany(table, ["id", "=", id], order, 1);
    return resultados.length ? resultados[0] : false;
  }

  selectFirst(table, where = [], order = ["id"]) {
    this.$trace("selectFirst");
    const resultados = this.selectMany(table, where, order, 1);
    return resultados.length ? resultados[0] : false;
  }

  insert(table, itemOrList = []) {
    this.$trace("insert");
    if (Array.isArray(itemOrList)) {
      return this.insertMany(table, itemOrList);
    }
    return this.insertOne(table, itemOrList);
  }

  update(table, idOrWhere, values = {}) {
    this.$trace("update");
    if (Array.isArray(idOrWhere)) {
      return this.updateMany(table, idOrWhere, values);
    }
    return this.updateOne(table, idOrWhere, values);
  }

  delete(table, idOrWhere) {
    this.$trace("delete");
    if (Array.isArray(idOrWhere)) {
      return this.deleteMany(table, idOrWhere);
    }
    return this.delete(table, idOrWhere);
  }

};