const Postgres = require('../Postgres');

const getWheel = async (req, res) => {
  const id = req.params.id;
  let result;

  try {
    result = await Postgres.Wheels.find(id);
  } catch (error) {
    console.error("Error finding wheel in DB. error=" + error.message);

    return res.sendStatus(500);
  }

  if (!result || result.length === 0) {
    console.error("Error finding wheel in DB. error=" + error.message);
    res.status(404);
    res.json({ message: "wheel not found" });

    return;
  }

  res.json(result);
};

module.exports = getWheel;
