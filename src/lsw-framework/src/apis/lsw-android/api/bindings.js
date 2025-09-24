LswAndroid.hablar = function(msg) {
    LswAndroid.eval('sys.tts.hablar(' + JSON.stringify(msg) + ')');
};