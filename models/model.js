const {Schema, model} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ModelSchema = Schema({
    titol: {
        type: String,
        required: true
    },
    sessions: Array,
    setmanes: String,
});

ModelSchema.plugin(mongoosePaginate);
module.exports = model("Model", ModelSchema, "models");