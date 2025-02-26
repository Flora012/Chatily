const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const authRepository = require("../repositories/authRepository");
const authController = require("../controllers/authController")




router.post("/", usersController.getUserForLogin);

router.get("/",usersController.getAllUsers)

router.post("/", authController.searchUsers);




module.exports = router;
