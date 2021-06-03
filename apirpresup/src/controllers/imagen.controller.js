const { response, request } = require('express');
const imagenModel = require('../models/imagen');
const fse = require('fs-extra');

const crtEntity = async (req, res = response) => {
  const { ordsalida } = req.body;
  const entity = new imagenModel(req.file);
  const fileExtension = entity.originalname.split('.').pop();
  const fileName = `${entity.filename}.${fileExtension}`;
  const newDestino = `${entity.path}.${fileExtension}`;
  const oldDestino = entity.path;
  try {
    entity.ordsalida = ordsalida;
    entity.filename = fileName;
    entity.path = newDestino;
    entity.url = `images/${fileName}`;
    rename(oldDestino, newDestino);
    const entitySaved = await entity.save();
    return res.status(201).json({
      ok: true,
      data: entitySaved,
    });
  } catch (error) {
    console.log(error);
    const { code, keyValue } = error;
    res.status(500).json({
      ok: false,
      data: {
        message: 'Consulte con el administrador',
      },
    });
  }
};

const getAll = async (req = request, res = response) => {
  const { page = 1, limit = 10, sort = '', ordsalida = '' } = req.query;
  const optionPage = { page: parseInt(page, 10), limit: parseInt(limit, 10), sort };
  const condOrdSalida = ordsalida !== '' ? { ordsalida } : {};

  // const thePort = process.env.PORT || 4000;
  // var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // console.log(ip);
  // console.log(req.connection);
  try {
    const entities = await imagenModel.paginate(condOrdSalida, optionPage);
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

    const entity = await imagenModel.findById(id);
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

const delEntity = async (req, res = response) => {
  const imagenId = req.params.id;
  if (imagenId.length <= 20) {
    return res.status(404).json({
      ok: false,
      data: { message: 'Invalido codigo interno de busqueda' },
    });
  }

  try {
    const entityFind = await imagenModel.findById(imagenId);
    if (!entityFind) {
      return res.status(404).json({
        ok: false,
        data: { message: 'Invalido codigo interno de busqueda.' },
      });
    }

    // entityFind;
    fse.remove(entityFind.path).then(async (err) => {
      if (!err) {
        await imagenModel.findByIdAndDelete(imagenId);
        return res.status(200).json({
          ok: true,
        });
      }
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

const rename = (oldfile, newfile) => {
  try {
    fse.copy(oldfile, newfile).then(() => {
      fse.remove(oldfile).then((err) => {
        if (err) return console.error(err);
      });
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getAll,
  getOne,
  crtEntity,
  delEntity,
};
