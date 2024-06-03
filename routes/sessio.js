const express = require("express");
const router = express.Router();
const SessioContoller = require("../controllers/sessio");
const check = require("../middlewares/auth");


router.get("/sessions", check.auth, SessioContoller.getSessions);


module.exports = router; 