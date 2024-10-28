$(document).ready(function() {
    cargarProductos();

    $('#formAgregar').on('submit', function(e) {
        e.preventDefault();
        agregarProducto();
    });

    // Cambiar el evento de submit a click en el botón de actualizar
    $('#btnActualizar').on('click', function() {
        actualizarProducto();
    });
});

function cargarProductos() {
    $.ajax({
        url: 'productos.php',
        type: 'GET',
        success: function(data) {
            console.log("Respuesta de productos.php:", data);
            $('#productos').empty();
            data.forEach(producto => {
                $('#productos').append(`
                    <div class="card mb-3">
                        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">${producto.descripcion}</p>
                            <p class="card-text">Precio: $${producto.precio}</p>
                            <p class="card-text">Cantidad: ${producto.cantidad}</p>
                            <button class="btn btn-warning" onclick="abrirModalEditar(${producto.id}, '${producto.nombre}', '${producto.descripcion}', ${producto.precio}, '${producto.imagen}', ${producto.cantidad})">Editar</button>
                            <button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                        </div>
                    </div>
                `);
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error al cargar productos:', textStatus, errorThrown);
        }
    });
}

function agregarProducto() {
    const nombre = $('#nombre').val();
    const descripcion = $('#descripcion').val();
    const precio = $('#precio').val();
    const imagen = $('#imagen').val();
    const cantidad = $('#cantidad').val();

    $.post('productos.php', { nombre, descripcion, precio, imagen, cantidad }, function(response) {
        alert(response.success || response.error);
        cargarProductos();
        $('#modalAgregar').modal('hide');
    }, 'json').fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error al agregar producto:', textStatus, errorThrown);
    });
}

function abrirModalEditar(id, nombre, descripcion, precio, imagen, cantidad) {
    $('#idProducto').val(id); // Este debe ser el campo oculto para el ID
    $('#nombreEditar').val(nombre);
    $('#descripcionEditar').val(descripcion);
    $('#precioEditar').val(precio);
    $('#imagenEditar').val(imagen);
    $('#cantidadEditar').val(cantidad);
    $('#modalEditar').modal('show');
}


function actualizarProducto() {
    const id = $('#idProducto').val(); // Obtener el ID del producto
    const nombre = $('#nombreEditar').val();
    const descripcion = $('#descripcionEditar').val();
    const precio = $('#precioEditar').val();
    const imagen = $('#imagenEditar').val();
    const cantidad = $('#cantidadEditar').val();

    // Comprobando si todos los campos están llenos
    if (!id || !nombre || !descripcion || !precio || !imagen || !cantidad) {
        alert('Por favor, completa todos los campos.');
        return; // Salir si falta información
    }

    // Agregando una línea para ver los datos antes de enviar
    console.log("ID del producto:", id); // Añadir esta línea
    console.log("Datos a enviar:", {
        id: id,
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        imagen: imagen,
        cantidad: cantidad
    });

    $.ajax({
        url: 'productos.php',
        type: 'PUT', // Asegúrate de que sea el método correcto
        contentType: 'application/json',
        data: JSON.stringify({
            id: id,
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            imagen: imagen,
            cantidad: cantidad
        }),
        success: function(response) {
            console.log("Respuesta del servidor:", response); // Agregar esto para ver la respuesta
            if (response.success) {
                alert('Producto actualizado correctamente');
                $('#modalEditar').modal('hide'); // Cerrar el modal
                cargarProductos(); // Volver a cargar los productos
            } else {
                alert('Error al actualizar el producto: ' + response.error);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error en la solicitud AJAX:', error);
            alert('Error al actualizar el producto: ' + xhr.responseText);
        }
    });
}


function eliminarProducto(id) {
    $.ajax({
        url: 'productos.php',
        type: 'DELETE',
        data: { id: id },
        success: function (response) {
            if (response.error) {
                alert('Error al eliminar producto: ' + response.error);
            } else {
                alert(response.success);
                cargarProductos(); // Recargar productos
            }
        },
        error: function (xhr) {
            console.error('Error al eliminar producto:', xhr.responseText);
            alert('Error al eliminar producto: ' + xhr.responseText);
            cargarProductos();
        }
    });
}
