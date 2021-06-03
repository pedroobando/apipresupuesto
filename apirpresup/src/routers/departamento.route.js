/*
  Rutas de Personas
  host + /api/persona
*/
const router = require('express').Router();
const { check } = require('express-validator');

const { fieldValid } = require('../middlewares/fieldValid');
const { validJWT } = require('../middlewares/validJWT');

const {
  getAll,
  getOne,
  crtEntity,
  updEntity,
  delEntity,
} = require('../controllers/departamento.controller');

router.use(validJWT); // => Todas las rutas validaran el token

router.get('/', getAll);
router.get('/:id', getOne);

router.post(
  '/',
  [
    check('nombre', 'El nombre del departamento es requerido').not().isEmpty(),
    check('nombre', 'El nombre debe ser contener minimo 5 caracteres').isLength({
      min: 5,
    }),
    check('abreviacion', 'La abreviacion del departamento es requerida').not().isEmpty(),
    check('nrosalida', 'El numero de orden de salida es requerido').not().isEmpty(),
    fieldValid,
  ],
  crtEntity
);

router.put(
  '/:id',
  [
    check('nombre', 'El nombre del departamento es requerido').not().isEmpty(),
    check('nombre', 'El nombre debe ser contener minimo 5 caracteres').isLength({
      min: 5,
    }),
    check('abreviacion', 'La abreviacion del departamento es requerida').not().isEmpty(),
    check('nrosalida', 'El numero de orden de salida es requerido').not().isEmpty(),
    fieldValid,
  ],
  updEntity
);

router.delete('/:id', delEntity);

module.exports = router;
