(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['LswBarsGraph'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['LswBarsGraph'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  
  const LswBarsGraph = class {

    static toSample(list, idField = false, numerableFields = [], optionsField = "$options") {
      let output = [];
      Iterating_list:
      for(let indexItem=0; indexItem<list.length; indexItem++) {
        const item = list[indexItem];
        const formatted = {
          id: idField ? item[idField] : indexItem,
          values: [],
        };
        for(let indexNumerables=0; indexNumerables<numerableFields.length; indexNumerables++) {
          const numerableId = numerableFields[indexNumerables];
          let value = 0;
          if(numerableId in item) {
            value = item[numerableId];
          }
          formatted.values.push(value);
        }
        output.push(formatted);
      }
      return {
        id: idField,
        numerables: numerableFields,
        options: optionsField,
        output,
      };
    }

  };

  return LswBarsGraph;

});