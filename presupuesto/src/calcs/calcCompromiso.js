const cuentaOriginal = require("../../json/comprometido.json");
const cuentaPresupuerto = require("../../json/cuentas.json");
const fse = require("fs-extra");
const {
  ordenCuenta,
  ordenCuentaDesc,
  addCuentaNo,
  sumaCuenta,
  numeroCuentaFather,
  numeroCuentaCreateFather,
  verificarCuenta,
} = require("./util");

const cuentaCompromiso = (anoTrabajo, mesTrabajo = 12) => {
  const ctasPorAno = addCuentaNo(
    cuentaPresupuerto.filter((cta) => cta.Año == anoTrabajo)
  ).sort(ordenCuentaDesc);

  let ctaAjustada = addCuentaNo(
    cuentaOriginal.filter((cta) => cta.Año == anoTrabajo && cta.Mes <= mesTrabajo)
  ).sort(ordenCuentaDesc);

  let ctaAjustadaII = [];
  ctasPorAno.map((laCta) => {
    const sumCtaTotal = ctaAjustada.reduce((prev, curr) => {
      return prev + (laCta.cuentaNo === curr.cuentaNo ? curr.MontoComprometido : 0);
    }, 0);
    ctaAjustadaII = [...ctaAjustadaII, { ...laCta, MontoComprometido: sumCtaTotal }];

    const sumCtaTotalF = ctaAjustadaII.reduce((prev, curr) => {
      return prev + (laCta.cuentaNo === curr.fatherId ? curr.MontoComprometido : 0);
    }, 0);
    if (sumCtaTotalF > 0) {
      ctaAjustadaII = [
        ...ctaAjustadaII.filter((ctaMod) => ctaMod.cuentaNo !== laCta.cuentaNo),
        { ...laCta, MontoComprometido: sumCtaTotalF },
      ];
    }
  });
  fse.writeJson("ctaAjustadaII.json", ctaAjustadaII);
  return ctaAjustadaII.sort(ordenCuenta);
};

module.exports = { cuentaCompromiso };
