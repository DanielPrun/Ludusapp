const express = require("express");
const router = express.Router();
const ExerciciContoller = require("../controllers/exercici");
const check = require("../middlewares/auth");



router.get("/exercisis", ExerciciContoller.getExercisis);
router.post("/guardar", check.authEntrenador, ExerciciContoller.guardar);

module.exports = router; 
