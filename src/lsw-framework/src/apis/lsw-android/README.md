# lsw-android

Android tool for lsw.

## Usage

```js
LswAndroid.eval(function() {
    // Working on rhino.
    // Available globals:
    //   - applicationContext
    //   - Packages
    //   - System
    //   - Math
    //   - $RhinobridgePluginClass
    //   - $rhinobridgePlugin
    //   - $scope
    //   - $rhino
    //   - $webview
    //   - abg
    //   - print
    //   - evaluateByBrowser
});
LswAndroid.evalFile("/kernel/android/commons/fs.js");
```