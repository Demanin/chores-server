const Postgres = require('../Postgres');

const getAllWheels = async (req, res) => {
  let result;
  try {
    result = await Postgres.Wheels.all();
  } catch (error) {
    console.error("Error finding wheels in DB. error=" + error.message);

    return res.sendStatus(500);
  }

  res.json(result);
};

module.exports = getAllWheels;
