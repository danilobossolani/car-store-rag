import fs from 'fs';
import { pool } from './database';

const caminhoArquivo = './src/data/carros_catalogo.enriched.json';
const conteudoDoArquivo = fs.readFileSync(caminhoArquivo, 'utf-8');
const dadosCompletos = JSON.parse(conteudoDoArquivo);
const carros = dadosCompletos.vehicles;

async function popularBanco() {
    for (const carro of carros) {
        await pool.query(
            `INSERT INTO carros 
       (montadora, modelo, categoria, ano, motor, potencia_cv, cambio, consumo, 
        preco_a_partir_rs, preco_obs, cores, itens, descricao, imagem_principal, imagens)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
            [
                carro.montadora, carro.modelo, carro.categoria, carro.ano, carro.motor,
                carro.potencia_cv, carro.cambio, carro.consumo, carro.preco_a_partir_rs,
                carro.preco_obs, carro.cores, carro.itens, carro.desc, carro.imagem_arquivo, carro.imagens,
            ]
        );
        console.log(`Inserido: ${carro.montadora} ${carro.modelo}`);
    }
    console.log('Seed finalizado!');
    process.exit(0);
}

popularBanco();