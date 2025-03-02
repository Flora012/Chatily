const express = require("express");
const friendshipController = require("../controllers/friendshipController");

const router = express.Router();

console.log("ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg")

router.post("/", friendshipController.createFriendRequest);


module.exports = router;

