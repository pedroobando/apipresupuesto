const cuenta = require("../json/cuentas.json");
const cuentaCompromiso = require("../json/comprometido.json");
// let cuenta = require("../json/modificaciones.json");

const {
  ceroleft,
  ordenCuenta,
  ordenCuentaDesc,
  numeroCuenta,
  addCuentaNo,
  sumaCuenta,
  consolaCompromiso,
  consolaPresup,
} = require("./util");

// Cuentas de Presupuesto
const cuentasPresupuesto = (cuentaOriginal, anoTrabajo) => {
  const cuenta = addCuentaNo(cuentaOriginal);

  const ctasDeGrupo = cuenta.filter((cta) => cta.Año == anoTrabajo).sort(ordenCuentaDesc);
  let ctaAjustada = cuenta.filter((cta) => cta.Año == anoTrabajo).sort(ordenCuentaDesc);

  ctasDeGrupo.map((laCta) => {
    let findFather = ctaAjustada.find((cta) => cta.cuentaNo == laCta.fatherId);
    if (findFather) {
      findFather = {
        ...findFather,
        Inicial: sumaCuenta(ctaAjustada, "Inicial", "fatherId", findFather.cuentaNo),
      };
      ctaAjustada = [
        ...ctaAjustada.filter((ctaAj) => ctaAj.cuentaNo !== findFather.cuentaNo),
        findFather,
      ];
    } else {
      console.log(`${laCta.fatherId} - not found`);
    }
  });

  // Ordena de nuevo la cuenta
  return ctaAjustada.sort(ordenCuenta);
};

const cuentasCompromiso = (cuentaOriginal, anoTrabajo) => {
  const cuenta = addCuentaNo(cuentaOriginal);

  const ctasDeGrupo = cuenta.filter((cta) => cta.Año == anoTrabajo).sort(ordenCuentaDesc);
  let ctaAjustadaComp = cuenta.filter((cta) => cta.Año == anoTrabajo).sort(ordenCuenta);

  ctasDeGrupo.map((laCta) => {
    let findFather = ctaAjustadaComp.find((cta) => cta.cuentaNo == laCta.fatherId);
    if (findFather) {
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
    } else {
      setTimeout(() => {
        console.log(`${laCta.fatherId} - not found - Estas cuentas tienen que crearce`);
      }, 2000);
    }
  });

  // Ordena de nuevo la cuenta
  return ctaAjustadaComp.sort(ordenCuenta);
};

// Imprime la cuenta
cuentasPresupuesto(cuenta, 2015).map((cta) => console.log(consolaPresup(cta)));

cuentasCompromiso(cuentaCompromiso, 2015).map((cta) =>
  console.log(consolaCompromiso(cta))
);
