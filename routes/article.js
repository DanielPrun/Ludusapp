const express = require("express");
const multer = require("multer");
const ArticleController = require("../controllers/article");
const check = require("../middlewares/auth");

const router = express.Router();

const emmagatzematge = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './imatges/articles/');
    },
    filename: function(re, file, cb){
        cb(null, "article" + Date.now() + file.originalname);
    }
});

const pujades = multer({storage: emmagatzematge});

router.post("/crear", check.authAdmin, ArticleController.crear);
router.get("/articles/:pagina?", ArticleController.getArticles);
router.get("/article/:id", ArticleController.getArticle);
router.delete("/article/:id", check.authAdmin, ArticleController.borrar);
router.put("/article/:id", check.authAdmin, ArticleController.editar);
router.post("/upload-img/:id",[check.authAdmin, pujades.single("file0")], ArticleController.upload);
router.get("/img/:file", ArticleController.img);
router.get("/cerca/:pagina?", ArticleController.cercador);

module.exports = router;