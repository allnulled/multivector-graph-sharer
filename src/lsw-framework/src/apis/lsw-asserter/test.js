const LswAsserter = require(__dirname + "/lsw-asserter.js");

LswAsserter.global.as("global no es undefined").that(typeof global !== "undefined");
LswAsserter.global.as("require no es undefined").that(typeof require !== "undefined");