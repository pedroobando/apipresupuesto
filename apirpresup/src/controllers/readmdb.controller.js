const { response } = require("express");

const { query } = require("../database/dbcnn");

const cnndb = "./PresupuestoData2013.accdb";
const orderBy = "ORDER BY Año, Part, Gene, Espe, Sub";

const prefile = "./json";

const messageError=()=>res.status(500).json({
  ok: false,
  data: {
    message: "Consulte con el administrador",
  },
});

const getCuenta = async (req, res = response) => {
  const { year } = req.params;
  try {
    resultJson = await query(
      cnndb,
      `Select * from Cuentas where Año >= ${year} and Año <= ${year} ${orderBy}`
    );
    return res.status(200).json(resultJson);
  } catch (error) {
    messageError();
  }
};

const getModificacion = async (req, res = response) => {
  const { year } = req.params;
  try {
    resultJson = await query(
      cnndb,
      `Select * from Modificaciones where Año >= ${year} and Año <= ${year} ${orderBy}`
    );
    return res.status(200).json(resultJson);
  } catch (error) {
    messageError();
  }
};


const getComprometido = async (req, res = response) => {
  const { year } = req.params;
  try {
    resultJson = await query(
      cnndb,
      `Select * from Comprometido where Año >= ${year} and Año <= ${year} ${orderBy}`
    );
    return res.status(200).json(resultJson);
  } catch (error) {
    messageError();
  }
};


const getCausado = async (req, res = response) => {
  const { year } = req.params;
  try {
    resultJson = await query(
      cnndb,
      `Select * from Causado where Año >= ${year} and Año <= ${year} ${orderBy}`
    );
    return res.status(200).json(resultJson);
  } catch (error) {
    messageError();
  }
};


const getPagado = async (req, res = response) => {
  const { year } = req.params;
  try {
    resultJson = await query(
      cnndb,
      `Select * from Pagos where Año >= ${year} and Año <= ${year} ${orderBy}`
    );
    return res.status(200).json(resultJson);
  } catch (error) {
    messageError();
  }
};

module.exports = { getCuenta, getComprometido,getCausado,getModificacion,getPagado };
