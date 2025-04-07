
const express = require("express");
const router = express.Router();
const groupMessagesController = require("../controllers/groupMessagesController");

router.post("/create", groupMessagesController.createGroupMessage);
router.get("/group/:groupId", groupMessagesController.getGroupMessagesByGroupId); 
//router.get("/", groupMessagesController.getGroupMessages);
//router.get("/:id", groupMessagesController.getGroupMessage);
//router.delete("/:id", groupMessagesController.deleteGroupMessage);

module.exports = router;
