const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController")

router.get("/", authController.getUsers);

router.post("/",authController.createUser);

router.post("/", usersController.searchUsers);

router.post("/", authController.searchUsers);




module.exports = router;
