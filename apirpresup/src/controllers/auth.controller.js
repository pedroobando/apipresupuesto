const { response } = require('express');
const bcrypt = require('bcryptjs');

const userModel = require('../models/users');
const { generarJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
  const { name, email, password, departamento = '', administrador = false } = req.body;

  try {
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        data: {
          message: `Email ${email}, ya esta registrado`,
        },
      });
    }

    user = await userModel.findOne({ name });
    if (user) {
      return res.status(400).json({
        ok: false,
        data: {
          message: `usuario ${name}, ya esta registrado`,
        },
      });
    }
    user = new userModel(req.body);
    // Encriptar Contrasena
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();
    return res
      .status(201)
      .json(
        await respUserToken(
          true,
          user.id,
          user.name,
          user.departamento,
          user.administrador
        )
      );
  } catch (error) {
    res.status(500).json({
      ok: false,
      data: {
        message: 'Consulte con el administrador',
      },
    });
  }
};

const loginUser = async (req, res = response) => {
  const { name, password } = req.body;
  try {
    const user = await userModel.findOne({ name });
    if (!user) {
      return res.status(400).json({
        ok: false,
        data: {
          message: 'Usuario y password no validos',
        },
      });
    }

    // Compare password
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        data: {
          message: 'Usuario y password no validos.',
        },
      });
    }

    return res
      .status(200)
      .json(
        await respUserToken(
          true,
          user.id,
          user.name,
          user.departamento,
          user.administrador
        )
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      data: {
        message: 'Por favor hable con el administrador',
      },
    });
  }
};

const renewToken = async (req, res = response) => {
  const { uid, name, seccion, administrador } = req;

  return res
    .status(200)
    .json(await respUserToken(true, uid, name, seccion, administrador));
};

const getAll = async (req, res = response) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const sort = req.query.sort || '';

  try {
    const entities = await userModel
      .find()
      .sort({ name: 0 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('departamento', ['nombre'])
      .exec();

    const count = await userModel.countDocuments();

    return res.status(200).json({
      ok: true,
      // data: entities,
      // ok: true,
      data: [
        ...entities.map((item) => ({
          uid: item.id,
          id: item.id,
          name: item.name,
          fullname: item.fullname,
          email: item.email,
          departamento: item.departamento,
          activo: item.activo,
          administrador: item.administrador,
        })),
      ],
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      data: {
        message: 'Consulte con el administrador',
      },
    });
  }
};

const getOne = async (req, res = response) => {
  const uid = req.params.uid || undefined;
  let retEntities = undefined;

  try {
    const entities = await userModel
      .findById({ _id: uid })
      .populate('departamento', ['nombre'])
      .exec();
    if (entities !== null) {
      retEntities = res.status(200).json({
        ok: true,
        // data: entities,
        data: {
          uid: entities.id,
          id: entities.id,
          name: entities.name,
          fullname: entities.fullname,
          email: entities.email,
          departamento: entities.departamento,
          activo: entities.activo,
          administrador: entities.administrador,
          createdAt: entities.createdAt,
          updatedAt: entities.updatedAt,
        },
      });
    } else {
      retEntities = res.status(404).json({
        ok: true,
        data: { message: 'Usuario nop localidado. Ups..' },
      });
    }
  } catch (error) {
    console.log(error);
    retEntities = res.status(500).json({
      ok: false,
      data: {
        message: 'Consulte con el administrador',
      },
    });
  }
  return retEntities;
};

const updateUser = async (req, res = response) => {
  const { uid } = req.params;
  const { name, fullname, email, departamento, activo, administrador } = req.body;
  // const { uid, name } = req;
  try {
    const User = await userModel.findById(uid);
    if (!User) {
      return res.status(404).json({
        ok: false,
        data: {
          message: 'Problema al leer datos del usuarios',
        },
      });
    }

    if (User.id !== uid) {
      return res.status(401).json({
        ok: false,
        data: {
          message: 'No tiene privilegios sobre este usuario',
        },
      });
    }

    const userUpdated = await userModel.findByIdAndUpdate(
      uid,
      { name, fullname, email, departamento, activo, administrador },
      { new: true }
    );
    const _id = userUpdated._doc._id;
    delete userUpdated._doc.password;

    delete userUpdated._doc._id;
    return res.status(200).json({
      ok: true,
      data: { uid: _id, id: _id, ...userUpdated._doc },
    });
    // return res.status(200).json(await respUserToken(true, uid, name));
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      data: {
        message: 'Por favor hable con el administrador',
      },
    });
  }
};

const updateUserpass = async (req, res = response) => {
  const { uid } = req.params;
  const { password } = req.body;
  try {
    const User = await userModel.findById(uid);
    if (!User) {
      return res.status(404).json({
        ok: false,
        data: {
          message: 'Problema al leer datos del usuarios',
        },
      });
    }

    if (User.id !== uid) {
      return res.status(401).json({
        ok: false,
        data: {
          message: 'No tiene privilegios sobre este usuario',
        },
      });
    }

    // Encriptar Contrasena
    const salt = bcrypt.genSaltSync();
    const newPass = bcrypt.hashSync(password, salt);

    const userUpdated = await userModel.findByIdAndUpdate(
      uid,
      { password: newPass },
      { new: true }
    );
    return res
      .status(200)
      .json(
        await respUserToken(
          true,
          User.id,
          User.name,
          User.departamento,
          User.administrador
        )
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      data: {
        message: 'Por favor hable con el administrador',
      },
    });
  }
};

const deleteUser = async (req, res = response) => {
  const { uid } = req.params;
  // const { password } = req.body;
  try {
    const User = await userModel.findById(uid);
    if (!User) {
      return res.status(404).json({
        ok: false,
        data: {
          message: 'Problema al leer datos del usuarios',
        },
      });
    }

    if (User.id !== uid) {
      return res.status(401).json({
        ok: false,
        data: {
          message: 'No tiene privilegios sobre este usuario',
        },
      });
    }

    const userDelete = await userModel.findByIdAndDelete(uid);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      data: {
        message: 'Por favor hable con el administrador',
      },
    });
  }
};

const respUserToken = async (ok, uid, name, seccion = '', administrador = false) => {
  // Generar JWT

  return {
    ok,
    data: {
      uid,
      name,
      seccion,
      isAdmin: administrador,
      token: await generarJWT(uid, name),
    },
  };
};

module.exports = {
  createUser,
  loginUser,
  renewToken,
  // listUser,
  getAll,
  getOne,
  deleteUser,
  updateUser,
  updateUserpass,
};
