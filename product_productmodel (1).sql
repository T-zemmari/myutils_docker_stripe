-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: mysql
-- Tiempo de generación: 03-01-2024 a las 15:58:56
-- Versión del servidor: 10.10.7-MariaDB-1:10.10.7+maria~ubu2204
-- Versión de PHP: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `util_tar_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product_productmodel`
--

DROP TABLE IF EXISTS `product_productmodel`;
CREATE TABLE IF NOT EXISTS `product_productmodel` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` longtext NOT NULL,
  `price` decimal(5,2) NOT NULL,
  `price_id` varchar(100) DEFAULT NULL,
  `date_created` datetime(6) NOT NULL,
  `date_modified` datetime(6) NOT NULL,
  `days` int(10) UNSIGNED NOT NULL CHECK (`days` >= 0),
  `is_suscription` int(10) UNSIGNED NOT NULL CHECK (`is_suscription` >= 0),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `product_productmodel`
--

INSERT INTO `product_productmodel` (`id`, `name`, `description`, `price`, `price_id`, `date_created`, `date_modified`, `days`, `is_suscription`) VALUES
(1, 'Gratuito', 'Disfruta de nuestras herramientas durante 2 dias gratis.', 0.00, 'price_1OUVZWHMq5R06SlDM9hehX15', '2024-01-03 14:37:33.370616', '2024-01-03 14:37:34.198083', 2, 0),
(2, 'Plan 30', 'Desbloquea todo el potencial creativo con nuestro plan premium de 30 dias: une PDFs, convierte imagenes a PDF, edita videos y mas, durante un mes completo.', 6.99, 'price_1OUVa6HMq5R06SlDu9BHnx1d', '2024-01-03 14:38:10.051842', '2024-01-03 14:38:10.447601', 30, 0),
(3, 'Plan 180', 'Experimenta la versatilidad ilimitada con nuestro plan premium de 180 dias. Un periodo extendido para disfrutar de todas las herramientas: unir PDFs, convertir imagenes a PDF, editar videos y mucho mas', 22.99, 'price_1OUVaeHMq5R06SlDYUirR2aL', '2024-01-03 14:38:43.801744', '2024-01-03 14:38:44.105105', 180, 0),
(4, 'Plan 360', 'Potencia tu creatividad durante todo el año con nuestro exclusivo plan anual. Accede sin limites a funciones avanzadas: unir PDFs, convertir imagenes a PDF, editar videos y mas. Descubre el poder de la versatilidad continua', 39.99, 'price_1OUVb2HMq5R06SlDUbCs8xLE', '2024-01-03 14:39:08.526203', '2024-01-03 14:39:08.995172', 365, 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
