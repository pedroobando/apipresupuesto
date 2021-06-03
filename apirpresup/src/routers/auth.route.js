/*
  Rutas de Usuarios / Auth
  host + /api/auth
*/
const router = require('express').Router();
const { check } = require('express-validator');

const { fieldValid } = require('../middlewares/fieldValid');
const { validJWT } = require('../middlewares/validJWT');

const { createUser, loginUser, renewToken } = require('../controllers/auth.controller');

router.post(
  '/new',
  [
    check('name', 'El name es requerido').not().isEmpty(),
    check('email', 'El email es requerido').isEmail(),
    check('password', 'El password debe ser minimo 6 caracteres').isLength({ min: 6 }),
    fieldValid,
  ],
  createUser
);

router.post(
  '/',
  [
    // check('email', 'El email es requerido').isEmail(),
    check('name', 'El login es requerido').not().isEmpty(),
    // check('password', 'El password debe ser minimo 6 caracteres').isLength({ min: 6 }),
    fieldValid,
  ],
  loginUser
);

router.get('/renew', validJWT, renewToken);

module.exports = router;
