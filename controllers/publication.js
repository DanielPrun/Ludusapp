const fs = require("fs");
const path = require("path");

const Publication = require("../models/publication");
const followService = require("../services/followService");
const publication = require("../models/publication");


const guardar = async (req, res) => {
    try{
        const params = req.body;

        if (!params.text) return res.status(400).send({ status: "error", "message": "has de posar contingut a la publicació" });

        let publicacio = new Publication(params);
        publicacio.user = req.user.id;

        let publicacioGuardada = await publicacio.save();

        if (!publicacioGuardada){
            
            return res.status(400).send({ 
                status: "error", 
                message: "No se ha guardat la publicació." 
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Publicació guardada",
            publicacioGuardada
        });
   
    } catch (error){

        return res.status(400).send({ 
            status: "error", 
            message: "No s'ha guardat la publicació." 
        });
    }
}

const getPubli = (req, res) => {
    const publicationId = req.params.id;

    Publication.findById(publicationId)
        .then( (publiGuardada) => {

            if (!publiGuardada) {
                return res.status(404).send({
                    status: "error",
                    message: "No existeix la publicació"
                })
            }

            return res.status(200).send({
                status: "success",
                message: "Mostrar publicació",
                publication: publiGuardada
            });

        }).catch ((error) => {
            return res.status(404).send({
                status: "error",
                message: "error al buscar la publicació"
            })
        });
}

const borrar = (req, res) => {
    const publicationId = req.params.id;

    Publication.findOneAndDelete({ _id: publicationId })
    .then((publiBorrada) => {

        return res.status(200).json({
            status: "success",
            article: publiBorrada,
            missatge: "borrar"
        });

    }).catch((error) => {
        return res.status(500).json({
            status: "error",
            missatge: "Error al borrar la publicació"
        });
    });

}

const publiUsuari = async (req, res) => {
    const userId = req.params.id;

    let pg = 1;
    if (req.params.pg) pg = req.params.pg
  
    const options = {
        page: pg,
        limit: 5,
        sort: { created_at: -1 },
        populate: [{
            path: "user",
            select: "-password -__v -rol -email"
        }],
        collation: { 
            locale: "es",
        },
    };

    const publis = await Publication.paginate({ user: userId }, options);

    return res.status(200).send({
        status: "success",
        message: "Publicacions del usuari",
        pg,
        total: publis.totalDocs,
        pages: publis.totalPages,
        publications: publis.docs,

    });
        
}

const pujarImg = async (req, res) => {
    const publicationId = req.params.id;

    if (!req.file) {
        return res.status(404).send({
            status: "error",
            message: "falta el file"
        });
    }

    let img = req.file.originalname;
    let extensio = img.split("\.");
    extensio = extensio[1];
    extensio = extensio.toLowerCase();
    //si el file no es una imatge el borrem
    if (extensio != "png" && extensio != "jpg" && extensio != "jpeg" && extensio != "gif") {
        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath);

        return res.status(400).send({
            status: "error",
            message: "format del fitxer incorrecte"
        });
    }

    //si la extensio es correcta guardem el nom a la bdd
    try {
        let publiActualitzada = await Publication.findOneAndUpdate( {_id: publicationId} , { img: req.file.filename }, { new: true });
        if (!publiActualitzada) {
            return res.status(500).send({
                status: "error",
                message: "Error en la pujada de la imatge",
                error: error.message
            });
        }

        return res.status(200).send({
            status: "success",
            publi: publiActualitzada,
            file: req.file,
        });

    } catch (error) {
        return res.status(400).send({
            status: "error",
            message: "Error al trobar la publicació",
        });
    }
}

const getImg = (req, res) => {
    const filePath = "./imatges/publicacions/" + req.params.file;

    fs.stat(filePath, (error, exists) => {

        if (!exists) {
            return res.status(404).send({
                status: "error",
                message: "No existeix la imatge"
            });
        }

        return res.sendFile(path.resolve(filePath));
    });

}

const feed = async (req, res) => {
    let pg = 1;
    if (req.params.pg) {
        pg = req.params.pg;
    }

    try {
        //busquem publicacions les cuals tinguin un id dintre dels ids de usuaris que segueixo
        const Follows = await followService.followUserIds(req.user.id);
       
        const options = {
            page: pg,
            limit: 6,
            sort: { created_at: -1 },
            populate: [{
                path: "user",
                select: "-password -rol -__v -email"
            }],
            collation: {
                locale: "es",
            },
        };

        const publicacions = await Publication.paginate({ user: Follows.seguint }, options);

        return res.status(200).send({
            status: "success",
            message: "Feed de publicacions",
            seguint: Follows.seguint,
            total: publicacions.totalDocs,
            pg,
            pages: publicacions.totalPages,
            publications: publicacions.docs
        });
        

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: "error",
            message: "Error al obtenir usuaris que segueixes",
        });
    }

}

const getAllPublis = (req, res) => {
    let pg = 1;
    if (req.params.pg) {
        pg = req.params.pg;
    }
    pg = parseInt(pg);

    const options = {
        page: pg,
        limit: 6,
        sort: { created_at: -1 },
        populate: [{
            path: "user",
            select: "-password -rol -__v -email"
        }],
        
        collation: {
            locale: "es",
        },
    };

    Publication.paginate({}, options)
        .then(async (result) => {
            if (!result) {
                return res.status(404).send({
                    status: "error",
                    message: "No hi ha publicacions",
                    error
                });
            }


            return res.status(200).send({
                status: "success",
                publications: result.docs,
                pg,
                itemsPerPage: 6,
                total: result.totalDocs,
                pages: Math.ceil(result.totalDocs / 6),
            });

        }).catch((error) => {
            return res.status(500).send({
                status: "error",
                message: "error al llistar publicacions",
                error
            });
        });
}

module.exports = {
    guardar,
    getPubli,
    borrar,
    publiUsuari,
    pujarImg,
    getImg,
    feed,
    getAllPublis
}