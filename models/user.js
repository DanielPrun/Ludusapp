const {Schema, model} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = Schema({
    nom: {
        type: String,
        required: true
    },
    cognom: String,
    bio: String,
    nick: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        default: "rol_user"
    },
    img: {
        type: String,
        default: "default.png"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

UserSchema.plugin(mongoosePaginate);
module.exports = model("User", UserSchema, "users");