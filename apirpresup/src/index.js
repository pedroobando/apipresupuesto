const { serve, thePort } = require('./serve');

const main = () => {
  serve.listen(thePort, () => {
    console.log(`Servidor :-) Port:${thePort}`);
  });
};

main();
