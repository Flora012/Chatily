const express = require("express");
const groupsController = require("../controllers/groupsController");

const router = express.Router();

router.post("/", groupsController.createGroup);
router.put('/rename/:groupId', groupsController.renameGroup);
router.put('/changeDescription/:groupId', groupsController.changeGroupDescription);
router.get('/:id', groupsController.getGroup);
router.delete('/:id', groupsController.deleteGroup); 

module.exports = router;
