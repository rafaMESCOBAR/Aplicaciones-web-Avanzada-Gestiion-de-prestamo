import express from 'express';
import * as prestamoController from '../controllers/prestamoController.js';

const router = express.Router();

router.get('/', prestamoController.getAllPrestamos);
router.get('/:id', prestamoController.getPrestamoById);
router.post('/', prestamoController.createPrestamo);
router.put('/:id', prestamoController.updatePrestamo);
router.delete('/:id', prestamoController.deletePrestamo);

export default router;