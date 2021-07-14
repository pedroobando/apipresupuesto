/*
  Rutas de readmdb
  host + /api/readmdb
*/
const router = require('express').Router();

const {
  getCuenta,
  getCausado,
  getPagado,
  getModificado,
  getCompromiso,
} = require('../controllers/readmdb.controller');

router.get('/cuenta/:year', getCuenta);
router.get('/modificado/:year', getModificado);
router.get('/compromiso/:year', getCompromiso);
router.get('/causado/:year', getCausado);
router.get('/pagado/:year', getPagado);

module.exports = router;
