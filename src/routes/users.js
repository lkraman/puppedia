const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController")

router.get("/users/sign_up", userController.signUp);
router.post("/users/sign_up", userController.sign_up);

module.exports = router;