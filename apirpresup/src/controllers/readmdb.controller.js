const { response } = require('express');

const { cuentaCausado } = require('../calculos/causado.calculo');
const { cuentaCompromiso } = require('../calculos/compromiso.calculo');
const { cuentaModificacion } = require('../calculos/modificacion.calculo');
const { cuentaPagado } = require('../calculos/pagado.calculo');
const { cuentaPresupuesto } = require('../calculos/presupuesto.calculo');

const { query } = require('../database/dbcnn');

const cnndb = process.env.ACCDB || './PresupuestoData2013.accdb';
const orderBy = 'ORDER BY Año, Part, Gene, Espe, Sub';

const getCuenta = async (req, res = response) => {
  const { year } = req.params;
  try {
    const resultJson = await query(
      cnndb,
      `Select * from Cuentas where [Año] = ${year} ${orderBy}`
    );
    const resultCuenta = cuentaPresupuesto(resultJson);
    return res.status(200).json(resultCuenta);
  } catch (error) {
    res.status(500).json({
      ok: false,
      data: {
        message: 'Consulte con el administrador',
      },
      error,
    });
  }
};

const getModificado = async (req, res = response) => {
  const { year } = req.params;
  try {
    const resultPresup = await query(
      cnndb,
      `Select * from Cuentas where [Año] = ${year} ${orderBy}`
    );
    const resultModif = await query(
      cnndb,
      `Select * from Modificaciones where [Año] = ${year} ${orderBy}`
    );
    const resultCuenta = cuentaModificacion(resultPresup, resultModif);
    return res.status(200).json(resultCuenta);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      data: {
        message: 'Consulte con el administrador',
        modulo: 'getModificado',
      },
      error,
    });
  }
};

const getCompromiso = async (req, res = response) => {
  const { year } = req.params;
  try {
    const resultPresup = await query(
      cnndb,
      `Select * from Cuentas where [Año] = ${year} ${orderBy}`
    );
    const resultCompromiso = await query(
      cnndb,
      `Select * from Comprometido where [Año] = ${year} ${orderBy}`
    );
    const resultCuenta = cuentaCompromiso(resultPresup, resultCompromiso);
    return res.status(200).json(resultCuenta);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      data: {
        message: 'Consulte con el administrador',
        modulo: 'getCompromiso',
      },
      error,
    });
  }
};

const getCausado = async (req, res = response) => {
  const { year } = req.params;
  try {
    const resultPresup = await query(
      cnndb,
      `Select * from Cuentas where [Año] = ${year} ${orderBy}`
    );
    const resultCausado = await query(
      cnndb,
      `Select * from Causado where [Año] = ${year} ${orderBy}`
    );
    const resultCuenta = cuentaCausado(resultPresup, resultCausado);
    return res.status(200).json(resultCuenta);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      data: {
        message: 'Consulte con el administrador',
        modulo: 'getCausado',
      },
      error,
    });
  }
};

const getPagado = async (req, res = response) => {
  const { year } = req.params;
  try {
    const resultPresup = await query(
      cnndb,
      `Select * from Cuentas where [Año] = ${year} ${orderBy}`
    );
    const resultPagado = await query(
      cnndb,
      `Select * from Pagos where [Año] = ${year} ${orderBy}`
    );
    const resultCuenta = cuentaPagado(resultPresup, resultPagado);
    return res.status(200).json(resultCuenta);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      data: {
        message: 'Consulte con el administrador',
        modulo: 'getPagado',
      },
      error,
    });
  }
};

module.exports = { getCuenta, getCompromiso, getCausado, getModificado, getPagado };
