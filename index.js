require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const commentsRouter = require("./routes/comments");

const app = express();

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// set up middleware
// body parser middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

// cors middleware
app.use(cors());

// logger middleware
// app.use(logger);

// middleware
app.use(express.static(path.join(__dirname, "public")));

// routing middleware
app.use("/api/comments", commentsRouter);

const { PORT } = process.env || 5000;

// everytime server starts up
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
