print_time() {
    local current_time
    current_time=$(date +"%T")
    echo "$current_time"
}

MANAGE_PLUGINS=false

echo "[*] $(print_time): Reconstruyendo app para móvil:"
cd "$(dirname "$0")"

echo "  [*] $(print_time): Limpiando directorio de aplicación..."
rm -rf www/*
echo "  [*] $(print_time): Re-importando aplicación..."
cp -R ../../docs/* www

echo "  [*] $(print_time): Quitando plugin rhinobridge..."
npx cordova plugin rm cordova-plugin-rhinobridge

if [ "$MANAGE_PLUGINS" = true ]; then
  echo "  [*] $(print_time): Quitando plugins y plataforma android..."
  npx cordova plugin rm cordova-plugin-android-permissions
  npx cordova plugin rm cordova-plugin-background-mode
  npx cordova plugin rm cordova-plugin-device
  npx cordova plugin rm cordova-plugin-local-notification
fi

npx cordova platform rm android

if [ "$MANAGE_PLUGINS" = true ]; then
  echo "  [*] $(print_time): Añadiendo plugins y plataforma android..."
  npx cordova plugin add cordova-plugin-android-permissions
  npx cordova plugin add cordova-plugin-background-mode
  npx cordova plugin add cordova-plugin-device
  npx cordova plugin add cordova-plugin-local-notification
fi

npx cordova plugin add cordova-plugin-rhinobridge

echo "  [*] $(print_time): Añadiendo plugin de rhinobridge..."
npx cordova plugin add ../cordova-plugin-rhino-bridge

echo "  [*] $(print_time): Añadiendo plataforma android..."
npx cordova platform add android

echo "  [*] $(print_time): Reconstruyendo plataforma de android..."
npx cordova build android

echo "  [*] $(print_time): La aplicación fue compilada correctamente."
cp ./platforms/android/app/build/outputs/apk/debug/app-debug.apk ../lsw-one.apk
echo "  [*] $(print_time): La aplicación fue exportada correctamente."
