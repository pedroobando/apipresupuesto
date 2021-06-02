// const Datastore = require("nedb");
// const db = new Datastore({ filename: "datafile2.json", autoload: true });

const XLSX = require("xlsx");

const { cuentaPresupuesto } = require("./calcs/calcPresupueto");
const { cuentaModificacion } = require("./calcs/calcModificacion");
const { cuentaCompromiso, verificarCuenta } = require("./calcs/calcCompromiso");
const { cuentaCausado } = require("./calcs/calcCausado");
const { cuentaPagado } = require("./calcs/calcPagado");

const {
  consolaCausado,
  consolaPresup,
  consolaCompromiso,
  consolaModif,
  ceroleft,
} = require("./calcs/util");

const AnoActivo = 2017;

const formatoFecha = (cta) =>
  new Date(`${cta.Año}-${ceroleft(cta.Mes, 2)}-${ceroleft(cta.Dia, 2)}T00:01:40`);
// Imprime la cuenta
const ctaPresup = cuentaPresupuesto(AnoActivo).map((cta) => ({
  cuentaNo: cta.cuentaNo,
  cuentaGrupo: cta.fatherId,
  nombreCuenta: cta.Descripcion,
  Monto: cta.Inicial,
}));

const ctaModifi = cuentaModificacion(AnoActivo).map((cta) => ({
  cuentaNo: cta.cuentaNo,
  cuentaGrupo: cta.fatherId,
  tipoModific: cta.TipoMod,
  fecha: formatoFecha(cta),
  nombreCuenta: cta.nombreCuenta,
  Observacion: cta.Observaciones,
  Monto: cta.MontoMod,
  // Nivel: cta.Nivel,
}));

const ctaCompromiso = cuentaCompromiso(AnoActivo).map((cta) => ({
  cuentaNo: cta.cuentaNo,
  cuentaGrupo: cta.fatherId,
  referencia: cta.Referencia,
  correlativo: cta.CorrComp,
  fecha: formatoFecha(cta),
  nombreCuenta: cta.nombreCuenta,
  Observacion: cta.Observaciones,
  Monto: cta.MontoComprometido,
  // Nivel: cta.Nivel,
}));

const ctaCausado = cuentaCausado(AnoActivo).map((cta) => ({
  cuentaNo: cta.cuentaNo,
  cuentaGrupo: cta.fatherId,
  referencia: cta.Referencia,
  correlativo: cta.CorrC,
  fecha: formatoFecha(cta),
  Observacion: cta.Observaciones,
  Monto: cta.MontoCausado,
  // Nivel: cta.Nivel,
}));

const ctaPagado = cuentaPagado(AnoActivo).map((cta) => ({
  cuentaNo: cta.cuentaNo,
  cuentaGrupo: cta.fatherId,
  referencia: cta.Referencia,
  correlativo: cta.CorrP,
  fecha: formatoFecha(cta),
  Observacion: cta.Observaciones,
  Monto: cta.MontoPag,
  // Nivel: cta.Nivel,
}));

// const ctaVerficar = verificarCuenta(AnoActivo).map((cta) => ({
//   cuentaNo: cta.cuentaNo,
//   cuentaGrupo: cta.fatherId,
//   referencia: cta.Referencia,
//   correlativo: cta.CorrP,
//   fecha: new Date(`${cta.Año}-${ceroleft(cta.Mes, 2)}-${ceroleft(cta.Dia, 2)}T00:01:40`),
//   Observacion: cta.Observaciones,
//   Monto: cta.MontoComprometido,
// }));

// const ctaCompro = cuentaCompromiso(AnoActivo).map((cta) =>
//   console.log(consolaCompromiso(cta))
// );
// .map((cta) => console.log(consolaCompromiso(cta)));

// const ctaCausado = cuentaCausado(2015).map((cta) => console.log(consolaCausado(cta)));
// const ctaCausado = cuentaCausado(AnoActivo); //.map((cta) => console.log(consolaCausado(cta)));

let ctaEjecucion = [];
const findMonto = (cuenta, cuentafind) => cuenta.cuentaNo == cuentafind.cuentaNo;
ctaEjecucion = ctaPresup.map((cta) => {
  let fctaCompromiso = { cuentaNo: 2222 };
  fctaCompromiso = ctaCompromiso.filter((cuenta) => cuenta.cuentaNo == cta.cuentaNo);
  // console.log(fctaCompromiso[0]["Monto"]);
  return {
    cuentaNo: cta.cuentaNo,
    cuentaGrupo: cta.cuentaGrupo,
    fecha: AnoActivo,
    "nombreCuenta / Observacion": cta.nombreCuenta,
    montoPresupuesto: cta.Monto,
    montoComprometido: 0,
    montoCausado: 0,
    montoPagado: 0,
  };
});

// for (let index = 0; index < 50; index++) {
//   ctaEjecucion = [
//     ...ctaEjecucion,
//     {
//       cuentaNo: "01.01.01.01.001",
//       cuentaGrupo: "01.01.01.01.000",
//       "nombreCuenta / Observacion": "PAGAR LA APLICACION / PARA VER LOS RESULTADOS",
//       montoPresupuesto: 0,
//       montoComprometido: 0,
//       montoCausado: 0,
//       montoPagado: 0,
//     },
//   ];
// }

const formatoCellDate = { cellDates: true, dateNF: "YYYYMMDD HH:mm:ss" };

const libroExcel = XLSX.utils.book_new();
const hojaPresupuesto = XLSX.utils.json_to_sheet(ctaPresup);
const hojaModificacion = XLSX.utils.json_to_sheet(ctaModifi, formatoCellDate);
const hojaComprometido = XLSX.utils.json_to_sheet(ctaCompromiso, formatoCellDate);
const hojaCausado = XLSX.utils.json_to_sheet(ctaCausado, formatoCellDate);
const hojaPagado = XLSX.utils.json_to_sheet(ctaPagado, formatoCellDate);
const hojaEjecucion = XLSX.utils.json_to_sheet(ctaEjecucion, formatoCellDate);

// const hojaVerificar = XLSX.utils.json_to_sheet(ctaVerficar, formatoCellDate);

XLSX.utils.book_append_sheet(libroExcel, hojaPresupuesto, `Presupuesto ${AnoActivo}`);
XLSX.utils.book_append_sheet(libroExcel, hojaModificacion, `Modificaciones ${AnoActivo}`);
XLSX.utils.book_append_sheet(libroExcel, hojaComprometido, `Comprometido ${AnoActivo}`);
XLSX.utils.book_append_sheet(libroExcel, hojaCausado, `Causado ${AnoActivo}`);
XLSX.utils.book_append_sheet(libroExcel, hojaPagado, `Pagado ${AnoActivo}`);
XLSX.utils.book_append_sheet(libroExcel, hojaEjecucion, `Ejecucion ${AnoActivo}`);

// XLSX.utils.book_append_sheet(libroExcel, hojaVerificar, `Verificacion ${AnoActivo}`);

XLSX.writeFile(libroExcel, `./presupuesto_${AnoActivo}.xlsx`);

console.log("success..!");
