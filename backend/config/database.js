import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',  // Dejamos esto vacío ya que mencionaste que no tienes contraseña
  database: 'biblioteca',  // Asegúrate de que este es el nombre correcto de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;