{
    const indexes = {};
    const roots = {};
    const sentences = {};

    const registerIndexes = function(sentencias) {
        for(let indexSentencia=0; indexSentencia<sentencias.length; indexSentencia++) {
          const sentencia = sentencias[indexSentencia];
          registerRecursively(sentencia, [indexSentencia]);
        }
        return sentencias;
    };

    const registerSentence = function(source) {
        sentences[Object.keys(sentences).length] = source;
    };

    const registerRecursively = function(ast, currentIndex) {
        // console.log("AST:", ast);
        if(Array.isArray(ast)) {
            for(let subindex=0; subindex<ast.length; subindex++) {
              const partialAst = ast[subindex];
              registerRecursively(partialAst, [].concat(currentIndex).concat([subindex]));
            }
        } else if(typeof ast === 'object') {
            registerRecursively(ast.c, [].concat(currentIndex).concat("c"));
        } else if(typeof ast === 'string') {
            registerIndex(ast, currentIndex);
        } else {
            console.log("NOOOOOOOOO, SE NOS ESCAPA EL AST REC", ast, currentIndex);
        }
    }

    const registerIndex = function(sentencia, indice) {
        if(!(sentencia in indexes)) {
            indexes[sentencia] = [];
        }
        indexes[sentencia].push(indice.join("."));
    };

    const filterEmptySpaces = function(list) {
        return list.filter(item => item !== "").map(item => {
            return item;
            if(typeof item === 'string') {
                return {
                    r: 'WHAT',
                    c: item,
                };
            }
        });
    };

    const registerEquivalence = function(equivalencia) {
        // console.log("equivalencia:", equivalencia);
        const main = equivalencia.c[0];
        const equivalents = [].concat(equivalencia.c).splice(1);
        if(!(main in roots)) {
            roots[main] = [];
        }
        roots[main] = roots[main].concat(equivalents);
        for(let indexEquivalents=0; indexEquivalents<equivalents.length; indexEquivalents++) {
          const equivalent = equivalents[indexEquivalents];
          registerIndex(equivalent, ["root=>" + main]);
        }
        return equivalencia;
    };

}

NatyScript = sentencias:Sentencia_completa* {
    const output = {
        tree: registerIndexes(sentencias),
        indexes: indexes,
        roots: roots,
        sentences: sentences,
    };
    console.log(JSON.stringify(output, null, 2));
    return output;
}

Sentencia_completa = sentencia:Sentencia_incompleta Token_eos {
    registerSentence(text());
    return sentencia;
}

Sentencia_incompleta = Grupo_nivel_maximo

Grupo_nivel_maximo = g:Grupo_nivel_maximo_unidad+ { return filterEmptySpaces(g) }
Grupo_nivel_maximo_unidad = Grupo_set / Grupo_not / Grupo_and / Grupo_or / Grupo_adject / Grupo_act / Grupo_equal / Grupo_textual
Grupo_nivel_0 = Grupo_set
Grupo_nivel_1 = Grupo_not

Grupo_not = _* "¬" g:Grupo_nivel_maximo { return { r: "NOT", c: g } }
Grupo_set = _* "{" g:Grupo_nivel_maximo "}" { return { r: "GROUP", c: g } }
Grupo_act = _* ">" _* g:Grupo_nivel_maximo { return { r: "DOES", c: g } }
Grupo_adject = _* "@" _* g:Grupo_nivel_maximo { return { r: "IS", c: g } }
Grupo_and = _* "&" _* g:Grupo_nivel_maximo { return { r: "AND", c: g } }
Grupo_or = _* "|" _* g:Grupo_nivel_maximo { return { r: "OR", c: g } }
Grupo_or_de_equals = g1:Grupo_textual gN:Grupo_or_de_equal_unidad* { return [g1].concat(gN || []) }
Grupo_or_de_equal_unidad = _* "|" _* g1:Grupo_textual { return g1 }
Grupo_equal = g1:Grupo_textual _* "=" _* gN:Grupo_or_de_equals { return registerEquivalence({ r: "EQUAL", c: [g1].concat(gN) }) }
Grupo_textual = Token_textual+ { return text().trim() }

Token_prohibido = "¬" / "&" / "|" / ">" / "@" / "[" / "]" / "{" / "}" / "." / "="
Token_textual = (!(Token_prohibido) .)
Token_eos = ("." _*) / __ / "" {}

Comentario "comment" = Comentario_unilinea / Comentario_multilinea
Comentario_unilinea = "//" (!(___) .)* ___
Comentario_multilinea = "/*" (!("*/").)* "*/"

_ "any space" = __ / ___ / Comentario
__ "short space" = "\t" / " "
___ "long space" = "\r\n" / "\r" / "\n"