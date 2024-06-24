const Sessio = require("../models/sessio");



const getSessions = (req, res) => {
    let consulta;

    if(req.query.ids){
        const ids = JSON.parse(req.query.ids)
    
        consulta = Sessio.find({ _id: { $in: ids } });
    }
    else{
        consulta = Sessio.find();
    }

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

const guardar = async (req, res) => {
    try{

        const params = req.body;
        let sessio = new Sessio(params);
        
        let sessioGuardada = await sessio.save();

        if (!sessioGuardada){
            
            return res.status(400).send({ 
                status: "error", 
                message: "No se ha guardat la sessio'." 
            });
        }

        return res.status(200).send({
            status: "success",
            message: "sessio guardada ",
            sessioGuardada
        });
   
    } catch (error){
        console.log(error);
        return res.status(400).send({ 
            status: "error", 
            message: "No s'ha guardat la sessio." 
        });
    }
}

module.exports = {
    getSessions,
    guardar
}