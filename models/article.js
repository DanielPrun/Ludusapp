const {Schema, model} = require("mongoose");

const ArticleSchema = Schema({
    titol: {
        type: String,
        required: true
    },
    contingut: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        default: Date.now
    },
    img: {
        type: String,
        default: "default.png"
    },
    tag: {
        type: String,
        default: "null"
    },
});

module.exports = model("Article", ArticleSchema, "articles");

