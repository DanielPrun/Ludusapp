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

const getModel = (req, res) => {
    let id = req.params.id;
    let consulta = Model.findById(id);
    consulta.then((model) => {

        return res.status(200).send({
            status: "success",
            model
        })

    }).catch((error) => {
        return res.status(404).json({
            status: "error",
            missatge: "No s'han trobat models"
        });
    });
}

const guardar = async (req, res) => {
    try{

        const params = req.body;
        let model = new Model(params);
        
        let modelGuardat = await model.save();

        if (!modelGuardat){
            
            return res.status(400).send({ 
                status: "error", 
                message: "No se ha guardat el model'." 
            });
        }

        return res.status(200).send({
            status: "success",
            message: "model guardat ",
            modelGuardat
        });
   
    } catch (error){
        console.log(error);
        return res.status(400).send({ 
            status: "error", 
            message: "No s'ha guardat el model." 
        });
    }
}

const editar = async (req, res) => {
    let modelId = req.params.id;
    let params = req.body;

    Model.findOneAndUpdate({ _id: modelId }, params, { new: true }).then((modelActualitzat) => {

        return res.status(200).json({
            status: "success",
            article: modelActualitzat
        });

    }).catch((error) => {
        return res.status(500).json({
            status: "error",
            missatge: "Error al actualitzar"
        });
    });
}


const borrar = (req, res) => {
    const modelId = req.params.id;

    Model.findOneAndDelete({ _id: modelId })
    .then((modelBorrat) => {

        return res.status(200).json({
            status: "success",
            model: modelBorrat,
            missatge: "borrar"
        });

    }).catch((error) => {
        return res.status(500).json({
            status: "error",
            missatge: "Error al borrar el model"
        });
    });

}

module.exports = {
    getModels,
    getModel,
    guardar,
    editar,
    borrar
}