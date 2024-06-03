const Exercici = require("../models/exercici");


const getExercisis = (req, res) => {
    
    const ids = JSON.parse(req.query.ids)
    
    let consulta = Exercici.find({ _id: { $in: ids } });
    
    consulta.then((exercisis) => {

        return res.status(200).send({
            status: "success",
            exercisis
        })

    }).catch((error) => {
        return res.status(404).json({
            status: "error",
            missatge: "No s'han trobat exercisis"
        });
    });
}

module.exports = {
    getExercisis
}