const express = require("express");
const router = express.Router();
const multer = require("multer");
const UserContoller = require("../controllers/user");
const check = require("../middlewares/auth");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./imatges/avatars/")
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-"+Date.now()+"-"+file.originalname);
    }
});

const uploads = multer({storage});

router.post("/registre", UserContoller.registre);
router.post("/login", UserContoller.login);
router.get("/perfil/:id", check.auth, UserContoller.perfil);
router.get("/admin/:id", check.auth, UserContoller.admin);
router.get("/entrenador/:id", check.auth, UserContoller.entrenador);
router.get("/llista/:pg?", check.auth, UserContoller.llistaUsuaris);
router.put("/actualitzar", check.auth, UserContoller.actualitzar);
router.post("/pujarImg", [check.auth, uploads.single("file0")], UserContoller.pujarImg);
router.get("/avatar/:file", UserContoller.avatar); 
router.get("/contadors/:id?", check.auth, UserContoller.contadors);
router.get("/cerca/", check.auth, UserContoller.cercador);


module.exports = router;