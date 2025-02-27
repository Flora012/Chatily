
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware")


router.get("/", authMiddleware.CheckToken);

module.exports = router;

