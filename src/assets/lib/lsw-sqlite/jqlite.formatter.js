const jQliteFormatter = class {

  constructor(jQlite) {
    this.jQlite = jQlite;
  }

  json() {
    return JSON.stringify(this.jQlite.$data);
  }

  data() {
    return this.jQlite.$data;
  }

  sql(table) {
    let sql = "";
    sql += "INSERT INTO " + table;
    return sql;
  }

};