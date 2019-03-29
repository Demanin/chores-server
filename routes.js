const _ = require("lodash");
const db = require("./database");
const Promise = require("bluebird");
const express = require("express");
const path = require("path");

const routes = (app) => {

    app.use(express.static(path.join(__dirname, 'client')));

    app.get("/api/wheels/:_id", Promise.coroutine(function* (req, res) {
        const _id = req.params._id;

        db.find({ _id }, (err, docs) => {
            if (err) {
                console.error("Error finding wheel in DB. error="+err.message);

                return res.sendStatus(500);
            }
            if (!docs || docs.length === 0) {
                console.error("Error finding wheel in DB. error="+err.message);
                res.status(404);
                res.json({ message: "wheel not found" });

                return;
            }

            res.json(docs[0]);
        });
    }));

    app.get("/api/wheels", Promise.coroutine(function* (req, res) {
        db.find({}, (err, docs) => {
            if (err) {
                console.error("Error finding wheel in DB. error="+err.message);

                return res.sendStatus(500);
            }

            res.json(docs);
        });
    }));

    app.post("/api/wheels", Promise.coroutine(function* (req, res) {
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

        const isVisible = false;

        db.insert({ title, turnList, isVisible }, function (err, added) {
            if (err) {
                console.error(
                  "Error inserting wheel into DB. error="+err.message+", "
                  +"title="+title+", turnList="+turnList.join()
                );
                res.status(500);
                res.json({ message: "Error creating wheel" });

                return;
            }
            console.log("Inserted wheel into DB. wheelId="+added._id);
            res.status(200);
            res.json(added);

            return;
        });
    }));

    app.post("/api/wheels/:_id", Promise.coroutine(function* (req, res) {
        const _id = req.params._id;
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

        db.find({ _id }, (err, docs) => {
            if (err) {
                console.error("Error finding wheel in DB. error="+err.message);
                res.status(500);
                res.json({ message: "Error Finding wheel" });

                return
            }
            if (!docs || docs.length === 0) {
                res.status(400);
                res.json({ message: "Wheel doesn't exists." });

                return;
            }

            db.update({ _id }, { $set: { title, turnList, isVisible } }, function (err, added) {
                if (err) {
                    console.error("Error inserting wheel into DB. error="+err.message);
                    res.status(500);
                    res.json({ message: "Error updating wheel." });

                    return;
                }
                console.log("Updated wheel in DB. wheelId="+_id);
                res.status(200);
                res.json({title, turnList, isVisible, _id});

                return;
            });
        });
    }));

    app.delete("/api/wheels/:_id", Promise.coroutine(function* (req, res) {
        const _id = req.params._id;

        db.remove({ _id }, {}, (err, numRemoved) => {
            if (err) {
                res.sendStatus(500);

                throw err;
            } else {
                res.sendStatus(200);
                console.log("Deleted $wheel in DB. wheelId="+_id);
            }
        });
    }));
};

module.exports = routes;
