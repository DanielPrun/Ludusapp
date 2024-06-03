const jwt = require("jwt-simple");
const moment = require("moment");

const secret = "ClauSecreta_Projecte_Final_Grau_DP_2024_162724";

const createToken = (user) => {
    const payload = {
        id: user._id,
        nom: user.nom,
        cognom: user.cognom,
        nick: user.nick,
        email: user.email,
        rol: user.rol,
        img: user.img,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    };

    return jwt.encode(payload, secret);
}

module.exports = {
    secret,
    createToken
}

