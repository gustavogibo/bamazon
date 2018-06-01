-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.6.34-log - MySQL Community Server (GPL)
-- Server OS:                    Win32
-- HeidiSQL Version:             9.5.0.5249
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for bamazon
DROP DATABASE IF EXISTS `bamazon`;
CREATE DATABASE IF NOT EXISTS `bamazon` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `bamazon`;

-- Dumping structure for table bamazon.departments
DROP TABLE IF EXISTS `departments`;
CREATE TABLE IF NOT EXISTS `departments` (
  `department_id` int(10) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(50) NOT NULL,
  `over_head_costs` int(10) NOT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- Dumping data for table bamazon.departments: ~10 rows (approximately)
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` (`department_id`, `department_name`, `over_head_costs`) VALUES
	(1, 'Weapons', 1500),
	(2, 'Artifacts', 200),
	(3, 'Games', 500),
	(4, 'Utilities', 1000),
	(5, 'Food', 250),
	(6, 'Vehicles', 500),
	(7, 'Eletronics', 300),
	(8, 'Toys', 100),
	(9, 'Candy', 100),
	(10, 'Candy', 100);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;

-- Dumping structure for table bamazon.products
DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `item_id` int(10) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(50) NOT NULL,
  `department_name` varchar(50) NOT NULL,
  `stock_quantity` int(10) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `product_sales` int(10) DEFAULT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

-- Dumping data for table bamazon.products: ~12 rows (approximately)
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` (`item_id`, `product_name`, `department_name`, `stock_quantity`, `price`, `product_sales`) VALUES
	(1, 'Spear of Destiny', 'Weapons', 99345, 999.99, 26),
	(2, 'Infinity Gauntlet', 'Artifacts', 92, 49.99, 8),
	(3, 'Mjolnir', 'Weapons', 491, 399.99, 6),
	(4, 'Apple Watch 3', 'Eletronics', 295, 299.99, 4),
	(5, 'God of War 4', 'Games', 267, 99.99, 33),
	(6, 'Google Pixel 2 XL', 'Eletronics', 87, 799.99, 12),
	(7, 'BroKen Pencil', 'Utilities', 647, 9.99, 3),
	(8, 'Crossbow', 'Weapons', 240, 299.99, 10),
	(9, 'Lemon Muffin', 'Food', 14, 4.99, 3),
	(10, 'Eletric Scotter', 'Vehicles', 98, 399.99, 2),
	(11, 'Test', 'test', 10, 10.00, 0),
	(12, 'Iphone X', 'Eletronics', 100, 899.99, 0);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;

-- Dumping structure for table bamazon.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(10) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(250) NOT NULL,
  `department` int(10) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Dumping data for table bamazon.users: ~3 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`user_id`, `username`, `password`, `department`) VALUES
	(1, 'guest', '084e0343a0486ff05530df6c705c8bb4', 1),
	(2, 'manager', '1d0258c2440a8d19e716292b231e3190', 2),
	(3, 'supervisor', '09348c20a019be0318387c08df7a783d', 3);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
