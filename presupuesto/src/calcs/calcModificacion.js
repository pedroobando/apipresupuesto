const cuentaOriginal = require("../../json/modificaciones.json");

const {
  ordenCuenta,
  ordenCuentaDesc,
  addCuentaNo,
  sumaCuenta,
  numeroCuentaFather,
  numeroCuentaCreateFather,
  verificarCuenta,
} = require("./util");

const cuentaModificacion = (anoTrabajo) => {
  const ctasPorAno = verificarCuenta(anoTrabajo, cuentaOriginal, "MontoMod").sort(
    ordenCuentaDesc
  );

  let ctaAjustada = ctasPorAno.filter((cta) => cta.Año == anoTrabajo).sort(ordenCuenta);

  ctasPorAno.map((laCta) => {
    let findFather = ctaAjustada.find((cta) => cta.cuentaNo == laCta.fatherId);

    if (!findFather) {
      findFather = {
        cuentaNo: laCta.fatherId,
        fatherId: numeroCuentaCreateFather(laCta.fatherId),
        Referencia: "0000000",
        nombreCuenta: "<< CUENTA FALTANTE >>",
        Observaciones: "<< CUENTA FALTANTE >>",
        MontoMod: 0,
        Dia: 01,
        Mes: 01,
        Año: anoTrabajo,
        TipoMod: "CF",
        Nivel: 1,
      };
      ctaAjustada = [...ctaAjustada, findFather];
    }

    findFather = {
      ...findFather,
      MontoMod: sumaCuenta(ctaAjustada, "MontoMod", "fatherId", findFather.cuentaNo),
    };
    ctaAjustada = [
      ...ctaAjustada.filter((ctaAj) => ctaAj.cuentaNo !== findFather.cuentaNo),
      findFather,
    ];
  });
  return ctaAjustada.sort(ordenCuenta);
};

module.exports = { cuentaModificacion };
