return LswTestRegistry.collect("can use MicrodataBank API", async function (test) {

  const shared = {
    banks: {},
    settings: {},
  };

  test("can find MicrodataBank API global", async function () {
    try {
      console.log("can find microdatabank api global test");
      $ensure.id({ LswMicrodataBank }).type("function");
      $ensure.id({ create: LswMicrodataBank.create }).type("function");
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  test("can make instances of MicrodataBank", async function () {
    try {
      console.log("can make instances of MicrodataBank");
      shared.banks.one = LswMicrodataBank.create();
      shared.banks.two = LswMicrodataBank.create();
      shared.banks.three = LswMicrodataBank.create();
      $ensure.id({ bankOne: shared.banks.one }).type("object").to.be.instanceOf(LswMicrodataBank);
      $ensure.id({ bankTwo: shared.banks.two }).type("object").to.be.instanceOf(LswMicrodataBank);
      $ensure.id({ bankThree: shared.banks.three }).type("object").to.be.instanceOf(LswMicrodataBank);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  test("can use insert from MicrodataBank instances", async function () {
    try {
      console.log("can use insert from MicrodataBank instances");
      await shared.banks.one.insert("random type", { item: 1 });
      await shared.banks.one.insert("random type", { item: 2 });
      await shared.banks.one.insert("random type", { item: 3 });
      await shared.banks.one.insert("random type", { item: 4 });
      $ensure.id({ bankThree: shared.banks.three }).type("object").to.be.instanceOf(LswMicrodataBank);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  test("can use select from MicrodataBank instances", async function () {
    try {
      console.log("can use select from MicrodataBank instances");
      const allRandoms = await shared.banks.one.select("random type");
      $ensure.id({ allRandoms }).to.be.array().its("length").to.be.greaterThan(0);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  test("can use update from MicrodataBank instances", async function () {
    try {
      console.log("can use update from MicrodataBank instances");
      await shared.banks.one.update("random type", it => it.item === 1);
      const matched = await shared.banks.one.selectFirst("random type", it => it.item === 1);
      $ensure.id({ matched }).type("object").its("item").is(1);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

});