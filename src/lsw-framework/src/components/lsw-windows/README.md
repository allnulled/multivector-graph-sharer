# lsw-windows

Windows manager tool for LSW.

## Requirements

Based on [vue@2](#) and [@allnulled/lsw-dialogs](https://github.com/allnulled/lsw-dialogs).

## Installation

```sh
npm i -s @allnulled/lsw-windows
```

## Importation

Be sure to have loaded [`@allnulled/lsw-dialogs`](https://github.com/allnulled/lsw-dialogs) before. Then, you have to load also 2 artifacts * (1 css + 1 js). As so:

```html
<script src="node_modules/@allnulled/lsw-windows/lsw-windows.js"></script>
<link rel="stylesheet" type="text/css" href="node_modules/@allnulled/lsw-windows/lsw-windows.css" />
```

Then in your `vue@2` template you only have to:

```html
<lsw-windows-viewer />
```

And a button will appear. Then it all will make sense.

> **Important note:** if you use `lsw-windows`, do not inject in your templates the `lsw-dialogs` component, and use the `dialogs` property of the `lsw-windows-pivot-button` instead in order to centralize all the dialogs management as windows management. IUKWIM. Do NOT INJECT `<lsw-dialogs>` because `<lsw-windows-pivot-button>` already cares about it. Get them from `lswWindowsPivotButton.dialogs` instead.

## Example

Once you have everything loaded, you can simply do dialog flows like:

```js
const userData = await this.$dialogs.open({
  id: "dialog-step-1",
  title: "Paso 1",
  template: `
    <div>
        <div>
          <div>Nombre:</div>
          <input type="text" ref="nameInput" v-model="value.name" style="width:100%;" placeholder="Pon tu nombre aquí" v-focus v-on:keydown.enter="() => $refs.ageInput.focus()" />
          <div>Edad:</div>
          <input type="number" ref="ageInput" v-model="value.age" style="width:100%;" placeholder="Pon tu edad aquí" v-on:keydown.enter="() => $refs.cityInput.focus()" />
          <div>Ciudad:</div>
          <input type="text" ref="cityInput" v-model="value.city" style="width:100%;" placeholder="Pon tu ciudad aquí" v-on:keydown.enter="accept" />
        </div>
        <div>
          <button v-on:click="accept">Aceptar</button>
        </div>
    </div>
  `,
  factory: {
    data: {
      value: {
        name: "Guybrush Threepwood",
        age: 0,
        city: "Los Angeles"
      }
    }
  }
});
console.log("UserData:", userData);
const response = await this.$dialogs.open({
  id: "dialog-step-2",
  title: "Paso 2",
  template: `
    <div>
        <div>
          <div>¿Cómo estás, ${userData.name}?</div>
          <div>Cuéntame, ¿qué tal todo por ${userData.city}?</div>
          <div>¿Cómo van esos ${userData.age} años?</div>
          <input type="text" v-model="value" style="width:100%;" placeholder="Cuéntame aquí, que quiero saber" v-on:keydown.enter="accept" />
        </div>
        <div>
          <button v-on:click="accept">Aceptar</button>
        </div>
    </div>
  `
});
console.log("Response:", response);
```