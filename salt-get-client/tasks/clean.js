var rimraf = require("rimraf");
rimraf("dist", function () { console.log("clean done."); });