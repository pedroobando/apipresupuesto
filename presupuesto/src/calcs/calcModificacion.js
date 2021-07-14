const cuentaOriginal = require("../../json/modificaciones.json");
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
  consolaPagado,
} = require("./util");

const cuentaModificacion = (anoTrabajo, mesTrabajo = 12) => {
  const ctasPorAno = addCuentaNo(
    cuentaPresupuerto.filter((cta) => cta.Año == anoTrabajo)
  ).sort(ordenCuentaDesc);

  let ctaAjustada = addCuentaNo(
    cuentaOriginal.filter((cta) => cta.Año == anoTrabajo && cta.Mes <= mesTrabajo)
  ).sort(ordenCuentaDesc);

  let ctaAjustadaII = [];
  ctasPorAno.map((laCta) => {
    const sumCtaMes = ctaAjustada.reduce((prev, curr) => {
      return (
        prev +
        (laCta.cuentaNo === curr.cuentaNo && curr.Mes === mesTrabajo ? curr.MontoMod : 0)
      );
    }, 0);
    const sumCtaTotal = ctaAjustada.reduce((prev, curr) => {
      return prev + (laCta.cuentaNo === curr.cuentaNo ? curr.MontoMod : 0);
    }, 0);
    ctaAjustadaII = [
      ...ctaAjustadaII,
      { ...laCta, MontoMod: sumCtaTotal, MontoModMes: sumCtaMes },
    ];

    const sumCtaMesF = ctaAjustadaII.reduce((prev, curr) => {
      return prev + (laCta.cuentaNo === curr.fatherId ? curr.MontoModMes : 0);
    }, 0);
    const sumCtaTotalF = ctaAjustadaII.reduce((prev, curr) => {
      return prev + (laCta.cuentaNo === curr.fatherId ? curr.MontoMod : 0);
    }, 0);
    if (sumCtaTotalF !== 0) {
      ctaAjustadaII = [
        ...ctaAjustadaII.filter((ctaMod) => ctaMod.cuentaNo !== laCta.cuentaNo),
        { ...laCta, MontoMod: sumCtaTotalF, MontoModMes: sumCtaMesF },
      ];
    }
  });
  fse.writeJson("ctaAjustadaII.json", ctaAjustadaII.sort(ordenCuenta));
  return ctaAjustadaII.sort(ordenCuenta);
};

module.exports = { cuentaModificacion };
