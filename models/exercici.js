const {Schema, model} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ExerciciSchema = Schema({
    titol: {
        type: String,
        required: true
    },
    equipament: Array,
    descripció: String,
    grupMuscular: String,
    disciplina: String,
    target: Array,
    url: String,
});

ExerciciSchema.plugin(mongoosePaginate);
module.exports = model("Exercici", ExerciciSchema, "exercicis");