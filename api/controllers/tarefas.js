const db = require("../../config/db");
class task {
    async postTarefas(req, res) {
        const client = await db.connect();
        let sql = `INSERT INTO tarefas (id_usuario,data_criacao,descricao) VALUES ($1,current_date,$2)`;
        const values = [req.id_usu, req.descricao];
        let r = client.query(sql, values)
        let response = { "status": "success", "message": "usuario salvo" }
        await res.json(response);
    }

    async deleteTarefa(req, res) {
        if (req.id_tarefa == null || req.id_tarefa == '') {
            req.status(200).send({ "status": "erro", "message": "ID da tarefa deve ser informado!" });
            return;
        }
        const client = await db.connect();
        let sql = `DELETE FROM tarefas WHERE id = ${req.id_tarefa}`;
        let r = await client.query(sql);
        if (r.rowCount > 0) {
            res.status(200).send({"status":"success","message":"Tarefa removida com sucesso!"})
            return;
        }
        else{
            res.status(200).send({"status":"erro","message":"Erro ao excluir tarefa"})
            return;
        }
    }

    async getTarefas(req, res) {
        const client = await db.connect();
        let sql = `select ID, DATA_CRIACAO,DESCRICAO,TITULO from tarefas where id_usuario = ${req.id_usu}`;
        let r = await client.query(sql);
        if (r.rowCount <= 0) {
            res.status(200).send({ "status": "erro", "message": "Nao foram encontrados dados" });
            return;
        }
        else {
            res.status(200).send({ 'status': 'success', 'data': r.rows });
            return;
        }
    }
}

module.exports = new task()