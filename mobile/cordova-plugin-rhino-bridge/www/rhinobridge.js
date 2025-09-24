var exec = require("cordova/exec");

var Rhinobridge = {
    evaluate: function (script, success, error) {
        const noop = function() {};
        const resolved = typeof success === "function" ? success : noop;
        const rejected = typeof error === "function" ? error : noop;
        exec(resolved, rejected, "Rhinobridge", "EVALUATE_JAVASCRIPT", [script]);
    }
};

module.exports = Rhinobridge;
