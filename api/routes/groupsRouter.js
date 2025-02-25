const express = require("express");
const router = express.Router();
const groupsController = require("../controllers/groupsController");

router.get("/", groupsController.getGroups);
router.post(["/create", "/new"], groupsController.createGroup);
router.get("/:id", groupsController.getGroup);
router.delete("/:id", groupsController.deleteGroup);


module.exports = router;
