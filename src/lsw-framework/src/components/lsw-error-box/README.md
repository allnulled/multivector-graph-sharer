# lsw-error-box

## Uso

En un componente vue2 cualquiera, reservas en el `data` una variable cualquiera, aquí `loadingError`, que es una instancia de `Error` y lo metes así:

```html
<lsw-error-box
    v-if="loadingError"
    :error="loadingError"
    context="Fase de carga de tests"
    :on-clear-error="() => loadingError = false"
/>
```

Y obtendrías algo así:

![ejemplo_de_error_box](./ejemplo.png)