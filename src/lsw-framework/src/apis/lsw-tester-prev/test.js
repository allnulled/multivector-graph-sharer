const LswTester = require(__dirname + "/lsw-tester.js");

const main = async function () {

  const test1 = await LswTester.run("Test ID", function (it) {

    console.log(1);

    it("can load the API", async function () {
      console.log(2);
      await new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 1000 * 0.5);
      })
      throw 90;
    });

  });

  const test2 = await LswTester.run("MicrodataBank API Test", function (it) {
    it.timeout(5000);
    it.only("can access the API global variable 1", function () {});
    it.never("can access the API global variable 2", function () {});
    it.always("can access the API global variable 3", function () {});
    it.normally("can access the API global variable 4", function () {});
    it("can access the API global variable 5", function () {});
  });

  const test3 = await LswTester.run("MicrodataBank API Test", function (it) {
    it.timeout(1000); // Timeout for all tests
    it.normally("can set timeout different on specific test", async function(settings) {
      settings.timeout(3000);
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      })
    });
  });

  const report1 = test1.getReportAsJson();
  const report2 = test2.getReportAsJson();
  const report3 = test3.getReportAsJson();

  console.log(report1);
  console.log(report2);
  console.log(report3);

};

main();