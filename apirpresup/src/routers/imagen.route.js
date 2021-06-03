/*
  Rutas de Personas
  host + /api/persona
*/
const router = require('express').Router();
const { check } = require('express-validator');

// const { fieldValid } = require('../middlewares/fieldValid');
const { validJWT } = require('../middlewares/validJWT');

const {
  getAll,
  getOne,
  crtEntity,
  delEntity,
} = require('../controllers/imagen.controller');

// router.use(validJWT); // => Todas las rutas validaran el token

router.get('/', getAll);
router.get('/:id', getOne);

router.post('/', validJWT, crtEntity);

router.delete('/:id', validJWT, delEntity);

module.exports = router;
