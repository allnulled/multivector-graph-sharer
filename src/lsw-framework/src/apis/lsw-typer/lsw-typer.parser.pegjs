{
  // Función auxiliar para convertir cadenas con escapes
  function unescapeString(str) {
    return JSON.parse(str);
  }
}

Start
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
  = key:String ANYSPACE ":" ANYSPACE value:Value {
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
