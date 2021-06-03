/*
  Rutas de Vehiculos
  host + /api/vehiculo
*/
const router = require('express').Router();
const { check } = require('express-validator');

const { fieldValid } = require('../middlewares/fieldValid');
const { validJWT } = require('../middlewares/validJWT');

const {
  getVehiculo,
  createVehiculo,
  getOneVehiculo,
  getPlacaVehiculo,
  updateVehiculo,
  deleteVehiculo,
} = require('../controllers/vehiculo.controller');

router.use(validJWT); // => Todas las rutas validaran el token

router.get('/', getVehiculo);
router.get('/:id', getOneVehiculo);
router.get('/placa/:placa', getPlacaVehiculo);

router.post(
  '/',
  [
    check('placa', 'La placa del vehiculo es requerida').not().isEmpty(),
    check('placa', 'La placa del vehiculo debe ser minimo 5 caracteres').isLength({
      min: 5,
    }),
    fieldValid,
  ],
  createVehiculo
);

router.put(
  '/:id',
  [
    check('placa', 'La placa del vehiculo es requerida').not().isEmpty(),
    check('placa', 'La placa del vehiculo debe ser minimo 5 caracteres').isLength({
      min: 5,
    }),
    fieldValid,
  ],
  updateVehiculo
);

router.delete('/:id', deleteVehiculo);

module.exports = router;
