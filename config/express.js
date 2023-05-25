const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const user = require('../api/controllers/usuario');
const { json } = require('body-parser');
const { response } = require('express');
const tarefas = require('../api/controllers/tarefas')
const meta = require('../api/controllers/meta')
const cors = require('cors');
module.exports = () => {

  const app = express();

  app.use((req, res, next) => {
    //Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
    //Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
  });
  var jsonParser = bodyParser.json()
  app.use(express.json({ limit: '50mb' }));
  // SETANDO VARIÁVEIS DA APLICAÇÃO
  app.set('port', process.env.PORT || config.get('server.port'));

  app.post('/tarefas', jsonParser, async function (req, res) {
    let r;
    if (req.body.type == null) {
      try {
        r = await tarefas.postTarefas(req.body, res)
      } catch (e) {
        res.status(400).send({ "status": "erro" })
      }
    }
    else if (req.body.type == 'get_user') {
      r = await tarefas.getTarefas(req.body, res);
    }
    else if (req.body.type == 'DELETE') {
      r = await tarefas.deleteTarefa(req.body, res);
    }
    res.status(200).send(r)
    return r
  });

  app.post('/user', jsonParser, async function (req, res) {
    if (req.body.type == 'dados') {
      try {
        await user.atualizacaoUsuario(req.body, res);
      } catch (e) {
        res.status(200).send({ 'status': 'erro', 'message': 'Erro inesperado' });
      }
      return;
    }
    else if (req.body.type == 'senha') {
      try {
        await user.confereSenha(req.body, res);
      } catch (e) {
        res.status(200).send({ 'status': 'erro', 'message': 'Erro inesperado' });
      }
      return;
    }
    else if (req.body.type == 'pass') {
      try {
        await user.atualizaSenha(req.body, res);
      } catch (e) {
        res.status(200).send({ 'status': 'erro', 'message': 'Erro inesperado' });
      }
      return;
    }
    else {
      res.status(200).send({ 'status': 'erro', 'message': 'Metodo invalido' });
      return;
    }
    res.status(200).send({ 'status': 'erro', 'message': 'Erro inesperado' });
    return;
  });

  app.post('/user/get', jsonParser, async function (req, res) {
    let r;
    if (req.body.type == 'login') {
      r = await user.selectLogin(req.body, res);
      if (r.status == 'erro')
        res.status(200).send(r)
    }
    else {
      let e = { "status": "erro", "message": "Tipo de requisição não suportada" }
      res.status(200).send(e)
    }
    res.status(200).send(r)
  });

  app.post('/user/post', jsonParser, async function (req, res) {
    let response
    try {
      response = await user.insertCustomer(req.body, res)
    } catch (e) {
      response = e
      res.status(200).send(e)
    }
    return response
  });

  app.post('/meta', jsonParser, async function (req, res) {
    let body = req.body;
    if (body.method == 'POST') {
      await meta.postMeta(body, res);
    }
    else if (body.method == 'PUT') {
      await meta.putMeta(body, res);
    }
    else if (body.method == 'GET') {
      await meta.getMeta(body, res);
    }
    else if (body.method == 'DELETE') {
      await meta.apagaMeta(body, res);
    }
    else { res.status(200).send({ "status": "erro", "message": "Metodo nao suportado" }); }
  });

  app.get('/', function (req, res) {
    res.json({ message: "Welcome to Rotina's API" });
  });

  // MIDDLEWARES
  app.use(bodyParser.json());

  return app;
};