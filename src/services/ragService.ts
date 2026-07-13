import { pool } from '../config/database';

export async function buscarCarrosRelevantes(pergunta: string, apiKey: string) {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent';

    const resposta = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
            model: 'models/gemini-embedding-001',
            content: { parts: [{ text: pergunta }] },
            task_type: 'RETRIEVAL_QUERY',
        }),
    });

    const dados = await resposta.json();
    const embeddingPergunta = dados.embedding.values;
    const embeddingFormatado = `[${embeddingPergunta.join(',')}]`;

    const resultado = await pool.query(
        `SELECT id, montadora, modelo, retrieval_text,
            embedding <=> $1::vector AS distancia
     FROM carros
     ORDER BY distancia
     LIMIT 3`,
        [embeddingFormatado]
    );

    return resultado.rows;
}