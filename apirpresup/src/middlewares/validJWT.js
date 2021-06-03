const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const validJWT = (req = request, res = response, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      data: {
        message: 'No hay token en la peticion',
      },
    });
  }

  try {
    //  iat, exp
    const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);

    req.uid = uid;
    req.name = name;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      data: {
        message: 'Token not Valid',
      },
    });
  }
  next();
};

module.exports = {
  validJWT,
};
