let cuenta = require("../json/cuentas.json");

const ceroleft = (valor, cantidad) => {
  return valor.toString().padStart(cantidad, "0");
};

const ordenCuenta = (a, b) =>
  a.cuentaNo > b.cuentaNo ? 1 : a.cuentaNo < b.cuentaNo ? -1 : 0;

const ordenCuentaDesc = (a, b) =>
  a.cuentaNo < b.cuentaNo ? 1 : a.cuentaNo > b.cuentaNo ? -1 : 0;

const consolaShow = (record, separador) =>
  `${record.cuentaNo} ${record.fatherId} ${record.Nivel} ${separador} ${record.Descripcion} -  ${record.Inicial}`;

const numeroCuenta = (cta) =>
  `${ceroleft(cta.Part, 2)}.${ceroleft(cta.Gene, 2)}.${ceroleft(cta.Espe, 2)}.${ceroleft(
    cta.Sub,
    2
  )}.${ceroleft(cta.Ordi, 3)}`;

// Agregar Registro
cuenta = cuenta.map((cta) => ({
  ...cta,
  cuentaNo: numeroCuenta(cta),
  fatherId:
    cta.Nivel == 5
      ? numeroCuenta(cta).slice(0, -4) + ".000"
      : cta.Nivel == 4
      ? numeroCuenta(cta).slice(0, -7) + ".00.000"
      : cta.Nivel == 3
      ? numeroCuenta(cta).slice(0, -10) + ".00.00.000"
      : cta.Nivel == 2
      ? numeroCuenta(cta).slice(0, -13) + ".00.00.00.000"
      : "-",
}));

// Ordenar Cuenta
cuenta = cuenta.sort(ordenCuenta);
// cuenta = cuenta.sort((a, b) =>
//   a.cuentaNo > b.cuentaNo ? 1 : a.cuentaNo < b.cuentaNo ? -1 : 0
// );

// Filtrar la Cuenta  de Grupo & el Ano.
const ctasDeGrupo = cuenta.filter((cta) => cta.Año == 2015);
var ctaAjustada = cuenta.filter((cta) => cta.Año == 2015);

ctasDeGrupo.map((laCta) => {
  let findFather = ctaAjustada.find((cta) => cta.cuentaNo === laCta.fatherId);
  if (findFather) {
    findFather = { ...findFather, Inicial: findFather.Inicial + laCta.Inicial };
    ctaAjustada = [
      ...ctaAjustada.filter((ctaAj) => ctaAj.cuentaNo !== findFather.cuentaNo),
      findFather,
    ];
  } else {
    console.log(`${laCta.fatherId} - not found`);
  }
});

// Esto verifica si faltan cuentas...
// ctasDeGrupo.map((cta) => {
//   if (cta.Tipo == "I") {
//     const ctaFather = ctasDeGrupo.find((ctad) => ctad.cuentaNo === cta.fatherId);
//     if (!ctaFather) {
//       console.log(`Cuenta: ${cta.fatherId} no existe`);
//     } else if (ctaFather.Tipo == !"D") {
//       console.log(`Cuenta: ${cta.fatherId} no es cta de grupo`);
//     }
//   }
// });

// nvoFormato.map((cta) => console.log(consolaShow(cta, cta.Tipo !== "D" ? "---" : "==>")));
// ctasDeGrupo.map((cta) => console.log(consolaShow(cta, cta.Tipo !== "D" ? "---" : "==>")));
ctaAjustada = ctaAjustada.sort(ordenCuenta);
ctaAjustada.map((cta) => console.log(consolaShow(cta, cta.Tipo !== "D" ? "---" : "==>")));
