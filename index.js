const {connexio} = require("./database/connexio");
const express = require("express");
const cors = require("cors");

const path = require("path");

connexio();

//crear servidor node
const app = express();
const puerto = 3900;

const options = {
    origin: ["http://194.164.76.221", "https://194.164.76.221"]
}

app.use(cors(options));

//convertir el que m'arribi com a body a objecte js
app.use(express.json());
app.use(express.urlencoded({extended: true}));



//importem els fixers de rutes
const rutes_article = require("./routes/article");
const rutes_user = require("./routes/user");
const rutes_publi = require("./routes/publication");
const rutes_follow = require("./routes/follow");
const rutes_ex = require("./routes/exercici");
const rutes_sessio = require("./routes/sessio");
const rutes_model = require("./routes/model");
const rutes_horari = require("./routes/horari");
const rutes_historic = require("./routes/historicHoraris");


app.use("/", express.static("dist", {redirect: false}));
//creem les rutes http
app.use("/api", rutes_article);
app.use("/api/user", rutes_user);
app.use("/api/publi", rutes_publi);
app.use("/api/follow", rutes_follow);
app.use("/api/ex", rutes_ex);
app.use("/api/sessio", rutes_sessio);
app.use("/api/model", rutes_model);
app.use("/api/horari", rutes_horari);
app.use("/api/historic", rutes_historic);


app.get("*", (req, res, next) => {
    return res.sendFile(path.resolve("dist/index.html"));
});

//establim un port per el que escoltarem les peticions al servidor
app.listen(puerto, () => {
    console.log("servidor on");
});

