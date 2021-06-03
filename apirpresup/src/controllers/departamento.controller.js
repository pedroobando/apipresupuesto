const { response } = require('express');
const departamentoModel = require('../models/departamento');
const crtEntity = async (req, res = response) => {
  const entity = new departamentoModel({
    ...req.body,
    abreviacion: req.body.abreviacion.substr(0, 3),
  });
  try {
    const entitySaved = await entity.save();

    return res.status(201).json({
      ok: true,
      data: entitySaved,
    });
  } catch (error) {
    console.log(error);
    const { code, keyValue } = error;
    if (code === 11000) {
      return res.status(400).json({
        ok: false,
        data: { mensaje: `Duplicidad en: ${keyValue.abreviacion}` },
      });
    }

    res.status(500).json({
      ok: false,
      data: {
        message: 'Consulte con el administrador',
      },
    });
  }
};

const getAll = async (req, res = response) => {
  const { page = 1, limit = 10, sort = '', activo = false } = req.query;
  const optionPage = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort };
  let findCondition = activo ? { activo: true } : {};
  try {
    const entities = await departamentoModel.paginate(findCondition, optionPage);
    const resultJson = {
      ok: entities.docs.length >= 1,
      data: entities.docs,
      ...entities,
    };
    delete resultJson.docs;
    return res.status(200).json(resultJson);
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
  const { id } = req.params;
  try {
    if (id.length <= 10) {
      return res.status(400).json({
        ok: false,
        data: { message: 'Invalido codigo interno de busqueda' },
      });
    }

    const entity = await departamentoModel.findById(id);
    if (!entity) {
      return res.status(404).json({
        ok: false,
        data: { message: 'No localizado' },
      });
    }
    return res.status(200).json({
      ok: true,
      data: entity,
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

const updEntity = async (req, res = response) => {
  const departamentoId = req.params.id;
  try {
    const entityFind = await departamentoModel.findById(departamentoId);
    if (!entityFind) {
      return res.status(404).json({
        ok: false,
        data: { message: 'Invalido codigo interno de busqueda' },
      });
    }

    const entity = { ...req.body, abreviacion: req.body.abreviacion.substr(0, 3) };
    const entityUpdated = await departamentoModel.findByIdAndUpdate(
      departamentoId,
      entity,
      {
        new: true,
      }
    );

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

const delEntity = async (req, res = response) => {
  const departamentoId = req.params.id;
  if (departamentoId.length <= 20) {
    return res.status(404).json({
      ok: false,
      data: { message: 'Invalido codigo interno de busqueda' },
    });
  }

  try {
    const entityFind = await departamentoModel.findById(departamentoId);
    if (!entityFind) {
      return res.status(404).json({
        ok: false,
        data: { message: 'Invalido codigo interno de busqueda.' },
      });
    }

    await departamentoModel.findByIdAndDelete(departamentoId);
    return res.status(200).json({
      ok: true,
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

const increment = async (departamentoId) => {
  try {
    const entityFind = await departamentoModel.findById(departamentoId);
    if (!entityFind) {
      return -1;
    }

    entityFind.nrosalida += 1;
    const entityUpdated = await departamentoModel.findByIdAndUpdate(
      departamentoId,
      entityFind,
      {
        new: true,
      }
    );

    const fecha = new Date();
    const { abreviacion, nrosalida } = entityFind;
    const retval = `${abreviacion}-${nrosalida
      .toString()
      .padStart(5, '00000')}-${fecha.getFullYear()}`;
    return retval;
  } catch (error) {
    console.log(error);
    return -2;
  }
};

module.exports = {
  getAll,
  getOne,
  crtEntity,
  updEntity,
  delEntity,
  increment,
};
