const Datastore = require("nedb");
const db = new Datastore({ filename: "datafile2.json", autoload: true });

const { cuentaPresupuesto } = require("./calcPresupueto");
const { cuentaCompromiso } = require("./calcCompromiso");
const { cuentaCausado } = require("./calcCausado");
const { cuentaPagado } = require("./calcPagado");

// Imprime la cuenta
const ctaPresup = cuentaPresupuesto(2015);
// .map((cta) => console.log(consolaPresup(cta)));

const ctaCompro = cuentaCompromiso(2015);
// .map((cta) => console.log(consolaCompromiso(cta)));

const ctaCausado = cuentaCausado(2015);
// .map((cta) => console.log(consolaCompromiso(cta)));

const ctaPagado = cuentaPagado(2015);
// .map((cta) => console.log(consolaCompromiso(cta)));

ctaPagado.map((cta) =>
  db.insert(cta, (err, doc) => {
    if (err) console.log(err);
  })
);
