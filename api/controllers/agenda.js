const db = require("../../config/db");
class task {
    async postAgenda(req, res) {
        const client = await db.connect();
        let vSQL = 'insert into agenda (id_usuario, titulo, descricao, data_inicio, data_final) values ($1,$2,$3,$4,$5)';
        let values = [req.userID, req.titulo, req.descricao, req.dataInicio, req.dataFinal];
        let r;
        console.log('edicao-agenda');
        try {
            r = await client.query(vSQL, values);
        } catch (e) {
            res.status(200).send({ "status": "erro", "message": "Erro ao salvar agenda" });
            return;
        }
        if (r.rowCount > 0) {
            r = await client.query('select id, titulo, descricao, data_inicio, data_final from agenda order by 1 desc limit 1')
            res.status(200).send({ "status": "success", "message": "Agenda editada com sucesso!", "data": r.rows[0] });
        } else {
            res.status(200).send({ "status": "erro", "message": "Erro ao salvar agenda" });
        }
        return;
    }

    async getAgenda(req, res) {
        const client = await db.connect();
        let vSQL = `select id, titulo, descricao, data_inicio, data_final from agenda where id_usuario = ${req.userID} order by data_inicio`;
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
    async deleteAgenda(req, res) {
        const client = await db.connect();
        let vSQL = `delete from agenda where id = ${req.idAgenda}`;
        let r;
        try {
            r = await client.query(vSQL);
        } catch (e) {
            res.status(200).send({ "status": "erro", "message": "Erro ao salvar agenda" });
            return;
        }
        res.status(200).send({ "status": "success", "message": "Agenda salva com sucesso" });
        return;
    }

    async editarAgenda(req, res) {
        const client = await db.connect();
        let vSQL = `update agenda set titulo = $1, descricao = $2, data_inicio = $3, data_final = $4 where id = ${req.idAgenda}`;
        let valur = [req.titulo, req.descricao, req.dataInicio, req.dataFinal];
        let r;
        try {
            r = await client.query(vSQL, valur);
        } catch (e) {
            res.status(200).send({ "status": "erro", "message": "Erro ao salvar agenda" });
            return;
        }
        console.log(r);
        res.status(200).send({ "status": "success", "message": "Agenda salva com sucesso" });
        return;
    }
}
module.exports = new task()