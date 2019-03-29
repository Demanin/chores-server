const _ = require("lodash");
const Datastore = require("nedb");
const fs = require("fs");

// Security note: the database is saved to the file `datafile` on the local filesystem. It's deliberately placed in the `.data` directory
// which doesn't get copied if someone remixes the project.
// fs.unlinkSync('.data/datafile');
const db = new Datastore({ filename: ".data/datafile", autoload: true });

db.ensureIndex({ fieldName: "name" }, function (err) {
    if (err) {
        console.error("Error setting up index on name");
        console.error(err.message);
    } else {
        console.log("🛠 Built index on name");
    }
});

db.ensureIndex({ fieldName: "turnId" }, function (err) {
    if (err) {
        console.error("Error setting up index on turnId");
        console.error(err.message);
    } else {
        console.log("🛠 Built index on turnId");
    }
});

db.ensureIndex({ fieldName: "turnList" }, function (err) {
    if (err) {
        console.error("Error setting up index on turnList");
        console.error(err.message);
    } else {
        console.log("🛠 Built index on turnList");
    }
});

db.count({}, (err, count) => {
    if (err) {
        console.error(err);
    } else {
        console.info("DB currently has "+count+" wheels");
    }
});

module.exports = db;
