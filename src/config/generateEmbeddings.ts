import fs from 'fs';
import path from 'path';
import { pool } from './database';
import { gerarEmbedding } from '../services/embeddingService';

const caminhoArquivo = path.join(__dirname, '..', 'data', 'carros_catalogo.enriched.json');
const conteudoArquivo = fs.readFileSync(caminhoArquivo, 'utf-8');
const dadosCompletos = JSON.parse(conteudoArquivo);
const carros = dadosCompletos.vehicles;

async function processarCarros() {
    for (const carro of carros) {
        const textoParaEmbedding = carro.enrichment.retrieval_text;

        console.log(`Gerando embedding: ${carro.montadora} ${carro.modelo}...`);
        const embedding = await gerarEmbedding(textoParaEmbedding);

        const embeddingFormatado = `[${embedding.join(',')}]`;

        await pool.query(
            `UPDATE carros SET retrieval_text = $1, embedding = $2::vector WHERE id = $3`,
            [textoParaEmbedding, embeddingFormatado, carro.id]
        );

        console.log(`Salvo: ${carro.montadora} ${carro.modelo}`);
    }

    console.log('Todos os embeddings foram gerados!');
    process.exit(0);
}

processarCarros();