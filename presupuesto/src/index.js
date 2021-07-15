const XLSX = require("xlsx");
const { ceroleft, ordenCuenta } = require("./calcs/util");

const { cuentaPresupuesto } = require("./calcs/calcPresupueto");
const { cuentaModificacion } = require("./calcs/calcModificacion");
const { cuentaCompromiso } = require("./calcs/calcCompromiso");
const { cuentaCausado } = require("./calcs/calcCausado");
const { cuentaPagado } = require("./calcs/calcPagado");

const AnoActivo = 2020;
const MesActivo = 12;

const formatoFecha = (cta) =>
  new Date(`${cta.Año}-${ceroleft(cta.Mes, 2)}-${ceroleft(cta.Dia, 2)}T00:01:40`);
// Imprime la cuenta
const ctaPresup = cuentaPresupuesto(AnoActivo).map((cta) => ({
  cuentaNo: cta.cuentaNo,
  cuentaGrupo: cta.fatherId,
  nombreCuenta: cta.Descripcion,
  montoInicial: cta.Inicial,
}));

const ctaModifi = cuentaModificacion(AnoActivo, MesActivo).map((cta) => ({
  cuentaNo: cta.cuentaNo,
  cuentaGrupo: cta.fatherId,
  nombreCuenta: cta.Descripcion,
  montoModMes: cta.MontoModMes,
  montoModAcm: cta.MontoMod,
}));

const ctaCompromiso = cuentaCompromiso(AnoActivo, MesActivo).map((cta) => ({
  cuentaNo: cta.cuentaNo,
  cuentaGrupo: cta.fatherId,
  // referencia: cta.Referencia,
  // correlativo: cta.CorrComp,
  // fecha: formatoFecha(cta),
  nombreCuenta: cta.Descripcion,
  // Observacion: cta.Observaciones,
  montoCompMes: cta.MontoComprometidoMes,
  montoCompAcm: cta.MontoComprometido,
  // Nivel: cta.Nivel,
}));

const ctaCausado = cuentaCausado(AnoActivo, MesActivo).map((cta) => ({
  cuentaNo: cta.cuentaNo,
  cuentaGrupo: cta.fatherId,
  // referencia: cta.Referencia,
  // correlativo: cta.CorrC,
  // fecha: formatoFecha(cta),
  nombreCuenta: cta.Descripcion,
  // Observacion: cta.Observaciones,
  montoCausAcm: cta.MontoCausado,
  montoCausMes: cta.MontoCausadoMes,
  // Nivel: cta.Nivel,
}));

const ctaPagado = cuentaPagado(AnoActivo, MesActivo).map((cta) => ({
  cuentaNo: cta.cuentaNo,
  cuentaGrupo: cta.fatherId,
  // referencia: cta.Referencia,
  // correlativo: cta.CorrP,
  // fecha: formatoFecha(cta),
  nombreCuenta: cta.Descripcion,
  // Observacion: cta.Observaciones,
  montoPagaAcm: cta.MontoPag,
  montoPagaMes: cta.MontoPagMes,
  // Nivel: cta.Nivel,
}));

// Presupuesto Inicial
let ctaEjecucion = [...ctaPresup];

// Modificacion del Presupuesto
ctaModifi.map((cta) => {
  const ctaFind = ctaEjecucion.find((ctaOrig) => ctaOrig.cuentaNo == cta.cuentaNo);
  ctaEjecucion = [
    ...ctaEjecucion.filter((ctaRemove) => ctaRemove.cuentaNo != cta.cuentaNo),
    {
      ...ctaFind,
      montoModMes: cta.montoModMes,
      montoModAcm: cta.montoModAcm,
      montoAsigAjust: ctaFind.montoInicial + cta.montoModAcm,
    },
  ];
});

// Compromiso del Presupuesto
ctaCompromiso.map((cta) => {
  const ctaFind = ctaEjecucion.find((ctaOrig) => ctaOrig.cuentaNo == cta.cuentaNo);
  ctaEjecucion = [
    ...ctaEjecucion.filter((ctaRemove) => ctaRemove.cuentaNo != cta.cuentaNo),
    {
      ...ctaFind,
      montoCompMes: cta.montoCompMes,
      montoCompAcm: cta.montoCompAcm,
    },
  ];
});

// Causado del Presupuesto
ctaCausado.map((cta) => {
  const ctaFind = ctaEjecucion.find((ctaOrig) => ctaOrig.cuentaNo == cta.cuentaNo);
  ctaEjecucion = [
    ...ctaEjecucion.filter((ctaRemove) => ctaRemove.cuentaNo != cta.cuentaNo),
    {
      ...ctaFind,
      montoCausMes: cta.montoCausMes,
      montoCausAcm: cta.montoCausAcm,
    },
  ];
});

// Pagado del Presupuesto
ctaPagado.map((cta) => {
  const ctaFind = ctaEjecucion.find((ctaOrig) => ctaOrig.cuentaNo == cta.cuentaNo);
  ctaEjecucion = [
    ...ctaEjecucion.filter((ctaRemove) => ctaRemove.cuentaNo != cta.cuentaNo),
    {
      ...ctaFind,
      montoPagaMes: cta.montoPagaMes,
      montoPagaAcm: cta.montoPagaAcm,
    },
  ];
});

let ctaEjecucionTmp = [];
ctaEjecucion.map((cta) => {
  // const ctaFind = ctaEjecucion.find((ctaOrig) => ctaOrig.cuentaNo == cta.cuentaNo);
  ctaEjecucionTmp = [
    ...ctaEjecucionTmp,
    {
      ...cta,
      // cuentaNo: cta.cuentaNo,
      // cuentaGrupo: cta.cuentaGrupo,
      // nombreCuenta: cta.nombreCuenta,

      montoInicial: cta.montoInicial,
      montoModMes: cta.montoModMes,
      montoModAcm: cta.montoModAcm,
      montoAsigAjust: cta.montoAsigAjust,

      montoCompMes: cta.montoCompMes,
      montoCausMes: cta.montoCausMes,
      montoPagaMes: cta.montoPagaMes,

      montoCompAcm: cta.montoCompAcm,
      montoCausAcm: cta.montoCausAcm,
      montoPagaAcm: cta.montoPagaAcm,
    },
  ];
});

ctaEjecucion = ctaEjecucionTmp.sort(ordenCuenta);

const formatoCellDate = { cellDates: true, dateNF: "YYYYMMDD HH:mm:ss" };

const libroExcel = XLSX.utils.book_new();
// const hojaPresupuesto = XLSX.utils.json_to_sheet(ctaEjecucion, formatoCellDate);
// const hojaModificacion = XLSX.utils.json_to_sheet(ctaModifi, formatoCellDate);
// const hojaComprometido = XLSX.utils.json_to_sheet(ctaCompromiso, formatoCellDate);
// const hojaCausado = XLSX.utils.json_to_sheet(ctaCausado, formatoCellDate);
// const hojaPagado = XLSX.utils.json_to_sheet(ctaPagado, formatoCellDate);
const hojaEjecucion = XLSX.utils.json_to_sheet(ctaEjecucion, formatoCellDate);

// XLSX.utils.book_append_sheet(libroExcel, hojaPresupuesto, `Presupuesto ${AnoActivo}`);
// XLSX.utils.book_append_sheet(libroExcel, hojaModificacion, `Modificaciones ${AnoActivo}`);
// XLSX.utils.book_append_sheet(libroExcel, hojaComprometido, `Comprometido ${AnoActivo}`);
// XLSX.utils.book_append_sheet(libroExcel, hojaCausado, `Causado ${AnoActivo}`);
// XLSX.utils.book_append_sheet(libroExcel, hojaPagado, `Pagado ${AnoActivo}`);
XLSX.utils.book_append_sheet(libroExcel, hojaEjecucion, `Ejecucion ${AnoActivo}`);

XLSX.writeFile(libroExcel, `./presupuesto_${AnoActivo}.xlsx`);

console.log("success..!");
