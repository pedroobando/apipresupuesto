const cuentaOriginal = require("../../json/cuentas.json");
const fse = require("fs-extra");

const {
  ceroleft,
  ordenCuenta,
  ordenCuentaDesc,
  numeroCuenta,
  addCuentaNo,
  sumaCuenta,
  consolaCompromiso,
  consolaPresup,
  numeroCuentaCreateFather,
} = require("./util");

// Cuentas de Presupuesto
const cuentaPresupuesto = (anoTrabajo) => {
  const ctasPorAno = addCuentaNo(cuentaOriginal.filter((cta) => cta.Año == anoTrabajo)).sort(
    ordenCuentaDesc
  );
  let ctaAjustada = addCuentaNo(cuentaOriginal.filter((cta) => cta.Año == anoTrabajo)).sort(
    ordenCuentaDesc
  );

  // fse.writeJson("cuentasano.json", ctasPorAno);
  // fse.writeJson("cuentasajustada.json", ctaAjustada);
  ctasPorAno.map(
    (laCta) => {
      let findFather = ctaAjustada.find((cta) => cta.cuentaNo == laCta.fatherId);

      if (!findFather) {
        findFather = {
          cuentaNo: laCta.fatherId,
          fatherId: numeroCuentaCreateFather(laCta.fatherId),
          Descripcion: "<< CUENTA FALTANTE >>",
          Inicial: 0,
        };
        ctaAjustada = [...ctaAjustada, findFather];
      }

      // if (findFather) {
      findFather = {
        ...findFather,
        Inicial: sumaCuenta(ctaAjustada, "Inicial", "fatherId", findFather.cuentaNo),
      };
      ctaAjustada = [
        ...ctaAjustada.filter((ctaAj) => ctaAj.cuentaNo !== findFather.cuentaNo),
        findFather,
      ];
    }
    // }
  );

  // Ordena de nuevo la cuenta
  return ctaAjustada.sort(ordenCuenta);
};

module.exports = { cuentaPresupuesto };
