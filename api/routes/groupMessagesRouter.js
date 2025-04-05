
const express = require("express");
const router = express.Router();
const groupMessagesController = require("../controllers/groupMessagesController");

router.get("/", groupMessagesController.getGroupMessages);
router.post(["/create", "/new"], groupMessagesController.createGroupMessage);
router.get("/:id", groupMessagesController.getGroupMessage);
router.delete("/:id", groupMessagesController.deleteGroupMessage);
router.get("/group/:groupId", groupMessagesController.getGroupMessagesByGroupId); 

module.exports = router;
