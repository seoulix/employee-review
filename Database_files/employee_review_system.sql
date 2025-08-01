-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 01, 2025 at 07:30 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `employee_review_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_notification_preferences`
--

CREATE TABLE `admin_notification_preferences` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `email_notifications` tinyint(1) DEFAULT 1,
  `whatsapp_notifications` tinyint(1) DEFAULT 1,
  `high_rating_alerts` tinyint(1) DEFAULT 1,
  `low_rating_alerts` tinyint(1) DEFAULT 1,
  `daily_reports` tinyint(1) DEFAULT 0,
  `weekly_reports` tinyint(1) DEFAULT 1,
  `monthly_reports` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `role` enum('super_admin','admin','manager') DEFAULT 'admin',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `phone` varchar(20) DEFAULT NULL,
  `whatsapp_number` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `email`, `password_hash`, `full_name`, `role`, `is_active`, `last_login`, `created_at`, `updated_at`, `phone`, `whatsapp_number`) VALUES
(1, 'admin@company.com', '$2b$10$UKkEB89cQ0a6DlJ0ef0TpOmAMD0N63j88J30MEKJwvVGLEGWzNhmi', 'System Admin', 'super_admin', 1, NULL, '2025-07-19 09:32:56', '2025-07-23 14:36:37', NULL, NULL),
(2, 'manager@company.com', '$2b$10$rQZ9QmjlhF8K8K8K8K8K8O', 'Store Manager', 'manager', 1, NULL, '2025-07-19 09:32:56', '2025-07-19 09:32:56', NULL, NULL),
(3, 'hr@company.com', '$2b$10$rQZ9QmjlhF8K8K8K8K8K8O', 'HR Manager', 'admin', 1, NULL, '2025-07-19 09:32:56', '2025-07-19 09:32:56', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `description`, `logo_url`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Premium Coffee', 'High-end coffee chain with premium quality products', NULL, 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(2, 'Quick Bites', 'Fast food restaurant chain serving quick meals', NULL, 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(3, 'Fresh Market', 'Grocery store chain with fresh produce', NULL, 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(4, 'Tech Store', 'Electronics retail chain', NULL, 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(5, 'Shivam Kin', 'sd', NULL, 'Active', '2025-07-19 12:11:30', '2025-07-19 12:11:30');

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `state_id` int(11) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `name`, `state_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Los Angeles', 1, 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(2, 'San Francisco', 1, 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(3, 'San Diego', 1, 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(4, 'New York City', 2, 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(5, 'Buffalo', 2, 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(6, 'Albany', 2, 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(7, 'Houston', 3, 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(8, 'Dallas', 3, 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(9, 'Austin', 3, 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(10, 'Miami', 4, 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(11, 'Orlando', 4, 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(12, 'Tampa', 4, 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `unique_id` varchar(255) NOT NULL,
  `feedback_unique_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `anniversary_date` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `place` varchar(255) DEFAULT NULL,
  `booking_date` date DEFAULT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `booking_type` varchar(100) DEFAULT NULL,
  `group_type` varchar(100) DEFAULT NULL,
  `game_and_slot` varchar(100) DEFAULT NULL,
  `upcoming_event_date_time` datetime DEFAULT NULL,
  `form_number` varchar(100) DEFAULT NULL,
  `team_id` varchar(100) DEFAULT NULL,
  `team_name` varchar(255) DEFAULT NULL,
  `signature` text DEFAULT NULL,
  `id_proof` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `unique_id`, `feedback_unique_id`, `name`, `phone`, `email`, `gender`, `dob`, `anniversary_date`, `location`, `place`, `booking_date`, `time_stamp`, `booking_type`, `group_type`, `game_and_slot`, `upcoming_event_date_time`, `form_number`, `team_id`, `team_name`, `signature`, `id_proof`, `created_at`, `updated_at`) VALUES
(126, 'A1001', NULL, 'Gunishka', '7303406300', 'gunishkaanand2008@gmail.com', 'Female', '2008-01-11', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"5\",\"name\":\"The Kon of Kohinoor - A Mission Impossible (CP)\",\"slot\":\"12:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131043', 'KOK 12:30', 'https://participationform.mysteryrooms.in/uploads/68832fecaba94.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(127, 'A1003', NULL, 'Anirban', '8851817669', 'anirban.work2487@gmail.com', 'Male', '2006-08-24', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Walk-In', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"12:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131044', 'LO-1', 'https://participationform.mysteryrooms.in/uploads/68833102bc4cb.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(128, 'A1005', NULL, 'Tejrudra Dhankar', '9053101052', 'Dhankar.tanmay2008@gmail.com', '', '2008-01-31', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Walk-In', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"12:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131044', 'LO-1', 'https://participationform.mysteryrooms.in/uploads/688331e0c82bc.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(129, 'A108', NULL, 'Gunika', '9891386272', 'gunikaanand2008@gmail.com', 'Female', '2008-01-11', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"5\",\"name\":\"The Kon of Kohinoor - A Mission Impossible (CP)\",\"slot\":\"12:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131043', 'KOK 12:30', 'https://participationform.mysteryrooms.in/uploads/6883304f599df.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(130, 'A1007', NULL, 'Abhinav Ranjan', '9873474013', 'ranjanabhinav4j@gmail.com', 'Male', '2005-01-04', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"13:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131051', 'Hangover', 'https://participationform.mysteryrooms.in/uploads/688335c27afab.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(131, 'A1006', NULL, 'Rudra Narula', '9560591229', 'rudranarula56@gmail.com', 'Male', '2007-03-08', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Walk-In', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"12:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131044', 'LO-1', 'https://participationform.mysteryrooms.in/uploads/688331e1c0765.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(132, 'A1004', NULL, 'Upwan', '88104 0378', 'upwansharma99@gmail.com', 'Male', '2007-09-06', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Walk-In', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"12:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131044', 'LO-1', 'https://participationform.mysteryrooms.in/uploads/68833175ec0e6.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(134, 'A1008', NULL, 'Garima', '9021032050', 'garima.saxena2224@gmail.com', 'Female', '2007-07-02', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"13:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131051', 'Hangover', 'https://participationform.mysteryrooms.in/uploads/688335c766f9d.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(135, 'A1009', NULL, 'Karuna', '9980026741', 'karunadhanashree@gmail.com', 'Female', '1950-06-05', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"13:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131051', 'Hangover', 'https://participationform.mysteryrooms.in/uploads/688336253705e.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(144, 'A117', NULL, 'Alexandra Carter', '7303932618', 'Alexandra.c.carter@outlook.com', 'Female', '2025-02-08', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/68833c131ac5a.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(145, 'A118', NULL, 'Indrani Dasgupta', '9999049708', 'rinscorp2001@gmail.com', 'Female', '1982-11-18', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/68833ca89345b.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(146, 'A119', NULL, 'Sangeetha PM', '8750125226', 'sangeethapm26@gmail.com', 'Female', '1990-06-26', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/68833ceb308e8.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(147, 'A120', NULL, 'Gagan', '9891149505', 'gmisra.official@gmail.com', 'Male', '1982-12-20', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/68833d8f357a8.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(148, 'A121', NULL, 'Aarti Dutta', '9810801974', 'aarti_dutta@ymail.com', 'Female', '1984-03-19', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/68833e90dba40.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(149, 'A122', NULL, 'Khushi Sharma', '9315016801', 'khushish01082004@gmail.com', 'Female', '2004-08-01', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"14:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131059', 'KOK 2PM', 'https://participationform.mysteryrooms.in/uploads/68833f043cdef.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(150, 'A123', NULL, 'Jai', '890-175556', 'jaisingh03112001@gmail.com', 'Male', '2001-11-03', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"14:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131059', 'KOK 2PM', 'https://participationform.mysteryrooms.in/uploads/68833f064e892.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(151, 'A124', NULL, 'Ankit', '9991409846', 'ankitkunardauria@gmail.com', 'Male', '2000-10-20', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"14:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131059', 'KOK 2PM', 'https://participationform.mysteryrooms.in/uploads/68833f32997f1.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(152, 'A125', NULL, 'Deepak', '9711698463', 'Kharideepak19@gmail.com', 'Male', '2001-10-29', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"14:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131059', 'KOK 2PM', 'https://participationform.mysteryrooms.in/uploads/68833f389e64a.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(153, 'A126', NULL, 'Khushi', '9711698463', 'Khushilohia0100@gmail.com', 'Female', '2025-07-20', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"14:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131059', 'KOK 2PM', 'https://participationform.mysteryrooms.in/uploads/68833f38e9da5.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(154, 'A127', NULL, 'Amisha', '9711698463', 'Amishalohia0100@gmail.com', 'Female', '2025-07-17', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"14:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131059', 'KOK 2PM', 'https://participationform.mysteryrooms.in/uploads/68833f89177b4.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(155, 'A128', NULL, 'Arjun', '769107967', 'arjun0901@icloud.com', 'Male', '2009-01-09', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"14:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131061', 'Dosco', 'https://participationform.mysteryrooms.in/uploads/688340ae59249.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(156, 'A129', NULL, 'Andrew Bernstein', '810429327', 'TheAndrew.Bernstein@gmail.com', 'Male', '2009-11-17', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"14:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131061', 'Dosco', 'https://participationform.mysteryrooms.in/uploads/6883413c1f0bd.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(157, 'A130', NULL, 'Zorawar', '9988221219', 'zorawarss10@gmail.com', 'Male', '2008-03-10', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"14:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131061', 'Dosco', 'https://participationform.mysteryrooms.in/uploads/6883414a4b5bd.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(158, 'A131', NULL, 'Sean Burman', '615436195', 'Seanburman@icloud.com', 'Male', '2025-07-05', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"14:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131061', 'Dosco', 'https://participationform.mysteryrooms.in/uploads/6883415376bd8.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(159, 'A132', NULL, 'Loechin Phangcho', '7099032045', 'loechinphangcho@gmail.com', 'Male', '2009-01-15', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"14:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131061', 'Dosco', 'https://participationform.mysteryrooms.in/uploads/688341b92889a.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(160, 'A133', NULL, 'Aura', '9205003564', 'Jaisrana564@gmail.com', 'Male', '2006-09-06', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"14:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131061', 'Dosco', 'https://participationform.mysteryrooms.in/uploads/6883422353a7b.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(161, 'A134', NULL, 'Divya', '9810893604', 'khanna.divya7@gmail.com', 'Female', '1995-06-21', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/6883452dd3b05.png', 'NA', '2025-07-31 17:25:11', '2025-07-31 17:25:11'),
(162, 'A136', NULL, 'Ramneek Khullar', '9999600075', 'Rameek.khullar@gmail.com', '', '1981-07-09', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/68834708832b1.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(163, 'A138', NULL, 'Rohan', '8800671311', 'Rohan.libra@gmail.com', 'Male', '1989-10-11', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/6883474cb127e.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(164, 'A135', NULL, 'Madhu', '9871444377', 'Thapa.rahul@gmail.com', 'Female', '1982-01-11', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/688346b4844ac.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(165, 'A140', NULL, 'Naurazkar', '7838826761', 'naurazkar.pradhan@gmail.com', 'Male', '1983-12-21', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/6883478a3b8f8.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(166, 'A141', NULL, 'Neeti carine', '9717974755', 'Carinepattick@gmail.com', 'Female', '1987-07-15', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/6883492de6b3f.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(167, 'A337', NULL, 'Shivam Dixit', '9720965985', 'Dixitshivam249@gmail.com', '', '1981-07-09', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/68834708832b1.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(168, 'A139', NULL, 'Aman Wadhawan', '9818890372', 'aman.wadhawan@gmail.com', 'Male', '1978-09-19', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/68834753553e2.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(169, 'A142', NULL, 'Archana Zhimo', '9971816999', 'Archizhimo@gmail.com', 'Female', '1979-10-23', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/688349e8ec9ed.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(170, 'A143', NULL, 'Aradhya Singh', '8700034554', 'Anandparishi@gmail.com', '', '2025-07-21', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"14:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131069', 'Hangover', 'https://participationform.mysteryrooms.in/uploads/688349f674f1b.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(171, 'A144', NULL, 'Kanchan', '9899500652', 'kanchan.r.sharma@gmail.com', 'Female', '1981-08-06', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/68834a9918c79.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(172, 'A145', NULL, 'Preethi Nair', '9899946164', 'preethi.pillai3@gmail.com', 'Female', '1982-12-03', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/68834bf154ca4.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(173, 'A146', NULL, 'Massey', '9654982229', 'yusufmassey@gmail.com', 'Male', '1977-07-31', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/68834ca045f84.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(174, 'A147', NULL, 'Deepti', '7011103644', 'deeptirawal@gmail.com', 'Female', '1982-02-08', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/68834d5c4bb17.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(175, 'A148', NULL, 'Anshul Ahuja', '9910211130', 'anshul.vj@gmail.com', 'Male', '1987-12-21', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/6883538c99d1b.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(176, 'A149', NULL, 'Charanpreet Bidhuri', '9971444008', 'charanpreet16@gmail.com', 'Female', '1980-08-16', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"16:00\"},{\"id\":\"5\",\"name\":\"The', '2025-07-25 00:00:00', '1.75E+09', '131034', 'AHC', 'https://participationform.mysteryrooms.in/uploads/68835434c0520.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(177, 'A150', NULL, 'Tanish', '9999011654', 'tanishbhutani100@gmail.com', '', '2004-02-06', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"3\",\"name\":\"The Conjuring - Into The Darkest Hour (CP)\",\"slot\":\"16:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131106', 'CONJ 4', 'https://participationform.mysteryrooms.in/uploads/68835e8682c5d.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(178, 'A151', NULL, 'Hitesh t das', '9818500203', 'hitesh.t.das@gmail.com', 'Male', '2004-06-24', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"3\",\"name\":\"The Conjuring - Into The Darkest Hour (CP)\",\"slot\":\"16:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131106', 'CONJ 4', 'https://participationform.mysteryrooms.in/uploads/68835ea42ed65.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(179, 'A152', NULL, 'Uttkarsh Singh', '2693917910', 'uttkarsh.singh2004@gmail.com', 'Male', '2004-11-24', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"3\",\"name\":\"The Conjuring - Into The Darkest Hour (CP)\",\"slot\":\"16:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131106', 'CONJ 4', 'https://participationform.mysteryrooms.in/uploads/68835ec4bf96e.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(180, 'A153', NULL, 'Aayan Mathur', '9971420054', 'Aayan.mathur2005@gmail.com', 'Male', '2005-02-24', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"3\",\"name\":\"The Conjuring - Into The Darkest Hour (CP)\",\"slot\":\"16:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131106', 'CONJ 4', 'https://participationform.mysteryrooms.in/uploads/68835ec6943b3.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(181, 'A154', NULL, 'Ritviek', '9953552098', 'ritviekpadda@gmail.com', 'Male', '2004-03-03', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"3\",\"name\":\"The Conjuring - Into The Darkest Hour (CP)\",\"slot\":\"16:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131106', 'CONJ 4', 'https://participationform.mysteryrooms.in/uploads/68835eeae11b1.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(182, 'A155', NULL, 'Praveer Singh', '9560368280', 'Praveer5896@gmail.com', 'Male', '2005-01-05', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"3\",\"name\":\"The Conjuring - Into The Darkest Hour (CP)\",\"slot\":\"16:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131106', 'CONJ 4', 'https://participationform.mysteryrooms.in/uploads/68835f08371cb.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(183, 'A156', NULL, 'ABHIVEER Wadhwa', '8368391631', 'abhiveer2011wadhwa@gmail.com', 'Male', '2011-01-21', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"5\",\"name\":\"The Kon of Kohinoor - A Mission Impossible (CP)\",\"slot\":\"17:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131128', 'Kohinoor 5', 'https://participationform.mysteryrooms.in/uploads/68836a559304a.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(184, 'A157', NULL, 'Sukrit Gupta', '9810859079', 'G.sonam@gmail.com', 'Male', '2014-11-30', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"17:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131125', 'Ronaldos', 'https://participationform.mysteryrooms.in/uploads/68836a5a4100e.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(185, 'A158', NULL, 'Aarush', '9466691021', 'aarush.tanwar10@gmail.com', 'Male', '2010-08-06', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"5\",\"name\":\"The Kon of Kohinoor - A Mission Impossible (CP)\",\"slot\":\"17:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131128', 'Kohinoor 5', 'https://participationform.mysteryrooms.in/uploads/68836a64149b1.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(186, 'A159', NULL, 'Ishaan', '9315267714', 'Ist12rr@gmail.com', 'Male', '2010-07-28', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"5\",\"name\":\"The Kon of Kohinoor - A Mission Impossible (CP)\",\"slot\":\"17:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131128', 'Kohinoor 5', 'https://participationform.mysteryrooms.in/uploads/68836a80e387e.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(187, 'A160', NULL, 'Ikjyot singh', '3728538539', 'Ishaankabadah2011@gmail.com', 'Male', '2010-07-07', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"5\",\"name\":\"The Kon of Kohinoor - A Mission Impossible (CP)\",\"slot\":\"17:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131128', 'Kohinoor 5', 'https://participationform.mysteryrooms.in/uploads/68836a9ed7c8f.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(188, 'A161', NULL, 'Vaibhavi', '93152 6771', 'Ist12rr@gmail.com', 'Female', '2013-08-28', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"5\",\"name\":\"The Kon of Kohinoor - A Mission Impossible (CP)\",\"slot\":\"17:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131128', 'Kohinoor 5', 'https://participationform.mysteryrooms.in/uploads/68836ae44420c.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(189, 'A162', NULL, 'Ayush', '9183773748', 'Hsgdhahhs@gmail.com', 'Male', '2025-07-01', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"5\",\"name\":\"The Kon of Kohinoor - A Mission Impossible (CP)\",\"slot\":\"17:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131128', 'Kohinoor 5', 'https://participationform.mysteryrooms.in/uploads/68836b0e0e63f.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(190, 'A163', NULL, 'Siddhant', '2627272727', 'Hshdhdhdhdj@gmail.com', 'Male', '2025-07-25', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"5\",\"name\":\"The Kon of Kohinoor - A Mission Impossible (CP)\",\"slot\":\"17:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131128', 'Kohinoor 5', 'https://participationform.mysteryrooms.in/uploads/68836c9747567.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(191, 'A164', NULL, 'Savage', '6969694200', 'dpschutyah@dpsrkp.net', 'Other', '2006-01-18', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"5\",\"name\":\"The Kon of Kohinoor - A Mission Impossible (CP)\",\"slot\":\"17:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131128', 'Kohinoor 5', 'https://participationform.mysteryrooms.in/uploads/68836da9be5c5.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(192, 'A165', NULL, 'Vaishavi Mittal', '8448447583', 'Cvdndcebevec@gmail.com', 'Female', '2025-07-16', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"5\",\"name\":\"The Kon of Kohinoor - A Mission Impossible (CP)\",\"slot\":\"17:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131128', 'Kohinoor 5', 'https://participationform.mysteryrooms.in/uploads/68836dcb3a643.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(193, 'A166', NULL, 'Yashika', '7300148803', 'yashigoel1805@gmail.com', '', '2003-05-18', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"17:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131150', 'Hang 5', 'https://participationform.mysteryrooms.in/uploads/688371adbf51e.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(194, 'A167', NULL, 'Utkarsh', '9458892608', 'Utkarshs840@gmail.com', 'Male', '2002-10-08', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"17:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131150', 'Hang 5', 'https://participationform.mysteryrooms.in/uploads/68837219ac846.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(195, 'A168', NULL, 'Mitvik Sihag', '9518285241', 'mitvik.sihag2003@gmail.com', 'Male', '2003-11-17', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"17:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131150', 'Hang 5', 'https://participationform.mysteryrooms.in/uploads/6883724f02a99.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(196, 'A169', NULL, 'Mayank Saneja', '8929189697', 'MAYANKSANEJA5@GMAIL.COM', 'Male', '2001-06-25', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"3\",\"name\":\"The Conjuring - Into The Darkest Hour (CP)\",\"slot\":\"17:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131152', 'Conj 5', 'https://participationform.mysteryrooms.in/uploads/6883729fdcd83.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(197, 'A170', NULL, 'shikhin pawar', '9581400013', 'Shikhin4u@gmail.com', 'Male', '1983-01-01', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"3\",\"name\":\"The Conjuring - Into The Darkest Hour (CP)\",\"slot\":\"17:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131152', 'Conj 5', 'https://participationform.mysteryrooms.in/uploads/688372df7630c.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(198, 'A171', NULL, 'Sourav Meena', '7849917411', 'souravsunita1@gmail.com', 'Male', '2002-11-26', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"17:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131150', 'Hang 5', 'https://participationform.mysteryrooms.in/uploads/6883730e7f58f.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(207, 'A181', NULL, 'Eshaan Saigal', '9773889450', 'eshaansaigal101@gmail.com', 'Male', '2005-07-01', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"6\",\"name\":\"Hangover - Last Fling Before the Ring (CP)\",\"slot\":\"19:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131198', 'Hang 7', 'https://participationform.mysteryrooms.in/uploads/6883858a2b471.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(208, 'A182', NULL, 'Areeb', '9718595864', 'farhatperween98@gmail.com', 'Male', '2007-07-14', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Walk-In', '', '[{\"id\":\"5\",\"name\":\"The Kon of Kohinoor - A Mission Impossible (CP)\",\"slot\":\"20:00\"}]', '2025-07-25 00:00:00', '1.75E+09', '131231', 'Kohinoor 8', 'https://participationform.mysteryrooms.in/uploads/68839635169fb.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(219, 'A194', NULL, 'Prince Khudaniya', '7042166816', 'Princekhudaniya@icloud.com', 'Male', '2000-05-15', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Walk-In', '', '[{\"id\":\"3\",\"name\":\"The Conjuring - Into The Darkest Hour (CP)\",\"slot\":\"20:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131253', 'Conj 8', 'https://participationform.mysteryrooms.in/uploads/68839d0aa9623.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(220, 'A195', NULL, 'Umesh Choudhary', '9588739734', 'manga.waggles_9i@icloud.com', 'Male', '2002-06-09', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Walk-In', '', '[{\"id\":\"3\",\"name\":\"The Conjuring - Into The Darkest Hour (CP)\",\"slot\":\"20:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131253', 'Conj 8', 'https://participationform.mysteryrooms.in/uploads/68839d38704f2.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(221, 'A196', NULL, 'Manjot', '8299350473', 'manjotsingh2533@gmail.com', 'Male', '2002-09-05', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Walk-In', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"21:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131258', 'Lock 9', 'https://participationform.mysteryrooms.in/uploads/6883a0a506825.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(222, 'A197', NULL, 'Manas', '7985557055', 'Manas61223@gmail.com', 'Male', '2001-12-06', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Walk-In', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"21:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131258', 'Lock 9', 'https://participationform.mysteryrooms.in/uploads/6883a129c59d7.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(223, 'A198', NULL, 'Raj agrawal', '81730 0867', 'rajagrawal0086gnj@gmail.com', 'Male', '2005-05-30', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Walk-In', '', '[{\"id\":\"4\",\"name\":\"Lockout 2 - The Death Sentence (CP)\",\"slot\":\"21:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131258', 'Lock 9', 'https://participationform.mysteryrooms.in/uploads/6883a132c6425.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(224, 'A199', NULL, 'Priyanshu Sharma', '9872644908', 'pashu_47@icloud.com', 'Male', '2006-02-17', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"5\",\"name\":\"The Kon of Kohinoor - A Mission Impossible (CP)\",\"slot\":\"21:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131270', 'Kohinoor 9', 'https://participationform.mysteryrooms.in/uploads/6883aa994339a.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(225, 'A200', NULL, 'Ishan', '987244908', 'sharmapashu17@gmail.com', 'Male', '2005-06-06', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"5\",\"name\":\"The Kon of Kohinoor - A Mission Impossible (CP)\",\"slot\":\"21:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131270', 'Kohinoor 9', 'https://participationform.mysteryrooms.in/uploads/6883aaf0729b4.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(226, 'A201', NULL, 'Anup Kumar', '9891267565', 'anup.dreamer.1988@gmail.com', 'Male', '1988-01-22', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"3\",\"name\":\"The Conjuring - Into The Darkest Hour (CP)\",\"slot\":\"20:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131272', 'Conj 9', 'https://participationform.mysteryrooms.in/uploads/6883ad69e33e1.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(227, 'A202', NULL, 'Shashank', '9891267565', 'anup.dreamer.1988@gmail.com', 'Male', '1995-06-08', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"3\",\"name\":\"The Conjuring - Into The Darkest Hour (CP)\",\"slot\":\"20:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131272', 'Conj 9', 'https://participationform.mysteryrooms.in/uploads/6883adb9bea47.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(228, 'A203', NULL, 'Bairister', '9891267565', 'anup.dreamer.1988@gmail.com', 'Male', '1982-12-05', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"3\",\"name\":\"The Conjuring - Into The Darkest Hour (CP)\",\"slot\":\"20:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131272', 'Conj 9', 'https://participationform.mysteryrooms.in/uploads/6883adfb1acc8.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(229, 'A204', NULL, 'Monika Sah', '8319050330', 'monica.sah6@gmail.com', 'Female', '1988-04-01', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"3\",\"name\":\"The Conjuring - Into The Darkest Hour (CP)\",\"slot\":\"20:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131272', 'Conj 9', 'https://participationform.mysteryrooms.in/uploads/6883ae69e1b84.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(230, 'A205', NULL, 'Awdhesh', '6264276274', 'awdheshp145@gmail.com', 'Male', '2001-04-14', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"3\",\"name\":\"The Conjuring - Into The Darkest Hour (CP)\",\"slot\":\"20:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131272', 'Conj 9', 'https://participationform.mysteryrooms.in/uploads/6883ae73561b9.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(231, 'A206', NULL, 'Abhishek', '7415210950', 'prasadabhishek550@gmail.com', 'Male', '2002-05-01', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"3\",\"name\":\"The Conjuring - Into The Darkest Hour (CP)\",\"slot\":\"20:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131272', 'Conj 9', 'https://participationform.mysteryrooms.in/uploads/6883ae85c9a1d.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12'),
(232, 'A207', NULL, 'Anjali Shah', '8962244704', 'anjali19shah@gmail.com', 'Female', '1994-02-19', '0000-00-00', 'Delhi', 'Connaught Place', '2025-07-25', '0000-00-00 00:00:00', 'Online Booking', '', '[{\"id\":\"3\",\"name\":\"The Conjuring - Into The Darkest Hour (CP)\",\"slot\":\"20:30\"}]', '2025-07-25 00:00:00', '1.75E+09', '131272', 'Conj 9', 'https://participationform.mysteryrooms.in/uploads/6883ae9172729.png', 'NA', '2025-07-31 17:25:12', '2025-07-31 17:25:12');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `employee_code` varchar(50) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `outlet_id` int(11) NOT NULL,
  `position` varchar(255) NOT NULL,
  `photo_url` varchar(500) DEFAULT NULL,
  `join_date` date NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `employee_code`, `full_name`, `email`, `phone`, `outlet_id`, `position`, `photo_url`, `join_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 'EMP001', 'John Doe', 'john.doe@company.com', '+1-555-1001', 1, 'Sales Associate', NULL, '2024-01-15', 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(2, 'EMP002', 'Sarah Johnson', 'sarah.johnson@company.com', '+1-555-1002', 2, 'Store Manager', NULL, '2023-11-20', 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(3, 'EMP003', 'Mike Wilson', 'mike.wilson@company.com', '+1-555-1003', 3, 'Cashier', NULL, '2024-02-01', 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(4, 'EMP004', 'Emily Davis', 'emily.davis@company.com', '+1-555-1004', 4, 'Assistant Manager', NULL, '2023-08-10', 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(5, 'EMP005', 'Lisa Chen', 'lisa.chen@company.com', '+1-555-1005', 1, 'Barista', NULL, '2024-03-01', 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(6, 'EMP006', 'David Brown', 'david.brown@company.com', '+1-555-1006', 2, 'Supervisor', NULL, '2023-12-15', 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(7, 'EMP007', 'Anna Martinez', 'anna.martinez@company.com', '+1-555-1007', 3, 'Sales Associate', NULL, '2024-01-20', 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(8, 'EMP008', 'James Taylor', 'james.taylor@company.com', '+1-555-1008', 4, 'Cashier', NULL, '2023-10-05', 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(9, 'EMP009', 'Maria Garcia', 'maria.garcia@company.com', '+1-555-1009', 5, 'Store Manager', NULL, '2023-09-12', 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(10, 'EMP010', 'Robert Lee', 'robert.lee@company.com', '+1-555-1010', 6, 'Assistant Manager', NULL, '2024-02-14', 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(11, 'EMP1752930852635', 'Ayush Tiware', 'dixitshivam249@gmail.com', '09720965985', 8, 'Cashier', 'blob:http://localhost:3000/44a33c63-4930-41d6-9de7-3d0b1732c59e', '2025-07-17', 'Active', '2025-07-19 13:14:12', '2025-07-19 13:14:12'),
(12, 'EMP1753724359791', 'Ayush Singh', 'Sigh@gmail.com', '34343434343', 8, 'Team Lead', 'blob:http://localhost:3000/301ad628-7d06-4015-befd-8dbecf78ee58', '2025-07-17', 'Active', '2025-07-28 17:39:19', '2025-07-28 17:39:19'),
(13, 'EMP1753724680195', 'Rohit', 'thi@gmail.com', '34343434', 7, 'Supervisor', NULL, '2025-07-16', 'Active', '2025-07-28 17:44:40', '2025-07-28 17:44:40');

-- --------------------------------------------------------

--
-- Stand-in structure for view `employee_performance_summary`
-- (See below for the actual view)
--
CREATE TABLE `employee_performance_summary` (
`id` int(11)
,`employee_code` varchar(50)
,`full_name` varchar(255)
,`position` varchar(255)
,`outlet_name` varchar(255)
,`brand_name` varchar(255)
,`city_name` varchar(255)
,`state_name` varchar(255)
,`total_reviews` bigint(21)
,`average_rating` decimal(14,4)
,`perfect_count` decimal(22,0)
,`counselling_count` decimal(22,0)
,`needs_review_count` decimal(22,0)
,`last_feedback_date` timestamp
);

-- --------------------------------------------------------

--
-- Table structure for table `feedback_links`
--

CREATE TABLE `feedback_links` (
  `id` int(11) NOT NULL,
  `outlet_id` int(11) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `url` varchar(500) NOT NULL,
  `status` enum('Active','Inactive','Expired') DEFAULT 'Active',
  `total_submissions` int(11) DEFAULT 0,
  `last_used` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `arrival_date` date DEFAULT NULL,
  `unique_id` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback_links`
--

INSERT INTO `feedback_links` (`id`, `outlet_id`, `phone`, `email`, `name`, `token`, `url`, `status`, `total_submissions`, `last_used`, `expires_at`, `created_at`, `updated_at`, `arrival_date`, `unique_id`) VALUES
(2273, 1, '7303406300', 'gunishkaanand2008@gmail.com', 'Gunishka', 'A10018ogjfbr5scq4lmrl2qeb', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A1001'),
(2274, 1, '9053101052', 'Dhankar.tanmay2008@gmail.com', 'Tejrudra Dhankar', 'A1005iqpxiu3jwcrcz1haj98v9l', '', 'Expired', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 21:19:00', '2025-07-25', 'A1005'),
(2275, 1, '9891386272', 'gunikaanand2008@gmail.com', 'Gunika', 'A10029yl0i59iqmvxezd8xp62s', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A1002'),
(2276, 1, '8851817669', 'anirban.work2487@gmail.com', 'Anirban', 'A1003xwmxwseflwt0g16nry0ovip', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A1003'),
(2277, 1, '88104 0378', 'upwansharma99@gmail.com', 'Upwan', 'A10041aibs2nig68vh8kgbeqc1o', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A1004'),
(2278, 1, '9560591229', 'rudranarula56@gmail.com', 'Rudra Narula', 'A1006bnhxaugjso7jxd9aswq25f', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A1006'),
(2279, 1, '9873474013', 'ranjanabhinav4j@gmail.com', 'Abhinav Ranjan', 'A1007dv5tdxlu51u44h47xgxt6v', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A1007'),
(2280, 1, '9021032050', 'garima.saxena2224@gmail.com', 'Garima', 'A10083j24077rlzq1ybpejcy1sb', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A1008'),
(2281, 1, '9980026741', 'karunadhanashree@gmail.com', 'Karuna', 'A1009bjl8j9cfynr6dsqzqi5cko', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A1009'),
(2282, 2, '7303406300', 'gunishkaanand2008@gmail.com', 'Gunishka', 'A107wtefek386287oe761fxp7', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A107'),
(2283, 2, '9891386272', 'gunikaanand2008@gmail.com', 'Gunika', 'A108rsrrvgest7df4ehvuk1zl5', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A108'),
(2284, 2, '88104 0378', 'upwansharma99@gmail.com', 'Upwan', 'A110w3wdazwxvfff3n1tusiv9c', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A110'),
(2285, 2, '9053101052', 'Dhankar.tanmay2008@gmail.com', 'Tejrudra Dhankar', 'A1127spwoh381zloz1zrde091', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A112'),
(2286, 2, '8851817669', 'anirban.work2487@gmail.com', 'Anirban', 'A109sxniai70rgbe1dk28f29d', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A109'),
(2287, 2, '9560591229', 'rudranarula56@gmail.com', 'Rudra Narula', 'A113x8kuk1yopy8d3a0vqs7jtu', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A113'),
(2288, 2, '9873474013', 'ranjanabhinav4j@gmail.com', 'Abhinav Ranjan', 'A1146thd4nso1xbr924krinj6', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A114'),
(2289, 2, '9021032050', 'garima.saxena2224@gmail.com', 'Garima', 'A115wx6fmpsrivpt1w57hfctc', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A115'),
(2290, 2, '9980026741', 'karunadhanashree@gmail.com', 'Karuna', 'A11685yxsaklupqqow8t0y13n', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A116'),
(2291, 3, '7303932618', 'Alexandra.c.carter@outlook.com', 'Alexandra Carter', 'A11797r3ac0wd0kcyn2fdvruu9', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A117'),
(2292, 3, '9999049708', 'rinscorp2001@gmail.com', 'Indrani Dasgupta', 'A118ocrqc638p882xx19bleyc', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A118'),
(2293, 3, '8750125226', 'sangeethapm26@gmail.com', 'Sangeetha PM', 'A119xim31bdl76ovljlp72t5l', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A119'),
(2294, 3, '9891149505', 'gmisra.official@gmail.com', 'Gagan', 'A120ek985xuealribaysh3zhnc', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A120'),
(2295, 3, '9810801974', 'aarti_dutta@ymail.com', 'Aarti Dutta', 'A121idrym9cfj0al9mx2kh4nys', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A121'),
(2296, 3, '9315016801', 'khushish01082004@gmail.com', 'Khushi Sharma', 'A122kkpbevby62lif9o81yeym', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A122'),
(2297, 3, '890-175556', 'jaisingh03112001@gmail.com', 'Jai', 'A123ydairihm8apa7y1rn56f', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A123'),
(2298, 3, '9991409846', 'ankitkunardauria@gmail.com', 'Ankit', 'A124bkj2o54byyvcmzw0xpyh9d', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A124'),
(2299, 3, '9711698463', 'Kharideepak19@gmail.com', 'Deepak', 'A125j0w217z5q9ijhevca4ffpn', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A125'),
(2302, 3, '769107967', 'arjun0901@icloud.com', 'Arjun', 'A1280wts8h848j2pxvhj5jea4nf', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A128'),
(2303, 3, '810429327', 'TheAndrew.Bernstein@gmail.com', 'Andrew Bernstein', 'A129tre4iht6znj3fsmefpob8t', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A129'),
(2304, 3, '9988221219', 'zorawarss10@gmail.com', 'Zorawar', 'A130x6kiyn39vyhs112yw1k2x9', '', 'Inactive', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 19:29:36', '2025-07-25', 'A130'),
(2305, 3, '615436195', 'Seanburman@icloud.com', 'Sean Burman', 'A131yd4rpyp1mre2kschagdjt', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A131'),
(2306, 3, '7099032045', 'loechinphangcho@gmail.com', 'Loechin Phangcho', 'A132cap3uxbszqlndeg7t76qn', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A132'),
(2307, 3, '9205003564', 'Jaisrana564@gmail.com', 'Aura', 'A133musjkcg2n1d0ai4yis3uhz', '', 'Inactive', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 23:34:45', '2025-07-25', 'A133'),
(2308, 3, '9810893604', 'khanna.divya7@gmail.com', 'Divya', 'A134zphiaz6foahy8rmdpczjx', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A134'),
(2309, 3, '9871444377', 'Thapa.rahul@gmail.com', 'Madhu', 'A1358s93ih0tbq6c3q2fk02hj', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A135'),
(2310, 3, '9999600075', 'Rameek.khullar@gmail.com', 'Ramneek Khullar', 'A136b669hzlrichr54qeg2y0n', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A136'),
(2311, 3, '9720965985', 'Dixitshivam249@gmail.com', 'Shivam Dixit', 'A3379syz1f5u3yq3rgj8awie7k', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A337'),
(2312, 4, '8800671311', 'Rohan.libra@gmail.com', 'Rohan', 'A13834lbfpkip7bzpb35qsrere', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A138'),
(2313, 4, '9818890372', 'aman.wadhawan@gmail.com', 'Aman Wadhawan', 'A139y9y2ihifvzmub4j3ldv3kf', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A139'),
(2314, 4, '7838826761', 'naurazkar.pradhan@gmail.com', 'Naurazkar', 'A140c586sp4vda7h6qhf4o91fc', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A140'),
(2315, 4, '9717974755', 'Carinepattick@gmail.com', 'Neeti carine', 'A141b1um85qucg7weogj6znrep', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A141'),
(2316, 4, '9971816999', 'Archizhimo@gmail.com', 'Archana Zhimo', 'A142r81gmvplo9mvbidgmqmhg', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A142'),
(2317, 4, '8700034554', 'Anandparishi@gmail.com', 'Aradhya Singh', 'A143t8t79bkic3njqz9dzwbv', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A143'),
(2318, 4, '9899500652', 'kanchan.r.sharma@gmail.com', 'Kanchan', 'A144dhodu3ktp3lkl0xce8xcip', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A144'),
(2319, 4, '9899946164', 'preethi.pillai3@gmail.com', 'Preethi Nair', 'A1459z9zh3gtytcs4vi5kkow', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A145'),
(2320, 4, '9654982229', 'yusufmassey@gmail.com', 'Massey', 'A146pnif98j5h59fnj7vf9d2n', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A146'),
(2321, 4, '7011103644', 'deeptirawal@gmail.com', 'Deepti', 'A147bm26mek59viq6xu20rqfvb', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A147'),
(2322, 4, '9910211130', 'anshul.vj@gmail.com', 'Anshul Ahuja', 'A148kdotcjkfi7d34pcwstq19', '', 'Inactive', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 21:22:47', '2025-07-25', 'A148'),
(2323, 4, '9971444008', 'charanpreet16@gmail.com', 'Charanpreet Bidhuri', 'A149b7qdndm9hctx8s664etw3o', '', 'Inactive', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 23:08:33', '2025-07-25', 'A149'),
(2324, 4, '9999011654', 'tanishbhutani100@gmail.com', 'Tanish', 'A150sveb7beli0csy6rdp8lo5a', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A150'),
(2325, 4, '9818500203', 'hitesh.t.das@gmail.com', 'Hitesh t das', 'A151p7arrjymgtkrwqoswwvgyj', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A151'),
(2326, 4, '2693917910', 'uttkarsh.singh2004@gmail.com', 'Uttkarsh Singh', 'A152vpr2nbb5e1limp7ic3cqm', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A152'),
(2327, 4, '9971420054', 'Aayan.mathur2005@gmail.com', 'Aayan Mathur', 'A1538g9bm40l9wcn1crb90yc89', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A153'),
(2328, 4, '9953552098', 'ritviekpadda@gmail.com', 'Ritviek', 'A154lej9ip1792fod9j1gegchr', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A154'),
(2329, 4, '9560368280', 'Praveer5896@gmail.com', 'Praveer Singh', 'A1557b88dgm44p86tr05m8s00p', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A155'),
(2330, 4, '8368391631', 'abhiveer2011wadhwa@gmail.com', 'ABHIVEER Wadhwa', 'A156ulpysdnp1pextknkyfaekc', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A156'),
(2331, 4, '9810859079', 'G.sonam@gmail.com', 'Sukrit Gupta', 'A157sedlm487y77gmsvmu57zt', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A157'),
(2332, 4, '9466691021', 'aarush.tanwar10@gmail.com', 'Aarush', 'A158zooi96rbvt41nd4b7li', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A158'),
(2333, 4, '9315267714', 'Ist12rr@gmail.com', 'Ishaan', 'A159e6doi5gx5uo0tsafdd3e4qo', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A159'),
(2334, 4, '3728538539', 'Ishaankabadah2011@gmail.com', 'Ikjyot singh', 'A1605wpb2ir09g4ek56m23c19h', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A160'),
(2335, 4, '93152 6771', 'Ist12rr@gmail.com', 'Vaibhavi', 'A161mr14dvum5pi2gz2tp8a0tm', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A161'),
(2336, 4, '9183773748', 'Hsgdhahhs@gmail.com', 'Ayush', 'A162amyw6zcv5q5u744z5o0fpg', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A162'),
(2337, 4, '2627272727', 'Hshdhdhdhdj@gmail.com', 'Siddhant', 'A163c0qv43r30wn3bmwe3aphxq', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A163'),
(2338, 4, '6969694200', 'dpschutyah@dpsrkp.net', 'Savage', 'A164io1dhq0obknucm4cpeuw', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A164'),
(2339, 4, '8448447583', 'Cvdndcebevec@gmail.com', 'Vaishavi Mittal', 'A165z2iutz8isjr1jdutt7764r', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A165'),
(2340, 4, '7300148803', 'yashigoel1805@gmail.com', 'Yashika', 'A166no2yzghtpjxllj5vxrg1b', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A166'),
(2341, 4, '9458892608', 'Utkarshs840@gmail.com', 'Utkarsh', 'A1676y41oub15u9bspvj70yah6', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A167'),
(2342, 4, '9518285241', 'mitvik.sihag2003@gmail.com', 'Mitvik Sihag', 'A168uo350pp3i6fcsejy8bpvw6', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A168'),
(2343, 4, '8929189697', 'MAYANKSANEJA5@GMAIL.COM', 'Mayank Saneja', 'A16976qxrdctg6wtko70ad2n3k', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A169'),
(2344, 4, '9581400013', 'Shikhin4u@gmail.com', 'shikhin pawar', 'A170z2azysqhvfqnvxrapnw5dh', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A170'),
(2345, 4, '7849917411', 'souravsunita1@gmail.com', 'Sourav Meena', 'A1710xm301ayqb6evaoevya94', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A171'),
(2347, 5, '9810859079', 'G.sonam@gmail.com', 'Sukrit Gupta', 'A174y2trrd2t1ndovrwueh6yjj', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A174'),
(2354, 5, '9773889450', 'eshaansaigal101@gmail.com', 'Eshaan Saigal', 'A181ohl4mu8qktc4x5cn1tymus', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A181'),
(2355, 5, '9718595864', 'farhatperween98@gmail.com', 'Areeb', 'A182ccgjumedu5nzxu5y4jt9vf', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A182'),
(2359, 5, '7300148803', 'yashigoel1805@gmail.com', 'Yashika', 'A186ew8lycws7hawclxr9fauwo', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A186'),
(2360, 5, '9458892608', 'Utkarshs840@gmail.com', 'Utkarsh', 'A1875l8phq3hmgsui02lm2na1o', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A187'),
(2361, 6, '8929189697', 'MAYANKSANEJA5@GMAIL.COM', 'Mayank Saneja', 'A189qkb9x8d8pmv57u9dzu3j8', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A189'),
(2364, 6, '9581400013', 'Shikhin4u@gmail.com', 'shikhin pawar', 'A1922tlaorefolp36ywdujw0jk', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A192'),
(2366, 6, '7042166816', 'Princekhudaniya@icloud.com', 'Prince Khudaniya', 'A194qna4ef1n6yifhyfmp31nn', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A194'),
(2367, 6, '9588739734', 'manga.waggles_9i@icloud.com', 'Umesh Choudhary', 'A195a2agab53wsck9b5zxzszgb', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A195'),
(2368, 6, '8299350473', 'manjotsingh2533@gmail.com', 'Manjot', 'A1966lbxibn141y5azlw8nyuwa', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A196'),
(2369, 6, '7985557055', 'Manas61223@gmail.com', 'Manas', 'A197djcg919swdvckddo09x5x8', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A197'),
(2370, 6, '81730 0867', 'rajagrawal0086gnj@gmail.com', 'Raj agrawal', 'A198c9u0xe5imuf1wh6p4tihwe', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A198'),
(2371, 6, '9872644908', 'pashu_47@icloud.com', 'Priyanshu Sharma', 'A1992whme9vu8key5o5mngnggj', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A199'),
(2372, 6, '987244908', 'sharmapashu17@gmail.com', 'Ishan', 'A2007if7ul0tam7uwnx6b5fn8', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A200'),
(2375, 6, '9891267565', 'anup.dreamer.1988@gmail.com', 'Bairister', 'A203ofph0rychbneg3rbn3d8q', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A203'),
(2376, 6, '8319050330', 'monica.sah6@gmail.com', 'Monika Sah', 'A2043gbeqdcow1k2w1271z7izz', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A204'),
(2377, 6, '6264276274', 'awdheshp145@gmail.com', 'Awdhesh', 'A205yqopk5otp2el25inc708', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A205'),
(2378, 6, '7415210950', 'prasadabhishek550@gmail.com', 'Abhishek', 'A206azlrzxw40k53yqhhr8vuk9', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A206'),
(2379, 6, '8962244704', 'anjali19shah@gmail.com', 'Anjali Shah', 'A2076wp1lpjo1cgaagil6m6xg', '', 'Active', 0, NULL, NULL, '2025-07-31 17:07:24', '2025-07-31 17:07:24', '2025-07-25', 'A207');

-- --------------------------------------------------------

--
-- Table structure for table `feedback_questions`
--

CREATE TABLE `feedback_questions` (
  `id` int(11) NOT NULL,
  `question` varchar(500) NOT NULL,
  `type` enum('smiley','star','slider','text','checkbox') NOT NULL,
  `required` tinyint(1) DEFAULT 0,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `min_value` int(11) DEFAULT NULL,
  `max_value` int(11) DEFAULT NULL,
  `placeholder` varchar(200) DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback_questions`
--

INSERT INTO `feedback_questions` (`id`, `question`, `type`, `required`, `options`, `min_value`, `max_value`, `placeholder`, `order_index`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'How would you rate your overall experience?', 'smiley', 1, NULL, 1, 5, NULL, 1, 1, '2025-07-19 09:47:32', '2025-07-19 09:47:32'),
(2, 'Rate the service quality', 'star', 1, NULL, 1, 5, NULL, 2, 1, '2025-07-19 09:47:32', '2025-07-19 09:47:32'),
(3, 'How likely are you to recommend us?', 'slider', 0, NULL, 1, 10, NULL, 3, 1, '2025-07-19 09:47:32', '2025-07-19 09:47:32'),
(4, 'Any additional comments?', 'text', 0, NULL, NULL, NULL, NULL, 4, 1, '2025-07-19 09:47:32', '2025-07-19 09:47:32'),
(5, 'What aspects of our service could be improved?', 'checkbox', 0, '[\"Customer Service\",\"Food Quality\",\"Cleanliness\",\"Speed of Service\",\"Value for Money\",\"Team Behaviour\"]', NULL, NULL, NULL, 5, 1, '2025-07-19 09:47:32', '2025-07-31 23:52:44'),
(6, 'How Was the Host Nature Overall', 'star', 0, '[]', 1, 5, NULL, 6, 1, '2025-07-19 10:25:11', '2025-07-19 10:25:11'),
(7, 'How was the cleaning there', 'slider', 0, '[]', 1, 5, NULL, 7, 1, '2025-07-20 05:46:57', '2025-07-20 05:46:57'),
(9, 'What aspects of our service could be improved?', 'text', 0, '[]', 1, 5, 'This isthe test question', 8, 1, '2025-08-01 01:14:17', '2025-08-01 01:14:17');

-- --------------------------------------------------------

--
-- Table structure for table `feedback_responses`
--

CREATE TABLE `feedback_responses` (
  `id` int(11) NOT NULL,
  `feedback_submission_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `response_value` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback_responses`
--

INSERT INTO `feedback_responses` (`id`, `feedback_submission_id`, `question_id`, `response_value`, `created_at`) VALUES
(52, 42, 1, '4', '2025-07-31 23:34:45'),
(53, 42, 2, '2', '2025-07-31 23:34:45'),
(54, 42, 3, '6', '2025-07-31 23:34:45'),
(55, 42, 4, 'No', '2025-07-31 23:34:45'),
(56, 42, 5, '[\"Food Quality\",\"Cleanliness\"]', '2025-07-31 23:34:45'),
(57, 42, 6, '3', '2025-07-31 23:34:45'),
(58, 42, 7, '5', '2025-07-31 23:34:45');

-- --------------------------------------------------------

--
-- Table structure for table `feedback_settings`
--

CREATE TABLE `feedback_settings` (
  `id` int(11) NOT NULL DEFAULT 1,
  `lucky_draw_enabled` tinyint(1) DEFAULT 1,
  `feedback_required` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `lastFetchedRow` int(11) DEFAULT NULL,
  `expiry_time` int(11) DEFAULT NULL,
  `expiry_format` enum('Minute','Hour','Never','Day') DEFAULT NULL,
  `tiles` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback_settings`
--

INSERT INTO `feedback_settings` (`id`, `lucky_draw_enabled`, `feedback_required`, `created_at`, `updated_at`, `lastFetchedRow`, `expiry_time`, `expiry_format`, `tiles`) VALUES
(1, 1, 0, '2025-07-19 09:47:32', '2025-07-31 22:08:23', 8, 2, 'Day', '{\n  \"1\": {\n    \"question\": \"We\'re sorry your experience wasn\'t great. What went wrong?\",\n    \"tiles\": \"Unhelpful Staff, Dirty Environment, Game Not Working, Misleading Experience, Would Not Recommend\"\n  },\n  \"2\": {\n    \"question\": \"We’d love to improve. What could have been better?\",\n    \"tiles\": \"Late Start, Poor Ambience, Staff Ignored Issues, Game Glitches, Not Worth the Price\"\n  },\n  \"3\": {\n    \"question\": \"Thanks for the feedback. What parts were just okay?\",\n    \"tiles\": \"Average Service, Okay Cleanliness, Game Was Just Fine, Expected More Magic, Could Be Better\"\n  },\n  \"4\": {\n    \"question\": \"We\'re glad you enjoyed it! What did you like?\",\n    \"tiles\": \"Enjoyable Gameplay, Friendly Staff, Clean Setup, Good Value, Liked the Vibe\"\n  },\n  \"5\": {\n    \"question\": \"Awesome! What made your experience magical?\",\n    \"tiles\": \"Excellent Staff Behaviour, Magical Experience, Game Was Immersive, Super Clean Environment, Loved Every Moment\"\n  }\n}\n');

-- --------------------------------------------------------

--
-- Table structure for table `feedback_submissions`
--

CREATE TABLE `feedback_submissions` (
  `id` int(11) NOT NULL,
  `feedback_link_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `tiles` varchar(400) DEFAULT NULL,
  `feedback_text` text DEFAULT NULL,
  `additional_details` text DEFAULT NULL,
  `status` enum('Perfect','Counselling','Needs Review') NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `submission_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `has_deep_feedback` tinyint(1) DEFAULT 0,
  `feedback_unique_id` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback_submissions`
--

INSERT INTO `feedback_submissions` (`id`, `feedback_link_id`, `employee_id`, `customer_name`, `customer_phone`, `customer_email`, `rating`, `tiles`, `feedback_text`, `additional_details`, `status`, `ip_address`, `user_agent`, `submission_time`, `created_at`, `has_deep_feedback`, `feedback_unique_id`) VALUES
(36, 2304, 7, 'Zorawar', '9988221219', 'zorawarss10@gmail.com', 4, NULL, '', '', 'Perfect', NULL, NULL, '2025-07-31 18:40:14', '2025-07-31 18:40:14', 0, 'A130'),
(39, 2304, 7, 'Zorawar', '9988221219', 'zorawarss10@gmail.com', 3, NULL, '', '', 'Needs Review', NULL, NULL, '2025-07-31 19:29:36', '2025-07-31 19:29:36', 0, 'A130'),
(40, 2322, 4, 'Anshul Ahuja', '9910211130', 'anshul.vj@gmail.com', 4, NULL, 'Nice Staff and All', 'Good Behaviour', 'Perfect', NULL, NULL, '2025-07-31 21:22:47', '2025-07-31 21:22:47', 0, 'A148'),
(41, 2323, 4, 'Charanpreet Bidhuri', '9971444008', 'charanpreet16@gmail.com', 4, '{\"question\":\"We\'re glad you enjoyed it! What did you like?\",\"tiles\":[\" Friendly Staff\",\" Liked the Vibe\"]}', 'sds', '', 'Perfect', NULL, NULL, '2025-07-31 23:08:33', '2025-07-31 23:08:33', 0, 'A149'),
(42, 2307, 3, 'Aura', '9205003564', 'Jaisrana564@gmail.com', 3, '{\"question\":\"Thanks for the feedback. What parts were just okay?\",\"tiles\":[\"Average Service\",\" Okay Cleanliness\",\" Game Was Just Fine\",\" Expected More Magic\",\" Could Be Better\"]}', 'I was thinking more good services as the level of Hospitality and welcome and will to make the customer happy was not there', 'Other things like food interior and Games was good', 'Needs Review', NULL, NULL, '2025-07-31 23:34:45', '2025-07-31 23:34:45', 1, 'A133');

--
-- Triggers `feedback_submissions`
--
DELIMITER $$
CREATE TRIGGER `after_feedback_submission` AFTER INSERT ON `feedback_submissions` FOR EACH ROW BEGIN
  UPDATE feedback_links
  SET status = 'Inactive'
  WHERE unique_id = NEW.feedback_unique_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `notification_logs`
--

CREATE TABLE `notification_logs` (
  `id` int(11) NOT NULL,
  `feedback_id` int(11) DEFAULT NULL,
  `notification_type` enum('high_rating_alert','low_rating_alert','monthly_report') NOT NULL,
  `recipient` varchar(255) NOT NULL,
  `status` enum('sent','failed','pending') DEFAULT 'pending',
  `error_message` text DEFAULT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification_settings`
--

CREATE TABLE `notification_settings` (
  `id` int(11) NOT NULL,
  `email_notifications_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `whatsapp_notifications_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `high_rating_threshold` int(11) NOT NULL DEFAULT 4,
  `low_rating_threshold` int(11) NOT NULL DEFAULT 2,
  `admin_emails` text DEFAULT NULL,
  `admin_phones` text DEFAULT NULL,
  `email_template_subject` varchar(255) DEFAULT NULL,
  `email_template_body` text DEFAULT NULL,
  `whatsapp_template_name` varchar(255) DEFAULT NULL,
  `doubletick_api_key` varchar(255) DEFAULT NULL,
  `sender_phone` varchar(50) DEFAULT NULL,
  `notification_frequency` varchar(50) DEFAULT 'immediate',
  `business_hours_only` tinyint(1) NOT NULL DEFAULT 0,
  `weekend_notifications` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification_settings`
--

INSERT INTO `notification_settings` (`id`, `email_notifications_enabled`, `whatsapp_notifications_enabled`, `high_rating_threshold`, `low_rating_threshold`, `admin_emails`, `admin_phones`, `email_template_subject`, `email_template_body`, `whatsapp_template_name`, `doubletick_api_key`, `sender_phone`, `notification_frequency`, `business_hours_only`, `weekend_notifications`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 4, 2, '', '', '🌟 Excellent Review Alert - {{employee_name}} ({{rating}}/5)', 'New excellent review received!\n\nEmployee: {{employee_name}}\nCustomer: {{customer_name}}\nRating: {{rating}}/5\nOutlet: {{outlet_name}} ({{brand_name}})\nFeedback: {{feedback}}\nTime: {{submission_time}}', 'excellent_review_alert', '4938493489348', '8374834', 'immediate', 1, 1, '2025-07-20 22:45:56', '2025-07-20 22:49:27');

-- --------------------------------------------------------

--
-- Table structure for table `outlets`
--

CREATE TABLE `outlets` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `address` text NOT NULL,
  `manager_name` varchar(255) DEFAULT NULL,
  `manager_phone` varchar(20) DEFAULT NULL,
  `manager_email` varchar(255) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `lastFetchedIndex` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `outlets`
--

INSERT INTO `outlets` (`id`, `name`, `brand_id`, `city_id`, `address`, `manager_name`, `manager_phone`, `manager_email`, `status`, `created_at`, `updated_at`, `lastFetchedIndex`) VALUES
(1, 'Downtown Store', 1, 1, '123 Main St, Downtown Los Angeles, CA 90012', 'John Smith', '+1-555-0101', 'john.smith@company.com', 'Active', '2025-07-19 09:32:56', '2025-07-31 17:25:11', 10),
(2, 'Mall Branch', 2, 2, '456 Shopping Mall, San Francisco, CA 94102', 'Sarah Johnson', '+1-555-0102', 'sarah.johnson@company.com', 'Active', '2025-07-19 09:32:56', '2025-07-31 17:25:11', 10),
(3, 'Airport Terminal', 1, 4, 'Terminal 1, JFK Airport, New York, NY 10001', 'Mike Wilson', '+1-555-0103', 'mike.wilson@company.com', 'Active', '2025-07-19 09:32:56', '2025-07-31 17:25:11', 22),
(4, 'City Center', 3, 7, '789 City Center Plaza, Houston, TX 77002', 'Emily Davis', '+1-555-0104', 'emily.davis@company.com', 'Active', '2025-07-19 09:32:56', '2025-07-31 17:25:11', 36),
(5, 'Beach Location', 1, 3, '321 Beach Blvd, San Diego, CA 92101', 'Lisa Chen', '+1-555-0105', 'lisa.chen@company.com', 'Active', '2025-07-19 09:32:56', '2025-07-31 17:25:11', 15),
(6, 'Times Square', 2, 4, '555 Times Square, New York, NY 10036', 'David Brown', '+1-555-0106', 'david.brown@company.com', 'Active', '2025-07-19 09:32:56', '2025-07-31 17:25:11', 20),
(7, 'Near Mum', 5, 1, 'sdsd', 'sdsd', NULL, NULL, 'Active', '2025-07-19 12:12:29', '2025-07-30 13:40:51', 1),
(8, 'Shivam Dixit', 5, 4, 'Vrindaban', 'xx', NULL, NULL, 'Active', '2025-07-19 12:45:14', '2025-07-30 13:40:47', 1),
(9, 'ggsdsd', 3, 2, 'Vrindaban', 'sds', NULL, NULL, 'Active', '2025-07-19 12:45:35', '2025-07-30 13:40:43', 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `outlet_feedback_summary`
-- (See below for the actual view)
--
CREATE TABLE `outlet_feedback_summary` (
`id` int(11)
,`outlet_name` varchar(255)
,`brand_name` varchar(255)
,`city_name` varchar(255)
,`state_name` varchar(255)
,`total_employees` bigint(21)
,`total_feedback` bigint(21)
,`average_rating` decimal(14,4)
,`feedback_token` varchar(255)
,`feedback_url` varchar(500)
,`link_submissions` int(11)
);

-- --------------------------------------------------------

--
-- Table structure for table `outlet_wise_custom_question`
--

CREATE TABLE `outlet_wise_custom_question` (
  `id` int(11) NOT NULL,
  `question_id` varchar(5) DEFAULT NULL,
  `outlet_id` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `outlet_wise_custom_question`
--

INSERT INTO `outlet_wise_custom_question` (`id`, `question_id`, `outlet_id`) VALUES
(6, '11', '1'),
(9, '12', '1'),
(25, '7', '1'),
(10, '12', '2'),
(24, '7', '2'),
(11, '12', '3'),
(17, '5', '3'),
(23, '7', '3'),
(12, '12', '4'),
(22, '7', '4'),
(13, '12', '5'),
(16, '5', '5'),
(21, '7', '5'),
(14, '12', '6'),
(15, '5', '6'),
(20, '7', '6'),
(3, '10', '7'),
(8, '12', '7'),
(7, '12', '8'),
(26, '5', '8'),
(18, '7', '8'),
(1, '9', '8'),
(19, '7', '9');

-- --------------------------------------------------------

--
-- Table structure for table `states`
--

CREATE TABLE `states` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(10) NOT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `states`
--

INSERT INTO `states` (`id`, `name`, `code`, `status`, `created_at`, `updated_at`) VALUES
(1, 'California', 'CA', 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(2, 'New York', 'NY', 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(3, 'Texas', 'TX', 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(4, 'Florida', 'FL', 'Active', '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(5, 'Mathura', 'MTR', 'Active', '2025-07-19 13:28:19', '2025-07-19 13:28:19');

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL,
  `system_name` varchar(255) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `support_email` varchar(255) NOT NULL,
  `support_phone` varchar(50) NOT NULL,
  `app_url` varchar(255) NOT NULL,
  `timezone` varchar(100) NOT NULL,
  `date_format` varchar(50) NOT NULL,
  `currency` varchar(10) NOT NULL,
  `language` varchar(10) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`id`, `system_name`, `company_name`, `support_email`, `support_phone`, `app_url`, `timezone`, `date_format`, `currency`, `language`, `created_at`, `updated_at`) VALUES
(1, 'Employee', 'Your Company', 'support@yourcompany.com', '+1234567890', 'http://localhost:3000', 'UTC', 'DD/MM/YYYY', 'USD', 'en', '2025-07-20 22:31:59', '2025-07-20 22:36:45');

-- --------------------------------------------------------

--
-- Table structure for table `theme_settings`
--

CREATE TABLE `theme_settings` (
  `id` int(11) NOT NULL,
  `app_name` varchar(255) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `favicon_url` varchar(255) DEFAULT NULL,
  `primary_color` varchar(50) DEFAULT NULL,
  `secondary_color` varchar(50) DEFAULT NULL,
  `accent_color` varchar(50) DEFAULT NULL,
  `background_color` varchar(50) DEFAULT NULL,
  `text_color` varchar(50) DEFAULT NULL,
  `sidebar_color` varchar(50) DEFAULT NULL,
  `header_color` varchar(50) DEFAULT NULL,
  `custom_css` text DEFAULT NULL,
  `dark_mode_enabled` tinyint(1) DEFAULT 0,
  `default_theme` varchar(50) DEFAULT NULL,
  `font_family` varchar(100) DEFAULT NULL,
  `font_size` varchar(20) DEFAULT NULL,
  `border_radius` varchar(20) DEFAULT NULL,
  `shadow_intensity` varchar(20) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `theme_settings`
--

INSERT INTO `theme_settings` (`id`, `app_name`, `logo_url`, `favicon_url`, `primary_color`, `secondary_color`, `accent_color`, `background_color`, `text_color`, `sidebar_color`, `header_color`, `custom_css`, `dark_mode_enabled`, `default_theme`, `font_family`, `font_size`, `border_radius`, `shadow_intensity`, `created_at`, `updated_at`) VALUES
(1, 'Ejbfkb', '', '', '#f97316', '#ea580c', '#fb923c', '#ffffff', '#000000', '#ba34df', '#21c4c2', '', 0, 'system', 'Poppins, sans-serif', '15px', '10px', 'heavy', '2025-07-20 22:52:48', '2025-07-28 23:32:47');

-- --------------------------------------------------------

--
-- Table structure for table `whatsapp_templates`
--

CREATE TABLE `whatsapp_templates` (
  `id` int(11) NOT NULL,
  `template_name` varchar(255) NOT NULL,
  `template_type` enum('high_rating','low_rating','monthly_report','winner_announcement') NOT NULL,
  `language_code` varchar(10) DEFAULT 'en',
  `header_text` text DEFAULT NULL,
  `body_text` text NOT NULL,
  `footer_text` text DEFAULT NULL,
  `button_text` varchar(255) DEFAULT NULL,
  `button_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `whatsapp_templates`
--

INSERT INTO `whatsapp_templates` (`id`, `template_name`, `template_type`, `language_code`, `header_text`, `body_text`, `footer_text`, `button_text`, `button_url`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'excellent_review_alert', 'high_rating', 'en', '🌟 Excellent Review Alert!', 'Great news! {{1}} received an excellent {{3}}/5 star review from {{2}} at {{4}} ({{5}}).\n\nCustomer feedback: \"{{6}}\"\n\nSubmitted: {{7}}', 'Employee Review System', NULL, NULL, 1, '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(2, 'low_rating_alert', 'low_rating', 'en', '⚠️ Low Rating Alert', 'Attention needed! {{1}} received a {{3}}/5 star review from {{2}} at {{4}} ({{5}}).\n\nCustomer feedback: \"{{6}}\"\n\nSubmitted: {{7}}\n\nPlease review and take appropriate action.', 'Employee Review System', NULL, NULL, 1, '2025-07-19 09:32:56', '2025-07-19 09:32:56'),
(3, 'monthly_winner', 'winner_announcement', 'en', '🏆 Monthly Winner Announcement', 'Congratulations! {{1}} from {{2}} has been selected as this month\'s winner with an average rating of {{3}}/5 from {{4}} reviews!\n\nKeep up the excellent work!', 'Employee Review System', NULL, NULL, 1, '2025-07-19 09:32:56', '2025-07-19 09:32:56');

-- --------------------------------------------------------

--
-- Table structure for table `winner_selections`
--

CREATE TABLE `winner_selections` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `selection_month` varchar(7) NOT NULL,
  `selection_criteria` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`selection_criteria`)),
  `selected_by` int(11) NOT NULL,
  `selection_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `prize_details` text DEFAULT NULL,
  `is_notified` tinyint(1) DEFAULT 0,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `winner_selections`
--

INSERT INTO `winner_selections` (`id`, `employee_id`, `selection_month`, `selection_criteria`, `selected_by`, `selection_date`, `prize_details`, `is_notified`, `notes`, `created_at`) VALUES
(1, 2, '2024-01', NULL, 1, '2025-07-19 09:32:56', 'Gift voucher worth $500 and certificate of excellence', 0, 'Outstanding performance with highest customer satisfaction', '2025-07-19 09:32:56'),
(2, 1, '2023-12', NULL, 1, '2025-07-19 09:32:56', 'Gift voucher worth $300 and recognition award', 0, 'Consistent excellent service throughout December', '2025-07-19 09:32:56'),
(3, 9, '2023-11', NULL, 1, '2025-07-19 09:32:56', 'Gift voucher worth $400 and team dinner', 0, 'Exceptional leadership and customer service', '2025-07-19 09:32:56');

-- --------------------------------------------------------

--
-- Structure for view `employee_performance_summary`
--
DROP TABLE IF EXISTS `employee_performance_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `employee_performance_summary`  AS SELECT `e`.`id` AS `id`, `e`.`employee_code` AS `employee_code`, `e`.`full_name` AS `full_name`, `e`.`position` AS `position`, `o`.`name` AS `outlet_name`, `b`.`name` AS `brand_name`, `c`.`name` AS `city_name`, `s`.`name` AS `state_name`, count(`fs`.`id`) AS `total_reviews`, avg(`fs`.`rating`) AS `average_rating`, sum(case when `fs`.`status` = 'Perfect' then 1 else 0 end) AS `perfect_count`, sum(case when `fs`.`status` = 'Counselling' then 1 else 0 end) AS `counselling_count`, sum(case when `fs`.`status` = 'Needs Review' then 1 else 0 end) AS `needs_review_count`, max(`fs`.`submission_time`) AS `last_feedback_date` FROM (((((`employees` `e` left join `outlets` `o` on(`e`.`outlet_id` = `o`.`id`)) left join `brands` `b` on(`o`.`brand_id` = `b`.`id`)) left join `cities` `c` on(`o`.`city_id` = `c`.`id`)) left join `states` `s` on(`c`.`state_id` = `s`.`id`)) left join `feedback_submissions` `fs` on(`e`.`id` = `fs`.`employee_id`)) WHERE `e`.`status` = 'Active' GROUP BY `e`.`id`, `e`.`employee_code`, `e`.`full_name`, `e`.`position`, `o`.`name`, `b`.`name`, `c`.`name`, `s`.`name` ;

-- --------------------------------------------------------

--
-- Structure for view `outlet_feedback_summary`
--
DROP TABLE IF EXISTS `outlet_feedback_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `outlet_feedback_summary`  AS SELECT `o`.`id` AS `id`, `o`.`name` AS `outlet_name`, `b`.`name` AS `brand_name`, `c`.`name` AS `city_name`, `s`.`name` AS `state_name`, count(distinct `e`.`id`) AS `total_employees`, count(`fs`.`id`) AS `total_feedback`, avg(`fs`.`rating`) AS `average_rating`, `fl`.`token` AS `feedback_token`, `fl`.`url` AS `feedback_url`, `fl`.`total_submissions` AS `link_submissions` FROM ((((((`outlets` `o` left join `brands` `b` on(`o`.`brand_id` = `b`.`id`)) left join `cities` `c` on(`o`.`city_id` = `c`.`id`)) left join `states` `s` on(`c`.`state_id` = `s`.`id`)) left join `employees` `e` on(`o`.`id` = `e`.`outlet_id` and `e`.`status` = 'Active')) left join `feedback_submissions` `fs` on(`e`.`id` = `fs`.`employee_id`)) left join `feedback_links` `fl` on(`o`.`id` = `fl`.`outlet_id` and `fl`.`status` = 'Active')) WHERE `o`.`status` = 'Active' GROUP BY `o`.`id`, `o`.`name`, `b`.`name`, `c`.`name`, `s`.`name`, `fl`.`token`, `fl`.`url`, `fl`.`total_submissions` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_notification_preferences`
--
ALTER TABLE `admin_notification_preferences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_cities_state` (`state_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_id` (`unique_id`),
  ADD UNIQUE KEY `unique_phone_name` (`phone`,`name`),
  ADD KEY `idx_unique_id` (`unique_id`),
  ADD KEY `idx_phone` (`phone`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_booking_date` (`booking_date`),
  ADD KEY `idx_team_id` (`team_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_code` (`employee_code`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_employees_outlet` (`outlet_id`),
  ADD KEY `idx_employees_status` (`status`);

--
-- Indexes for table `feedback_links`
--
ALTER TABLE `feedback_links`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD UNIQUE KEY `unique_outlet_phone_day` (`outlet_id`,`phone`,`arrival_date`),
  ADD KEY `idx_feedback_links_outlet` (`outlet_id`),
  ADD KEY `idx_feedback_links_token` (`token`),
  ADD KEY `idx_feedback_links_unique_id` (`unique_id`);

--
-- Indexes for table `feedback_questions`
--
ALTER TABLE `feedback_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_feedback_questions_active` (`is_active`,`order_index`);

--
-- Indexes for table `feedback_responses`
--
ALTER TABLE `feedback_responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `idx_feedback_responses_submission` (`feedback_submission_id`);

--
-- Indexes for table `feedback_settings`
--
ALTER TABLE `feedback_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback_submissions`
--
ALTER TABLE `feedback_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `feedback_link_id` (`feedback_link_id`),
  ADD KEY `idx_feedback_employee` (`employee_id`),
  ADD KEY `idx_feedback_rating` (`rating`),
  ADD KEY `idx_feedback_status` (`status`),
  ADD KEY `idx_feedback_date` (`submission_time`),
  ADD KEY `idx_feedback_submissions_feedback_unique_id` (`feedback_unique_id`);

--
-- Indexes for table `notification_logs`
--
ALTER TABLE `notification_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification_settings`
--
ALTER TABLE `notification_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `outlets`
--
ALTER TABLE `outlets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_outlets_brand` (`brand_id`),
  ADD KEY `idx_outlets_city` (`city_id`);

--
-- Indexes for table `outlet_wise_custom_question`
--
ALTER TABLE `outlet_wise_custom_question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniqueData_outletid_questionid` (`outlet_id`,`question_id`) USING BTREE;

--
-- Indexes for table `states`
--
ALTER TABLE `states`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `theme_settings`
--
ALTER TABLE `theme_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `whatsapp_templates`
--
ALTER TABLE `whatsapp_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `template_name` (`template_name`);

--
-- Indexes for table `winner_selections`
--
ALTER TABLE `winner_selections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_month_employee` (`employee_id`,`selection_month`),
  ADD KEY `selected_by` (`selected_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_notification_preferences`
--
ALTER TABLE `admin_notification_preferences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=233;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `feedback_links`
--
ALTER TABLE `feedback_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2808;

--
-- AUTO_INCREMENT for table `feedback_questions`
--
ALTER TABLE `feedback_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `feedback_responses`
--
ALTER TABLE `feedback_responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `feedback_submissions`
--
ALTER TABLE `feedback_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `notification_logs`
--
ALTER TABLE `notification_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `outlets`
--
ALTER TABLE `outlets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `outlet_wise_custom_question`
--
ALTER TABLE `outlet_wise_custom_question`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `states`
--
ALTER TABLE `states`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `whatsapp_templates`
--
ALTER TABLE `whatsapp_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `winner_selections`
--
ALTER TABLE `winner_selections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_notification_preferences`
--
ALTER TABLE `admin_notification_preferences`
  ADD CONSTRAINT `admin_notification_preferences_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cities`
--
ALTER TABLE `cities`
  ADD CONSTRAINT `cities_ibfk_1` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`outlet_id`) REFERENCES `outlets` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `feedback_links`
--
ALTER TABLE `feedback_links`
  ADD CONSTRAINT `feedback_links_ibfk_1` FOREIGN KEY (`outlet_id`) REFERENCES `outlets` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `feedback_responses`
--
ALTER TABLE `feedback_responses`
  ADD CONSTRAINT `feedback_responses_ibfk_1` FOREIGN KEY (`feedback_submission_id`) REFERENCES `feedback_submissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedback_responses_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `feedback_questions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `feedback_submissions`
--
ALTER TABLE `feedback_submissions`
  ADD CONSTRAINT `feedback_submissions_ibfk_1` FOREIGN KEY (`feedback_link_id`) REFERENCES `feedback_links` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedback_submissions_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_feedback_submissions_customer` FOREIGN KEY (`feedback_unique_id`) REFERENCES `customers` (`unique_id`) ON DELETE SET NULL;

--
-- Constraints for table `outlets`
--
ALTER TABLE `outlets`
  ADD CONSTRAINT `outlets_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `outlets_ibfk_2` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `winner_selections`
--
ALTER TABLE `winner_selections`
  ADD CONSTRAINT `winner_selections_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `winner_selections_ibfk_2` FOREIGN KEY (`selected_by`) REFERENCES `admin_users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
