const cuenta = require("../json/cuentas.json");

ctaAno = cuenta.filter((cta) => cta.Año == 2019);

console.log(ctaAno);
