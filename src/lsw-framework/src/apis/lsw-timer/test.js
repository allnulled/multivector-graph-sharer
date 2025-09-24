require(__dirname + "/lsw-timer.bundled.js");

const main = async function () {
  try {
    const out1 = Timeformat_parser.parse("1h 20min")
    const out2 = Timeformat_parser.parse("1y 2mon 5d 3h 2min 10s 15ms");
    const out3 = Timeformat_parser.parse("1h, 2h, 3h");
    const out4 = Timeformat_parser.parse("2025/01/01+00:00:00.000");
    const out5 = Timeformat_parser.parse("2025/01/01+00:00:00.000-2025/01/01+00:00:01.000");
    const out6 = Timeformat_parser.parse("2025/01/01-2028/01/01");
    const out7 = Timeformat_parser.parse("2025/01/01-2028/01/01, 2030/01/01-2033/01/01");
    console.log(out1);
    console.log(out2);
    console.log(out3);
    console.log(out4);
    console.log(out5);
    console.log(out6);
    console.log(out7);
  } catch (error) {
    console.error(error);
  }
};

main();