const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connexio = async() => {
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/mi_blog");

        console.log("conectat correctament");

    }catch(error) {
        console.log(error);
        throw new Error("No s'ha pogut conectar a la base de dades");
    }

}

module.exports = {
    connexio
}
