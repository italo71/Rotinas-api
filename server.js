const app = require('./config/express.js')();
//const cors = require('cors');
//const port = app.get('port');
const port = 80;
//const db = require("../API_Rotina/config/db");
// RODANDO NOSSA APLICAÇÃO NA PORTA SETADA
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
});