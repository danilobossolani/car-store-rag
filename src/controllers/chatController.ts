import { Request, Response } from 'express';
import { buscarCarrosRelevantes } from '../services/ragService';

interface ChatRequestBody {
    pergunta: string;
    historico?: { autor: string; texto: string }[];
}

export async function postChat(req: Request<{}, {}, ChatRequestBody>, res: Response) {
    try {
        const { pergunta, historico } = req.body;
        const apiKey = process.env.GEMINI_API_KEY as string;

        const carrosRelevantes = await buscarCarrosRelevantes(pergunta, apiKey);

        const contexto = carrosRelevantes
            .map((c) => c.retrieval_text)
            .join('\n\n---\n\n');

        const historicoFormatado = (historico || [])
            .map((h) => `${h.autor === 'usuario' ? 'Cliente' : 'Você'}: ${h.texto}`)
            .join('\n');

        const prompt = `Você é o Nagata, assistente de vendas de uma loja de carros. Responda a pergunta do cliente APENAS com base nas informações abaixo. Se a informação não estiver disponível, diga que não tem esse dado.

INFORMAÇÕES DOS CARROS:
${contexto}

HISTÓRICO DA CONVERSA:
${historicoFormatado}

PERGUNTA ATUAL DO CLIENTE: ${pergunta}`;

        const respostaGemini = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey,
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        );

        const dados = await respostaGemini.json();
        const textoResposta = dados.candidates[0].content.parts[0].text;

        res.json({ resposta: textoResposta, carrosUsados: carrosRelevantes.map((c) => c.modelo) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao processar chat' });
    }
}