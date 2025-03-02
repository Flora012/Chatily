const express = require("express");

const router = express.Router();

const messagesController = require("../controllers/messagesController");

router.get("/", messagesController.getAllMessages);

router.post(["/create", "/new"], messagesController.createMessage);

router.get("/:index", messagesController.getMessages);

module.exports = router;