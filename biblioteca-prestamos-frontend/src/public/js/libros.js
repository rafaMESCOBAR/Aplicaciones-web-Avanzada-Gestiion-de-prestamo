document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://localhost:5000';
    const searchInput = document.getElementById('searchInput');
    const editorialFilter = document.getElementById('editorialFilter');
    const sortBy = document.getElementById('sortBy');
    const booksTableBody = document.getElementById('booksTableBody');

    // Verificación de existencia de booksTableBody
    if (!booksTableBody) {
        console.error('Elemento booksTableBody no encontrado en el DOM');
        return;
    }

    // Cargar libros inicialmente
    loadBooks();

    // Función para cargar libros desde el backend
    async function loadBooks() {
        try {
            const query = searchInput ? searchInput.value : '';
            const editorial = editorialFilter ? editorialFilter.value : '';
            const sort = sortBy ? sortBy.value : '';

            const response = await fetch(`${API_URL}/api/libros/search?query=${query}&editorial=${editorial}&sortBy=${sort}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const libros = await response.json();
            renderBooks(libros);
        } catch (error) {
            console.error('Error al cargar libros:', error);
            booksTableBody.innerHTML = '<tr><td colspan="7">Error al cargar los libros. Por favor, intente de nuevo más tarde.</td></tr>';
        }
    }

    // Función para renderizar libros en la tabla
    function renderBooks(libros) {
        booksTableBody.innerHTML = '';
        if (libros.length === 0) {
            booksTableBody.innerHTML = '<tr><td colspan="7">No se encontraron libros.</td></tr>';
            return;
        }
        libros.forEach(libro => {
            const row = `
                <tr>
                    <td>${libro.Codigo || 'N/A'}</td>
                    <td>${libro.titulo || 'N/A'}</td>
                    <td>${libro.Autores || 'N/A'}</td>
                    <td>${libro.ISBN || 'N/A'}</td>
                    <td>${libro.Editorial || 'N/A'}</td>
                    <td>${libro.NumeroDePaginas || 'N/A'}</td>
                    <td>
                        <a href="/libros/view/${libro.idLibro}" class="btn btn-sm btn-outline-info"><i class="bi bi-eye"></i></a>
                        <a href="/libros/edit/${libro.idLibro}" class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil"></i></a>
                        <button onclick="deleteBook(${libro.idLibro})" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `;
            booksTableBody.innerHTML += row;
        });
    }

    // Agregar event listeners
    if (searchInput) {
        searchInput.addEventListener('input', debounce(loadBooks, 300));
    }
    if (editorialFilter) {
        editorialFilter.addEventListener('change', loadBooks);
    }
    if (sortBy) {
        sortBy.addEventListener('change', loadBooks);
    }

    // Función debounce para evitar múltiples llamadas innecesarias
    function debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        }
    }

    // Manejar eliminación de libros
    window.deleteBook = async function(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este libro?')) {
            try {
                const response = await fetch(`${API_URL}/api/libros/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    loadBooks(); // Recargar la lista de libros
                } else {
                    const errorData = await response.json();
                    alert(`Error al eliminar el libro: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            }
        }
    }
});