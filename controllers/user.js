const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const User = require("../models/user");

const Follow = require("../models/follow");
const Publication = require("../models/publication");

const jwt = require("../services/jwt");
const followService = require("../services/followService");
/*
const validate = require("../helpers/validate");
*/

const registre = (req, res) => {
    let params = req.body;
    // validar dades
    if (!params.nom || !params.email || !params.password || !params.nick) {
        return res.status(400).json({
            status: "error",
            message: "Falten dades",
        });
    }
    /*
    try{
        validate(params);
    }catch(error){
        return res.status(400).json({
            status: "error",
            message: "error dades incorrectes",
        });
    }
    */
    // usuaris duplicats
    User.find({
        $or: [
            { email: params.email.toLowerCase() },
            { nick: params.nick.toLowerCase() }
        ]
    }).then(async (users) => {

        if (users && users.length >= 1) {
            return res.status(400).send({
                status: "error",
                message: "L'usuari ja existeix, canvia el email o el nick"
            });
        }

        // xifrem la pass
        let pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;

        let usuariAGuardar = new User(params);

        usuariAGuardar.save().then((usuariGuardat) => {

            usuariGuardat.toObject();
            delete usuariGuardat.password;
            delete usuariGuardat.rol;

            return res.status(200).json({
                status: "success",
                message: "Usuari registrat correctament",
                user: usuariGuardat
            });

        }).catch((error) => {
            return res.status(500).json({ status: "error", message: "Error al guardar l'usuari" });
        });;

    }).catch((error) => {
        return res.status(500).json({ status: "error", message: "Error en la consulta d'usuaris" });
    });
}

const login = (req, res) => {
    let params = req.body;

    if (!params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "Falten dades per enviar"
        });
    }

    User.findOne({ email: params.email })
        .then((usuari) => {

            if (!usuari) return res.status(404).send({ status: "error", message: "No existeix l'usuari" });

            // Comprobem password
            const pwd = bcrypt.compareSync(params.password, usuari.password);

            if (!pwd) {
                return res.status(400).send({
                    status: "error",
                    message: "contrasenya incorrecta"
                })
            }

            const token = jwt.createToken(usuari);

            return res.status(200).send({
                status: "success",
                message: "Identificat correctament",
                usuari: {
                    id: usuari._id,
                    nom: usuari.nom,
                    nick: usuari.nick
                },
                token
            });
        }).catch((error) => {
            return res.status(404).send({ status: "error", message: "No existeix l'usuari" });
        });
}

const perfil = (req, res) => {
    const id = req.params.id;

    User.findById(id)
        .select({ password: 0, rol: 0 })
        .then(async (perfil) => {
            if (!perfil) {
                return res.status(404).send({
                    status: "error",
                    message: "El usuari no existeix"
                });
            }

            const followInfo = await followService.followUserIds(req.user.id);

            return res.status(200).send({
                status: "success",
                user: perfil,
                seguint: followInfo.seguint
            });

        }).catch((error) => {
            return res.status(404).send({
                status: "error",
                message: "hi ha hagut un error en buscar l'usuari"
            });
        });

}

const admin = (req, res) => {
    const id = req.params.id;

    User.findById(id)
        .select({ password: 0 })
        .then(async (perfil) => {
            if (!perfil) {
                return res.status(404).send({
                    status: "error",
                    message: "El usuari no existeix"
                });
            }
            if(perfil.rol == "rol_admin"){
                return res.status(200).send({
                    status: "success",
                    result: true,
                });
            }
            else {
                return res.status(200).send({
                    status: "success",
                    result: false,
                });
            }

        }).catch((error) => {
            return res.status(404).send({
                status: "error",
                message: "hi ha hagut un error en buscar l'usuari"
            });
        });

}

const entrenador = (req, res) => {
    const id = req.params.id;

    User.findById(id)
        .select({ password: 0 })
        .then(async (perfil) => {
            if (!perfil) {
                return res.status(404).send({
                    status: "error",
                    message: "El usuari no existeix"
                });
            }

            if(perfil.rol == "rol_entrenador"){
                return res.status(200).send({
                    status: "success",
                    result: true,
                });
            }
            else {
                return res.status(200).send({
                    status: "success",
                    result: false,
                });
            }

        }).catch((error) => {
            return res.status(404).send({
                status: "error",
                message: "hi ha hagut un error en buscar l'usuari"
            });
        });

}



const llistaUsuaris = (req, res) => {
    let pg = 1;
    if (req.params.pg) {
        pg = req.params.pg;
    }
    pg = parseInt(pg);

    const options = {
        page: pg,
        limit: 10,
        sort: { _id: 1 },
        select: "-password -__v -rol -email"
    };

    User.paginate({}, options)
        .then(async (result) => {
            if (!result) {
                return res.status(404).send({
                    status: "error",
                    message: "No hi ha usuaris",
                    error
                });
            }

            let followUserIds = await followService.followUserIds(req.user.id);

            return res.status(200).send({
                status: "success",
                users: result.docs,
                pg,
                itemsPerPage: 10,
                total: result.totalDocs,
                pages: Math.ceil(result.totalDocs / 10),
                seguint: followUserIds.seguint,
                seguidors: followUserIds.seguidors
            });

        }).catch((error) => {
            return res.status(500).send({
                status: "error",
                message: "error al llistar usuaris",
                error
            });
        });
}

const actualitzar = (req, res) => {
    let usuariActual = req.user;
    let usuariActualitzar = req.body;

    User.find({
        $or: [
            { email: usuariActualitzar.email.toLowerCase() },
            { nick: usuariActualitzar.nick.toLowerCase() }
        ]
    }).then(async (users) => {

        //comprobem si els usuaris que retorna el find no son l'usuari actual, en tal cas el email i/o el nick ja estarien en ús
        let userExists = false;
        users.forEach(user => {
            if (user && user._id != usuariActual.id) userExists = true;
        });

        if (userExists) {
            return res.status(200).send({
                status: "success",
                message: "el email o el nick ja existeixen"
            });
        }
        if (usuariActualitzar.password) {
            let pwd = await bcrypt.hash(usuariActualitzar.password, 10);
            usuariActualitzar.password = pwd;

        }else{
            //quan no s'envia una contrasenya la treiem del objecte per evitar que es sobreescrigui a la bdd
            delete usuariActualitzar.password;
        }

        try {
            let usuariActualitzat = await User.findByIdAndUpdate({ _id: usuariActual.id }, usuariActualitzar, { new: true });

            if (!usuariActualitzat) {
                return res.status(400).json({ status: "error", message: "Error al actualizar" });
            }

            return res.status(200).send({
                status: "success",
                message: "Metodo de actualizar usuario",
                user: usuariActualitzat
            });

        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: "Error al actualizar",
            });
        }

    }).catch((error) => {
        return res.status(500).json({ status: "error", message: "Error en la consulta de usuarios" });
    });
}

const pujarImg = async (req, res) => {

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
            message: "format del file incorrecte"
        });
    }

    //si la extensio es correcta guardem el nom a la bdd
    try {
        let usuariActualitzat = await User.findOneAndUpdate({ _id: req.user.id }, { img: req.file.filename }, { new: true });
        if (!usuariActualitzat) {
            return res.status(500).send({
                status: "error",
                message: "Error en la pujada de la imatge",
                user: req.user,
                error: error.message
            });
        }

        return res.status(200).send({
            status: "success",
            user: usuariActualitzat,
            file: req.file,
        });

    } catch (error) {
        return res.status(400).send({
            status: "error",
            message: "Error al trobar l'usuari",
            user: req.user,
            error: error.message
        });
    }
}

const avatar = (req, res) => {
    const filePath = "./imatges/avatars/" + req.params.file;

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

const contadors = async (req, res) => { 
    let userId = req.user.id; 
    if (req.params.id) { 
        userId = req.params.id; 
    } 
    try { 
        const myFollows = await followService.followUserIds(req.user.id); 
        const publications = await Publication.find({ "user": userId });        
          
        return res.status(200).send({ 
            userId, 
            following: myFollows.seguint.length, 
            followed: myFollows.seguidors.length, 
            publications: publications.length 
        }); 
    
    } catch (error) { 
        
        return res.status(500).send({ 
            status: "error", 
            message: "Error en els contadors", 
            error 
        }); 
    } 
}

const cercador = (req, res) => {
    let cerca = req.query.nick;
    
    let query = {
        "$or": [
          { "nick": { "$regex": cerca, "$options": "i" } },
          { "nom": { "$regex": cerca, "$options": "i" } },
          { "cognom": { "$regex": cerca, "$options": "i" } }
        ]
      };
      

    User.find(query)
    .then((UsuarisTrobats) => {

        return res.status(200).json({
            status: "success",
            usuaris: UsuarisTrobats
        }); 
        
    }).catch((error) => {
        return res.status(404).json({
            status: "error",
            missatge: "Error al cercar els usuaris"
        });
    });
}

module.exports = {
    registre,
    login,
    perfil,
    admin,
    entrenador,
    llistaUsuaris,
    actualitzar,
    pujarImg,
    avatar,
    contadors,
    cercador
}