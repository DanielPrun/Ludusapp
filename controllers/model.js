const Model = require("../models/model");

const getModels = (req, res) => {
    let consulta = Model.find({});

    consulta.then((models) => {

        return res.status(200).send({
            status: "success",
            models
        })

    }).catch((error) => {
        return res.status(404).json({
            status: "error",
            missatge: "No s'han trobat models"
        });
    });
}


module.exports = {
    getModels
}