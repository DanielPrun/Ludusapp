const express = require("express");
const router = express.Router();
const multer = require("multer");

const PublicationContoller = require("../controllers/publication");
const check = require("../middlewares/auth");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./imatges/publicacions/")
    },
    filename: (req, file, cb) => {
        cb(null, "pub-"+Date.now()+"-"+file.originalname);
    }
});

const uploads = multer({storage});

router.post("/guardar", check.auth, PublicationContoller.guardar);
router.get("/publicacio/:id", check.auth, PublicationContoller.getPubli);
router.delete("/borrar/:id", check.auth, PublicationContoller.borrar);
router.get("/user/:id/:pg?", check.auth, PublicationContoller.publiUsuari);
router.post("/pujarImg/:id", [check.auth, uploads.single("file0")], PublicationContoller.pujarImg);
router.get("/getImg/:file", PublicationContoller.getImg); 
router.get("/feed/:pg?", check.auth, PublicationContoller.feed);
router.get("/global/:pg?", PublicationContoller.getAllPublis);

module.exports = router;