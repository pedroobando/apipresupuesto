"use strict";

const chalk = require("chalk");

const ceroleft = (valor, cantidad) => {
  return valor.toString().padStart(cantidad, "0");
};

const ordenCuenta = (a, b) =>
  a.cuentaNo > b.cuentaNo ? 1 : a.cuentaNo < b.cuentaNo ? -1 : 0;

const ordenCuentaDesc = (a, b) =>
  a.cuentaNo < b.cuentaNo ? 1 : a.cuentaNo > b.cuentaNo ? -1 : 0;

const consolaPresup = (record) =>
  `${chalk.blueBright(record.cuentaNo)} |${chalk.blue(record.fatherId)} |${
    record.Tipo !== "D" ? "---" : "==>"
  } |${chalk.yellow(record.Descripcion)} |${chalk.blue(record.Inicial)}`;

const consolaCompromiso = (record) =>
  `${record.cuentaNo} |${record.fatherId} |${record.Referencia} |${record.Observaciones}  |${record.MontoComprometido}`;

const consolaCausado = (record) =>
  `${record.cuentaNo} |${record.fatherId} |${record.Referencia} |${record.Observaciones}  |${record.MontoCausado}`;

const consolaPagado = (record) =>
  `${record.cuentaNo} |${record.fatherId} |${record.Referencia} |${record.Observaciones}  |${record.MontoPag}`;

const consolaModif = (record) =>
  `${record.cuentaNo} |${record.fatherId} |${record.TipoMod} |${record.Observaciones}  |${record.MontoMod}`;

const numeroCuenta = (cta) =>
  `${ceroleft(cta.Part, 2)}.${ceroleft(cta.Gene, 2)}.${ceroleft(cta.Espe, 2)}.${ceroleft(
    cta.Sub,
    2
  )}.${ceroleft(cta.Ordi, 3)}`;

const numeroCuentaFather = (cta) =>
  cta.Ordi > 0
    ? numeroCuenta(cta).slice(0, -4) + ".000"
    : cta.Ordi == 0 && cta.Sub > 0
    ? numeroCuenta(cta).slice(0, -7) + ".00.000"
    : cta.Ordi == 0 && cta.Sub == 0 && cta.Espe > 0
    ? numeroCuenta(cta).slice(0, -10) + ".00.00.000"
    : cta.Ordi == 0 && cta.Sub == 0 && cta.Espe == 0 && cta.Gene > 0
    ? numeroCuenta(cta).slice(0, -13) + ".00.00.00.000"
    : numeroCuenta(cta).slice(0, -13) + ".00.00.00.000";

const numeroCuentaCreateFather = (cuentaNo = "01.01.01.01.001") =>
  cuentaNo.slice(12, 0) >= "001"
    ? cuentaNo.slice(0, -4) + ".000"
    : cuentaNo.slice(9, -4) >= "01"
    ? cuentaNo.slice(0, -7) + ".00.000"
    : cuentaNo.slice(6, -7) >= "01"
    ? cuentaNo.slice(0, -10) + ".00.00.000"
    : cuentaNo.slice(3, -10) >= "01"
    ? cuentaNo.slice(0, -13) + ".00.00.00.000"
    : "00.00.00.00.000";

const sumaCuenta = (laColleccion, amoutName, accountName, accountFather) => {
  var totSumaCuenta = 0;
  laColleccion
    .filter((item) => item[accountName] == accountFather)
    .forEach((element) => {
      totSumaCuenta += element[amoutName];
    });
  return totSumaCuenta;
};

const sumaPadre = (laColleccion, elPadre) => {
  var total = 0;
  laColleccion
    .filter((item) => item.fatherId == elPadre)
    .forEach((element) => {
      total += element.Inicial;
    });
  return total;
};

const addCuentaNo = (laColleccion) =>
  laColleccion.map((cta) => ({
    ...cta,
    // cuentaId: `${cta.Año}.${numeroCuenta(cta)}`,
    cuentaNo: numeroCuenta(cta),
    fatherId: numeroCuentaFather(cta),
  }));

module.exports = {
  ceroleft,
  ordenCuenta,
  ordenCuentaDesc,
  numeroCuenta,
  numeroCuentaCreateFather,
  sumaPadre,
  addCuentaNo,
  sumaCuenta,
  consolaCompromiso,
  consolaPresup,
  consolaCausado,
  consolaPagado,
  consolaModif,
};
