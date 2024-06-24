const express = require("express");
const router = express.Router();
const SessioContoller = require("../controllers/sessio");
const check = require("../middlewares/auth");


router.get("/sessions", check.auth, SessioContoller.getSessions);
router.post("/guardar", check.authEntrenador, SessioContoller.guardar);


module.exports = router; 