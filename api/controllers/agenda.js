const db = require("../../config/db");
class task {
    async postAgenda(req, res) {
        const client = await db.connect();
        let vSQL = 'insert into agenda (id_usuario, titulo, descricao, data_inicio, data_final) values ($1,$2,$3,$4,$5)';
        let values = [req.userID, req.titulo, req.descricao, req.dataInicio, req.dataFinal];
        let r;
        try {
            r = await client.query(vSQL, values);
        } catch (e) {
            res.status(200).send({ "status": "erro", "message": "Erro ao salvar agenda" });
            return;
        }
        if (r.rowCount > 0) {
            res.status(200).send({ "status": "Success", "message": "Agenda salva com sucesso!" });
        } else {
            res.status(200).send({ "status": "erro", "message": "Erro ao salvar agenda" });
        }
        return;
    }

    async getAgenda(req, res) {
        const client = await db.connect();
        let vSQL = `select titulo, descricao, data_inicio, data_final from agenda where id_usuario = ${req.userID}`;
        let r;
        try {
            r = await client.query(vSQL);
        } catch (e) {
            res.status(200).send({ "status": "erro", "message": "Erro ao obter agenda" });
            return;
        }

        if (r.rowCount > 0) {
            res.status(200).send({ "status": "success", "data": r.rows });
        } else {
            res.status(200).send({ "status": "erro", "message": "Sem dados" });
        }
        return;
    }
}
module.exports = new task()