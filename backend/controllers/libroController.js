import Libro from '../models/Libro.js';

export const getAllLibros = async (req, res, next) => {
  try {
    const libros = await Libro.getAll();
    res.json(libros);
  } catch (error) {
    next(error);
  }
};

export const getLibroById = async (req, res, next) => {
  try {
    const libro = await Libro.getById(req.params.id);
    if (libro) {
      res.json(libro);
    } else {
      res.status(404).json({ message: 'Libro no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const createLibro = async (req, res, next) => {
  try {
    const { codigo, titulo, autores, isbn, editorial, numeroDePaginas } = req.body;
    const imagen = req.file ? req.file.filename : null;
    
    const nuevoLibro = await Libro.create({
      Codigo: codigo,
      titulo,
      Autores: autores.split(','),
      ISBN: isbn,
      Editorial: editorial,
      NumeroDePaginas: numeroDePaginas,
      Imagen: imagen
    });
    
    res.status(201).json(nuevoLibro);
  } catch (error) {
    next(error);
  }
};

export const updateLibro = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { codigo, titulo, autores, isbn, editorial, numeroDePaginas } = req.body;
    const imagen = req.file ? req.file.filename : undefined;

    const libroActualizado = await Libro.update(id, {
      Codigo: codigo,
      titulo,
      Autores: autores.split(','),
      ISBN: isbn,
      Editorial: editorial,
      NumeroDePaginas: numeroDePaginas,
      Imagen: imagen
    });

    if (libroActualizado) {
      res.json(libroActualizado);
    } else {
      res.status(404).json({ message: 'Libro no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteLibro = async (req, res, next) => {
  try {
    const result = await Libro.delete(req.params.id);
    if (result) {
      res.json({ message: 'Libro eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Libro no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const searchLibros = async (req, res, next) => {
  try {
    const { query, editorial, sortBy } = req.query;
    const libros = await Libro.search(query, editorial, sortBy);
    res.json(libros);
  } catch (error) {
    next(error);
  }
};