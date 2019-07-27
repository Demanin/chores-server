const postgres = require('../postgres-db');

const deleteWheel = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    await postgres.wheels.delete(id);
  } catch (error) {
    console.error("Error removing wheel from DB. error="+error.message);
    res.sendStatus(500);

    return;
  }

  res.sendStatus(200);
  console.log("Deleted $wheel in DB. wheelId=" + id);
};

module.exports = deleteWheel;
