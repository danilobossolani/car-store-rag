import { Request, Response } from 'express';
import { criarLead, listarLeads } from '../services/leadService';

export async function postLead(req: Request, res: Response) {
    try {
        const lead = await criarLead(req.body);
        res.status(201).json(lead);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar lead' });
    }
}

export async function getLeads(req: Request, res: Response) {
    try {
        const leads = await listarLeads();
        res.json(leads);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar leads' });
    }
}