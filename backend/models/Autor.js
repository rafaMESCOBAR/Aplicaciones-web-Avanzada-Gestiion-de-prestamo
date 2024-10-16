import db from '../config/database.js';

class Autor {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM Autor');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM Autor WHERE idAutor = ?', [id]);
    return rows[0];
  }

  static async create(autor) {
    const { Nombre, Nacional } = autor;
    const [result] = await db.query(
      'INSERT INTO Autor (Nombre, Nacional) VALUES (?, ?)',
      [Nombre, Nacional]
    );
    return { id: result.insertId, ...autor };
  }

  static async update(id, autor) {
    const { Nombre, Nacional } = autor;
    const [result] = await db.query('UPDATE Autor SET Nombre = ?, Nacional = ? WHERE idAutor = ?',
      [Nombre, Nacional, id]
    );
    return result.affectedRows > 0 ? this.getById(id) : null;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM Autor WHERE idAutor = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getLibrosByAutor(id) {
    const [rows] = await db.query(`
      SELECT L.* 
      FROM Libro L
      JOIN Libro_Autor LA ON L.idLibro = LA.idLibro
      WHERE LA.idAutor = ?
    `, [id]);
    return rows;
  }
}

export default Autor;