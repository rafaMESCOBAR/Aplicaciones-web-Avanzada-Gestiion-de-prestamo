import Autor from '../models/Autor.js';

export const getAllAutores = async (req, res, next) => {
  try {
    const autores = await Autor.getAll();
    res.json(autores);
  } catch (error) {
    next(error);
  }
};

export const getAutorById = async (req, res, next) => {
  try {
    const autor = await Autor.getById(req.params.id);
    if (autor) {
      res.json(autor);
    } else {
      res.status(404).json({ message: 'Autor no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const createAutor = async (req, res, next) => {
  try {
    const nuevoAutor = await Autor.create(req.body);
    res.status(201).json(nuevoAutor);
  } catch (error) {
    next(error);
  }
};

export const updateAutor = async (req, res, next) => {
  try {
    const autorActualizado = await Autor.update(req.params.id, req.body);
    if (autorActualizado) {
      res.json(autorActualizado);
    } else {
      res.status(404).json({ message: 'Autor no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteAutor = async (req, res, next) => {
  try {
    const result = await Autor.delete(req.params.id);
    if (result) {
      res.json({ message: 'Autor eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Autor no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const getLibrosByAutor = async (req, res, next) => {
  try {
    const libros = await Autor.getLibrosByAutor(req.params.id);
    res.json(libros);
  } catch (error) {
    next(error);
  }
};