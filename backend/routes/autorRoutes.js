import express from 'express';
import * as autorController from '../controllers/autorController.js';

const router = express.Router();

router.get('/', autorController.getAllAutores);
router.get('/:id', autorController.getAutorById);
router.post('/', autorController.createAutor);
router.put('/:id', autorController.updateAutor);
router.delete('/:id', autorController.deleteAutor);
router.get('/:id/libros', autorController.getLibrosByAutor);

export default router;