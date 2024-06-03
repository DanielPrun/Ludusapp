const express = require("express");
const router = express.Router();

const HistoricContoller = require("../controllers/historicHoraris");
const check = require("../middlewares/auth");



router.get("/get/:id", check.auth, HistoricContoller.getHistoric);
router.post("/guardar", check.auth, HistoricContoller.guardar);
router.get("/sessions/:id", check.auth, HistoricContoller.getSessions);
router.get("/disciplines/:id", check.auth, HistoricContoller.getDisciplines);
router.get("/exercisis/:id", check.auth, HistoricContoller.getEx);

module.exports = router;