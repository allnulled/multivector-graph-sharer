npx pegjs --format globals --export-var NatyScriptParser -o naty-script-parser.js naty-script-parser.pegjs
node fix.js
node test.js
cp naty-script-parser.js /home/carlos/Escritorio/natyscript/docs/naty-script-parser.js