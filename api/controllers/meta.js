const db = require("../../config/db");
class task {
    async postMeta(req, res) {
        const client = await db.connect();
        let sql = `insert into meta (titulo, meta, data_inicio, data_final, id_usuario) values($1,$2,$3,$4,$5)`;
        let values = [req.titulo, req.meta, req.dataInicio, req.dataFinal, req.userID];
        let r;
        try {
            r = await client.query(sql, values);
        }
        catch (e) {
            res.status(200).send({ "status": "erro", "message": "erro ao cadastrar meta" });
            return;
        }
        r = await client.query('select * from meta order by 1 desc limit 1');

        res.status(200).send({ "status": "success", "message": "Meta cadastrada com sucesso", "data": r.rows });
    }
    async putMeta(req, res) {
        const client = await db.connect();
        let sql = `update meta set titulo = $1, meta = $2, data_inicio = $3, data_final = $4 where id = $5`;
        let values = [req.titulo, req.meta, req.dataInicio, req.dataFinal, req.idMeta];
        let r
        try {
            r = await client.query(sql, values);
        } catch (e) {
            res.status(200).send({ "status": "erro", "message": "Erro ao alterar Meta" })
            return;
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

    async apagaMeta(req, res) {
        if (req.metaID == null) {
            res.status(200).send({ "status": "erro", "message": "Identificador da meta nao informado" });
            return;
        }
        const client = await db.connect();
        let sql = `delete from meta where id = ${req.metaID}`;
        try {
            let r = await client.query(sql);
        }catch(e){
            res.status(200).send({"status":"erro","message":"Erro ao apagar Meta"});
            return;
        }
        res.status(200).send({"status":"success","message":"Meta apagada com sucesso"});
    }
}
module.exports = new task()