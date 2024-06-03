const express = require("express");
const router = express.Router();

const HorariContoller = require("../controllers/horari");
const check = require("../middlewares/auth");



router.get("/get/:id", check.auth, HorariContoller.getHorari);
router.post("/guardar", check.auth, HorariContoller.guardar);

module.exports = router;