import { pool } from '../config/database';

export async function listarCarros() {
    const resultado = await pool.query('SELECT * FROM carros ORDER BY id');
    return resultado.rows;
}
export async function buscarCarroPorId(id: number) {
    const resultado = await pool.query('SELECT * FROM carros WHERE id = $1', [id]);
    return resultado.rows[0];
}

export async function criarCarro(dados: any) {
    const resultado = await pool.query(
        `INSERT INTO carros (montadora, modelo, categoria, ano, motor, potencia_cv, cambio, consumo, preco_a_partir_rs, preco_obs, cores, itens, descricao, imagem_principal, imagens)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
        [dados.montadora, dados.modelo, dados.categoria, dados.ano, dados.motor, dados.potencia_cv, dados.cambio, dados.consumo, dados.preco_a_partir_rs, dados.preco_obs, dados.cores, dados.itens, dados.descricao, dados.imagem_principal, dados.imagens]
    );
    return resultado.rows[0];
}

export async function atualizarCarro(id: number, dados: any) {
    const resultado = await pool.query(
        `UPDATE carros SET montadora=$1, modelo=$2, categoria=$3, ano=$4, preco_a_partir_rs=$5 WHERE id=$6 RETURNING *`,
        [dados.montadora, dados.modelo, dados.categoria, dados.ano, dados.preco_a_partir_rs, id]
    );
    return resultado.rows[0];
}

export async function deletarCarro(id: number) {
    await pool.query('DELETE FROM carros WHERE id = $1', [id]);
}