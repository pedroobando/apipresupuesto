/*
  Rutas de Usuarios / Auth
  host + /api/user
*/

const router = require('express').Router();
const { check } = require('express-validator');

const { fieldValid } = require('../middlewares/fieldValid');
const { validJWT } = require('../middlewares/validJWT');

const {
  getAll,
  getOne,
  updateUser,
  deleteUser,
  updateUserpass,
} = require('../controllers/auth.controller');

router.get('/', validJWT, getAll);

router.get('/:uid', validJWT, getOne);

router.put(
  '/:uid',
  [
    check('name', 'El name es requerido').not().isEmpty(),
    check('email', 'El email es requerido').isEmail(),
    fieldValid,
  ],
  validJWT,
  updateUser
);

router.put(
  '/password/:uid',
  [
    check('password', 'El password debe ser minimo 6 caracteres').isLength({ min: 6 }),
    fieldValid,
  ],
  validJWT,
  updateUserpass
);

router.delete('/:uid', validJWT, deleteUser);

module.exports = router;
