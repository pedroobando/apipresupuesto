const express = require("express");
const { json } = require("express");
const morgan = require("morgan");
// const helmet = require('helmet');
const dotenv = require("dotenv");
const cors = require("cors");
// const { dbConnection } = require('./database/dbcnn');
// const { uploads } = require('./middlewares/uploads');

// initialization
const serve = express();
dotenv.config();

// base de datos
// dbConnection();

const thePort = process.env.PORT || 8080;
// console.log(process.env);
if (process.env.NODE_ENV === "DEV") {
  serve.use(morgan("dev"));
}

serve.use(cors());
// serve.use(helmet());

serve.use(json());
// public router

serve.use(express.static("./public"));
// serve.use('/images', express.static('./public/uploads'));

// serve.use(uploads());

// Rutas
serve.use("/api/presupuesto", require("./routers/readmdb.route"));
// serve.use('/api/usuario', require('./routers/user.route'));
// serve.use('/api/vehiculo', require('./routers/vehiculo.route'));
// serve.use('/api/persona', require('./routers/persona.route'));
// serve.use('/api/departamento', require('./routers/departamento.route'));
// serve.use('/api/ordsalida', require('./routers/ordSalida.route'));
// serve.use('/api/imagen', require('./routers/imagen.route'));

module.exports = { serve, thePort };
