const express = require("express");
const shortId = require("shortid");
const moments = require("moment");
const commentData = require("../data");

const router = express.Router();

// routing
// get all comments
router.get("/", (req, res) => {
  res.json(commentData);
});

// get single comment
router.get("/:id", (req, res) => {
  const myComment = commentData.find(comment => comment.id === parseInt(req.params.id));
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
  commentData.push(newComment);

  // return all comments, make sure new comment included

  // BONUS: if request has no body text or text empty, send proper error code and message
  res.status(201).json({ msg: "Comment successfully added", comments: commentData });
});

router.put("/:id", (req, res) => {
  if (!req.body.text) {
    res.status(400).json({
      msg: "Invalid syntax: please provide comment text",
    });
  }

  const myComment = commentData.find(comment => comment.id === parseInt(req.params.id));

  if (myComment) {
    const newComment = {
      text: req.body.text,
      id: parseInt(req.params.id),
      timestamp: moments().format(),
    };
    const indexComment = commentData.indexOf(myComment);
    commentData.splice(indexComment, 1, newComment);
    res.json(commentData);
  } else {
    res.status(404).json({ msg: "Invalid ID" });
  }
});

router.delete("/:id", (req, res) => {
  const myComment = commentData.find(comment => comment.id === parseInt(req.params.id));
  const indexComment = commentData.indexOf(myComment);
  commentData.splice(indexComment, 1);
  // console.log(commentData);
  res.json(commentData);
});

module.exports = router;
