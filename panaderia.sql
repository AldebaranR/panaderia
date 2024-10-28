CREATE DATABASE panaderia;
use panaderia;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    imagen VARCHAR(255) NOT NULL,
    disponible BOOLEAN DEFAULT TRUE
);

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(15)
);

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE facturas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

-- Modificar la tabla de productos para agregar el campo cantidad
ALTER TABLE productos
ADD COLUMN cantidad INT NOT NULL DEFAULT 0;

-- Si necesitas asegurarte de que la tabla tiene los datos correctos, aquí hay un ejemplo de cómo insertar datos con la nueva columna
INSERT INTO productos (nombre, descripcion, precio, imagen, cantidad) VALUES 
('Pan de muerto', 'Delicioso pan tradicional', 25.00, 'pan_muerto.jpg', 100),
('Galletas de calavera', 'Galletas decorativas de Halloween', 15.00, 'galletas_calavera.jpg', 50);

select * from productos;
select * from pedidos;
select * from facturas;