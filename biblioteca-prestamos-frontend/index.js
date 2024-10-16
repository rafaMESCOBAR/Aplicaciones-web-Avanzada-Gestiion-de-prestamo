import express from 'express';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const API_URL = 'http://localhost:5000';

// Configurar Handlebars
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(__dirname, 'src/views/layouts'),
    partialsDir: join(__dirname, 'src/views/partials'),
    extname: '.hbs',
    helpers: {
        formatDate: function(date) {
            return date ? new Date(date).toLocaleDateString('es-ES') : '';
        },
        isSelected: function(value, selectedValues) {
            if (!selectedValues) return '';
            if (Array.isArray(selectedValues)) {
                return selectedValues.includes(value.toString()) ? 'selected' : '';
            }
            if (typeof selectedValues === 'string') {
                return selectedValues.split(',').includes(value.toString()) ? 'selected' : '';
            }
            return selectedValues.toString() === value.toString() ? 'selected' : '';
        },
        eq: function(v1, v2) {
            return v1 === v2;
        }
    }
}));
app.set('view engine', '.hbs');
app.set('views', join(__dirname, 'src/views'));

// Servir archivos estáticos
app.use(express.static(join(__dirname, 'src/public')));
app.use('/uploads', express.static(join(__dirname, '../backend/uploads')));

// Middleware para procesar datos de formularios
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.render('home', { title: 'Inicio' });
});

// Rutas para Libros
app.get('/libros', async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/api/libros`);
        if (!response.ok) throw new Error('Error al obtener libros');
        const libros = await response.json();
        res.render('libros/list', { title: 'Gestión de Libros', libros });
    } catch (error) {
        console.error('Error al obtener libros:', error);
        res.status(500).render('error', { message: 'Error al cargar los libros' });
    }
});

app.get('/libros/add', async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/api/autores`);
        if (!response.ok) throw new Error('Error al obtener autores');
        const autores = await response.json();
        res.render('libros/add', { title: 'Añadir Libro', autores });
    } catch (error) {
        console.error('Error al obtener autores:', error);
        res.status(500).render('error', { message: 'Error al cargar los autores' });
    }
});

app.get('/libros/edit/:id', async (req, res) => {
    try {
        const [libroResponse, autoresResponse] = await Promise.all([
            fetch(`${API_URL}/api/libros/${req.params.id}`),
            fetch(`${API_URL}/api/autores`)
        ]);
        
        if (!libroResponse.ok || !autoresResponse.ok) {
            throw new Error('Error al obtener datos del servidor');
        }
        
        const libro = await libroResponse.json();
        const autores = await autoresResponse.json();
        
        if (Array.isArray(libro.Autores)) {
            libro.Autores = libro.Autores.map(autor => autor.idAutor.toString());
        } else if (typeof libro.Autores === 'string') {
            libro.Autores = libro.Autores.split(',');
        }
        
        res.render('libros/edit', { title: 'Editar Libro', libro, autores });
    } catch (error) {
        console.error('Error al obtener libro o autores:', error);
        res.status(500).render('error', { message: 'Error al cargar el libro o los autores' });
    }
});

app.get('/libros/view/:id', async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/api/libros/${req.params.id}`);
        if (!response.ok) throw new Error('Error al obtener libro');
        const libro = await response.json();
        res.render('libros/view', { title: 'Ver Libro', libro });
    } catch (error) {
        console.error('Error al obtener libro:', error);
        res.status(500).render('error', { message: 'Error al cargar el libro' });
    }
});

// Rutas para Autores
app.get('/autores', async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/api/autores`);
        if (!response.ok) throw new Error('Error al obtener autores');
        const autores = await response.json();
        res.render('autores/list', { title: 'Autores', autores });
    } catch (error) {
        console.error('Error al obtener autores:', error);
        res.status(500).render('error', { message: 'Error al cargar los autores' });
    }
});

app.get('/autores/add', (req, res) => {
    res.render('autores/add', { title: 'Añadir Autor' });
});

app.get('/autores/edit/:id', async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/api/autores/${req.params.id}`);
        if (!response.ok) throw new Error('Error al obtener autor');
        const autor = await response.json();
        res.render('autores/edit', { title: 'Editar Autor', autor });
    } catch (error) {
        console.error('Error al obtener autor:', error);
        res.status(500).render('error', { message: 'Error al cargar el autor' });
    }
});

app.get('/autores/view/:id', async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/api/autores/${req.params.id}`);
        if (!response.ok) throw new Error('Error al obtener autor');
        const autor = await response.json();
        res.render('autores/view', { title: 'Ver Autor', autor });
    } catch (error) {
        console.error('Error al obtener autor:', error);
        res.status(500).render('error', { message: 'Error al cargar el autor' });
    }
});

// Rutas para Usuarios
app.get('/usuarios', async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/api/usuarios`);
        if (!response.ok) throw new Error('Error al obtener usuarios');
        const usuarios = await response.json();
        res.render('usuarios/list', { title: 'Usuarios', usuarios });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).render('error', { message: 'Error al cargar los usuarios' });
    }
});

app.get('/usuarios/add', (req, res) => {
    res.render('usuarios/add', { title: 'Añadir Usuario' });
});

app.get('/usuarios/edit/:id', async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/api/usuarios/${req.params.id}`);
        if (!response.ok) throw new Error('Error al obtener usuario');
        const usuario = await response.json();
        res.render('usuarios/edit', { title: 'Editar Usuario', usuario });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).render('error', { message: 'Error al cargar el usuario' });
    }
});

app.get('/usuarios/view/:id', async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/api/usuarios/${req.params.id}`);
        if (!response.ok) throw new Error('Error al obtener usuario');
        const usuario = await response.json();
        res.render('usuarios/view', { title: 'Ver Usuario', usuario });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).render('error', { message: 'Error al cargar el usuario' });
    }
});

// Rutas para Préstamos
app.get('/prestamos', async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/api/prestamos`);
        if (!response.ok) throw new Error('Error al obtener préstamos');
        const prestamos = await response.json();
        res.render('prestamos/list', { title: 'Préstamos', prestamos });
    } catch (error) {
        console.error('Error al obtener préstamos:', error);
        res.status(500).render('error', { message: 'Error al cargar los préstamos' });
    }
});

app.get('/prestamos/add', async (req, res) => {
    try {
        const [usuariosResponse, librosResponse] = await Promise.all([
            fetch(`${API_URL}/api/usuarios`),
            fetch(`${API_URL}/api/libros`)
        ]);
        if (!usuariosResponse.ok || !librosResponse.ok) {
            throw new Error('Error al obtener datos del servidor');
        }
        const usuarios = await usuariosResponse.json();
        const libros = await librosResponse.json();
        res.render('prestamos/add', { title: 'Añadir Préstamo', usuarios, libros });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { message: 'Error al cargar los datos' });
    }
});

app.get('/prestamos/edit/:id', async (req, res) => {
    try {
        const [prestamoResponse, usuariosResponse, librosResponse] = await Promise.all([
            fetch(`${API_URL}/api/prestamos/${req.params.id}`),
            fetch(`${API_URL}/api/usuarios`),
            fetch(`${API_URL}/api/libros`)
        ]);
        
        if (!prestamoResponse.ok || !usuariosResponse.ok || !librosResponse.ok) {
            throw new Error('Error al obtener datos del servidor');
        }
        
        const prestamo = await prestamoResponse.json();
        const usuarios = await usuariosResponse.json();
        const libros = await librosResponse.json();
        
        res.render('prestamos/edit', { title: 'Editar Préstamo', prestamo, usuarios, libros });
    } catch (error) {
        console.error('Error al obtener préstamo:', error);
        res.status(500).render('error', { message: 'Error al cargar el préstamo' });
    }
});

app.get('/prestamos/view/:id', async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/api/prestamos/${req.params.id}`);
        if (!response.ok) throw new Error('Error al obtener préstamo');
        const prestamo = await response.json();
        res.render('prestamos/view', { title: 'Ver Préstamo', prestamo });
    } catch (error) {
        console.error('Error al obtener préstamo:', error);
        res.status(500).render('error', { message: 'Error al cargar el préstamo' });
    }
});

// Manejador de rutas no encontradas
app.use((req, res) => {
    res.status(404).render('error', { title: 'Página no encontrada', message: 'La página que buscas no existe.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor frontend corriendo en puerto ${PORT}`));