const Router = require("express-promise-router");
const createWheel = require('./routes/createWheel');
const deleteWheel = require('./routes/deleteWheel');
const getAllUsers = require('./routes/getAllUsers');
const getAllWheels = require('./routes/getAllWheels');
const getWheel = require('./routes/getWheel');
const updateWheel = require('./routes/updateWheel');

const router = new Router();

router.get("/api/wheels/:id", getWheel);
router.get("/api/wheels", getAllWheels);
router.get("/api/users", getAllUsers);
router.post("/api/wheels/:id", updateWheel);
router.post("/api/wheels", createWheel);
router.delete("/api/wheels/:id", deleteWheel);

module.exports = router;
