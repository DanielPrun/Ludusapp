const fs = require("fs");
const path = require("path");
const { validarArticle } = require("../helpers/validar")
const Article = require("../models/article");

const crear = async (req, res) => {
    try {

        let params = req.body;
        
        // validacions de dades
        validarArticle(params);
        
        //guardem l'article
        
        const article = new Article(params);
        const articleGuardat = await article.save();
        
        return res.status(200).json({
            status: "success",
            article: articleGuardat
        });


    } catch (error) {
        return res.status(400).json({
            status: "error",
            missatge: "falten dades"
        })
    }
}

const getArticles = (req, res) => {
    let consulta = Article.find({}).sort({ data: -1 });
   
    if (req.query.ultimos) {
        console.log(req.params);
        consulta.limit(4);
    }
    
    consulta.then((articles) => {

        return res.status(200).send({
            status: "success",
            articles
        })

    }).catch((error) => {
        return res.status(404).json({
            status: "error",
            missatge: "No s'han trobat articles"
        });
    });
}

const getArticle = (req, res) => {
    // Recollir un id per la url
    let id = req.params.id;

    Article.findById(id).then((article) => {

        return res.status(200).json({
            status: "success",
            article
        });

    }).catch((error) => {
        return res.status(404).json({
            status: "error",
            missatge: "No s'ha trobat l'article"
        });
    });
}

const borrar = (req, res) => {

    let articleId = req.params.id;

    Article.findOneAndDelete({ _id: articleId }).then((articleBorrat) => {

        return res.status(200).json({
            status: "success",
            article: articleBorrat,
            missatge: "borrar"
        });

    }).catch((error) => {
        return res.status(500).json({
            status: "error",
            missatge: "Error al borrar l'article"
        });
    });

}

const editar = (req, res) => {

    let articleId = req.params.id;
    let params = req.body;

    Article.findOneAndUpdate({ _id: articleId }, params, { new: true }).then((articleActualitzat) => {

        return res.status(200).json({
            status: "success",
            article: articleActualitzat
        });

    }).catch((error) => {
        return res.status(500).json({
            status: "error",
            missatge: "Error al actualitzar"
        });
    });

}

const upload = (req, res) => {

    if (!req.file && !req.files) {
        return res.status(404).json({
            status: "error",
            missatge: "solicitud invalida"
        });
    }

    let nomFile = req.file.originalname;

    let file_split = nomFile.split("\.");
    let file_ext = file_split[1].toLowerCase();

    if (file_ext != "png" && file_ext != "jpg" && file_ext != "gif" && file_ext != "jpeg") {

        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                missatge: "imatge invalida"
            });
        })

    } else {

        let articleId = req.params.id;
        // Validar dades
        
        Article.findOneAndUpdate({ _id: articleId }, {img: req.file.filename}, { new: true }).then((articleActualitzat) => {

            return res.status(200).json({
                status: "success",
                article: articleActualitzat
            });

        }).catch((error) => {
            return res.status(500).json({
                status: "error",
                missatge: "Error al actualitzar"
            });
        });

        
    }
}

const img = (req, res) => {
    let file = req.params.file;
    let path_fisic = "./imatges/articles/"+file;

    fs.stat(path_fisic, (error, exists) =>{
        if(exists){
            return res.sendFile(path.resolve(path_fisic));
        }else{
            return res.status(404).json({
                status: "error",
                missatge: "la imatge no existeix"
            })
        }
    })
}

const cercador = (req, res) => {
    let cerca = req.query.text;
    let tags = req.query.tags;

    let query = {
        "$or": [
          { "titol": { "$regex": cerca, "$options": "i" } },
          { "contingut": { "$regex": cerca, "$options": "i" } }
        ]
      };
      
      if (tags.length > 0) {
        tags = tags.split(',');
        query["$and"] = [
          { "tag": { "$in": tags } }
        ];
      }

    Article.find(query)
    .sort({data: -1})
    .then((articlesTrobats) => {

        return res.status(200).json({
            status: "success",
            articles: articlesTrobats
        }); 
        
    }).catch((error) => {
        return res.status(404).json({
            status: "error",
            missatge: "Error al cercar l'altricle"
        });
    });
}

module.exports = {
    crear,
    getArticles,
    getArticle,
    borrar,
    editar,
    upload,
    img,
    cercador
}

