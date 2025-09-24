{
    const reduceBlock = function(ast) {
        return ast.length === 0 ? null : ast.length === 1 ? ast[0] : {
            grupo: ast.map((sentencia, i) => {
                return Object.assign({ indice: i }, sentencia);
            })
        };
    };
    const filterSentences = function(s) {
        return (s !== null);
    };
}

Naty_script = _* ast:Bloque_nivel_1 _* { return ast }
Bloque_nivel_1 = sentencias:Sentencia_completa+ { return sentencias }
Bloque_nivel_2 = s:Sentencia_incompleta* { return s }
Sentencia_completa = s:Sentencia_incompleta Token_eos { return s }
Sentencia_incompleta = s:(Sentencia_svc / Sentencia_vc / Sentencia_sc / Sentencia_grupo) { return s }
Sentencia_svc = sujeto:Sujeto predicado:Predicado { return { tipo0: "oración", sujeto, predicado } }
Sentencia_sc = sujeto:Sujeto { return { tipo0: "conjunto nominal", ...sujeto } }
Sentencia_vc = predicado:Predicado { return { tipo0: "conjunto verbal", ...predicado } }
Sentencia_grupo = grupo:Complemento_spec { return { tipo0: "conjunto abierto", ...grupo } }
Sujeto = 
    nombre:(Texto / Complemento_spec)
    complementos:Complementos_del_nombre?
        { return { tipo1: "sujeto", nombre, complementos }}
Predicado =
    verbo:(Verbo / Complemento_spec)
    complementos:Complementos_del_verbo?
        { return { tipo1: "predicado", verbo, complementos }}
Texto = ( !(Tokens_prohibidos) .)+ { return text().trim() }
Verbo = 
    token1:(_* ">" _*)
    verbo:Texto
        { return verbo }
Complementos_del_nombre = Complemento_del_nombre+
Complemento_del_nombre = Complemento_adj / Complemento_conj / Complemento_disj / Complemento_spec / Complemento_list
Complementos_del_verbo = Complemento_del_nombre+
Complemento_adj =
    token1:(_* "@" _*)
    complemento:Bloque_nivel_2
        { return complemento }
Complemento_conj =
    token1:(_* "&" _*)
    complemento:Bloque_nivel_2
        { return complemento }
Complemento_disj =
    token1:(_* "|" _*)
    complemento:Bloque_nivel_2
        { return complemento }
Complemento_spec = 
    token1:(_* "{" _*)
    complemento:Bloque_nivel_2
    tokenZ:(_* "}" _*)
        { return complemento }
Complemento_list = 
    token1:(_* "[" _*)
    complemento:Bloque_nivel_2
    tokenZ:(_* "]" _*)
        { return complemento }
Tokens_prohibidos = Token_into_verb / Token_into_spec / Token_into_list / Token_into_adj / Token_into_conj / Token_into_disj / Token_into_neg / Token_eol / Token_eof
Token_into_verb = (_* ">")
Token_into_spec = (_* "{") / (_* "}")
Token_into_list = (_* "[") / (_* "]")
Token_into_adj = (_* "@")
Token_into_conj = (_* "&")
Token_into_disj = (_* "|")
Token_into_neg = (_* "¬")
Token_eol "." = "."
Token_eof = !.
Token_eos = Token_eol / Token_eof / ""

Comentario "comment" = Comentario_unilinea / Comentario_multilinea
Comentario_unilinea = "//" (!(___) .)* 
Comentario_multilinea = "/*" (!("*/").)* "*/"

_ "any space" = __ / ___ / Comentario
__ "short space" = "\t" / " "
___ "long space" = "\r\n" / "\r" / "\n"