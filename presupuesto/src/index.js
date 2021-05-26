const cuenta = require("../json/cuentas.json");

ctaAno = cuenta.filter((cta) => cta.Año == 2019 && cta.Nivel == 4 && cta.Tipo == "D");

console.log(ctaAno);
console.log(ctaAno.length);
console.log(ctaAno.length);
