import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import * as libroController from '../controllers/libroController.js';

const router = express.Router();

// Obtener el directorio actual en un módulo ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asegurar que la carpeta 'uploads' exista
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o755 });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('El archivo debe ser una imagen válida'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB límite
});

router.get('/', libroController.getAllLibros);
router.get('/search', libroController.searchLibros);
router.get('/:id', libroController.getLibroById);
router.post('/add', upload.single('imagen'), libroController.createLibro);
router.put('/:id', upload.single('imagen'), libroController.updateLibro);
router.delete('/:id', libroController.deleteLibro);

// Middleware para manejar errores de multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo es 5MB.' });
    }
    return res.status(400).json({ message: 'Error al subir el archivo', error: error.message });
  } else if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
});

export default router;