// const Datastore = require("nedb");
// const db = new Datastore({ filename: "datafile2.json", autoload: true });

const XLSX = require("xlsx");

const { cuentaPresupuesto } = require("./calcPresupueto");
const { cuentaModificacion } = require("./calcModificacion");
const { cuentaCompromiso } = require("./calcCompromiso");
const { cuentaCausado } = require("./calcCausado");
const { cuentaPagado } = require("./calcPagado");

const {
  consolaCausado,
  consolaPresup,
  consolaCompromiso,
  consolaModif,
} = require("./util");

const AnoActivo = 2019;

// Imprime la cuenta
const ctaPresup = cuentaPresupuesto(AnoActivo).map((cta) => ({
  cuentaNo: cta.cuentaNo,
  cuentaGrupo: cta.fatherId,
  NombreCuenta: cta.Descripcion,
  Monto: cta.Inicial,
}));

const ctaModifi = cuentaModificacion(AnoActivo).map((cta) => ({
  cuentaNo: cta.cuentaNo,
  cuentaGrupo: cta.fatherId,
  tipoModific: cta.TipoMod,
  "nombreCuenta / Observacion": cta.Observaciones,
  Monto: cta.MontoMod,
}));

const ctaCompromiso = cuentaCompromiso(AnoActivo).map((cta) => ({
  cuentaNo: cta.cuentaNo,
  cuentaGrupo: cta.fatherId,
  referencia: cta.Referencia,
  "nombreCuenta / Observacion": cta.Observaciones,
  Monto: cta.MontoComprometido,
}));

const ctaCausado = cuentaCausado(AnoActivo).map((cta) => ({
  cuentaNo: cta.cuentaNo,
  cuentaGrupo: cta.fatherId,
  referencia: cta.Referencia,
  "nombreCuenta / Observacion": cta.Observaciones,
  Monto: cta.MontoCausado,
}));

const ctaPagado = cuentaPagado(AnoActivo).map((cta) => ({
  cuentaNo: cta.cuentaNo,
  cuentaGrupo: cta.fatherId,
  referencia: cta.Referencia,
  "nombreCuenta / Observacion": cta.Observaciones,
  Monto: cta.MontoPag,
}));

// const ctaCompro = cuentaCompromiso(AnoActivo).map((cta) =>
//   console.log(consolaCompromiso(cta))
// );
// .map((cta) => console.log(consolaCompromiso(cta)));

// const ctaCausado = cuentaCausado(2015).map((cta) => console.log(consolaCausado(cta)));
// const ctaCausado = cuentaCausado(AnoActivo); //.map((cta) => console.log(consolaCausado(cta)));

let ctaEjecucion = [];
for (let index = 0; index < 50; index++) {
  ctaEjecucion = [
    ...ctaEjecucion,
    {
      cuentaNo: "01.01.01.01.001",
      cuentaGrupo: "01.01.01.01.000",
      "nombreCuenta / Observacion": "PAGAR LA APLICACION / PARA VER LOS RESULTADOS",
      montoPresupuesto: 0,
      montoComprometido: 0,
      montoCausado: 0,
      montoPagado: 0,
    },
  ];
}

const libroExcel = XLSX.utils.book_new();
const hojaPresupuesto = XLSX.utils.json_to_sheet(ctaPresup);
const hojaModificacion = XLSX.utils.json_to_sheet(ctaModifi);
const hojaComprometido = XLSX.utils.json_to_sheet(ctaCompromiso);
const hojaCausado = XLSX.utils.json_to_sheet(ctaCausado);
const hojaPagado = XLSX.utils.json_to_sheet(ctaPagado);
const hojaEjecucion = XLSX.utils.json_to_sheet(ctaEjecucion);

XLSX.utils.book_append_sheet(libroExcel, hojaPresupuesto, `Presupuesto ${AnoActivo}`);
XLSX.utils.book_append_sheet(libroExcel, hojaModificacion, `Modificaciones ${AnoActivo}`);
XLSX.utils.book_append_sheet(libroExcel, hojaComprometido, `Comprometido ${AnoActivo}`);
XLSX.utils.book_append_sheet(libroExcel, hojaCausado, `Causado ${AnoActivo}`);
XLSX.utils.book_append_sheet(libroExcel, hojaPagado, `Pagado ${AnoActivo}`);
XLSX.utils.book_append_sheet(libroExcel, hojaEjecucion, `Ejecucion ${AnoActivo}`);

XLSX.writeFile(libroExcel, `./presupuesto_${AnoActivo}.xlsx`);

console.log("success..!");
