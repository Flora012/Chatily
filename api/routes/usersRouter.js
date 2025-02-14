const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");




router.post("/", usersController.getUserForLogin);

router.get("/",usersController.getAllUsers)

router.get("/search", usersController.searchUsers);




module.exports = router;
