const express = require("express");
const router = express.Router();
const ModelController = require("../controllers/model");
const check = require("../middlewares/auth");


router.get("/models", check.auth, ModelController.getModels);
router.get("/model/:id", check.authEntrenador, ModelController.getModel);
router.post("/guardar", check.authEntrenador, ModelController.guardar);
router.put("/editar/:id", check.authEntrenador, ModelController.editar);
router.delete("/borrar/:id", check.authEntrenador, ModelController.borrar);


module.exports = router; 