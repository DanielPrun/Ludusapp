const {Schema, model} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const SessioSchema = Schema({
    titol: {
        type: String,
        required: true
    },
    color: String,
    aceptades: Array,
});

SessioSchema.plugin(mongoosePaginate);
module.exports = model("Sessio", SessioSchema, "sessions");