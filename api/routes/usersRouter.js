const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");




router.post("/", usersController.getUserForLogin);





module.exports = router;
