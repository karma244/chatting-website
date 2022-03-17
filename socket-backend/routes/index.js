const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send({ response: "You can't come in here." }).status(200);
});

module.exports = router