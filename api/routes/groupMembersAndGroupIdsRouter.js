const express = require("express");
const router = express.Router();
const groupMembersAndGroupIdsController = require("../controllers/groupMembersAndGroupIdsController");

router.get("/", groupMembersAndGroupIdsController.getAllGroupMembers);
router.post(["/create", "/new"], groupMembersAndGroupIdsController.addGroupMember);
router.get("/:id", groupMembersAndGroupIdsController.getGroupMember);
router.put("/:id", groupMembersAndGroupIdsController.updateGroupMember);
router.delete("/:id", groupMembersAndGroupIdsController.deleteGroupMember);

module.exports = router;
