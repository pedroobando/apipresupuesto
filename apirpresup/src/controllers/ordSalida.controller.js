const { response } = require('express');
const ordSalidaModel = require('../models/ordSalida');
const { increment } = require('./departamento.controller');

const crtEntity = async (req, res = response) => {
  const { uid } = req;
  // const { comentario } = req.body;

  try {
    const entity = new ordSalidaModel({
      ...req.body,
      fecharetorno: new Date(),
      fechaemision: new Date(),
      creador: uid,
    });
    entity.numerosec = await increment(entity.departamento);

    // if (comentario !== undefined) {
    // const comentarioAdd = {
    //   nota: entity.comentarioinicial,
    //   usuario: uid,
    //   fecha: new Date(),
    // };
    // entity.comentarios = [comentarioAdd];
    // }

    const entitySaved = await entity.save();
    return res.status(201).json({
      ok: true,
      data: entitySaved,
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

const getAll = async (req, res = response) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  // const activo = req.query.activo || false;
  const sort = req.query.sort || 'fechaemision';
  const sortType = parseInt(req.query.sorttype, 10) || 1;
  const selectDpto = req.query.seccion || '';
  const material = req.query.material.trim() || '';

  try {
    // let findCondition = activo
    //   ? { activo: true, departamento: selectDpto }
    //   : { departamento: selectDpto };

    // if (material.trim().length >= 1) {
    //   // const $regex = escapeStringRegexp(`/${material}/i`);
    //   findCondition.material = { $regex: material, $options: 'i' };
    // }

    const entities = await ordSalidaModel
      .find({ material: { $regex: material, $options: 'i' }, departamento: selectDpto })
      .limit(limit)
      .sort({ [sort]: sortType })
      .skip((page - 1) * limit)
      .populate('departamento', ['nombre'])
      .populate('solicitante', ['nombre'])
      .populate('aprobadoradm', ['nombre'])
      .populate('aprobadorseg', ['nombre'])
      .populate('transporte', ['placa'])
      .populate('creador', ['name'])
      .exec();

    const count = await ordSalidaModel.countDocuments({
      material: { $regex: material, $options: 'i' },
      departamento: selectDpto,
    });
    // .map((item) => ({
    //   ...item,
    //   departamento: { id: item.departamento._id, nombre: item.departamento.nombre },
    // }))
    return res.status(200).json({
      ok: true,
      data: entities,
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
  const { id } = req.params;
  try {
    if (id.length <= 10) {
      return res.status(400).json({
        ok: false,
        data: { message: 'Invalido codigo interno de busqueda' },
      });
    }

    const entity = await ordSalidaModel
      .findById(id)
      .populate('departamento', ['nombre', 'abreviacion'])
      .populate('solicitante', ['nombre', 'dni'])
      .populate('aprobadoradm', ['nombre', 'dni'])
      .populate('aprobadorseg', ['nombre', 'dni'])
      .populate('creador', ['name', 'fullname'])
      .populate('transporte', ['placa', 'marca', 'modelo', 'color']);
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

const getByNumeroSec = async (req, res = response) => {
  const { numerosec } = req.params;
  try {
    if (numerosec.length <= 6) {
      return res.status(404).json({
        ok: false,
        data: { message: 'Invalido numero' },
      });
    }

    const entity = await ordSalidaModel.findOne({ numerosec });
    if (!entity) {
      return res.status(404).json({
        ok: false,
        data: { message: `${numerosec} no localizado.` },
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
  const entityId = req.params.id;
  try {
    const entityFind = await ordSalidaModel.findById(entityId);
    if (!entityFind) {
      return res.status(404).json({
        ok: false,
        data: { message: 'Invalido codigo interno de busqueda' },
      });
    }

    const entity = { ...req.body };
    const entityUpdated = await ordSalidaModel.findByIdAndUpdate(entityId, entity, {
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
  const entityId = req.params.id;
  if (entityId.length <= 20) {
    return res.status(404).json({
      ok: false,
      data: { message: 'Invalido codigo interno de busqueda' },
    });
  }

  try {
    const entityFind = await ordSalidaModel.findById(entityId);
    if (!entityFind) {
      return res.status(404).json({
        ok: false,
        data: { message: 'Invalido codigo interno de busqueda.' },
      });
    }

    await ordSalidaModel.findByIdAndDelete(entityId);
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

const newNumeroSec = (departamentoId) => {
  return increment(departamentoId);
};

module.exports = {
  getAll,
  getOne,
  getByNumeroSec,
  crtEntity,
  updEntity,
  delEntity,
};
