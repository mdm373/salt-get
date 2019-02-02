// a workaround due to being unable to install with scripts on windows
var rimraf = require("rimraf");
rimraf("dist", function () { console.log("clean done."); });