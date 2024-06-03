const Historic = require("../models/historicHoraris");


const getHistoric = (req, res) => {

    const userId = req.params.id;

    const historic = Historic.find({ user: userId }, { user: 0 }).sort({ weekStart: -1 })
        .then(historic => {
            return res.status(200).send({
                status: "success",
                message: "Historic del usuari",
                historic
            });
        });
}

const guardar = async (req, res) => {

    try {

        const params = req.body;
        let historic = new Historic();
        historic.horari = JSON.stringify(params.horari);
        historic.weekEnd = params.weekEnd;
        historic.weekStart = params.weekStart;
        historic.created_at = params.created_at;
        historic.user = req.user.id;

        Historic.findOneAndDelete({ user: req.user.id, weekStart: params.weekStart }).then(deletedDocument => {
            console.log(deletedDocument);
        });

        let historiciGuardat = await historic.save();

        if (!historiciGuardat) {

            return res.status(400).send({
                status: "error",
                message: "No se ha guardat l'historic'."
            });
        }

        return res.status(200).send({
            status: "success",
            message: "historic guardat ",
            historiciGuardat
        });

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            status: "error",
            message: "No s'ha guardat l'historic."
        });
    }
}
const getSessions = (req, res) => {

    const userId = req.params.id;

    const historic = Historic.find({ user: userId }, { user: 0 }).sort({ weekStart: -1 })
        .then(historic => {

            let horaris = [];
            let sessions = {
                labels: [],
                datasets: [
                    {
                        label: 'cops realitzada: ',
                        data: [],
                        backgroundColor: [],
                        borderColor: [],
                        borderWidth: 1,
                    },
                ],
            };
            historic.map((horari, indx) => {
                horaris.push(JSON.parse(horari.horari));
            })

            horaris.map((setmana, indx) => {
                Object.keys(setmana).map((dia) => {
                    if (setmana[dia].length > 0) {
                        let index = sessions.labels.indexOf(setmana[dia][0]);
                        if (index >= 0) {
                            sessions.datasets[0].data[index]++;
                        }
                        else {
                            sessions.labels.push(setmana[dia][0]);
                            sessions.datasets[0].data.push(1);
                            sessions.datasets[0].backgroundColor.push('rgba(' + setmana[dia][1].replace(/\s/g, ",") + ', 0.5)');
                            sessions.datasets[0].borderColor.push('rgba(' + setmana[dia][1].replace(/\s/g, ",") + ', 1)');
                        }
                    }
                });
            });

            return res.status(200).send({
                status: "success",
                message: "Historic del usuari",
                sessions
            });
        });
}
const getDisciplines = (req, res) => {

    const userId = req.params.id;

    const historic = Historic.find({ user: userId }, { user: 0 }).sort({ weekStart: -1 })
        .then(historic => {

            let horaris = [];
            let disciplines = {
                labels: [],
                datasets: [
                    {
                        label: 'cops realitzada: ',
                        data: [],
                        backgroundColor: 'rgba(255,99,132,0.3)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1.5,
                    },
                ],
            };
            historic.map((horari, indx) => {
                horaris.push(JSON.parse(horari.horari));
            })

            horaris.map((setmana, indx) => {
                Object.keys(setmana).map((dia) => {
                    if (setmana[dia].length > 0) {

                        Object.keys(setmana[dia][2]).map((ex) => {
                            setmana[dia][2][ex].disciplina.map((disciplina) => {

                                let index = disciplines.labels.indexOf(disciplina);
                                if (index >= 0) {
                                    disciplines.datasets[0].data[index]++;
                                }
                                else {
                                    disciplines.labels.push(disciplina);
                                    disciplines.datasets[0].data.push(1);
                                }

                            });
                        });
                    }
                });
            });

            return res.status(200).send({
                status: "success",
                message: "Historic del usuari",
                disciplines
            });
        });
}

const getEx = (req, res) => {

    const userId = req.params.id;

    const historic = Historic.find({ user: userId }, { user: 0 }).sort({ weekStart: -1 })
        .then(historic => {

            let horaris = [];
            let exercisis = {
                labels: ['Gener', 'Febrer', 'March', 'April', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'],
                datasets: [
                    {
                        fill: true,
                        label: 'Exercisis fets cada mes',
                        data: [0,0,0,0,0,0,0,0,0,0,0,0],
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                ],
            };
            historic.map((horari, indx) => {
                let horariAux = {
                    horari: JSON.parse(horari.horari),
                    mes: horari.weekEnd.getMonth()
                };
                horaris.push(horariAux);
            })
            
            horaris.map((horari) => {
                let index = horari.mes;
                const setmana = horari.horari;
                Object.keys(setmana).map((dia) => {
                    if (setmana[dia].length > 0) {
                        Object.keys(setmana[dia][2]).map((ex) => {
                            const exercici = setmana[dia][2][ex];
                            if(exercici.repeticions * exercici.series > 0 || exercici.min > 0){
                                exercisis.datasets[0].data[index]++;
                            }
                        });
                    }
                });
            });

            return res.status(200).send({
                status: "success",
                message: "Historic del usuari",
                exercisis
            });
        });
}
module.exports = {
    getHistoric,
    guardar,
    getSessions,
    getDisciplines,
    getEx
}