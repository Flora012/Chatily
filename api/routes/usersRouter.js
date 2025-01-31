const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.get("/", usersController.getAllUsers);
router.post(["/create", "/new"], usersController.createUser);
router.get("/:id", usersController.getUser);
router.delete("/:id", usersController.deleteUser);

module.exports = router;
