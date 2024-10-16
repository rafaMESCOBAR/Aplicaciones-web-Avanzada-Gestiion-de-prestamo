import db from '../config/database.js';

class Libro {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT L.*, GROUP_CONCAT(A.Nombre SEPARATOR ', ') AS AutoresNombres, GROUP_CONCAT(A.idAutor) AS Autores
      FROM Libro L
      LEFT JOIN Libro_Autor LA ON L.idLibro = LA.idLibro
      LEFT JOIN Autor A ON LA.idAutor = A.idAutor
      GROUP BY L.idLibro
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(`
      SELECT L.*, GROUP_CONCAT(A.Nombre SEPARATOR ', ') AS AutoresNombres, GROUP_CONCAT(A.idAutor) AS Autores
      FROM Libro L
      LEFT JOIN Libro_Autor LA ON L.idLibro = LA.idLibro
      LEFT JOIN Autor A ON LA.idAutor = A.idAutor
      WHERE L.idLibro = ?
      GROUP BY L.idLibro
    `, [id]);
    return rows[0];
  }

  static async create(libro) {
    const { Codigo, titulo, Autores, ISBN, Editorial, NumeroDePaginas, Imagen } = libro;
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        'INSERT INTO Libro (Codigo, titulo, ISBN, Editorial, NumeroDePaginas, Imagen) VALUES (?, ?, ?, ?, ?, ?)',
        [Codigo, titulo, ISBN, Editorial, NumeroDePaginas, Imagen]
      );

      const libroId = result.insertId;

      if (Autores && Autores.length > 0) {
        for (let autorId of Autores) {
          await connection.query(
            'INSERT INTO Libro_Autor (idLibro, idAutor) VALUES (?, ?)',
            [libroId, autorId]
          );
        }
      }

      await connection.commit();
      return { id: libroId, ...libro };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async update(id, libro) {
    const { Codigo, titulo, Autores, ISBN, Editorial, NumeroDePaginas, Imagen } = libro;
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      let query = 'UPDATE Libro SET Codigo = ?, titulo = ?, ISBN = ?, Editorial = ?, NumeroDePaginas = ?';
      let params = [Codigo, titulo, ISBN, Editorial, NumeroDePaginas];

      if (Imagen) {
        query += ', Imagen = ?';
        params.push(Imagen);
      }

      query += ' WHERE idLibro = ?';
      params.push(id);

      await connection.query(query, params);

      await connection.query('DELETE FROM Libro_Autor WHERE idLibro = ?', [id]);

      if (Autores && Autores.length > 0) {
        for (let autorId of Autores) {
          await connection.query(
            'INSERT INTO Libro_Autor (idLibro, idAutor) VALUES (?, ?)',
            [id, autorId]
          );
        }
      }

      await connection.commit();
      return this.getById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM Libro WHERE idLibro = ?', [id]);
    return result.affectedRows > 0;
  }

  static async search(query, editorial, sortBy) {
    let sql = `
      SELECT L.*, GROUP_CONCAT(A.Nombre SEPARATOR ', ') AS AutoresNombres, GROUP_CONCAT(A.idAutor) AS Autores
      FROM Libro L
      LEFT JOIN Libro_Autor LA ON L.idLibro = LA.idLibro
      LEFT JOIN Autor A ON LA.idAutor = A.idAutor
      WHERE 1=1
    `;
    const params = [];

    if (query) {
      sql += ' AND (L.Codigo LIKE ? OR L.titulo LIKE ? OR L.ISBN LIKE ? OR L.Editorial LIKE ? OR A.Nombre LIKE ?)';
      params.push(`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`);
    }
    if (editorial) {
      sql += ' AND L.Editorial = ?';
      params.push(editorial);
    }

    sql += ' GROUP BY L.idLibro';

    if (sortBy) {
      switch(sortBy) {
        case 'titulo':
          sql += ' ORDER BY L.titulo';
          break;
        case 'autor':
          sql += ' ORDER BY AutoresNombres';
          break;
        case 'isbn':
          sql += ' ORDER BY L.ISBN';
          break;
        case 'editorial':
          sql += ' ORDER BY L.Editorial';
          break;
        case 'numpags':
          sql += ' ORDER BY L.NumeroDePaginas';
          break;
        default:
          break;
      }
    }

    const [rows] = await db.query(sql, params);
    return rows;
  }
}

export default Libro;
    