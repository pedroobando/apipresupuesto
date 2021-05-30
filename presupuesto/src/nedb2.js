"use strict";

const Datastore = require("nedb");

const db = new Datastore({ filename: "datafile2.json", autoload: true });

// db.loadDatabase((err) => {
//   if (err) console.log(err);
// });

let cuentaJson = require("../json/cuentas.json");

const {
  ceroleft,
  ordenCuenta,
  ordenCuentaDesc,
  consolaShow,
  numeroCuenta,
  sumaPadre,
  addCuentaNo,
} = require("./util");

const yearWorks = 2015;

db.remove({}, { multi: true }, (err, numRemoved) =>
  console.log(`remove records: ${numRemoved}`)
);

const cuentaJsonGrupo = addCuentaNo(
  cuentaJson.filter((cta) => cta.Año == yearWorks)
).sort(ordenCuentaDesc);

cuentaJson = addCuentaNo(cuentaJson.filter((cta) => cta.Año == yearWorks)).sort(
  ordenCuenta
);

// Carga de base de datos.
cuentaJson.map((cta) => {
  db.insert(
    {
      Ano: cta.Año,
      _id: cta.cuentaNo,
      cuentaNo: cta.cuentaNo,
      fatherId: cta.fatherId,
      Nivel: cta.Nivel,
      Tipo: cta.Tipo,
      Inicial: cta.Inicial,
      Descripcion: cta.Descripcion,
      Part: cta.Part,
      Gene: cta.Gene,
      Espe: cta.Espe,
      Sub: cta.Sub,
      Ordi: cta.Ordi,
    },
    (err, newDoc) => {
      if (err) {
        console.log(err);
        return;
      }
    }
  );
});

cuentaJsonGrupo.map((ctaGrp) => {
  // console.log(ctaGrp.cuentaNo, ctaGrp.Descripcion);
  db.find({ fatherId: ctaGrp.cuentaNo }, (err, docsHijos) => {
    if (err) {
      console.log(err);
      return;
    }
    var sumaHijo = 0;
    docsHijos.map((dochijo) => (sumaHijo += dochijo.Inicial));

    const cuentaMod = db.findOne({ _id: ctaGrp.cuentaNo });
    console.log(cuentaMod);
    db.update(
      { _id: ctaGrp.cuentaNo },
      { Inicial: 0 + sumaHijo },
      {},
      (err, numReplaced) => {
        if (err) {
          console.log(`Error en Update: => ${err}`);
          return;
        }
        // console.log(numReplaced);
      }
    );
    // console.log(sumaHijo);
  });
});

db.find({}, (err, docs) => {
  if (err) {
    console.log(err);
    return;
  }
  docs.map((doc) => console.log(doc._id, doc.Inicial));
});

// db.getAllData().map((ctaM) => console.log(ctaM._id, ctaM.Descripcion));

// db.insert(doc, (err, newDoc) => {
//   console.log(err, newDoc);
// });

// db.insert([{ a: 5 }, { a: 42 }, { a: 5 }], (err, newDoc) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(newDoc);
//   }
// });
