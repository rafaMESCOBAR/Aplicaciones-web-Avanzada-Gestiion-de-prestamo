import db from '../config/database.js';

class Usuario {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM Usuario');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM Usuario WHERE idUsuario = ?', [id]);
    return rows[0];
  }

  static async create(usuario) {
    const { NumeroDeUsuario, NIF, Nombre, Direccion, Telefono } = usuario;
    const [result] = await db.query(
      'INSERT INTO Usuario (NumeroDeUsuario, NIF, Nombre, Direccion, Telefono) VALUES (?, ?, ?, ?, ?)',
      [NumeroDeUsuario, NIF, Nombre, Direccion, Telefono]
    );
    return { id: result.insertId, ...usuario };
  }

  static async update(id, usuario) {
    const { NumeroDeUsuario, NIF, Nombre, Direccion, Telefono } = usuario;
    const [result] = await db.query(
      'UPDATE Usuario SET NumeroDeUsuario = ?, NIF = ?, Nombre = ?, Direccion = ?, Telefono = ? WHERE idUsuario = ?',
      [NumeroDeUsuario, NIF, Nombre, Direccion, Telefono, id]
    );
    return result.affectedRows > 0 ? this.getById(id) : null;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM Usuario WHERE idUsuario = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default Usuario;