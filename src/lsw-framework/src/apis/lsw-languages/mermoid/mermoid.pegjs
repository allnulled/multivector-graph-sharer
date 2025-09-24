start =
    token1:(anyspace "graph" anyspace)
    direction:direction
    token2:(anyspace)
    statements:statementList
    token3:(anyspace)
        { return { type: "graph", direction, statements }; }

direction = "TD" / "LR" / "BT" / "RL"

statementList = statementUnit+

statementUnit = 
    token1:anyspace
    sentencia:statement
        { return sentencia }

statement = link / subgraph / node

link =
    from:node anyspace
    label:label? anyspace
    arrow:arrow anyspace
    to:node
        { return { type: "link", from, to, arrow, label }; }

arrow = "-->" / "---" / "-.->" / "==>" / "-.-"

label =
    token1:"--"
    l:labelText
    token2:"-->"
        { return l; }

labelText =
    (!("-" / eol / eof) .)+
        { return text(); }

node =
    id:identifier
    shape:shapeText?
        { return { id, shape }; }

shapeText = shapeText_v1 / shapeText_v2 / shapeText_v3

shapeText_v1 = "(" text:negateText_v1 ")" { return { type: "default", text }; }
shapeText_v2 =  "[" text:negateText_v2 "]" { return { type: "rect", text }; }
shapeText_v3 =  "{" text:negateText_v3 "}" { return { type: "diamond", text }; }

negateText_v1 = (!(")" / eol / eof) .)* { return text(); }
negateText_v2 = (!("]" / eol / eof) .)* { return text(); }
negateText_v3 = (!("}" / eol / eof) .)* { return text(); }

eol = ___
eof = !.

identifier = [a-zA-Z0-9_]+ { return text() }

subgraph =
    token1:("subgraph" anyspace)
    id:subgraphId
    token2:anyspace
    body:statementList
    token3:"end"
        { return { type: "subgraph", id, body }; }

subgraphId = (!(eol / eof) .)* { return text() }

_ = anyspace

anyspace = space*
space = onespace+
onespace = (__ / ___)

__ = " " / "\t"
___ = "\r\n" / "\r" / "\n"