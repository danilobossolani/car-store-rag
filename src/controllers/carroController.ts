import { Request, Response } from 'express';
import { listarCarros, buscarCarroPorId, criarCarro, atualizarCarro, deletarCarro } from '../services/carroService';

export async function getCarros(req: Request, res: Response) {
    try {
        const carros = await listarCarros();
        res.json(carros);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar carros' });
    }
}
export async function getCarroPorId(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const carro = await buscarCarroPorId(id);
        if (!carro) {
            return res.status(404).json({ erro: 'Carro não encontrado' });
        }
        res.json(carro);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar carro' });
    }
}

export async function postCarro(req: Request, res: Response) {
    try {
        const carro = await criarCarro(req.body);
        res.status(201).json(carro);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar carro' });
    }
}

export async function putCarro(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const carro = await atualizarCarro(id, req.body);
        res.json(carro);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar carro' });
    }
}

export async function deleteCarro(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        await deletarCarro(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao deletar carro' });
    }
}