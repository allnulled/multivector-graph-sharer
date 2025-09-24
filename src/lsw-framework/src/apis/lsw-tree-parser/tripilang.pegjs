{
  // Función auxiliar para convertir cadenas con escapes
  const unescapeString = function(str) {
    return JSON.parse(str);
  };
  const printLocation = function(loc) {
    return `${loc.start.offset}-${loc.end.offset}|${loc.start.line}:${loc.start.column}-${loc.end.line}:${loc.end.column}`;
  };

}

Tripilang = tree:Tree _* { return tree }

Tree = _* tree:Treepart _* { return tree }

Node_decorator = 
  token_1:(_* "@" )
  decorator:Object
    { return decorator }

Treepart = 
  token_1:(_*)
  definition:Node_decorator?
  idAndOrLink:Treepart_identification
  subtree:Subtree?
    { return { ...idAndOrLink, definition: definition || undefined, subtree: subtree || undefined } }

Treepart_identification =
  token_1:(_*)
  identification:(
    Treepart_identification_by_link /
    Treepart_identification_by_id_and_link /
    Treepart_identification_by_id )
    { return identification }

Treepart_identification_by_link =
  link:Treepart_link
    { return { link: link || undefined } }

Treepart_identification_by_id =
  id:Treepart_id
    { return { id: id || undefined } }

Treepart_identification_by_id_and_link =
  id:Treepart_id
  link:Treepart_link
    { return { id: id || undefined, link: link || undefined } }

Treepart_id = 
  id:Negate_link_and_subtree
    { return id }

Treepart_link =
  token_1:(_* "[" _*)
  link:Negate_close_square_bracket?
  token_2:(_* "]")
    { return link }

Negate_close_square_bracket = ( (!(SPECIAL_TOKENS/EOF/EOL)) .)+ { return text().trim() }

Negate_link_and_subtree = ( (!(SPECIAL_TOKENS/EOF/EOL)) .)+ { return text().trim() }

SPECIAL_TOKENS = "["/"{"/"}"/"]"

Subtree =
  token_1:(_* "{" _*)
  content:Treeparts?
  token_2:(_* "}")
    { return content }

Treeparts = Treepart+

EOL = ___ {}
EOF = !. {}

___ = "\r\n" / "\r" / "\n"
__ = "\t" / " "
_ = ___ / __


Jsontyped_syntax
  = ANYSPACE value:Value ANYSPACE { return value; }

Value
  = tp:Type_def? ANYSPACE vl:Value_untyped { return tp ? { ...tp, $value: vl } : vl; }

// Define una `Type_def` que acepta URLs completas
Type_def = Type_def_by_js_property

Js_noun = [A-Za-z\$_] [A-Za-z0-9\$_]* { return text() }

Js_noun_predotted =
  "." noun:Js_noun
    { return "." + noun }

Js_noun_preslashed =
  "/" noun:Js_noun
    { return "/" + noun }

Js_path = 
  first:Js_noun
  others:(Js_noun_predotted / Js_noun_preslashed)*
    { return [first].concat(others || []).join("") }

Js_path_fallback =
  token1:(_ "|" _)
  otherType:Js_path
    { return otherType }

Type_def_by_js_property
  = "@" jspath:Js_path fallbacks:Js_path_fallback*
    {
      return {
        $type: [jspath].concat(fallbacks || []),
      };
    }

Value_untyped
  = Object
  / Array
  / String
  / Number
  / Boolean
  / Null

Object
  = "{" ANYSPACE members:MemberList? ANYSPACE "}" {
      return members !== null ? members : {};
    }

MemberList
  = head:Member tail:( ANYSPACE "," ANYSPACE Member)* {
      const result = { [head.key]: head.value };
      tail.forEach((item) => {
        const subitem = item[3];
        const { key, value } = subitem;
        result[key] = value;
      });
      return result;
    }

Member
  = key:(String/Js_noun) ANYSPACE ":" ANYSPACE value:Value {
      return { key, value };
    }

Array
  = "[" ANYSPACE elements:ElementList? ANYSPACE "]" {
      return elements !== null ? elements : [];
    }

ElementList
  = head:Value tail:( ANYSPACE "," ANYSPACE Value)* {
      return [head, ...tail.map(e => e[3])];
    }

String
  = '"' chars:DoubleQuotedString '"' {
      return chars;
    }

DoubleQuotedString
  = chars:('\\"' / ((!'"') .))* { return text(); }

Number
  = value:$("-"? [0-9]+ ("." [0-9]+)? ([eE] [-+]? [0-9]+)?) {
      return parseFloat(value);
    }

Boolean
  = "true" { return true; }
  / "false" { return false; }

Null
  = "null" { return null; }

ANYSPACE "whitespace"
  = [ \t\n\r]*
