$lswTyper.define("org.allnulled.lsw/type/moment.js", function(input) {
  let output = undefined;
  try {
    if(typeof input !== "object") {
      throw new Error("Parsed data must enter as {$type:'org.allnulled.lsw/type/moment.js, $value: '0min'}");
    }
    const text = input.$value;
    if(typeof text !== "string") {
      console.log(text);
      throw new Error("Parsed data must enter as string");
    }
    output = LswTimer.parser.parse(text);
    if(!Array.isArray(output)) {
      throw new Error("Parsed data does not return a meaning");
    }
    if(output.length === 0) {
      throw new Error("Parsed data does not return any sentence");
    }
    if(output.length !== 1) {
      throw new Error("Parsed data does not return only one sentence");
    }
    if(output[0].tipo !== "FechaHora") {
      throw new Error(`Parsed data does not return a moment type, but «${output[0].tipo}» type`);
    }
    return output[0];
  } catch (error) {
    output = `${error.name}: ${error.message}`;
  }
  return output;
});