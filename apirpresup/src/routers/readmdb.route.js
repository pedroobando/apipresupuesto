/*
  Rutas de readmdb
  host + /api/readmdb
*/
const router = require("express").Router();

const {
  getCuenta,
  // getModificacion,
  // getComprometido,
  // getCausado,
  // getPago,
} = require("../controllers/readmdb.controller");

router.get("/cuenta/:year", getCuenta);
// router.get('/:year', getModificacion);

module.exports = router;
