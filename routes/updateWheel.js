const Postgres = require('../Postgres');

const updateWheel = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const title = req.body.title;
  const isVisible = req.body.isVisible;
  if (!title){
    res.status(400);
    res.json({ message: 'Missing title' });

    return;
  }
  if ('string' !== typeof title){
    res.status(400);
    res.json({ message: 'title must be a string' });

    return;
  }
  if ('boolean' !== typeof isVisible){
    res.status(400);
    res.json({ message: 'isVisible must be a boolean' });

    return;
  }
  const turnList = req.body.turnList;
  if (!turnList) {
    res.status(400);
    res.json({ message: 'Missing turnList' });

    return;
  }
  if (!req.body.hasOwnProperty('priority')) {
    res.status(400);
    res.json({ message: 'Missing priority' });

    return;
  }

  let result;
  try {
    result = await Postgres.Wheels.find(id);
  } catch (error) {
    console.error('Error finding wheel in DB. error=' + error.message);

    return res.sendStatus(500);
  }

  let updatedWheel;
  try {
    const priority = parseInt(req.body.priority, 10);
    const currentTurn = parseInt(req.body.currentTurn, 10);
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
