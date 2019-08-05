const Postgres = require('../Postgres');

const updateWheel = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  let result;
  try {
    result = await Postgres.Wheels.find(id);
  } catch (error) {
    console.error('Error finding wheel in DB. error=' + error.message);

    return res.sendStatus(500);
  }

  const wheel = {
    ...result,
    ...req.body,
  };

  const title = wheel.title;
  const isVisible = wheel.isVisible;
  const turnList = wheel.turnList;
  const priority = wheel.priority;
  const currentTurn = wheel.currentTurn;

  let updatedWheel;
  try {
    updatedWheel = await Postgres.Wheels.update(
      { id, title, turnList, isVisible, priority, currentTurn }
    );
  } catch (error) {
    console.error('Error updating wheel in DB. error=' + error.message);
    res.status(500);
    res.json({ message: 'Error updating wheel.' });

    return;
  }

  console.log('Updated wheel in DB. wheelId=' + id);
  res.status(200);
  res.json(updatedWheel);
};

module.exports = updateWheel;
