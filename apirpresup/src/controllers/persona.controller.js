const { response, request } = require('express');
const personaModel = require('../models/persona');

const crtEntity = async (req, res = response) => {
  const entity = new personaModel(req.body);
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
        data: { mensaje: `Duplicidad en identificación: ${keyValue.dni}` },
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

const getAll = async (req = request, res = response) => {
  const { page = 1, limit = 10, sort = '', typepersona = '', activo = false } = req.query;
  const optionPage = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort };
  // let findCondition = activo ? { activo: true } : {};
  let findConditionPersona = undefined;
  if (typepersona === 'administrador') {
    findConditionPersona = { aprobadoradm: true };
  }
  if (typepersona === 'seguridad') {
    findConditionPersona = { aprobadorseg: true };
  }

  if (activo && findConditionPersona !== undefined) {
    findConditionPersona = { ...findConditionPersona, activo: true };
  }

  if (activo && findConditionPersona === undefined) {
    findConditionPersona = { activo: true };
  }
  try {
    const entities = await personaModel.paginate(findConditionPersona, optionPage);
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

    const entity = await personaModel.findById(id);
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

const getByDni = async (req, res = response) => {
  const { dni } = req.params;
  try {
    if (dni.length <= 2) {
      return res.status(404).json({
        ok: false,
        data: { message: 'Invalida identificacion' },
      });
    }

    const entity = await personaModel.findOne({ dni });
    if (!entity) {
      return res.status(404).json({
        ok: false,
        data: { message: `Identificacion ${dni} no localizada` },
      });
    }

    res.status(200).json({
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
  const personaId = req.params.id;
  try {
    const entityFind = await personaModel.findById(personaId);
    if (!entityFind) {
      return res.status(404).json({
        ok: false,
        data: { message: 'Invalido codigo interno de busqueda' },
      });
    }

    const entity = { ...req.body };
    const entityUpdated = await personaModel.findByIdAndUpdate(personaId, entity, {
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

const delEntity = async (req, res = response) => {
  const personaId = req.params.id;
  if (personaId.length <= 20) {
    return res.status(404).json({
      ok: false,
      data: { message: 'Invalido codigo interno de busqueda' },
    });
  }

  try {
    const entityFind = await personaModel.findById(personaId);
    if (!entityFind) {
      return res.status(404).json({
        ok: false,
        data: { message: 'Invalido codigo interno de busqueda.' },
      });
    }

    await personaModel.findByIdAndDelete(personaId);
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

module.exports = {
  getAll,
  getOne,
  getByDni,
  crtEntity,
  updEntity,
  delEntity,
};
