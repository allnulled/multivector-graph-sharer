assert.title("Common globals");
assert.as("global document exists").that(typeof document !== "undefined");
assert.as("global navigator exists").that(typeof navigator !== "undefined");
assert.as("global vue exists").that(typeof Vue !== "undefined");
assert.as("global lsw exists").that(typeof lsw !== "undefined");