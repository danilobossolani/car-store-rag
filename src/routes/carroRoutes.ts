import { Router } from 'express';
import { getCarros, getCarroPorId, postCarro, putCarro, deleteCarro } from '../controllers/carroController';

const router = Router();

router.get('/', getCarros);
router.get('/:id', getCarroPorId);
router.post('/', postCarro);
router.put('/:id', putCarro);
router.delete('/:id', deleteCarro);

export default router;