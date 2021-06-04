const ADODB = require('node-adodb');

const query = async (cnndb, strSqlQuery) => {
  const connectdb = ADODB.open(
    `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${cnndb};Persist Security Info=False;`
  );
  try {
    const cuentas = await connectdb.query(strSqlQuery);
    const resp = await JSON.stringify(cuentas, null, 2);
    return resp;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { query };
