/*
  Rutas de readmdb
  host + /api/readmdb
*/
const router = require('express').Router();

const {
  getCuenta,
  getComprometido,
  getCausado,
  getPagado,
  getModificado,
} = require('../controllers/readmdb.controller');

router.get('/cuenta/:year', getCuenta);
router.get('/modificado/:year', getModificado);
router.get('/comprometido/:year', getComprometido);
router.get('/causado/:year', getCausado);
router.get('/pagado/:year', getPagado);

module.exports = router;
