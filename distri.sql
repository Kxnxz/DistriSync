-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-06-2026 a las 20:13:05
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `distri`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id_carrito` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito_detalle`
--

CREATE TABLE `carrito_detalle` (
  `id_detalle` int(11) NOT NULL,
  `id_carrito` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `codigo` varchar(20) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `codigo`, `nombre`, `descripcion`) VALUES
(1, NULL, 'Piel sensible', NULL),
(2, NULL, 'Noche', NULL),
(3, NULL, 'Sérum', NULL),
(4, NULL, 'Exfoliantes', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `codigo` varchar(20) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `ml` int(11) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `id_proveedor` int(11) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT 'v1.png',
  `stock` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `codigo`, `nombre`, `color`, `ml`, `precio`, `id_categoria`, `id_proveedor`, `imagen`, `stock`) VALUES
(1, NULL, 'Místico Crema de Noche', NULL, NULL, 28.50, 2, 13, 'v1.png', 16),
(2, NULL, 'Minimal Sérum Facial', NULL, NULL, 34.20, 3, 13, 'v1.png', 8),
(3, NULL, 'Lavanda Dreams Aceite', NULL, NULL, 18.75, 1, 13, 'v1.png', 23),
(4, NULL, 'Antracita Exfoliante', NULL, NULL, 22.90, 4, 13, 'v1.png', 33),
(5, NULL, 'Aura Hidratante', NULL, NULL, 25.00, 1, 13, 'v1.png', 14),
(6, NULL, 'Velvet Skin Sérum', NULL, NULL, 31.80, 3, 13, 'v1.png', 12),
(8, NULL, 'Pure Glow Exfoliante', NULL, NULL, 21.50, 4, 13, 'v1.png', 20);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `admin` tinyint(1) DEFAULT 0,
  `rol` enum('admin','proveedor','cliente') DEFAULT 'cliente',
  `apellido` varchar(100) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `token_expira` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `email`, `password`, `fecha_creacion`, `admin`, `rol`, `apellido`, `reset_token`, `token_expira`) VALUES
(1, 'Admin', 'admin@distri.com', '$2y$10$urFKj56f2plzBcgYhVA42uvQ0wWzJqDJsmKxaTfiYnJ4WHcu79jFe', '2026-04-22 15:33:02', 1, 'admin', NULL, NULL, NULL),
(2, 'Admin', 'admin@distrisync.com', '$2y$10$urFKj56f2plzBcgYhVA42uvQ0wWzJqDJsmKxaTfiYnJ4WHcu79jFe', '2026-04-24 15:21:14', 1, 'admin', NULL, NULL, NULL),
(3, 'hola', 'hola@gmail.com', '$2y$10$urFKj56f2plzBcgYhVA42uvQ0wWzJqDJsmKxaTfiYnJ4WHcu79jFe', '2026-04-24 15:38:23', 0, 'cliente', NULL, NULL, NULL),
(4, 'sd', 'si@gmail.com', '$2y$10$urFKj56f2plzBcgYhVA42uvQ0wWzJqDJsmKxaTfiYnJ4WHcu79jFe', '2026-04-28 12:07:08', 0, 'cliente', NULL, NULL, NULL),
(5, 'andres', 'asi@gmial.com', '$2y$10$urFKj56f2plzBcgYhVA42uvQ0wWzJqDJsmKxaTfiYnJ4WHcu79jFe', '2026-04-28 12:21:48', 0, 'cliente', NULL, NULL, NULL),
(6, 'andnres', 'asi@gmail.com', '$2y$10$urFKj56f2plzBcgYhVA42uvQ0wWzJqDJsmKxaTfiYnJ4WHcu79jFe', '2026-04-28 12:22:12', 0, 'cliente', NULL, NULL, NULL),
(8, 'prueba', 'prueba@gmail.com', '$2y$10$urFKj56f2plzBcgYhVA42uvQ0wWzJqDJsmKxaTfiYnJ4WHcu79jFe', '2026-04-28 12:58:40', 0, 'cliente', NULL, NULL, NULL),
(9, 'andres', 'paez@gmail.com', '$2y$10$urFKj56f2plzBcgYhVA42uvQ0wWzJqDJsmKxaTfiYnJ4WHcu79jFe', '2026-04-29 12:31:56', 0, 'cliente', 'paez', '905d84466a9a78715031a17cd88992d7c06886a28dac86c97abd25b3c36c49ce', '2026-05-29 19:01:54'),
(10, 'andres', 'soto@gmail.com', '$2y$10$urFKj56f2plzBcgYhVA42uvQ0wWzJqDJsmKxaTfiYnJ4WHcu79jFe', '2026-04-29 12:37:15', 0, 'cliente', 'paez', NULL, NULL),
(11, 'Andres', 'apaez3335@gmail.com', '$2y$10$urFKj56f2plzBcgYhVA42uvQ0wWzJqDJsmKxaTfiYnJ4WHcu79jFe', '2026-05-29 14:50:47', 0, 'cliente', 'Paez', '6e5b4db7fbe323e170dce746bf3ba50cb3de48bfb8c5b754467c70e22762a80c', '2026-06-18 19:26:21'),
(12, 'Andres', 'mendez@gmail.com', '$2y$10$sQKNpd9cMV8oRVUg2qJK3ucop5WqkyUjn4yL4CKtuTWU2wzC.rKmq', '2026-06-29 22:53:23', 0, '', 'Mendez', NULL, NULL),
(13, 'Proveedor Demo', 'proveedor@demo.com', '$2y$10$TU_HASH_AQUI', '2026-06-29 23:30:25', 0, 'proveedor', 'Demo', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id_venta` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id_venta`, `id_usuario`, `total`, `fecha`) VALUES
(4, 1, 70.45, '2026-06-23 15:27:54'),
(5, 1, 70.45, '2026-06-23 15:27:54'),
(19, 1, 10.00, '2026-06-23 15:31:14'),
(20, 1, 10.00, '2026-06-23 15:32:26'),
(21, 1, 70.45, '2026-06-23 15:34:05'),
(22, 1, 22.31, '2026-06-23 15:36:39');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta_detalle`
--

CREATE TABLE `venta_detalle` (
  `id_detalle` int(11) NOT NULL,
  `id_venta` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `venta_detalle`
--

INSERT INTO `venta_detalle` (`id_detalle`, `id_venta`, `id_producto`, `cantidad`, `precio_unitario`) VALUES
(1, 20, 1, 1, 5.00),
(2, 21, 5, 1, 25.00),
(3, 21, 2, 1, 34.20),
(4, 22, 3, 1, 18.75);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id_carrito`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `carrito_detalle`
--
ALTER TABLE `carrito_detalle`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_carrito` (`id_carrito`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_categoria` (`id_categoria`),
  ADD KEY `productos_ibfk_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id_venta`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `venta_detalle`
--
ALTER TABLE `venta_detalle`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_producto` (`id_producto`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id_carrito` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `carrito_detalle`
--
ALTER TABLE `carrito_detalle`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id_venta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `venta_detalle`
--
ALTER TABLE `venta_detalle`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `carrito_detalle`
--
ALTER TABLE `carrito_detalle`
  ADD CONSTRAINT `carrito_detalle_ibfk_1` FOREIGN KEY (`id_carrito`) REFERENCES `carrito` (`id_carrito`),
  ADD CONSTRAINT `carrito_detalle_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  ADD CONSTRAINT `productos_ibfk_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `venta_detalle`
--
ALTER TABLE `venta_detalle`
  ADD CONSTRAINT `venta_detalle_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`),
  ADD CONSTRAINT `venta_detalle_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
