# lsw-importer

Import JavaScript, CSS and text easily.

Branch from [@allnulled/importer](https://github.com/allnulled/importer).

## Installation

```js
npm install -s @allnulled/lsw-importer
```

## Usage

### 1) Import from HTML:

```html
<script src="node_modules/@allnulled/lsw-importer/importer.js"></script>
```

### 2) Signature of the API:

```js
class Importer {
    setTotal(n) {/*...*/}
    setTimeout(ms) {/*...*/}
    async scriptSrc(src) {/*...*/}
    async scriptSrcModule(src) {/*...*/}
    async scriptAsync(url, context = {}) {/*...*/}
    async linkStylesheet(href) {/*...*/}
    async text(url) {/*...*/}
    async importVueComponent(partialUrl) {/*...*/}
}
```

Just note, in the case of `importVueComponent`, it is for `vue@2` only, and accepts any resource that can be appended with `.js`, `.css` and `.html`, and each of the three completed URLs serves a file.

### 3) Call methods:

```js
importer.setTotal(5);
await importer.scriptSrc("test/scriptSrc.js");
await importer.scriptSrcModule("test/scriptSrcModule.js");
await importer.linkStylesheet("test/linkStylesheet.css");
const txt = await importer.text("test/text.txt");
await importer.importVueComponent("components/dir/resource") // + (.js & .css & .html)
```

## Full-example

From the JavaScript perspective, you can use the globally injected `importer` object like so:

```js
Import_scripts: {
    importer.options.trace = true; // Set trace to true to see all the calls
    importer.setTotal(19); // Number of total modules that must be loaded
    importer.setTimeout(2000); // Wait 2 seconds untils remove the loader
    await Promise.all([
        importer.scriptSrc("src/external/socket.io-client.js"),
        importer.scriptSrc("src/external/vue-v2.js"),
        importer.scriptSrc("src/external/basic-logger.js"),
        importer.scriptSrc("src/external/ensure.js"),
        importer.scriptSrc("src/external/webmarket.js"),
        importer.importVueComponent("src/components/c-title/c-title"),
        importer.importVueComponent("src/components/home-page/home-page"),
        importer.importVueComponent("src/components/app/app"),
    ]);
    await importer.linkStylesheet("src/external/win7.css");
    await importer.scriptSrc("src/external/refresher.js");
}
```

From the Html perspective, you should better insert something like this:

```html
    <div id="intersitial">
        <div id="intersitial_loader">
            <div id="intersitial_loader_bar"></div>
            <div id="intersitial_message">
                <span>Loaded <span id="intersitial_modules_loaded"></span> out of <span id="intersitial_modules_all"></span> modules</span>
            </div>
        </div>
        <pre  id="intersitial_modules_trace"></pre>
    </div>
```

From the Css perspective, you maybe find useful something like this:

```html
<style>
    #intersitial {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        font-family: Arial;
        font-size: 12px;
    }
    #intersitial_message {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 12px;
        color: gold:
        font-family: Arial;
        font-size: 12px;
        border: 1px solid #888;
    }
    #intersitial_loader {
        position: relative;
        font-family: Arial;
        min-height: 14px;
        background-color: #333;
    }
    #intersitial_loader_bar {
        height: 100%;
        min-height: 15px;
        font-size: 12px;
        background-color: #0F0;
        width: 0%;
    }
    #intersitial_modules_trace {
        font-family: Arial;
        font-size: 12px;
        border: 1px solid #888;
        margin: 0;
        padding: 4px;
        margin-bottom: 1px;
    }
</style>
```

The intersitial will be removed once all the modules are loaded.

## Custom usage

If you need, for any reason, another importer, you can simply:

```js
const importer = Importer.create({
    /* Options of the API: default values */
    id: "#intersitial",
    id_loaded: "#intersitial_modules_loaded",
    id_all: "#intersitial_modules_all",
    id_trace: "#intersitial_modules_trace",
    id_loader: "#intersitial_loader",
    id_loader_bar: "#intersitial_loader_bar",
    trace: (Vue?.prototype?.$lsw?.logger?.$options?.active ),
    update_ui: false, // This option is only set to true on global: window.importer
    update_ui_minimum_milliseconds: 1200, // Minimum milliseconds the importer
    // must live before clearing the graphical counterpart
})
```

You can use the parameters to set up your own graphical counterpart.

Some of the settings are under `importer` and some under `importer.options`.

Methods that start with `$` are considered private.

To know the convenient number of modules, just see the logs in console, because they tell you each time a new module is loaded. Then hardcode the number in the code, and all fine.

To fully trace the importer, you can do:

```js
importer.options.trace = true;
```