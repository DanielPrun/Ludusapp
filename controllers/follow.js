//const follow = require("../models/follow");

const Follow = require("../models/follow");
const User = require("../models/user");

//const followService = require("../services/followService");

const seguir = async (req, res) => {
    try {
        const params = req.body;
        const idUser = req.user;

        // Crear objeto con modelo follow
        let userToFollow = new Follow({
            user: idUser.id,
            followed: params.followed
        });

        // Guardar objeto en bbdd
        let followGuardat = await userToFollow.save();

        return res.status(200).send({
            status: "success",
            idUser: req.user,
            follow: followGuardat
        });


    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "No s'ha pogut seguir a l'usuari"
        });
    }
}

const deseguir = async (req, res) => {
    const userId = req.user.id;
    const followedId = req.params.id;

    await Follow.deleteOne({
        "user": userId,
        "followed": followedId
    }).then(() => {
        return res.status(200).send({
            status: "success",
            message: "s'ha deixat de seguir a l'usuari",
        });

    }).catch((error) => {
        return res.status(500).send({
            status: "error",
            message: "No s'ha pogut deixar de seguir a l'usuari",
        });
    })

}

const seguint = async (req, res) => {
    let userId = req.user.id;
    if (req.params.id) userId = req.params.id;

    let pg = 1;
    if (req.params.pg) pg = req.params.pg;

    const options = {
        select: "name password",
        page: pg,
        limit: 5,
        sort: { created_at: -1 },
        populate: [{
            path: "followed",
            select: "-password -rol -__v -email"
        }],
        collation: {
            locale: "es",
        },
    };


    const follows = await Follow.paginate({ "user": userId }, options);

    return res.status(200).send({
        status: "success",
        message: "Seguint",
        userId,
        follows: follows.docs,
        total: follows.totalDocs,
        pages: follows.totalPages,
    });
}


const followers = async (req, res) => {
    let userId = req.user.id;
    if (req.params.id) userId = req.params.id;

    let pg = 1;
    if (req.params.pg) pg = req.params.pg;

    const options = {
        select: "name password",
        page: pg,
        limit: 5,
        sort: { created_at: -1 },
        populate: [{
            path: "user",
            select: "-password -rol -__v -email"
        }],
        collation: {
            locale: "es",
        },
    };


    const follows = await Follow.paginate({ "followed": userId }, options);

    return res.status(200).send({
        status: "success",
        message: "Seguidors",
        userId,
        follows: follows.docs,
        total: follows.totalDocs,
        pages: follows.totalPages,
    });
}

const cercadorSeguint = (req, res) => {
    let cerca = req.query.nick;
    let userId = req.params.id;

    Follow.find({ user: userId })
        .populate('followed')
        .then(users => {
            const filteredUsers = users.filter(user => {
                const nick = user.followed.nick;
                const nom = user.followed.nom;
                const cognom = user.followed.cognom;
                return nick.includes(cerca) || nom.includes(cerca) || cognom.includes(cerca);
            });

            if (filteredUsers.length > 0) {
                return res.status(200).json({
                    status: "success",
                    usuaris: filteredUsers
                });
            } else {
                return res.status(404).json({
                    status: "error",
                    missatge: "Error al cercar l'usuari"
                });
            }
        })
        .catch((error) => {
            return res.status(404).json({
                status: "error",
                missatge: "Error al cercar l'usuari"
            });
        });

}

const cercadorSeguidors = (req, res) => {
    let cerca = req.query.nick;
    let userId = req.params.id;

    Follow.find({ followed: userId })
        .populate('user')
        .then(users => {
            const filteredUsers = users.filter(user => {
                const nick = user.user.nick;
                const nom = user.user.nom;
                const cognom = user.user.cognom;
                return nick.includes(cerca) || nom.includes(cerca) || cognom.includes(cerca);
            });

            if (filteredUsers.length > 0) {
                return res.status(200).json({
                    status: "success",
                    usuaris: filteredUsers
                });
            } else {
                return res.status(404).json({
                    status: "error",
                    missatge: "Error al cercar l'usuari"
                });
            }
        })
        .catch((error) => {
            return res.status(404).json({
                status: "error",
                missatge: "Error al cercar l'usuari"
            });
        });

}

module.exports = {
    seguir,
    deseguir,
    seguint,
    followers,
    cercadorSeguint,
    cercadorSeguidors
}