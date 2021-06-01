const cuentaOriginal = require("../../json/pagos.json");

const {
  ordenCuenta,
  ordenCuentaDesc,
  addCuentaNo,
  sumaCuenta,
  numeroCuentaFather,
  numeroCuentaCreateFather,
} = require("./util");

const cuentaPagado = (anoTrabajo) => {
  const cuenta = addCuentaNo(cuentaOriginal);

  const ctasDeGrupo = cuenta.filter((cta) => cta.Año == anoTrabajo).sort(ordenCuentaDesc);
  let ctaAjustada = cuenta.filter((cta) => cta.Año == anoTrabajo).sort(ordenCuenta);

  ctasDeGrupo.map((laCta) => {
    let findFather = ctaAjustada.find((cta) => cta.cuentaNo == laCta.fatherId);

    if (!findFather) {
      findFather = {
        cuentaNo: laCta.fatherId,
        fatherId: numeroCuentaCreateFather(laCta.fatherId),
        Referencia: "0000000",
        Observaciones: "<< CUENTA FALTANTE >>",
        MontoPag: 0,
        Dia: 31,
        Mes: 12,
        Año: anoTrabajo,
      };
      ctaAjustada = [...ctaAjustada, findFather];
    }

    findFather = {
      ...findFather,
      MontoPag: sumaCuenta(ctaAjustada, "MontoPag", "fatherId", findFather.cuentaNo),
    };
    ctaAjustada = [
      ...ctaAjustada.filter((ctaAj) => ctaAj.cuentaNo !== findFather.cuentaNo),
      findFather,
    ];
  });

  // Ordena de nuevo la cuenta
  return ctaAjustada.sort(ordenCuenta);
};

module.exports = { cuentaPagado };
