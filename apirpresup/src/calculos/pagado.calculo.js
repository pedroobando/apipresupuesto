const {
  ordenCuenta,
  ordenCuentaDesc,
  sumaCuenta,
  verificarCuenta,
  numeroCuentaCreateFather,
} = require('../helpers/utilCuentas');

const cuentaPagado = (cuentaPresup, cuentaRevisar) => {
  const ctasPorAno = verificarCuenta(cuentaPresup, cuentaRevisar, 'MontoPag').sort(
    ordenCuentaDesc
  );

  let ctaAjustada = ctasPorAno.sort(ordenCuenta);

  ctasPorAno.map((laCta) => {
    let findFather = ctaAjustada.find((cta) => cta.cuentaNo == laCta.fatherId);

    if (!findFather) {
      findFather = {
        cuentaNo: laCta.fatherId,
        fatherId: numeroCuentaCreateFather(laCta.fatherId),
        Referencia: '0000000',
        nombreCuenta: '<< CUENTA FALTANTE >>',
        Observaciones: '<< CUENTA FALTANTE >>',
        MontoPag: 0,
        Dia: 01,
        Mes: 01,
        Año: laCta.Año,
        TipoMod: 'CF',
        Nivel: 1,
      };
      ctaAjustada = [...ctaAjustada, findFather];
    }

    findFather = {
      ...findFather,
      MontoPag: sumaCuenta(ctaAjustada, 'MontoPag', 'fatherId', findFather.cuentaNo),
    };
    ctaAjustada = [
      ...ctaAjustada.filter((ctaAj) => ctaAj.cuentaNo !== findFather.cuentaNo),
      findFather,
    ];
  });
  return ctaAjustada.sort(ordenCuenta);
};

module.exports = { cuentaPagado };
