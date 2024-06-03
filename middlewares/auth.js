const jwt = require("jwt-simple");
const moment = require("moment");

const libjwt = require("../services/jwt");
const secret = libjwt.secret;

const auth = (req, res, next) => {
    
    if(!req.headers.authorization){
        return res.status(403).send({
            status: "error",
            message: "Falta el authorization al headers"
        });
    }

    // netejem el token de caracters que molestin
    let token = req.headers.authorization.replace(/['"]+/g, '');

    try{
        let payload = jwt.decode(token, secret);

        // comprobem que el token segueixi vigent
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                status: "error",
                message: "Token caducat",
            });
        }

        req.user = payload;

    }catch(error){
        return res.status(404).send({
            status: "error",
            message: "Token invalid",
            error
        });
    }

    // next fa que seguim amb la execucio cridada en la ruta
    next();
}

const authAdmin = (req, res, next) => {
    
    if(!req.headers.authorization){
        return res.status(403).send({
            status: "error",
            message: "Falta el authorization al headers"
        });
    }

    // netejem el token de caracters que molestin
    let token = req.headers.authorization.replace(/['"]+/g, '');

    try{
        let payload = jwt.decode(token, secret);

        // comprobem que el token segueixi vigent
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                status: "error",
                message: "Token caducat",
            });
        }

        if(payload.rol != "rol_admin"){
            return res.status(401).send({
                status: "error",
                message: "no ets admin",
            });
        }

        req.user = payload;

    }catch(error){
        return res.status(404).send({
            status: "error",
            message: "Token invalid",
            error
        });
    }

    // next fa que seguim amb la execucio cridada en la ruta
    next();
}

const authEntrenador = (req, res, next) => {
    
    if(!req.headers.authorization){
        return res.status(403).send({
            status: "error",
            message: "Falta el authorization al headers"
        });
    }

    // netejem el token de caracters que molestin
    let token = req.headers.authorization.replace(/['"]+/g, '');

    try{
        let payload = jwt.decode(token, secret);

        // comprobem que el token segueixi vigent
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                status: "error",
                message: "Token caducat",
            });
        }

        if(payload.rol != "rol_admin" && payload.rol != "rol_entrenador"){
            return res.status(401).send({
                status: "error",
                message: "no ets admin",
            });
        }

        req.user = payload;

    }catch(error){
        return res.status(404).send({
            status: "error",
            message: "Token invalid",
            error
        });
    }

    // next fa que seguim amb la execucio cridada en la ruta
    next();
}

module.exports = {
    authAdmin,
    authEntrenador,
    auth
}