const cuentaOriginal = require("../../json/comprometido.json");

const {
  ordenCuenta,
  ordenCuentaDesc,
  addCuentaNo,
  sumaCuenta,
  numeroCuentaFather,
  numeroCuentaCreateFather,
  verificarCuenta,
} = require("./util");

const cuentaCompromiso = (anoTrabajo) => {
  const ctasPorAno = verificarCuenta(
    anoTrabajo,
    cuentaOriginal,
    "MontoComprometido"
  ).sort(ordenCuentaDesc);

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
        MontoComprometido: 0,
        Dia: 01,
        Mes: 01,
        Año: anoTrabajo,
        Nivel: 1,
      };
      ctaAjustada = [...ctaAjustada, findFather];
    }

    findFather = {
      ...findFather,
      MontoComprometido: sumaCuenta(
        ctaAjustada,
        "MontoComprometido",
        "fatherId",
        findFather.cuentaNo
      ),
    };
    ctaAjustada = [
      ...ctaAjustada.filter((ctaAj) => ctaAj.cuentaNo !== findFather.cuentaNo),
      findFather,
    ];
  });

  return ctaAjustada.sort(ordenCuenta);
};

module.exports = { cuentaCompromiso };
