const { response } = require('express');
const ordSalidaModel = require('../models/ordSalida');

const addNota = async (req, res = response) => {
  const { uid } = req;
  const entityId = req.params.id;
  const { fecha, nota } = req.body;
  try {
    const entityFind = await ordSalidaModel.findById(entityId);
    if (!entityFind) {
      return res.status(404).json({
        ok: false,
        data: { message: 'Invalido codigo interno de busqueda' },
      });
    }

    entityFind.comentarios = [...entityFind.comentarios, { fecha, nota, usuario: uid }];

    const entityUpdated = await ordSalidaModel.findByIdAndUpdate(entityId, entityFind, {
      new: true,
    });
    return res.status(200).json({
      ok: true,
      data: entityUpdated,
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

const delNota = async (req, res = response) => {
  const entityId = req.params.id;
  const { comentarioId } = req.body;
  try {
    const entityFind = await ordSalidaModel.findById(entityId);
    if (!entityFind) {
      return res.status(404).json({
        ok: false,
        data: { message: 'Invalido codigo interno de busqueda' },
      });
    }

    const vcomentarios = entityFind.comentarios.filter(
      (coment) => coment.id !== comentarioId
    );

    const entityUpdated = await ordSalidaModel.findByIdAndUpdate(
      entityId,
      { comentarios: vcomentarios },
      {
        new: true,
      }
    );
    return res.status(200).json({
      ok: true,
      data: vcomentarios,
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

module.exports = {
  addNota,
  delNota,
};
