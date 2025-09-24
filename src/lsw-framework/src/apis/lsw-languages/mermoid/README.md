# weeklang

El lenguaje `weeklang` permite hacer cosas así:

```
* {
    set 06:00 despertarse
    set 07:00 desayunar algo
}

2025/06/01-2025/07/01:

* {
    req programar > 5h !10
    req ejercicio físico > 1h !10
    req pasear > 2h !10
    req paisaje > 1 !1
}
```

Solo hay 2 instrucciones:

- `req` es de `require`.
- `set` es de `set`.

Deben ir dentro de grupos así:

- `* {  }`
- `lun {  }`
- `mar {  }`
- `mie {  }`
- `jue {  }`
- `vie {  }`
- `sab {  }`
- `dom {  }`

El `*` es para todos los días de la semana.

Estos grupos pueden ir intercalados por rangos de fechas, siempre con formato estricto, ceñido al ejemplo:

- `2025/12/30-2027/01/01`

### La instrucción set

La instrucción `set` permite especificar:
- una hora
   - en formato: `00:00` o `23:59`
- un concepto

```
set 06:00 despertarse
set 07:00 desayunar algo
```

### La instrucción req

La instrucción `req` de `require` permite especificar:
- concepto
- límite, con `<` o `>` y una duración o un número:
   - con duración, ver: [`allnulled@lsw-timer`](https://github.com/allnulled/lsw-timer)
   - con número indicas el número de acciones contra el concepto
- urgencia, con `!` y un número, a mayor, más urgente, y por defecto es `0`


