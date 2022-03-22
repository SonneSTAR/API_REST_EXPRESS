
// Paso 1
const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "root",
    database: "cursos",
    port: 5432,
});


const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.listen(3000);


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")

})




async function nuevoCurso(nombre, nivel, fecha, duracion) {
    try {

        const result = await pool.query(
            `INSERT INTO cursos (nombre, nivel, fecha,duracion) values ('${nombre}', '${nivel}', '${fecha}', '${duracion}') RETURNING *`
        );


        return result;
    } catch (e) {
        console.log(e)
        return e;
    }
}




app.post("/curso", async (req, res) => {

    console.log(req.body)
    const { nombre } = req.body;
    const { nivelTecnico } = req.body;
    const { fechaInicio } = req.body;
    const { duracion } = req.body;


    const respuesta = await nuevoCurso(nombre, nivelTecnico, fechaInicio, duracion);

    res.send(respuesta);
});



async function getCursos() {
    try {
        const result = await pool.query(`SELECT * FROM cursos`);
        return result.rows;
    } catch (e) {
        return e;
    }
}


app.get("/cursos", async (req, res) => {

    const respuesta = await getCursos();

    res.send(respuesta);
});




async function editarCurso(nombre, nivel, fecha, duracion) {
    try {
        const res = await pool.query(
            `UPDATE cursos SET nombre = '${nombre}',nivel = '${nivel}',fecha = '${fecha}',duracion = '${duracion}'  WHERE nombre = '${nombre}'
        RETURNING *`
        );
        return res.rows;
    } catch (e) {
        console.log(e);
    }
};


app.put("/curso", async (req, res) => {

    console.log(req.body.nombre)
    const { nombre } = req.body;
    const { nivelTecnico } = req.body;
    const { fechaInicio } = req.body;
    const { duracion } = req.body;

    const respuesta = await editarCurso(nombre, nivelTecnico, fechaInicio, duracion);
    res.send(respuesta);
});



async function deleteCurso(id) {
    try {
        const result = await pool.query(`DELETE FROM cursos WHERE id =
    '${id}'`);
        return result.rowCount;
    } catch (e) {
        return e;
    }
};


app.delete("/curso/:id", async (req, res) => {
    console.log("lo encontro")
    // Paso 2
    const { id } = req.params;
    // Paso 3
    const respuesta = await deleteCurso(id);
    // Paso 4
    respuesta > 0
        ? res.send(`El canal de id ${id} fue eliminado con éxito`)
        : res.send("No existe un canal registrado con ese id");
});
