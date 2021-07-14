const cuentaOriginal = require("../../json/causado.json");
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

const cuentaCausado = (anoTrabajo, mesTrabajo = 12) => {
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
        (laCta.cuentaNo === curr.cuentaNo && curr.Mes === mesTrabajo ? curr.MontoCausado : 0)
      );
    }, 0);
    const sumCtaTotal = ctaAjustada.reduce((prev, curr) => {
      return prev + (laCta.cuentaNo === curr.cuentaNo ? curr.MontoCausado : 0);
    }, 0);
    ctaAjustadaII = [
      ...ctaAjustadaII,
      { ...laCta, MontoCausado: sumCtaTotal, MontoCausadoMes: sumCtaMes },
    ];

    const sumCtaMesF = ctaAjustadaII.reduce((prev, curr) => {
      return prev + (laCta.cuentaNo === curr.fatherId ? curr.MontoCausadoMes : 0);
    }, 0);
    const sumCtaTotalF = ctaAjustadaII.reduce((prev, curr) => {
      return prev + (laCta.cuentaNo === curr.fatherId ? curr.MontoCausado : 0);
    }, 0);
    if (sumCtaTotalF !== 0) {
      ctaAjustadaII = [
        ...ctaAjustadaII.filter((ctaMod) => ctaMod.cuentaNo !== laCta.cuentaNo),
        { ...laCta, MontoCausado: sumCtaTotalF, MontoCausadoMes: sumCtaMesF },
      ];
    }
  });
  // fse.writeJson("ctaAjustadaII.json", ctaAjustadaII);
  return ctaAjustadaII.sort(ordenCuenta);
};

module.exports = { cuentaCausado };
