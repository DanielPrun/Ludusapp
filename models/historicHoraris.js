const {Schema, model} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const HistoricSchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    horari: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    weekStart:{
        type: Date,
        required: true
    },
    weekEnd:{
        type: Date,
        required: true
    }
});

HistoricSchema.plugin(mongoosePaginate);
module.exports = model("HistoricHorari", HistoricSchema, "historicsHoraris");