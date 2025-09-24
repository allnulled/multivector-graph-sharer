await LswLazyLoads.loadSqlite();
assert.as("Global LswSqlite exists").that(typeof LswSqlite !== "undefined");
assert.as("Global jQlite exists").that(typeof jQlite !== "undefined");
assert.as("Global jQlite.select exists").that(typeof jQlite.select !== "undefined");
assert.as("Global jQlite.insert exists").that(typeof jQlite.insert !== "undefined");
assert.as("Global jQlite.update exists").that(typeof jQlite.update !== "undefined");
assert.as("Global jQlite.delete exists").that(typeof jQlite.delete !== "undefined");
assert.as("Global jQlite.schema exists").that(typeof jQlite.schema !== "undefined");