const express = require("express");
const router = express.Router();
const validation = require("./validation");
const userController = require("../controllers/userController")
const User = require("../../src/db/models").User;


router.get("/users/sign_up", userController.signUp);
router.post("/users/sign_up", userController.create);

module.exports = router;

