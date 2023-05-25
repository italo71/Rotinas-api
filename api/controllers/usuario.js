
const customerWalletsDB = require('../data/usuario.json');
const controller = {};
const db = require("../../config/db");
class task {
  async selectLogin(req, res) {
    const client = await db.connect();
    let result;
    let vSQL = `SELECT id,nome,email,data_nasc FROM usuario WHERE LOGIN = '${req.login}' AND SENHA = '${req.senha}' limit 1`
    result = await client.query(vSQL);
    if (result.rowCount == 0) {
      vSQL = `select count(id) from usuario where login = '${req.login}'`;
      result = await client.query(vSQL);
      let e;
      if (result.rowCount == 0)
        e = { "status": "erro", "message": "usuário não encontrado" };
      else
        e = { "status": "erro", "message": "Senha Incorreta" };
      return e
    }
    return { "status": "success", "data": result.rows[0] };
  }

  async insertCustomer(req, res) {
    const client = await db.connect();
    const sql = 'INSERT INTO usuario(nome,login,senha,email) VALUES ($1,$2,$3,$4);';
    const values = [req.nome, req.login, req.senha, req.email];
    let r = await client.query(sql, values);
    let result = { "status": "success", "message": "usuario salvo" }
    await res.json(result);
  }

  async atualizacaoUsuario(req, res) {
    const client = await db.connect();
    let vSQL = `select nome, email, data_nasc from usuario where id = ${req.userID}`;
    let r = await client.query(vSQL);
    let d = r.rows[0];
    vSQL = 'UPDATE usuario SET nome = $1, email = $2, data_nasc = $3';
    const values = [(req.nome) ? req.nome : d.nome, (req.email) ? req.email : d.email, (req.dataNasc) ? req.dataNasc : d.data_nasc];
    try {
      r = await client.query(vSQL, values);
    } catch (e) {
      res.status(200).send({ "status": "erro", "message": "Erro ao salvar as alterações" });
      return;
    }
    vSQL = `select id,nome,email,data_nasc from usuario where id = ${req.userID}`;
    r = await client.query(vSQL);
    res.status(202).send({ "status": "success", "data": r.rows[0] });
    return;
  }

  async confereSenha(req, res) {
    const client = await db.connect();
    let vSQL = `select senha from usuario where id = ${req.userID}`;
    let r;
    try {
      r = await client.query(vSQL);
    } catch (e) {
      res.status(200).send({ "status": "erro", "message": "Erro ao validar Senha" });
      return;
    }
    if (req.senha == r.rows[0].senha) {
      res.status(200).send({ "status": "success", "message": true });
    }
    else res.status(200).send({ "status": "success", "message": false });
    return;
  }

  async atualizaSenha(req, res) {
    if (req.senha == null || req.senha == '') {
      res.status(200).send({ "status": "erro", "message": "Senha nao informada" });
      return;
    }
    if (req.userID == null || req.userID == '') {
      res.status(200).send({ "status": "erro", "message": "Usuario nao informada" });
      return;
    }
    const client = await db.connect();
    let vSQL = 'update usuario set senha = $1 where id = $2';
    let values = [req.senha, req.userID];
    let r;
    try {
      r = await client.query(vSQL, values);
    } catch (e) {
      res.status(200).send({ "status": "erro", "message": "Erro ao alterar Senha" });
      return;
    }
    if (r.rowCount > 0)
      res.status(200).send({ "status": "success", "message": "Senha alterada com sucesso" });
    else
      res.status(200).send({ "status": "erro", "message": "Erro ao alterar Senha" });
    return;
  }
}
module.exports = new task()