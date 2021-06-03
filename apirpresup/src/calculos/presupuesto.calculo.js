const {
  ordenCuenta,
  ordenCuentaDesc,
  addCuentaNo,
  sumaCuenta,
  numeroCuentaCreateFather,
} = require('../helpers/utilCuentas');

// Cuentas de Presupuesto
const cuentaPresupuesto = (cuentaOriginal) => {
  try {
    const ctasPorAno = addCuentaNo(cuentaOriginal).sort(ordenCuentaDesc);
    let ctaAjustada = addCuentaNo(cuentaOriginal).sort(ordenCuentaDesc);

    ctasPorAno.map((laCta) => {
      let findFather = ctaAjustada.find((cta) => cta.cuentaNo == laCta.fatherId);

      if (!findFather) {
        findFather = {
          cuentaNo: laCta.fatherId,
          fatherId: numeroCuentaCreateFather(laCta.fatherId),
          Descripcion: '<< CUENTA FALTANTE >>',
          Inicial: 0,
        };
        ctaAjustada = [...ctaAjustada, findFather];
      }
      findFather = {
        ...findFather,
        Inicial: sumaCuenta(ctaAjustada, 'Inicial', 'fatherId', findFather.cuentaNo),
      };
      ctaAjustada = [
        ...ctaAjustada.filter((ctaAj) => ctaAj.cuentaNo !== findFather.cuentaNo),
        findFather,
      ];
    });

    // Ordena de nuevo la cuenta
    return ctaAjustada.sort(ordenCuenta);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { cuentaPresupuesto };
