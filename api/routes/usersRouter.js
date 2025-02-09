const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

const cors = require("cors");
router.use(cors());  // It


router.get("/", usersController.getAllUsers);
router.post("/registration", usersController.createUser);
router.get("/:id", usersController.getUser);
router.delete("/:id", usersController.deleteUser);




module.exports = router;
