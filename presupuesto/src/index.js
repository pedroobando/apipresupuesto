// const cuenta = require("../json/cuentas.json");
// const cuentaCompromiso = require("../json/comprometido.json");
// let cuenta = require("../json/modificaciones.json");

const Datastore = require("nedb");

const db = new Datastore({ filename: "datafile2.json", autoload: true });

const { cuentaPresupuesto } = require("./calcPresupueto");
const { cuentaCompromiso } = require("./calcCompromiso");

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

// Imprime la cuenta
const ctaPresup = cuentaPresupuesto(2015);
// .map((cta) => console.log(consolaPresup(cta)));

const ctaCompro = cuentaCompromiso(2015);
// .map((cta) => console.log(consolaCompromiso(cta)));

ctaPresup.map((cta) =>
  db.insert(cta, (err, doc) => {
    if (err) console.log(err);
  })
);

// cuentaCompromiso(2015)
