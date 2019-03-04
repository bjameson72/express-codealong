/* eslint-disable no-const-assign */
const express = require("express");
const shortId = require("shortid");
const moments = require("moment");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const commentData = require("../data");

// create db file if it doesn't exist
// and seed it with data
const adapter = new FileSync("db.json", {
  defaultValue: {
    comments: commentData,
  },
});

const db = lowdb(adapter);

const router = express.Router();

// routing
// get all comments
router.get("/", (req, res) => {
  let comments = db.get("comments").value();
  if (req.query.filter) {
    const filterText = req.query.filter;
    comments = comments.filter(comment => comment.text.toLowerCase().includes(filterText.toLowerCase()));
  }
  return res.json(comments);
});

// GET /comments?filter="your text here"

// get single comment
router.get("/:id", (req, res) => {
  const myComment = db
    .get("comments")
    .find({ id: req.params.id })
    .value();
  if (myComment) {
    res.json(myComment);
  } else {
    res.status(404).json({ msg: "Invalid ID" });
  }
});

// create a comment
router.post("/", (req, res) => {
  // create a new comment for the text
  // timestamp: moment()
  // id should be shortid
  if (!req.body.text) {
    res.status(400).json({
      msg: "Invalid syntax: please provide comment text",
    });
  }

  const newComment = {
    text: req.body.text,
    id: shortId.generate(),
    timestamp: moments().format(),
  };

  //   add to comment data
  // commentData.push(newComment);
  db.get("comments")
    .push(newComment)
    .write();

  // return all comments, make sure new comment included

  // BONUS: if request has no body text or text empty, send proper error code and message
  res.status(201).json({
    msg: "Comment successfully added",
    comments: db.get("comments").value(),
  });
});

router.put("/:id", (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({
      msg: "Invalid syntax: please provide comment text",
    });
  }

  if (
    !db
      .get("comments")
      .find({ id: req.params.id })
      .value()
  ) {
    return res.status(404).json({ msg: "Invalid ID" });
  }

  db.get("comments")
    .find({ id: req.params.id })
    .assign({ text: req.body.text })
    .write();

  return res.json(db.get("comments").value());
});

router.delete("/:id", (req, res) => {
  if (
    !db
      .get("comments")
      .find({ id: req.params.id })
      .value()
  ) {
    return res.status(404).json({ msg: "Invalid ID" });
  }

  db.get("comments")
    .remove({ id: req.params.id })
    .write();

  res.status(200).json({
    msg: "Comment Succesfully deleted",
    comments: db.get("comments").value(),
  });
});

module.exports = router;
