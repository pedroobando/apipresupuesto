const cuentaOriginal = require("../../json/pagos.json");
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

const cuentaPagado = (anoTrabajo, mesTrabajo = 12) => {
  // const ctasPorAno = verificarCuenta(anoTrabajo, cuentaOriginal, "MontoPag").sort(
  //   ordenCuentaDesc
  // );

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
        (laCta.cuentaNo === curr.cuentaNo && curr.Mes === mesTrabajo ? curr.MontoPag : 0)
      );
    }, 0);
    const sumCtaTotal = ctaAjustada.reduce((prev, curr) => {
      return prev + (laCta.cuentaNo === curr.cuentaNo ? curr.MontoPag : 0);
    }, 0);
    ctaAjustadaII = [
      ...ctaAjustadaII,
      { ...laCta, MontoPag: sumCtaTotal, MontoPagMes: sumCtaMes },
    ];

    const sumCtaMesF = ctaAjustadaII.reduce((prev, curr) => {
      return prev + (laCta.cuentaNo === curr.fatherId ? curr.MontoPagMes : 0);
    }, 0);
    const sumCtaTotalF = ctaAjustadaII.reduce((prev, curr) => {
      return prev + (laCta.cuentaNo === curr.fatherId ? curr.MontoPag : 0);
    }, 0);
    if (sumCtaTotalF !== 0) {
      ctaAjustadaII = [
        ...ctaAjustadaII.filter((ctaMod) => ctaMod.cuentaNo !== laCta.cuentaNo),
        { ...laCta, MontoPag: sumCtaTotalF, MontoPagMes: sumCtaMesF },
      ];
    }
  });
  return ctaAjustadaII.sort(ordenCuenta);
};

module.exports = { cuentaPagado };
