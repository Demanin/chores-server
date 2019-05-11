const _ = require("lodash");
const db = require("./database");
const Router = require("express-promise-router");
const path = require("path");
const postgres = require("./postgres-db");

const router = new Router();

router.get("/api/wheels/:id", async (req, res) => {
  const id = req.params.id;
  let result;

  try {
    result = await postgres.wheels.find(id);
  } catch (error) {
    console.error("Error finding wheel in DB. error="+error.message);

    return res.sendStatus(500);
  }

  if (!result || result.length === 0) {
      console.error("Error finding wheel in DB. error="+error.message);
      res.status(404);
      res.json({ message: "wheel not found" });

      return;
  }

  res.json(result);
});

router.get("/api/wheels", async (req, res) => {
  let result;
  try {
    result = await postgres.wheels.all();
  } catch (error) {
    console.error("Error finding wheels in DB. error="+error.message);

    return res.sendStatus(500);
  }

  res.json(result);
});

router.post("/api/wheels", async (req, res) => {
  const title = req.body.title;
  if (!title){
      res.status(400);
      res.json({ message: "Missing title" });

      return;
  }
  if ("string" !== typeof title){
      res.status(400);
      res.json({ message: "title must be a string" });

      return;
  }
  const turnList = req.body.turnList;
  if (!turnList) {
      res.status(400);
      res.json({ message: "Missing turnList" });

      return;
  }
  const ownerId = req.body.ownerId;
  if (!ownerId) {
      res.status(400);
      res.json({ message: "Missing ownerId" });

      return;
  }
  const priority = req.body.priority;
  if (!priority) {
      res.status(400);
      res.json({ message: "Missing priority" });

      return;
  }

  const isVisible = false;

  let result;
  try {
    result = await postgres.wheels.insert({ ownerId, title, turnList, isVisible, priority });
  } catch (error) {
    console.error(
      "Error inserting wheel into DB. error="+error.message+", "
      +"title="+title+", turnList="+turnList.join()
    );
    res.status(500);
    res.json({ message: "Error creating wheel" });

    return;
  }

  console.log("Inserted wheel into DB. wheelId="+result.id);
  res.status(200);
  res.json(result);
});

router.post("/api/wheels/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const title = req.body.title;
  const isVisible = req.body.isVisible;
  if (!title){
      res.status(400);
      res.json({ message: "Missing title" });

      return;
  }
  if ("string" !== typeof title){
      res.status(400);
      res.json({ message: "title must be a string" });

      return;
  }
  if ("boolean" !== typeof isVisible){
      res.status(400);
      res.json({ message: "isVisible must be a boolean" });

      return;
  }
  const turnList = req.body.turnList;
  if (!turnList) {
      res.status(400);
      res.json({ message: "Missing turnList" });

      return;
  }
  const priority = req.body.priority;
  if (!priority) {
      res.status(400);
      res.json({ message: "Missing priority" });

      return;
  }

  let result;
  try {
    result = await postgres.wheels.find(id);
  } catch (error) {
    console.error("Error finding wheel in DB. error="+error.message);

    return res.sendStatus(500);
  }

  if (!result || result.length === 0) {
      console.error("Error finding wheel in DB. error="+error.message);
      res.status(404);
      res.json({ message: "wheel not found" });

      return;
  }

  try {
    await postgres.wheels.update({ id, title, turnList, isVisible, priority });
  } catch (error) {
    console.error("Error inserting wheel into DB. error="+error.message);
    res.status(500);
    res.json({ message: "Error updating wheel." });

    return;
  }

  console.log("Updated wheel in DB. wheelId=" + id);
  res.status(200);
  res.json({title, turnList, isVisible, id});
});

router.delete("/api/wheels/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);

  let result;
  try {
    result = await postgres.wheels.delete(id);
  } catch (error) {
    console.error("Error removing wheel from DB. error="+error.message);
    res.sendStatus(500);

    return;
  }

  res.sendStatus(200);
  console.log("Deleted $wheel in DB. wheelId=" + id);
});

module.exports = router;
