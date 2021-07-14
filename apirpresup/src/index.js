const { serve, thePort } = require('./serve');

const main = () => {
  serve.listen(thePort, () => {
    console.log(`Servidor Presupuesto ..! activo <<Port:${thePort}>>`);
  });
};

main();
