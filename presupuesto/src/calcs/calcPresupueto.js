const cuentaOriginal = require("../../json/cuentas.json");

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
  const cuenta = addCuentaNo(cuentaOriginal);

  const ctasDeGrupo = cuenta.filter((cta) => cta.Año == anoTrabajo).sort(ordenCuentaDesc);
  let ctaAjustada = cuenta.filter((cta) => cta.Año == anoTrabajo).sort(ordenCuentaDesc);

  ctasDeGrupo.map(
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
