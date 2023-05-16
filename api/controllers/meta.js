const db = require("../../config/db");
class task {
    async postMeta(req, res) {
        const client = await db.connect();
        let sql = `insert into meta (titulo, meta, data_inicio, data_final, id_usuario) values('${req.titulo}','${req.meta}','${req.dataInicio}','${req.dataFinal}', ${req.userID})`;
        let r;
        try {
            r = await client.query(sql);
        }
        catch (e) {
            res.status(200).send({ "status": "erro", "message": "erro ao cadastrar meta" });
            return;
        }
        res.status(200).send({ "status": "success", "message": "Meta cadastrada com sucesso" })
    }
    async putMeta(req, res) {
        const client = await db.connect();
        let sql = `update meta set titulo = '${req.titulo}', meta = '${req.meta}', data_inicio = '${req.dataInicio}', data_final = '${req.dataFinal}' where id = ${req.idMeta}`;
        let r
        try {
            r = await client.query(sql);
        } catch (e) {
            res.status(200).send({ "status": "erro", "message": "Erro ao alterar Meta" })
        }
        res.status(200).send({ "status": "success", "message": "Meta alterada com sucesso" })
    }
    async getMeta(req, res) {
        if (req.userID == null) {
            res.status(200).send({ "status": "erro", "message": "Identificador do usuario nao informado" });
            return;
        }
        const client = await db.connect();
        let sql = `select id, id_usuario, titulo, meta, data_inicio, data_final from meta where id_usuario = ${req.userID}`;
        let r
        try {
            r = await client.query(sql);
        } catch (e) {
            res.status(500).send({ "status": "erro", "message": "Erro interno do servidor" });
            return;
        }
        if (r.rowCount > 0) {
            res.status(200).send({ "status": "success", "data": r.rows });
        }
        else
            res.status(404).send({ "status": "erro", "message": "Nao existem" });
    }
}
module.exports = new task()