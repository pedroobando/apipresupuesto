const ceroleft = (valor, cantidad) => {
  return valor?.toString().padStart(cantidad, '0');
};

const ordenCuenta = (a, b) => (a.cuentaNo > b.cuentaNo ? 1 : a.cuentaNo < b.cuentaNo ? -1 : 0);

const ordenCuentaDesc = (a, b) =>
  a.cuentaNo < b.cuentaNo ? 1 : a.cuentaNo > b.cuentaNo ? -1 : 0;

const numeroCuenta = (cta) =>
  `${ceroleft(cta.Part, 2)}.${ceroleft(cta.Gene, 2)}.${ceroleft(cta.Espe, 2)}.${ceroleft(
    cta.Sub,
    2
  )}.${ceroleft(cta.Ordi, 3)}`;

const numeroCuentaFather = (cta) =>
  cta.Ordi > 0
    ? numeroCuenta(cta).slice(0, -4) + '.000'
    : cta.Ordi == 0 && cta.Sub > 0
    ? numeroCuenta(cta).slice(0, -7) + '.00.000'
    : cta.Ordi == 0 && cta.Sub == 0 && cta.Espe > 0
    ? numeroCuenta(cta).slice(0, -10) + '.00.00.000'
    : cta.Ordi == 0 && cta.Sub == 0 && cta.Espe == 0 && cta.Gene > 0
    ? numeroCuenta(cta).slice(0, -13) + '.00.00.00.000'
    : numeroCuenta(cta).slice(0, -13) + '.00.00.00.000';

const numeroCuentaCreateFather = (cuentaNo = '01.01.01.01.001') =>
  cuentaNo.slice(12, 0) >= '001'
    ? cuentaNo.slice(0, -4) + '.000'
    : cuentaNo.slice(9, -4) >= '01'
    ? cuentaNo.slice(0, -7) + '.00.000'
    : cuentaNo.slice(6, -7) >= '01'
    ? cuentaNo.slice(0, -10) + '.00.00.000'
    : cuentaNo.slice(3, -10) >= '01'
    ? cuentaNo.slice(0, -13) + '.00.00.00.000'
    : '00.00.00.00.000';

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
    cuentaNo: numeroCuenta(cta),
    fatherId: numeroCuentaFather(cta),
  }));

const verificarCuenta = (cuentaPresup, cuentaOrigen, nombreMonto) => {
  let plantCuentas = addCuentaNo(cuentaPresup);
  let cuentaVerificar = addCuentaNo(cuentaOrigen);

  plantCuentas = plantCuentas.sort(ordenCuenta);
  cuentaVerificar = cuentaVerificar.sort(ordenCuenta);

  plantCuentas.map((ctaFind) => {
    let cuentaExiste = cuentaVerificar.find((laCta) => laCta.cuentaNo == ctaFind.cuentaNo);
    if (!cuentaExiste) {
      const findFather = {
        cuentaNo: ctaFind.cuentaNo,
        fatherId: numeroCuentaCreateFather(ctaFind.cuentaNo),
        Referencia: '0000000',
        nombreCuenta: ctaFind.Descripcion,
        Observaciones: '',
        [nombreMonto]: 0,
        Dia: 30,
        Mes: 12,
        Año: ctaFind.Año,
        Nivel: ctaFind.Nivel,
      };
      cuentaVerificar = [...cuentaVerificar, findFather];
    } else {
      cuentaExiste = {
        ...cuentaExiste,
        nombreCuenta: ctaFind.Descripcion,
        Nivel: ctaFind.Nivel,
      };
      cuentaVerificar = [
        ...cuentaVerificar.filter((cta) => cta.cuentaNo !== ctaFind.cuentaNo),
        cuentaExiste,
      ];
    }
  });

  return cuentaVerificar;
};

module.exports = {
  ceroleft,
  ordenCuenta,
  ordenCuentaDesc,
  numeroCuenta,
  numeroCuentaCreateFather,
  sumaPadre,
  addCuentaNo,
  sumaCuenta,
  verificarCuenta,
};
