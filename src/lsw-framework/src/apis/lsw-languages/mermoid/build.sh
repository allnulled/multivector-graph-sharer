#!/usr/bin/env node
npx pegjs -o mermoid.js --format globals --export-var MermoidParser mermoid.pegjs
node fix.js
node test.js