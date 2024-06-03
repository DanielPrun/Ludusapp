const mongoose = require("mongoose");

const connexio = async() => {
    try{
        await mongoose.connect("mongodb://localhost:27017/mi_blog");

        console.log("conectat correctament");

    }catch(error) {
        console.log(error);
        throw new Error("No s'ha pogut conectar a la base de dades");
    }

}

module.exports = {
    connexio
}