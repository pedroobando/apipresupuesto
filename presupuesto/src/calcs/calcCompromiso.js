const cuentaOriginal = require("../../json/comprometido.json");
const cuentaPresup = require("../../json/cuentas.json");

const {
  ordenCuenta,
  ordenCuentaDesc,
  addCuentaNo,
  sumaCuenta,
  numeroCuentaFather,
  numeroCuentaCreateFather,
} = require("./util");

const verificarCuenta = (anoTrabajo) => {
  let plantCuentas = cuentaPresup
    .filter((cta) => cta.Año == anoTrabajo)
    .sort(ordenCuenta);
  let cuentaVerificar = cuentaOriginal
    .filter((cta) => cta.Año == anoTrabajo)
    .sort(ordenCuenta);

  plantCuentas = addCuentaNo(plantCuentas);
  cuentaVerificar = addCuentaNo(cuentaVerificar);

  plantCuentas.map((ctaFind) => {
    const cuentaExiste = cuentaVerificar.find(
      (laCta) => laCta.cuentaNo == ctaFind.cuentaNo
    );
    if (!cuentaExiste) {
      const findFather = {
        cuentaNo: ctaFind.cuentaNo,
        fatherId: numeroCuentaCreateFather(ctaFind.cuentaNo),
        Referencia: "0000000",
        Observaciones: ctaFind.Descripcion,
        MontoComprometido: 0,
        Dia: 31,
        Mes: 12,
        Año: anoTrabajo,
      };
      cuentaVerificar = [...cuentaVerificar, findFather];
    }
  });

  return cuentaVerificar;
};

const cuentaCompromiso = (anoTrabajo) => {
  const ctasPorAno = verificarCuenta(anoTrabajo).sort(ordenCuentaDesc);

  let ctaAjustadaComp = ctasPorAno.sort(ordenCuenta);

  ctasPorAno.map((laCta) => {
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
