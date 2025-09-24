#!/usr/bin/env node
npx pegjs -o weeklang.js --format globals --export-var WeekLang weeklang.pegjs
node fix.js
node test.js