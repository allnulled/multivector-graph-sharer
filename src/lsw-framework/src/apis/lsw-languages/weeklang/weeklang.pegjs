{
    const flatRules = (fecha, reglas) => {
        let out = [];
        for(let index=0; index<reglas.length; index++) {
          const regla = reglas[index];
          out.push({
            weekday: fecha,
            ...regla,
          });
        }
        return out;
    };
    const flatSentence = (sentence) => {
        const output = [];
        for(let indexRule=0; indexRule<sentence.rules.length; indexRule++) {
          const rule = sentence.rules[indexRule];
          output.push({
            ...sentence.range,
            ...rule,
          });
        }
        return output;
    };
    const flatScript = function(ast) {
        return ast.flat();
    }
}

WeekLang = anyspace ast:Sentence* anyspace { return flatScript(ast) }

Sentence =
    range:Date_header?
    rules:Rules_block
        { return flatSentence({ range: range || { from: "*", to: "*" }, rules }) }

Date_header =
    token0:_*
    dateSrc:Full_date_till_day_or_asterisk
    token1:(anyspace "-" anyspace)
    dateDst:Full_date_till_day_or_asterisk
    token2:":"
        { return { from: dateSrc, to: dateDst } };

Full_date_till_day_or_asterisk = Full_date_till_day / "*"

Full_date_till_day = Year "/" Month "/" Day { return text() }

Year = [0-9][0-9][0-9][0-9] { return text() }
Month = [0-9][0-9] { return text() }
Day = [0-9][0-9]? { return text() }

Rules_block = rules:Full_rule+ { return rules.flat() }

Full_rule =
    token1:anyspace
    frequency:Frequency
    token2:(anyspace "{" anyspace)
    rules:Inner_sentence*
    token3:(anyspace "}" anyspace)
      { return flatRules(frequency, rules) }

Frequency = Frequency_v1

Frequency_v1 = 
    frequency:("*" / "lun" / "mar" / "mie" / "jue" / "vie" / "sab" / "dom")
        { return frequency }

Inner_sentence = Sentence_req / Sentence_set

Sentence_set = 
    token1:(anyspace "set" space)
    moment:Full_hour
    duration:Duration_del_set?
    token2:(anyspace "=" anyspace)
    concept:Rest_of_line
        { return { type: "SET", concept, duration, ...moment } }

Duration_del_set = 
    token1:(anyspace "*" anyspace)
    duration:Token_para_el_duration_del_set
        { return duration }

Rest_of_line = Token_para_el_set

Full_hour =
    token1:anyspace
    hour:Hour
    minute:(":" Minute)?
        { return { hour, minute: minute ? minute[1] : "00" } }

Hour = [0-9] [0-9] { return text() }
Minute = [0-9] [0-9] { return text() }

Sentence_req = 
    token1:(anyspace "req" space)
    tokens:Line_of_tokens
        { return tokens }

Line_of_tokens =
    concept:Token_para_el_req
    limit:Limite_para_el_req
    urgency:Urgencia_para_el_req?
        { return { type: "REQ", concept, ...limit, urgency: urgency || 0 } }

Limite_para_el_req = 
    limit:(">" / "<")
    value:Token_para_el_req
        { return { limit, value: value.trim().trim(), condition: text().trim() } }

Urgencia_para_el_req = 
    op:("!")
    value:Token_para_el_req
        { return value.trim() }

Line_of_tokens_first = Token_para_el_req { return text().trim() }

Line_of_tokens_next = "|" Token_para_el_req { return text().substr(1).trim() }

Token_para_el_req = (!(">" / "<" / "!" / EOL) .)* { return text().trim() }

Token_para_el_set = (!(EOL) .)+ { return text().trim() }

Token_para_el_duration_del_set = (!(EOL / "=") .)+ { return text().trim() }

Token_para_el_comentario = ((!EOL) .)+ { return text().trim() }

Token_para_el_comentario_multilinea = ((!(EOL / "*/")) .)+ { return text().trim() }

anyspace = _*
space = _+
EOS = EOL / EOF
EOF = !.
EOL = ___
_ = __ / ___ / Comment
__ = " " / "\t"
___ = "\r\n" / "\r" / "\n"

Comment = Comment_oneline / Comment_multiline

Comment_oneline = "//" Token_para_el_comentario { return text() }

Comment_multiline = "/*" Token_para_el_comentario_multilinea "*/" { return text() }