const Exercici = require("../models/exercici");


const getExercisis = (req, res) => {
    let consulta;
    if(req.query.ids){
        const ids = JSON.parse(req.query.ids)
    
        consulta = Exercici.find({ _id: { $in: ids } });
    }
    else{
        consulta = Exercici.find();
    }

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

const guardar = async (req, res) => {
    try{

        const params = req.body;
        let exercici = new Exercici(params);
        //exercici = JSON.stringify(params);
        let exerciciGuardat = await exercici.save();

        if (!exerciciGuardat){
            
            return res.status(400).send({ 
                status: "error", 
                message: "No se ha guardat l'exercici'." 
            });
        }

        return res.status(200).send({
            status: "success",
            message: "exercici guardat ",
            exerciciGuardat
        });
   
    } catch (error){
        console.log(error);
        return res.status(400).send({ 
            status: "error", 
            message: "No s'ha guardat l'exercici." 
        });
    }
}

module.exports = {
    getExercisis,
    guardar
}