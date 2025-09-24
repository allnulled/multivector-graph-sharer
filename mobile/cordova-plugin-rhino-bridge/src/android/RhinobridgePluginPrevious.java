package com.allnulled.rhinobridge;

import java.io.FileWriter;
import java.io.IOException;
import java.io.File;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject; // Para trabajar con objetos JSON
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.BaseFunction; // Para definir funciones en Rhino
import org.mozilla.javascript.ClassShutter;

public class RhinobridgePlugin extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("EVALUATE_JAVASCRIPT".equals(action)) {
            this.evaluateScript(args.getString(0), callbackContext);
            return true;
        }
        return false;
    }

    private void evaluateScript(String script, CallbackContext callbackContext) {
        Context rhino = Context.enter(); // Inicia el entorno Rhino
        try {
            rhino.setOptimizationLevel(-1); // Evita optimizaciones para mayor compatibilidad
            Scriptable scope = rhino.initStandardObjects(); // Crea el contexto global
            rhino.setClassShutter(new ClassShutter() {
                public boolean visibleToScripts(String className) {
                    return true; // Permite acceso a todas las clases Java
                }
            });
            CordovaWebView webView = super.webView;
            ScriptableObject.putProperty(scope, "applicationContext", Context.javaToJS(cordova.getActivity().getApplicationContext(), scope));
            // ScriptableObject.putProperty(scope, "Packages", Context.javaToJS(Packages.class, scope));
            ScriptableObject.putProperty(scope, "System", Context.javaToJS(System.class, scope));
            ScriptableObject.putProperty(scope, "Math", Context.javaToJS(Math.class, scope));
            ScriptableObject.putProperty(scope, "$RhinobridgePluginClass", Context.javaToJS(RhinobridgePlugin.class, scope));
            ScriptableObject.putProperty(scope, "$rhinobridgePlugin", Context.javaToJS(this, scope));
            ScriptableObject.putProperty(scope, "$scope", Context.javaToJS(scope, scope));
            ScriptableObject.putProperty(scope, "$rhino", Context.javaToJS(rhino, scope));
            ScriptableObject.putProperty(scope, "$webview", Context.javaToJS(webView, scope));
            AndroidBridge androidBridge = new AndroidBridge(cordova.getActivity().getApplicationContext());
            ScriptableObject.putProperty(scope, "abg", Context.javaToJS(androidBridge, scope));
            ScriptableObject.putProperty(scope, "print", new BaseFunction() {
                @Override
                public Object call(Context cx, Scriptable scope, Scriptable thisObj, Object[] args) {
                    if (args.length > 0) {
                        String message = Context.toString(args[0]);
                        // Ejecutar console.log en el navegador
                        cordova.getActivity().runOnUiThread(() -> {
                            webView.loadUrl("javascript:console.log(" + JSONObject.quote(message) + ");");
                        });
                    }
                    return Context.getUndefinedValue();
                }
            });
            ScriptableObject.putProperty(scope, "evaluateByBrowser", new BaseFunction() {
                @Override
                public Object call(Context cx, Scriptable scope, Scriptable thisObj, Object[] args) {
                    if (args.length > 0) {
                        String code = Context.toString(args[0]);
                        // Ejecutar console.log en el navegador
                        cordova.getActivity().runOnUiThread(() -> {
                            webView.loadUrl("javascript:" + code);
                        });
                    }
                    return Context.getUndefinedValue();
                }
            });
            Object result = rhino.evaluateString(scope, script, "JavaScript", 1, null); // Ejecuta el script
            callbackContext.success(Context.toString(result)); // Retorna el resultado como string
        } catch (Exception e) {
            callbackContext.error("Error evaluando script (Rhino): " + e.getMessage());
        } finally {
            Context.exit(); // Finaliza el entorno Rhino
        }
    }
}
