const express = require("express");
const router = express.Router();
const friendsController = require("../controllers/friendsController");

router.get("/", friendsController.getFriends);
router.post(["/create", "/new"], friendsController.createFriend);
router.get("/:index", friendsController.getFriends);


module.exports = router;
