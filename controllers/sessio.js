const Sessio = require("../models/sessio");


const getSessions = (req, res) => {
    
    const ids = JSON.parse(req.query.ids)
    
    let consulta = Sessio.find({ _id: { $in: ids } });
    
    consulta.then((sessions) => {

        return res.status(200).send({
            status: "success",
            sessions
        })

    }).catch((error) => {
        return res.status(404).json({
            status: "error",
            missatge: "No s'han trobat sessions"
        });
    });
}

module.exports = {
    getSessions
}