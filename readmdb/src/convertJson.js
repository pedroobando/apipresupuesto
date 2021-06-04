const { query } = require('./conectDb');

const fse = require('fs-extra');
const cnndb = './src/PresupuestoData2013.accdb';
const yearBegin = 2109;
const yearEnd = 2019;
const orderBy = 'ORDER BY Año, Part, Gene, Espe, Sub';
const prefile = './json';
fse.mkdir(prefile);

//  Año = ${yearBegin}

query(cnndb, `Select * from Cuentas where [Año] = ${yearBegin} ${orderBy}`).then(
  (ret) => {
    fse.writeFile(`./json/cuentas.json`, ret);
    console.log('./json/cuentas.json');
  }
);

query(
  cnndb,
  `Select * from Modificaciones where [Año] >= ${yearBegin} and [Año] <= ${yearEnd}`
).then((ret) => {
  fse.writeFile(`${prefile}/modificaciones.json`, ret);
  console.log(`${prefile}/modificaciones.json`);
});

query(
  cnndb,
  `Select * from Comprometido where [Año] >= ${yearBegin} and [Año] <= ${yearEnd}`
).then((ret) => {
  fse.writeFile(`${prefile}/comprometido.json`, ret);
  console.log(`${prefile}/comprometido.json`);
});

query(
  cnndb,
  `Select * from Causado where [Año] >= ${yearBegin} and [Año] <= ${yearEnd}`
).then((ret) => {
  fse.writeFile(`${prefile}/causado.json`, ret);
  console.log(`${prefile}/causado.json`);
});

query(
  cnndb,
  `Select * from Pagos where [Año] >= ${yearBegin} and [Año] <= ${yearEnd}`
).then((ret) => {
  fse.writeFile(`${prefile}/pagos.json`, ret);
  console.log(`${prefile}/pagos.json`);
});
