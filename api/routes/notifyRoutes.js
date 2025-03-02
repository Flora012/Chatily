const express = require("express");
const { getNotifications } = require("../controllers/notifyController");

const router = express.Router();

console.log("oksikaaaaaa")

router.post("/", getNotifications);

module.exports = router;
