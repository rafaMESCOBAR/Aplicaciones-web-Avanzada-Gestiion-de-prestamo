import Prestamo from '../models/Prestamo.js';

export const getAllPrestamos = async (req, res, next) => {
  try {
    const prestamos = await Prestamo.getAll();
    res.json(prestamos);
  } catch (error) {
    next(error);
  }
};

export const getPrestamoById = async (req, res, next) => {
  try {
    const prestamo = await Prestamo.getById(req.params.id);
    if (prestamo) {
      res.json(prestamo);
    } else {
      res.status(404).json({ message: 'Préstamo no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const createPrestamo = async (req, res, next) => {
  try {
    const nuevoPrestamo = await Prestamo.create(req.body);
    res.status(201).json(nuevoPrestamo);
  } catch (error) {
    next(error);
  }
};

export const updatePrestamo = async (req, res, next) => {
  try {
    const prestamoActualizado = await Prestamo.update(req.params.id, req.body);
    if (prestamoActualizado) {
      res.json(prestamoActualizado);
    } else {
      res.status(404).json({ message: 'Préstamo no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const deletePrestamo = async (req, res, next) => {
  try {
    const result = await Prestamo.delete(req.params.id);
    if (result) {
      res.json({ message: 'Préstamo eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Préstamo no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};