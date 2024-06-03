const express = require("express");
const router = express.Router();
const ExerciciContoller = require("../controllers/exercici");
const check = require("../middlewares/auth");



router.get("/exercisis", check.auth, ExerciciContoller.getExercisis);

module.exports = router; 