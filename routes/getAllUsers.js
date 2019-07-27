const postgres = require('../postgres-db');

const getAllUsers = async (req, res) => {
  let result;
  try {
    result = await postgres.users.all();
  } catch (error) {
    console.error("Error finding users in DB. error="+error.message);

    return res.sendStatus(500);
  }

  res.json(result);
};

module.exports = getAllUsers;
