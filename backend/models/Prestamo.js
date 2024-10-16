import db from '../config/database.js';

class Prestamo {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT P.*, U.Nombre AS NombreUsuario, L.titulo AS TituloLibro
      FROM Prestamos P
      JOIN Usuario U ON P.idUsuario = U.idUsuario
      JOIN Libro L ON P.idLibro = L.idLibro
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(`
      SELECT P.*, U.Nombre AS NombreUsuario, L.titulo AS TituloLibro
      FROM Prestamos P
      JOIN Usuario U ON P.idUsuario = U.idUsuario
      JOIN Libro L ON P.idLibro = L.idLibro
      WHERE P.idPrestamos = ?
    `, [id]);
    return rows[0];
  }

  static async create(prestamo) {
    const { idUsuario, idLibro, FechaPrestamo, FechaDevolucion } = prestamo;
    const [result] = await db.query(
      'INSERT INTO Prestamos (idUsuario, idLibro, FechaPrestamo, FechaDevolucion) VALUES (?, ?, ?, ?)',
      [idUsuario, idLibro, FechaPrestamo, FechaDevolucion]
    );
    return { id: result.insertId, ...prestamo };
  }

  static async update(id, prestamo) {
    const { idUsuario, idLibro, FechaPrestamo, FechaDevolucion } = prestamo;
    const [result] = await db.query(
      'UPDATE Prestamos SET idUsuario = ?, idLibro = ?, FechaPrestamo = ?, FechaDevolucion = ? WHERE idPrestamos = ?',
      [idUsuario, idLibro, FechaPrestamo, FechaDevolucion, id]
    );
    return result.affectedRows > 0 ? this.getById(id) : null;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM Prestamos WHERE idPrestamos = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default Prestamo;