<?php 
include 'config.php';
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

$requestMethod = $_SERVER['REQUEST_METHOD'];

// Manejo de las solicitudes POST, PUT y DELETE
if ($requestMethod === 'POST') {
    $nombre = $_POST['nombre'];
    $descripcion = $_POST['descripcion'];
    $precio = $_POST['precio'];
    $imagen = $_POST['imagen'];
    $cantidad = $_POST['cantidad'];
    
    $sql = "INSERT INTO productos (nombre, descripcion, precio, imagen, cantidad) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssi", $nombre, $descripcion, $precio, $imagen, $cantidad);
    if ($stmt->execute()) {
        echo json_encode(['success' => 'Producto agregado correctamente.']);
    } else {
        echo json_encode(['error' => 'Error al agregar producto.']);
    }
    $stmt->close();
} elseif ($requestMethod === 'DELETE') {
    // Lógica para eliminar producto
    parse_str(file_get_contents("php://input"), $_DELETE);
    $id = $_DELETE['id'];

    if (empty($id)) {
        echo json_encode(['error' => 'ID no proporcionado.']);
        exit;
    }

    $sql = "DELETE FROM productos WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => 'Producto eliminado correctamente.']);
        } else {
            echo json_encode(['error' => 'Producto no encontrado.']);
        }
    } else {
        echo json_encode(['error' => 'Error al eliminar producto: ' . $stmt->error]);
    }
    $stmt->close();
} elseif ($requestMethod === 'PUT') {
 
    // Cambia esto para asegurarte de que estés recibiendo el JSON correctamente
    $data = json_decode(file_get_contents("php://input"), true);

    // Asegúrate de que todos los campos estén definidos
    if (isset($data['id'], $data['nombre'], $data['descripcion'], $data['precio'], $data['imagen'], $data['cantidad'])) {
        $stmt = $conn->prepare("UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, imagen = ?, cantidad = ? WHERE id = ?");
        $stmt->bind_param("ssdsdi", $data['nombre'], $data['descripcion'], $data['precio'], $data['imagen'], $data['cantidad'], $data['id']);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Error en la base de datos.']);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'error' => 'Faltan datos.']);
    }
    exit;
} else {
    $sql = "SELECT * FROM productos";
    $result = $conn->query($sql);
    $productos = [];
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
    echo json_encode($productos);
}
$conn->close(); // Cerrar conexión
?>
