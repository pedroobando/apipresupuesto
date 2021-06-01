const cuentaOriginal = require("../../json/comprometido.json");

const {
  ordenCuenta,
  ordenCuentaDesc,
  addCuentaNo,
  sumaCuenta,
  numeroCuentaFather,
  numeroCuentaCreateFather,
} = require("./util");

const cuentaCompromiso = (anoTrabajo) => {
  const cuenta = addCuentaNo(cuentaOriginal);

  const ctasDeGrupo = cuenta.filter((cta) => cta.Año == anoTrabajo).sort(ordenCuentaDesc);
  let ctaAjustadaComp = cuenta.filter((cta) => cta.Año == anoTrabajo).sort(ordenCuenta);

  ctasDeGrupo.map((laCta) => {
    let findFather = ctaAjustadaComp.find((cta) => cta.cuentaNo == laCta.fatherId);
    const notfindFather = !!findFather;

    if (!findFather) {
      findFather = {
        cuentaNo: laCta.fatherId,
        fatherId: numeroCuentaCreateFather(laCta.fatherId),
        Referencia: "0000000",
        Observaciones: "<< CUENTA FALTANTE >>",
        MontoComprometido: 0,
        Dia: 31,
        Mes: 12,
        Año: anoTrabajo,
      };
      ctaAjustadaComp = [...ctaAjustadaComp, findFather];
    }

    findFather = {
      ...findFather,
      MontoComprometido: sumaCuenta(
        ctaAjustadaComp,
        "MontoComprometido",
        "fatherId",
        findFather.cuentaNo
      ),
    };

    ctaAjustadaComp = [
      ...ctaAjustadaComp.filter((ctaAj) => ctaAj.cuentaNo !== findFather.cuentaNo),
      findFather,
    ];
  });

  // Ordena de nuevo la cuenta
  return ctaAjustadaComp.sort(ordenCuenta);
};

module.exports = { cuentaCompromiso };
