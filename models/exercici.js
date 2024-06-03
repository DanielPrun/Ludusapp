const {Schema, model} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ExerciciSchema = Schema({
    titol: {
        type: String,
        required: true
    },
    equipament: String,
    descripció: String,
    grupMuscular: String,
    disciplina: Array,
    target: Array
});

ExerciciSchema.plugin(mongoosePaginate);
module.exports = model("Exercici", ExerciciSchema, "exercicis");