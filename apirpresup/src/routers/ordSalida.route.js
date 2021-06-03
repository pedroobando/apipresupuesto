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
  getByNumeroSec,
} = require('../controllers/ordSalida.controller');

const { addNota, delNota } = require('../controllers/ordSalidaNota.controller');

router.use(validJWT); // => Todas las rutas validaran el token

router.get('/', getAll);
router.get('/:id', getOne);
router.get('/numerosec/:numerosec', getByNumeroSec);
// router.get('/Sdni/:dni', getByDni);

router.post(
  '/',
  [
    // check('fechaemision', 'La fecha elaboracion es requerida').isDate(),
    check('material', 'El nombre del material o equipo es requerido').not().isEmpty(),
    check('material', 'El material o equipo debe contener minimo 5 caracteres').isLength({
      min: 5,
    }),
    check('motivo', 'El motivo de la salida es requerida').not().isEmpty(),
    check('destino', 'El destino es requerido del equipo es requerido').not().isEmpty(),
    check('departamento', 'El departamento es requerido').not().isEmpty(),
    check('solicitante', 'Es requerido nombre de la persona solicitante').not().isEmpty(),
    check('aprobadoradm', 'El aprobador administrativo es requerido').not().isEmpty(),
    check('aprobadorseg', 'El aprobador de seguridad es requerido').not().isEmpty(),
    fieldValid,
  ],
  crtEntity
);

router.put(
  '/:id',
  [
    // check('fechaemision', 'La fecha elaboracion es requerida').isDate(),
    // check('material', 'El nombre del material o equipo es requerido').not().isEmpty(),
    // check('material', 'El material o equipo debe contener minimo 5 caracteres').isLength({
    //   min: 5,
    // }),
    // check('destino', 'El destino es requerido del equipo es requerido').not().isEmpty(),
    // check('persona', 'Es requerido nombre de la persona responsable').not().isEmpty(),
    // check('aprobadorAdm', 'El aprovador administrativo es requerido').not().isEmpty(),
    // check('aprobadorSeg', 'El aprovador de seguridad es requerido').not().isEmpty(),
    fieldValid,
  ],
  updEntity
);

router.delete('/:id', delEntity);

router.post('/comentario/:id', addNota);
router.delete('/comentario/:id', delNota);

module.exports = router;
