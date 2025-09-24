sys.tts = {};
sys.tts.hablar = function(mensaje) {
    try {
        var Locale = Packages.java.util.Locale;
        var TextToSpeech = Packages.android.speech.tts.TextToSpeech;
        var QUEUE_FLUSH = TextToSpeech.QUEUE_FLUSH;
        var tts = undefined;
        var listener = new TextToSpeech.OnInitListener({
            onInit: function(status) {
                if (status == TextToSpeech.SUCCESS) {
                    //                tts.language = Locale.US;
                    tts.language = new Locale("es", "ES");
                    tts.setSpeechRate(1.5);
                    tts.speak(mensaje, QUEUE_FLUSH, null, null);
                }
            }
        });
        tts = new TextToSpeech(applicationContext, listener);
    } catch (error) {
        sys.debug.view(error.message);
    }
};