const ADODB = require('node-adodb');

const query = async (cnndb, strSqlQuery) => {
  const connectdb = ADODB.open(
    `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${cnndb};Persist Security Info=False;`
  );

  let respConsulta = null;
  try {
    respConsulta = await connectdb.query(strSqlQuery);
    //  = cuentas; // await JSON.parse(cuentas);
    // respConsulta = await JSON.stringify(cuentas, null, 2);
  } catch (error) {
    respConsulta = {
      ok: false,
      data: {
        message: 'Consulte con el administrador - query()',
      },
      error,
    };
  } finally {
    return respConsulta;
  }
};

module.exports = { query };
