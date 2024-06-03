const Horari = require("../models/horari");


const getHorari = (req, res) => {
    
    const userId = req.params.id;

    const horari = Horari.find({ user: userId }, { user: 0 })
        .then(horari => {
            return res.status(200).send({
                status: "success",
                message: "horari del usuari",
                horari
            });
        });   
}

const guardar = async (req, res) => {
    try{

        const params = req.body;
        let horari = new Horari();
        horari.horari = JSON.stringify(params);
        horari.user = req.user.id;
        
        Horari.findOneAndDelete({ user: req.user.id }).then(deletedDocument => {
            console.log(deletedDocument);
        });

        let horariGuardat = await horari.save();

        if (!horariGuardat){
            
            return res.status(400).send({ 
                status: "error", 
                message: "No se ha guardat l'horari'." 
            });
        }

        return res.status(200).send({
            status: "success",
            message: "horari guardat ",
            horariGuardat
        });
   
    } catch (error){
        console.log(error);
        return res.status(400).send({ 
            status: "error", 
            message: "No s'ha guardat l'horari." 
        });
    }
}

module.exports = {
    getHorari,
    guardar
}