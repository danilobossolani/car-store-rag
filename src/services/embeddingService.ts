import dotenv from 'dotenv';
dotenv.config();

export async function gerarEmbedding(texto: string): Promise<number[]> {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent';

    const resposta = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey as string,
        },
        body: JSON.stringify({
            model: 'models/gemini-embedding-001',
            content: { parts: [{ text: texto }] },
            task_type: 'RETRIEVAL_DOCUMENT',
        }),
    });

    const dados = await resposta.json();
    return dados.embedding.values;
}