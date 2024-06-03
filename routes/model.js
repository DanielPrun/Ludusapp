const express = require("express");
const router = express.Router();
const ModelController = require("../controllers/model");
const check = require("../middlewares/auth");


router.get("/models", check.auth, ModelController.getModels);


module.exports = router; 