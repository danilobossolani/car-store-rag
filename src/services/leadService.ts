import { pool } from '../config/database';

export async function criarLead(dados: any) {
    const resultado = await pool.query(
        `INSERT INTO leads (nome, email, telefone, carro_id, mensagem)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [dados.nome, dados.email, dados.telefone, dados.carro_id, dados.mensagem]
    );
    return resultado.rows[0];
}

export async function listarLeads() {
    const resultado = await pool.query(
        `SELECT leads.*, carros.modelo, carros.montadora 
     FROM leads 
     LEFT JOIN carros ON leads.carro_id = carros.id 
     ORDER BY leads.criado_em DESC`
    );
    return resultado.rows;
}