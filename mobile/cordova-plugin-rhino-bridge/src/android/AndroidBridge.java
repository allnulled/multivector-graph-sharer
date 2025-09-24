package com.allnulled.rhinobridge;

import android.content.Context;
import android.widget.Toast;

public class AndroidBridge {

    private final Context context;

    public AndroidBridge(Context context) {
        this.context = context;
    }

    public Context getContext() {
        return context;
    }

    public Object getSystemService(String name) {
        return context.getSystemService(name);
    }

    public Class<?> getClass(String name) throws ClassNotFoundException {
        try {
            return Class.forName(name);
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("Class not found: " + name, e);
        }
    }

    public Class<?> forName(String name) throws ClassNotFoundException {
        return this.getClass(name);
    }

    public void toast(String text, int duration) {
        Toast.makeText(context, text, duration).show();
    }

    public String getPackageName() {
        return context.getPackageName();
    }

    public Object getApplicationInfo() {
        return context.getApplicationInfo();
    }

    public Object getResources() {
        return context.getResources();
    }

    public Object getAssets() {
        return context.getAssets();
    }

    public Object getContentResolver() {
        return context.getContentResolver();
    }

    public Object getApplicationContext() {
        return context.getApplicationContext();
    }

    // También puedes añadir más helpers aquí si lo deseas
}
