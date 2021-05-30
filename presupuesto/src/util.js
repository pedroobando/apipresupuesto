"use strict";

const ceroleft = (valor, cantidad) => {
  return valor.toString().padStart(cantidad, "0");
};

const ordenCuenta = (a, b) =>
  a.cuentaNo > b.cuentaNo ? 1 : a.cuentaNo < b.cuentaNo ? -1 : 0;

const ordenCuentaDesc = (a, b) =>
  a.cuentaNo < b.cuentaNo ? 1 : a.cuentaNo > b.cuentaNo ? -1 : 0;

const consolaPresup = (record) =>
  `${record.cuentaNo} ${record.fatherId} ${record.Tipo !== "D" ? "---" : "==>"} ${
    record.Descripcion
  } -  ${record.Inicial}`;

const consolaCompromiso = (record) =>
  `${record.cuentaNo} ${record.fatherId} --- ${record.Referencia} ${record.Observaciones} -  ${record.MontoComprometido}`;

const numeroCuenta = (cta) =>
  `${ceroleft(cta.Part, 2)}.${ceroleft(cta.Gene, 2)}.${ceroleft(cta.Espe, 2)}.${ceroleft(
    cta.Sub,
    2
  )}.${ceroleft(cta.Ordi, 3)}`;

const sumaCuenta = (laColleccion, amoutName, accountName, accountFather) => {
  var total = 0;
  laColleccion
    .filter((item) => item[accountName] == accountFather)
    .forEach((element) => {
      total += element[amoutName];
    });
  return total;
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
    fatherId:
      cta.Ordi > 0
        ? numeroCuenta(cta).slice(0, -4) + ".000"
        : cta.Ordi == 0 && cta.Sub > 0
        ? numeroCuenta(cta).slice(0, -7) + ".00.000"
        : cta.Ordi == 0 && cta.Sub == 0 && cta.Espe > 0
        ? numeroCuenta(cta).slice(0, -10) + ".00.00.000"
        : cta.Ordi == 0 && cta.Sub == 0 && cta.Espe == 0 && cta.Gene > 0
        ? numeroCuenta(cta).slice(0, -13) + ".00.00.00.000"
        : numeroCuenta(cta).slice(0, -13) + ".00.00.00.000",
  }));

module.exports = {
  ceroleft,
  ordenCuenta,
  ordenCuentaDesc,
  numeroCuenta,
  sumaPadre,
  addCuentaNo,
  sumaCuenta,
  consolaCompromiso,
  consolaPresup,
};
