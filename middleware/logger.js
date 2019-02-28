// wrapper for Date, moment() gives current time
const moment = require("moment");

const logger = (req, res, next) => {
  console.log(`${req.url} I'm in the logger requested at ${moment()}`);
  next();
};

module.exports = logger;
