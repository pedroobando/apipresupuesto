const cuentaOriginal = require("../../json/causado.json");
const cuentaPresupuerto = require("../../json/cuentas.json");

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
    const sumCtaTotal = ctaAjustada.reduce((prev, curr) => {
      return prev + (laCta.cuentaNo === curr.cuentaNo ? curr.MontoCausado : 0);
    }, 0);
    ctaAjustadaII = [...ctaAjustadaII, { ...laCta, MontoCausado: sumCtaTotal }];

    const sumCtaTotalF = ctaAjustadaII.reduce((prev, curr) => {
      return prev + (laCta.cuentaNo === curr.fatherId ? curr.MontoCausado : 0);
    }, 0);
    // if (sumCtaTotalF > 0) {
    //   ctaAjustadaII = [
    //     ...ctaAjustadaII.filter((ctaMod) => ctaMod.cuentaNo !== laCta.cuentaNo),
    //     { ...laCta, MontoCausado: sumCtaTotalF },
    //   ];
    // }
  });
  // fse.writeJson("ctaAjustadaII.json", ctaAjustadaII);
  return ctaAjustadaII.sort(ordenCuenta);
};

//   ctasPorAno.map((laCta) => {
//     let findFather = ctaAjustada.find((cta) => cta.cuentaNo == laCta.fatherId);

//     if (!findFather) {
//       findFather = {
//         cuentaNo: laCta.fatherId,
//         fatherId: numeroCuentaCreateFather(laCta.fatherId),
//         Referencia: "0000000",
//         nombreCuenta: "<< CUENTA FALTANTE >>",
//         Observaciones: "<< CUENTA FALTANTE >>",
//         MontoCausado: 0,
//         Dia: 01,
//         Mes: 01,
//         Año: anoTrabajo,
//         Nivel: 1,
//       };
//       ctaAjustada = [...ctaAjustada, findFather];
//     }

//     findFather = {
//       ...findFather,
//       MontoCausado: sumaCuenta(ctaAjustada, "MontoCausado", "fatherId", findFather.cuentaNo),
//     };
//     ctaAjustada = [
//       ...ctaAjustada.filter((ctaAj) => ctaAj.cuentaNo !== findFather.cuentaNo),
//       findFather,
//     ];
//   });
//   return ctaAjustada.sort(ordenCuenta);
// };

module.exports = { cuentaCausado };
