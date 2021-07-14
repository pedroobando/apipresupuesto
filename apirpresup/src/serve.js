const express = require('express');
const { json } = require('express');
const morgan = require('morgan');

const dotenv = require('dotenv');
const cors = require('cors');

// initialization
const serve = express();
dotenv.config();

const thePort = process.env.PORT || 8080;
// console.log(process.env);
if (process.env.NODE_ENV === 'DEV') {
  serve.use(morgan('dev'));
}

serve.use(cors());

serve.use(json());

serve.use(express.static('./public'));

// Rutas
serve.use('/api/presupuesto', require('./routers/readmdb.route'));

module.exports = { serve, thePort };
