const {
  ordenCuenta,
  ordenCuentaDesc,
  addCuentaNo,
  sumaCuenta,
  verificarCuenta,
  numeroCuentaCreateFather,
} = require('../helpers/utilCuentas');

const cuentaModificacion = (cuentaPresup, cuentaRevisar) => {
  // const ctasPorAno = addCuentaNo(cuentaOriginal).sort(ordenCuentaDesc);
  // let ctaAjustada = addCuentaNo(cuentaOriginal).sort(ordenCuentaDesc);

  const ctasPorAno = verificarCuenta(cuentaPresup, cuentaRevisar, 'MontoMod').sort(
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
        MontoMod: 0,
        Dia: 01,
        Mes: 01,
        Año: anoTrabajo,
        TipoMod: 'CF',
        Nivel: 1,
      };
      ctaAjustada = [...ctaAjustada, findFather];
    }

    findFather = {
      ...findFather,
      MontoMod: sumaCuenta(ctaAjustada, 'MontoMod', 'fatherId', findFather.cuentaNo),
    };
    ctaAjustada = [
      ...ctaAjustada.filter((ctaAj) => ctaAj.cuentaNo !== findFather.cuentaNo),
      findFather,
    ];
  });
  return ctaAjustada.sort(ordenCuenta);
};

module.exports = { cuentaModificacion };
