const cuentaOriginal = require("../../json/causado.json");

const {
  ordenCuenta,
  ordenCuentaDesc,
  addCuentaNo,
  sumaCuenta,
  numeroCuentaFather,
  numeroCuentaCreateFather,
  verificarCuenta,
} = require("./util");

const cuentaCausado = (anoTrabajo) => {
  const ctasPorAno = verificarCuenta(anoTrabajo, cuentaOriginal, "MontoCausado").sort(
    ordenCuentaDesc
  );

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
        MontoCausado: 0,
        Dia: 01,
        Mes: 01,
        Año: anoTrabajo,
        Nivel: 1,
      };
      ctaAjustada = [...ctaAjustada, findFather];
    }

    findFather = {
      ...findFather,
      MontoCausado: sumaCuenta(
        ctaAjustada,
        "MontoCausado",
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

module.exports = { cuentaCausado };
