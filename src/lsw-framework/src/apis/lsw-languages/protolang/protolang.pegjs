{
  const reduceLoc = function(loc) {
    return `${loc.start.offset}-${loc.end.offset}|${loc.start.line}:${loc.start.column}-${loc.end.line}:${loc.end.column}`;
  };
  const deundefinify = function(data) {
    return data;
    return JSON.parse(JSON.stringify(data));
  };
  const separateEffectsTriggers = function(all) {
    const effects = [];
    const triggers = [];
    for(let index=0; index<all.length; index++) {
      const item = all[index];
      if(item.type.startsWith("effect")) {
        effects.push(item);
      } else if(item.type.startsWith("trigger")) {
        triggers.push(item);
      }
    }
    return { effects, triggers };
  };
}

start
  = MAYSPACES statements:(statement)* MAYSPACES { return deundefinify(statements); }

statement
  = st:(
    incStatement
  / defStatement
  / funStatement
  / relStatement)
    { return Object.assign({}, st, { $len: text().length, $loc: reduceLoc(location()) })}

incStatement
  = MAYSPACES "inc" MINSPACE path:UNTIL_NEWLINE (EOL/EOF) { return { type: "inc", path }; }

defStatement
  = MAYSPACES "def" MINSPACE names:identifierList { return { type: "def", names }; }

funStatement
  = MAYSPACES "fun" MINSPACE header:funHeader MAYSPACES code:funContent {
      return { type: "fun", ...header, code };
  }

funHeader = funHeaderWithParameters / funHeaderWithoutParameters
funHeaderWithoutParameters = name:identifier { return { name, params: undefined } }
funHeaderWithParameters
  = name:identifier MAYSPACES ":" MAYSPACES params:identifierList {
    return { name, params }
  }

funContent = funContentEmpty / funContentFilled
funContentEmpty = "{" MAYSPACES "}" { return "" }
funContentFilled
  = "{" code:codeBlock EOL "}"
    { return code; }

relStatement
  = MAYSPACES "rel" MINSPACE name:identifier MAYSPACES rest:relArguments {
      return { type: "rel", name, ...(separateEffectsTriggers(rest)) };
  }

relArguments = relArgument+

relArgument
  = MAYSPACES arg:(relEffect / relTrigger) {
    return arg;
  }

relEffect
  = MAYSPACES ">" MAYSPACES concept:identifier MAYSPACES "*" MAYSPACES value:number args:extraArguments?
    { return { type: "effect", prototipo: "multiplicador", consecuencia: concept, ratio: value, argumentos: args || undefined }; }

extraArguments
  = STARTING_COMMA args:UNTIL_NEWLINE { return args }
  

relTrigger
  = MAYSPACES ">>" MAYSPACES expr:triggerExpr { return expr; }

triggerExpr = triggerExprByCall / triggerExprByCode

triggerExprByCall
  = name:identifier MAYSPACES ":" MAYSPACES concepts:List_of_concepts? STARTING_COMMA? args:UNTIL_NEWLINE (EOL/EOF)
    { return { type: "trigger by prototype", prototipo: name, conceptos: concepts || undefined, argumentos: args || undefined }; }

List_of_concepts
  = first:Isolated_concept rest:More_isolated_concepts? { return [first].concat(rest || [])}

More_isolated_concepts = Another_isolated_concept+

Another_isolated_concept
  = MAYSPACES "," concept:Isolated_concept
    { return concept }

Isolated_concept = MAYSPACES "<" concept:identifier ">" { return concept }

triggerExprByCode
  = UNTIL_NEWLINE (EOL/EOF) { return { type: "trigger by code", codigo: text().trim() } }

identifierList
  = first:identifier rest:(STARTING_COMMA identifier)* {
      return [first].concat(rest.map(r => r[1]));
  }

identifier
  = (!( EOL/FORBIDDEN_TOKENS_FOR_IDENTIFIERS ) .)+ { return text().trim() }

number
  = [0-9]+ ("." [0-9]+)? { return text(); }

codeBlock "Codeblock"
  = ((!( EOL "}" )) (EOL/.))+ { return text().trim() }

STARTING_COMMA = MAYSPACES "," MAYSPACES {}
FORBIDDEN_TOKENS_FOR_IDENTIFIERS = ","/"*"/":"/"{"/">"
UNTIL_NEWLINE = (!(EOL) .)+ { return text() }
MAYSPACES = _*
MAYSPACE = _?
MINSPACE = _+
SPACE = _
EOL = ___
EOF = !.

_ = __ / ___
__ = " " / "\t"
___  = "\r\n" / "\r" / "\n"