const validator = require("validator");

const validarArticle = (params) => {
    
    let validar_title = !validator.isEmpty(params.titol) && 
                        validator.isLength(params.titol, {min: 5, max: undefined});

    let validar_content = !validator.isEmpty(params.contingut);

    if(!validar_title || !validar_content){
        throw new Error("no s'ha validat la info");
    }
}

module.exports = {
    validarArticle
}