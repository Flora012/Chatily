const express = require("express");
const router = express.Router();


const authController = require("../controllers/authController")

router.get("/", authController.getUsers);

router.post("/",authController.createUser);




module.exports = router;
