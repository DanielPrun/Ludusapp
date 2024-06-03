const {Schema, model} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const HorariSchema = Schema({
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
    }
});

HorariSchema.plugin(mongoosePaginate);
module.exports = model("Horari", HorariSchema, "horaris");