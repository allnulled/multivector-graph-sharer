// Inject your local android api from here:
await LswAndroid.eval("sys = {}");
await LswAndroid.evalFile("/kernel/android/api/debug.js");
await LswAndroid.evalFile("/kernel/android/api/tts.js");
await LswAndroid.evalFile("/kernel/android/api/reflection.js");
await LswAndroid.evalFile("/kernel/android/api/fs.js");

lsw.fs.evaluateAsJavascriptFile("/kernel/android/api/bindings.js");

LswAndroid.hablar("Hola Carlos, bienvenido a ele ese u güán!");