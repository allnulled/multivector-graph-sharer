const fs = require("fs");
const path = require("path");
const urlsList = [];
const baseDir = path.resolve(__dirname + "/..");
const casesDir = __dirname + "/cases";
const findCasePriority = function(caseName) {
  const casePos = testsPriority.indexOf(caseName);
  return casePos === -1 ? 9999 : casePos;
}
const testsPriority = [
  "framework",
  "framework/lsw.can-find-all-globals.js",
  "framework/lsw-volatile-database.can-crud.js",
  "framework/lsw-volatile-database.can-load.js",
  "app/start-your-test-here.js",
];
const findTestPriority = function(caseName) {
  const testPos = testsPriority.indexOf(caseName);
  return testPos === -1 ? 9999 : testPos;
};
const casesNames = fs.readdirSync(casesDir).sort((a,b) => {
  const posA = findCasePriority(a);
  const posB = findCasePriority(b);
  return posB < posA ? 1 : -1;
});
for(let indexCase=0; indexCase<casesNames.length; indexCase++) {
  const caseName = casesNames[indexCase];
  const testNames = fs.readdirSync(`${casesDir}/${caseName}`);
  const testNamesSorted = testNames.sort((a,b) => {
    const posA = findTestPriority(caseName + "/" + a);
    const posB = findTestPriority(caseName + "/" + b);
    return posB < posA ? 1 : -1;
  });
  for(let indexTest=0; indexTest<testNames.length; indexTest++) {
    const testName = testNames[indexTest];
    const fullPath = `${casesDir}/${caseName}/${testName}`;
    const relativePath = fullPath.replace(baseDir, "assets");
    const id = path.basename(relativePath).replace(/\.js$/g, "");
    urlsList.push({
      id: "lsw.test." + caseName + "." + id,
      fromUrl: relativePath
    });
  }
}
const urls = {
  "id": "lsw.test",
  "fromCollection": urlsList
};
fs.writeFileSync(__dirname + "/urls.json", JSON.stringify(urls, null, 2), "utf8");