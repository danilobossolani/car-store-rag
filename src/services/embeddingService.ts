import dotenv from 'dotenv';
dotenv.config();

export async function gerarEmbedding(texto: string): Promise<number[]> {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('TAMANHO DA CHAVE:', apiKey?.length);
    console.log('PRIMEIROS CARACTERES:', apiKey?.slice(0, 6));
    console.log('ULTIMOS CARACTERES:', apiKey?.slice(-4));

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
    console.log('RESPOSTA DA API:', JSON.stringify(dados, null, 2));
    return dados.embedding.values;
}