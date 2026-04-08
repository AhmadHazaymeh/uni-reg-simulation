-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 08, 2026 at 03:50 PM
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
-- Database: `uni_registration_simulation`
--

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `course_id` int(11) NOT NULL,
  `line_number` int(11) DEFAULT NULL,
  `course_code` varchar(20) NOT NULL,
  `title` varchar(100) NOT NULL,
  `credit_hours` int(11) NOT NULL,
  `theory_hours` int(11) NOT NULL,
  `practical_hours` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`course_id`, `line_number`, `course_code`, `title`, `credit_hours`, `theory_hours`, `practical_hours`) VALUES
(1, 20261001, 'HSS101MATH', 'التفاضل والتكامل 1', 3, 3, 0),
(2, 20261002, 'HSS112SE', 'مقدمة في البرمجة كائنية التوجه', 3, 3, 0),
(3, 20261003, 'HSS203DS', 'مهارات التواصل وأخلاقيات المهنة', 2, 2, 0),
(4, 20261004, 'HSS211CS', 'تراكيب البيانات', 3, 3, 0),
(5, 20261005, 'HSS241Math', 'الرياضيات المتقطعة', 3, 3, 0),
(6, 20261006, 'HSS102SE', 'مهارات اللغة الإنجليزية في تكنولوجيا المعلومات', 3, 3, 0),
(7, 20261007, 'HSS101CS', 'مقدمة في البرمجة', 3, 3, 0),
(12, NULL, 'SE442', 'هندسة البرمجيات المتقدمة', 3, 3, 0),
(43, 20261008, 'HSS106CS', 'مختبر مقدمة في البرمجة', 1, 0, 2),
(44, 20261009, 'HSS113SE', 'مختبر مقدمة في البرمجة كائنية التوجه', 1, 0, 2),
(45, 20261010, 'HSS212CS', 'مختبر تراكيب البيانات', 1, 0, 2),
(46, 20261011, 'HSS221DS', 'أساسيات نظم قواعد البيانات', 3, 3, 0),
(47, 20261012, 'HSS233MATH', 'الاحتمالات والإحصاء (لطلبة علوم الحاسوب)', 3, 3, 0),
(48, 20261013, 'HSS236CPE', 'التصميم المنطقي الرقمي', 3, 3, 0),
(49, 20261014, 'HSS256CPE', 'تنظيم وبناء الحاسوب', 3, 3, 0),
(50, 20261015, 'MATH 140', 'عناصر الجبر الخطي', 3, 3, 0),
(51, 20261016, 'CS 284', 'تحليل وتصميم الخوارزميات', 3, 3, 0),
(52, 20261017, 'CS 342', 'شبكات الحاسوب', 3, 3, 0),
(53, 20261018, 'CS 375', 'نظم التشغيل', 3, 3, 0),
(54, 20261019, 'SE 210', 'البرمجة بلغة جافا', 3, 3, 0),
(55, 20261020, 'SE 211', 'مختبر البرمجة بلغة جافا', 1, 0, 3),
(56, 20261021, 'SE 222', 'تصميم وبرمجة واجهات المستخدم', 3, 3, 0),
(57, 20261022, 'SE 223', 'مختبر تصميم وبرمجة واجهات المستخدم', 1, 0, 3),
(58, 20261023, 'SE 230', 'أساسيات هندسة البرمجيات', 3, 3, 0),
(59, 20261024, 'SE 301', 'تحليل النظم ونمذجتها وتصميمها', 3, 3, 0),
(60, 20261025, 'SE 312', 'تصميم وتطوير الأنظمة المتوازية والموزعة', 3, 3, 0),
(61, 20261026, 'SE 313', 'مختبر تصميم وتطوير الأنظمة المتوازية والموزعة', 1, 0, 3),
(62, 20261027, 'SE 324', 'عمارة وتصميم البرمجيات', 3, 3, 0),
(63, 20261028, 'SE 327', 'هندسة وتوثيق متطلبات البرمجيات', 3, 3, 0),
(64, 20261029, 'SE 332', 'هندسة البرمجيات لتطبيقات الويب', 3, 3, 0),
(65, 20261030, 'SE 333', 'مختبر هندسة البرمجيات لتطبيقات الويب', 1, 0, 3),
(66, 20261031, 'SE 390', 'التدريب العملي', 3, 0, 25),
(67, 20261032, 'SE 436', 'فحص البرمجيات وضمان الجودة', 3, 3, 0),
(68, 20261033, 'SE 437', 'مختبر فحص البرمجيات وضمان الجودة', 1, 0, 3),
(69, 20261034, 'SE 442', 'عمليات البرمجيات وإدارة المشاريع', 3, 3, 0),
(70, 20261035, 'SE 443', 'صيانة البرمجيات وإدارة الإعدادات', 3, 3, 0),
(71, 20261036, 'SE 492', 'مشروع تخرج 2', 3, 0, 0),
(72, 20261037, 'HI 201', 'مختبر تصميم مواقع الإنترنت', 1, 0, 3),
(73, 20261038, 'SE 401', 'اقتصاديات هندسة البرمجيات', 3, 3, 0),
(74, 20261039, 'SE402', 'إدارة منتجات البرمجيات', 3, 3, 0),
(75, 20261040, 'SE 410', 'تطوير تطبيقات الهواتف الذكية', 3, 3, 0),
(76, 20261041, 'SE411', 'تطوير البرمجيات المعتمدة على المكونات', 3, 3, 0),
(77, 20261042, 'SE 420', 'الطرق الشكلية في هندسة البرمجيات', 3, 3, 0),
(78, 20261043, 'SE 472', 'هندسة البرمجيات المضمنة', 3, 3, 0),
(79, 20261044, 'SE473', 'تصميم الأنظمة واسعة النطاق', 3, 3, 0),
(80, 20261045, 'SE 493', 'مواضيع خاصة في هندسة البرمجيات 1', 1, 1, 0),
(81, 20261046, 'SE 494', 'مواضيع خاصة في هندسة البرمجيات 2', 2, 2, 0),
(82, 20261047, 'SE 495', 'مواضيع خاصة في هندسة البرمجيات 3', 3, 3, 0);

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `dept_id` int(11) NOT NULL,
  `dept_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`dept_id`, `dept_name`) VALUES
(2, 'علوم الحاسوب'),
(1, 'هندسة البرمجيات');

-- --------------------------------------------------------

--
-- Table structure for table `plan_course`
--

CREATE TABLE `plan_course` (
  `plan_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `custom_title` varchar(255) DEFAULT NULL,
  `custom_credit_hours` int(11) DEFAULT NULL,
  `custom_theory_hours` int(11) DEFAULT NULL,
  `custom_practical_hours` int(11) DEFAULT NULL,
  `year_level` int(11) DEFAULT NULL COMMENT '1, 2, 3, 4',
  `semester` int(11) DEFAULT NULL COMMENT '1, 2, 3 (Summer)',
  `category` varchar(100) DEFAULT NULL COMMENT 'University Mandatory, Department Elective, etc.',
  `delivery_mode` varchar(50) DEFAULT 'On-site',
  `is_confirmed` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plan_course`
--

INSERT INTO `plan_course` (`plan_id`, `course_id`, `custom_title`, `custom_credit_hours`, `custom_theory_hours`, `custom_practical_hours`, `year_level`, `semester`, `category`, `delivery_mode`, `is_confirmed`) VALUES
(1, 1, 'التفاضل والتكامل 1', 3, 0, 0, 1, 1, 'إجباري كلية', 'وجاهي', 1),
(1, 2, 'مقدمة في البرمجة كائنية التوجه', 3, 0, 0, 1, 2, 'إجباري تخصص', 'وجاهي', 1),
(1, 3, 'مهارات التواصل وأخلاقيات المهنة', 3, 2, 0, 2, 3, 'إجباري كلية', 'وجاهي', 1),
(1, 4, 'تراكيب البيانات', 3, 0, 0, 2, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 5, 'الرياضيات المتقطعة', 3, 0, 0, 2, 2, 'إجباري كلية', 'مدمج', 1),
(1, 6, 'مهارات اللغة الإنجليزية في تكنولوجيا المعلومات', 3, 0, 0, 1, 3, 'إجباري جامعة', 'وجاهي', 1),
(1, 7, 'مقدمة في البرمجة', 3, 0, 0, 1, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 43, 'مختبر مقدمة في البرمجة', 1, 0, 0, 1, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 44, 'مختبر مقدمة في البرمجة كائنية التوجه', 1, 0, 0, 1, 2, 'إجباري تخصص', 'وجاهي', 1),
(1, 45, 'مختبر تراكيب البيانات', 1, 0, 0, 2, 2, 'إجباري تخصص', 'وجاهي', 1),
(1, 46, 'أساسيات نظم قواعد البيانات', 3, 0, 0, 2, 2, 'إجباري تخصص', 'وجاهي', 1),
(1, 47, 'الاحتمالات والإحصاء (لطلبة علوم الحاسوب)', 3, 0, 0, 1, 2, 'إجباري كلية', 'عن بعد', 1),
(1, 48, 'التصميم المنطقي الرقمي', 3, 0, 0, 3, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 49, 'تنظيم وبناء الحاسوب', 3, 0, 0, 3, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 50, 'عناصر الجبر الخطي', 3, 0, 0, 3, 1, 'إجباري كلية', 'مدمج', 1),
(1, 51, 'تحليل وتصميم الخوارزميات', 3, 0, 0, 2, 2, 'إجباري تخصص', 'وجاهي', 1),
(1, 52, 'شبكات الحاسوب', 3, 0, 0, 3, 2, 'إجباري كلية', 'مدمج', 1),
(1, 53, 'نظم التشغيل', 3, 0, 0, 3, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 54, 'البرمجة بلغة جافا', 3, 0, 0, 3, 2, 'إجباري تخصص', 'وجاهي', 1),
(1, 55, 'مختبر البرمجة بلغة جافا', 1, 0, 0, 3, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 56, 'تصميم وبرمجة واجهات المستخدم', 3, 0, 0, 3, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 57, 'مختبر تصميم وبرمجة واجهات المستخدم', 1, 0, 0, 3, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 58, 'أساسيات هندسة البرمجيات', 3, 0, 0, 3, 2, 'إجباري تخصص', 'وجاهي', 1),
(1, 60, 'تصميم وتطوير الأنظمة المتوازية والموزعة', 3, 0, 0, 4, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 61, 'مختبر تصميم وتطوير الأنظمة المتوازية والموزعة', 1, 0, 0, 4, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 62, 'عمارة وتصميم البرمجيات', 3, 0, 0, 4, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 63, 'هندسة وتوثيق متطلبات البرمجيات', 3, 0, 0, 4, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 64, 'هندسة البرمجيات لتطبيقات الويب', 3, 0, 0, 4, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 65, 'مختبر هندسة البرمجيات لتطبيقات الويب', 1, 0, 0, 4, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 66, 'التدريب العملي', 3, 0, 0, 4, 3, 'إجباري تخصص', 'وجاهي', 1),
(1, 71, 'مشروع تخرج 2', 3, 0, 0, 4, 2, 'إجباري تخصص', 'وجاهي', 1),
(1, 72, 'مختبر تصميم مواقع الإنترنت', 1, 0, 0, 3, 3, 'إجباري تخصص', 'وجاهي', 1),
(1, 73, 'اقتصاديات هندسة البرمجيات', 3, 0, 0, 3, 2, 'اختياري تخصص', 'عن بعد', 1),
(1, 75, 'تطوير تطبيقات الهواتف الذكية', 3, 0, 0, 3, 3, 'اختياري تخصص', 'مدمج', 1),
(1, 78, 'هندسة البرمجيات المضمنة', 3, 0, 0, 4, 2, 'إجباري تخصص', 'وجاهي', 1),
(1, 82, NULL, NULL, NULL, NULL, 0, 0, 'اختياري تخصص', 'On-site', 0);

-- --------------------------------------------------------

--
-- Table structure for table `prerequisites`
--

CREATE TABLE `prerequisites` (
  `id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `prereq_id` int(11) DEFAULT NULL,
  `req_type` enum('Success','Study') DEFAULT 'Success'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prerequisites`
--

INSERT INTO `prerequisites` (`id`, `plan_id`, `course_id`, `prereq_id`, `req_type`) VALUES
(1, 1, 5, 1, 'Success'),
(2, 1, 50, 1, 'Study'),
(3, 1, 47, 1, 'Study'),
(4, 1, 2, 7, 'Study'),
(5, 1, 2, 43, 'Success'),
(6, 1, 4, 2, 'Success'),
(7, 1, 4, 44, 'Success'),
(8, 1, 44, 7, 'Success'),
(9, 1, 44, 43, 'Success'),
(10, 1, 45, 2, 'Success'),
(11, 1, 45, 44, 'Success'),
(12, 1, 71, 66, 'Study');

-- --------------------------------------------------------

--
-- Table structure for table `section`
--

CREATE TABLE `section` (
  `section_id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `section_num` int(11) NOT NULL,
  `days` varchar(100) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `instructor_name` varchar(100) DEFAULT NULL,
  `room_id` varchar(20) DEFAULT NULL,
  `delivery_mode` enum('On-site','Remote','Hybrid') NOT NULL,
  `capacity` int(11) DEFAULT 50,
  `enrolled_count` int(11) DEFAULT 0,
  `is_published` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`section_id`, `course_id`, `section_num`, `days`, `start_time`, `end_time`, `instructor_name`, `room_id`, `delivery_mode`, `capacity`, `enrolled_count`, `is_published`) VALUES
(1, 51, 1, 'UTR', '10:00:00', '11:00:00', 'د.غدير العبيدات', 'M5127', 'On-site', 50, 0, 1),
(2, 51, 2, 'UTR', '09:00:00', '10:00:00', '', '', 'On-site', 50, 0, 1),
(3, 51, 3, 'MW', '10:00:00', '11:30:00', 'د.دانا رشيدات', '', 'On-site', 50, 0, 1),
(5, 52, 1, 'UTR', '18:00:00', '19:00:00', 'م.خلف العناقرة ', '', 'Remote', 20, 0, 1),
(6, 52, 2, 'UTR', '20:00:00', '21:00:00', 'م.خلف العناقرة', '', 'Remote', 50, 0, 1),
(7, 53, 1, 'UTR', '08:00:00', '09:00:00', 'د.دانا الرشيدات', '', 'On-site', 40, 0, 1),
(8, 54, 1, 'UTR', '08:00:00', '09:00:00', 'د.زكريا الشرع', '', 'On-site', 50, 0, 1),
(9, 54, 2, 'UWR', '09:00:00', '10:00:00', 'د.زكريا الشرع', '', 'On-site', 50, 0, 1),
(10, 54, 3, 'MW', '10:00:00', '11:30:00', '', '', 'On-site', 50, 0, 1),
(11, 7, 1, 'UTR', '09:00:00', '10:00:00', 'د.غدير العبيدات ', 'CS010', 'On-site', 50, 0, 1),
(12, 7, 2, 'UTR', '08:00:00', '09:00:00', '', '', 'On-site', 50, 0, 1),
(13, 72, 1, 'UTR', '15:00:00', '16:00:00', '', '', 'On-site', 50, 0, 1),
(14, 1, 1, 'UTR', '11:00:00', '12:00:00', '', 'SF12', 'On-site', 50, 0, 1),
(15, 4, 1, 'UTR', '12:00:00', '13:00:00', '', '', 'On-site', 50, 0, 1),
(16, 2, 1, 'UTR', '10:00:00', '11:00:00', 'د.اسمهان الحسن', 'M210', 'On-site', 50, 0, 1),
(17, 2, 2, 'UTR', '08:00:00', '09:00:00', '', '', 'On-site', 50, 0, 1),
(18, 51, 4, 'UT', '08:00:00', '09:00:00', '', '', 'On-site', 50, 0, 1),
(19, 5, 1, 'MW', '08:00:00', '09:00:00', '', '', 'On-site', 50, 0, 1),
(20, 47, 1, 'UT', '10:00:00', '11:00:00', '', '', 'Hybrid', 50, 0, 1),
(21, 56, 1, 'UTR', '11:00:00', '00:00:00', '', '', 'On-site', 50, 0, 1),
(22, 45, 1, 'MW', '13:00:00', '14:00:00', '', '', 'On-site', 50, 0, 1),
(23, 53, 2, 'UTR', '13:00:00', '15:00:00', '', '', 'On-site', 50, 0, 1),
(24, 70, 1, 'UTR', '10:00:00', '11:00:00', '', '', 'On-site', 50, 0, 1),
(25, 6, 1, 'MW', '14:00:00', '15:00:00', '', '', 'On-site', 50, 0, 1),
(26, 81, 1, 'UTR', '02:00:00', '03:00:00', '', '', 'Hybrid', 50, 0, 1),
(27, 7, 3, 'UTR', '08:00:00', '09:00:00', '', '', 'On-site', 50, 0, 1),
(28, 1, 2, 'UTR', '08:00:00', '09:00:00', '', '', 'On-site', 50, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `staff_id` int(11) NOT NULL,
  `official_id` varchar(20) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('clerk','admin','hod') NOT NULL DEFAULT 'clerk',
  `dept_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`staff_id`, `official_id`, `name`, `email`, `password`, `role`, `dept_id`) VALUES
(1, '5555', 'سامر', 'samer@just.edu.jo', '111', 'hod', 2),
(2, '20000', 'د. حمزة', 'hamza@just.edu.jo', '123456', 'hod', 1),
(3, '2003', 'ahmadhazaymeh', 'ahmadhazaymeh@just.edu.jo', '12345678', 'clerk', 1),
(4, '1001', 'خالد', 'admin@just.edu.jo', '123456', 'admin', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `specialization` varchar(100) DEFAULT 'Software Engineering',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `plan_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `name`, `email`, `password`, `specialization`, `created_at`, `plan_id`) VALUES
('100002', 'أحمد عبيدات', 'ahmed@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('100006', 'زيد الشقران', 'zed@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('100007', 'رنا الروسان', 'rana@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('100008', 'عمر بطاينة', 'omar@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('100009', 'هيا العمري', 'haya@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('100010', 'بشر الزعبي', 'bishr@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('100011', 'نور القضاة', 'nour@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('100012', 'عبدالله الشبول', 'abd@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('100013', 'سلمى الزعبي', 'salma@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('100014', 'حمزة الخصاونة', 'hamza@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('100015', 'ديما عبابنة', 'dima@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('100016', 'خالد غرايبة', 'khaled@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('100017', 'ريما الشطناوي', 'reema@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('100018', 'ياسين الملكاوي', 'yaseen@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('100019', 'تاليا الرواشدة', 'talia@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('100020', 'فيصل الهياجنة', 'faisal@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('100021', 'منى جرادات', 'muna@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('100233', 'سارة الحايك', 'sara@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('100655', 'لينا المومني', 'lina@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('145004', 'محمد بني هاني', 'moe@just.edu.jo', '123', 'Software Engineering', '2026-04-07 23:21:28', 1),
('158001', 'أحمد عبيدات', 'stu158001@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158002', 'سارة المومني', 'stu158002@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158003', 'محمد بني هاني', 'stu158003@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158004', 'لينا الزعبي', 'stu158004@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158005', 'خالد الشقران', 'stu158005@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158006', 'رنا الروسان', 'stu158006@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158007', 'عمر البطاينة', 'stu158007@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158008', 'هيا القضاه', 'stu158008@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158009', 'زيد العتوم', 'stu158009@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158010', 'مريم الخصاونة', 'stu158010@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158011', 'عبدالله الشناق', 'stu158011@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158012', 'ياسمين جرادات', 'stu158012@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158013', 'حمزة القرعان', 'stu158013@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158014', 'نور الغرايبة', 'stu158014@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158015', 'فيصل الشبول', 'stu158015@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158016', 'ديما حتاملة', 'stu158016@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158017', 'براء النعيمي', 'stu158017@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158018', 'فرح الملكاوي', 'stu158018@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158019', 'إياد مقابلة', 'stu158019@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158020', 'سماح العزام', 'stu158020@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158021', 'قصي العمري', 'stu158021@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158022', 'جمانة الهياجنة', 'stu158022@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158023', 'راشد العقلة', 'stu158023@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158024', 'تالا العودات', 'stu158024@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158025', 'منصور النصيرات', 'stu158025@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158026', 'أريج المومني', 'stu158026@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158027', 'أسامة البشابشة', 'stu158027@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158028', 'شهد الزعبي', 'stu158028@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158029', 'بشار الرشدان', 'stu158029@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158030', 'رند الحموري', 'stu158030@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:40:34', 1),
('158138', 'احمد هزايمة', 'ahmad@just.edu.jo', '123456', 'Software Engineering', '2026-01-18 12:42:19', 1),
('159001', 'طالب تجريبي 1', 'test1@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:46:35', 1),
('159002', 'طالب تجريبي 2', 'test2@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:46:35', 1),
('159003', 'طالب تجريبي 3', 'test3@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:46:35', 1),
('159004', 'طالب 4', 's4@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159005', 'طالب 5', 's5@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159006', 'طالب 6', 's6@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159007', 'طالب 7', 's7@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159008', 'طالب 8', 's8@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159009', 'طالب 9', 's9@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159010', 'طالب 10', 's10@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159011', 'طالب 11', 's11@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159012', 'طالب 12', 's12@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159013', 'طالب 13', 's13@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159014', 'طالب 14', 's14@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159015', 'طالب 15', 's15@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159016', 'طالب 16', 's16@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159017', 'طالب 17', 's17@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159018', 'طالب 18', 's18@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159019', 'طالب 19', 's19@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159020', 'طالب 20', 's20@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159021', 'طالب تجريبي 21', 'test21@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:48:33', 1),
('159022', 'طالب تجريبي 22', 'test22@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:48:33', 1),
('159023', 'طالب تجريبي 23', 'test23@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:48:33', 1),
('159024', 'طالب تجريبي 24', 'test24@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:48:33', 1),
('159025', 'طالب تجريبي 25', 'test25@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:48:33', 1),
('159026', 'طالب تجريبي 26', 'test26@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:48:33', 1),
('159027', 'طالب تجريبي 27', 'test27@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:48:33', 1),
('159028', 'طالب تجريبي 28', 'test28@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:48:33', 1),
('159029', 'طالب تجريبي 29', 'test29@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:48:33', 1),
('159030', 'طالب تجريبي 30', 'test30@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:48:33', 1),
('159031', 'طالب تجريبي 31', 'test31@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:48:33', 1),
('159032', 'طالب تجريبي 32', 'test32@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:48:33', 1),
('159033', 'طالب تجريبي 33', 'test33@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:48:33', 1),
('159034', 'طالب تجريبي 34', 'test34@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:48:33', 1),
('159035', 'طالب تجريبي 35', 'test35@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:48:33', 1),
('159036', 'طالب 36', 's36@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159037', 'طالب 37', 's37@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159038', 'طالب 38', 's38@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159039', 'طالب 39', 's39@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159040', 'طالب 40', 's40@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159041', 'طالب 41', 's41@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159042', 'طالب 42', 's42@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159043', 'طالب 43', 's43@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159044', 'طالب 44', 's44@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159045', 'طالب 45', 's45@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159046', 'طالب 46', 's46@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159047', 'طالب 47', 's47@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159048', 'طالب 48', 's48@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159049', 'طالب 49', 's49@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159050', 'طالب 50', 's50@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:51:23', 1),
('159100', 'طالب تجريبي 100', 'test100@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:46:35', 1),
('159101', 'علاء القضاة', 's101@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159102', 'ميس الزعبي', 's102@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159103', 'إبراهيم بني هاني', 's103@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159104', 'هديل الروسان', 's104@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159105', 'منتصر الشقران', 's105@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159106', 'لجين البطاينة', 's106@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159107', 'أسامة العتوم', 's107@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159108', 'رؤى الخصاونة', 's108@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159109', 'بشار الشناق', 's109@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159110', 'تسنيم جرادات', 's110@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159111', 'جعفر القرعان', 's111@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159112', 'سلمى الغرايبة', 's112@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159113', 'قتيبة الشبول', 's113@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159114', 'ديما حتاملة', 's114@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159115', 'ليث النعيمي', 's115@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159116', 'نادية الملكاوي', 's116@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159117', 'عمر مقابلة', 's117@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159118', 'رغد العزام', 's118@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159119', 'صهيب العمري', 's119@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159120', 'غيداء الهياجنة', 's120@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159121', 'عامر العقلة', 's121@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159122', 'جنى العودات', 's122@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159123', 'يزن النصيرات', 's123@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159124', 'ميرا المومني', 's124@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159125', 'حمزة البشابشة', 's125@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159126', 'سجى الزعبي', 's126@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159127', 'معتصم الرشدان', 's127@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159128', 'دانا الحموري', 's128@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159129', 'خليل عبيدات', 's129@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1),
('159130', 'زينة المومني', 's130@just.edu.jo', 'pass1234', 'Software Engineering', '2026-04-08 12:57:37', 1);

-- --------------------------------------------------------

--
-- Table structure for table `studyplan`
--

CREATE TABLE `studyplan` (
  `plan_id` int(11) NOT NULL,
  `plan_name` varchar(100) NOT NULL,
  `specialization` varchar(100) NOT NULL,
  `total_hours` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `studyplan`
--

INSERT INTO `studyplan` (`plan_id`, `plan_name`, `specialization`, `total_hours`) VALUES
(1, 'خطة هندسة البرمجيات 2025', 'SE', 132);

-- --------------------------------------------------------

--
-- Table structure for table `vote`
--

CREATE TABLE `vote` (
  `vote_id` int(11) NOT NULL,
  `student_id` varchar(20) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `vote_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vote`
--

INSERT INTO `vote` (`vote_id`, `student_id`, `course_id`, `section_id`, `vote_date`) VALUES
(178, '159001', 51, 1, '2026-04-08 12:55:35'),
(179, '159002', 51, 1, '2026-04-08 12:55:35'),
(180, '159003', 51, 1, '2026-04-08 12:55:35'),
(181, '159004', 51, 1, '2026-04-08 12:55:35'),
(182, '159005', 51, 1, '2026-04-08 12:55:35'),
(183, '159006', 51, 1, '2026-04-08 12:55:35'),
(184, '159007', 51, 1, '2026-04-08 12:55:35'),
(185, '159008', 51, 1, '2026-04-08 12:55:35'),
(186, '159009', 51, 1, '2026-04-08 12:55:35'),
(187, '159010', 51, 1, '2026-04-08 12:55:35'),
(188, '159011', 51, 1, '2026-04-08 12:55:35'),
(189, '159012', 51, 1, '2026-04-08 12:55:35'),
(190, '159013', 51, 1, '2026-04-08 12:55:35'),
(191, '159014', 51, 1, '2026-04-08 12:55:35'),
(192, '159015', 51, 1, '2026-04-08 12:55:35'),
(193, '159016', 51, 2, '2026-04-08 12:55:35'),
(194, '159017', 51, 2, '2026-04-08 12:55:35'),
(195, '159018', 51, 2, '2026-04-08 12:55:35'),
(196, '159019', 51, 2, '2026-04-08 12:55:35'),
(197, '159020', 51, 2, '2026-04-08 12:55:35'),
(198, '159021', 51, 2, '2026-04-08 12:55:35'),
(199, '159022', 51, 2, '2026-04-08 12:55:35'),
(200, '159023', 51, 2, '2026-04-08 12:55:35'),
(201, '159024', 51, 2, '2026-04-08 12:55:35'),
(202, '159025', 51, 2, '2026-04-08 12:55:35'),
(203, '159026', 52, 5, '2026-04-08 12:55:35'),
(204, '159027', 52, 5, '2026-04-08 12:55:35'),
(205, '159028', 52, 5, '2026-04-08 12:55:35'),
(206, '159029', 52, 5, '2026-04-08 12:55:35'),
(207, '159030', 52, 5, '2026-04-08 12:55:35'),
(208, '159031', 52, 5, '2026-04-08 12:55:35'),
(209, '159032', 52, 5, '2026-04-08 12:55:35'),
(210, '159033', 52, 5, '2026-04-08 12:55:35'),
(211, '159034', 52, 5, '2026-04-08 12:55:35'),
(212, '159035', 52, 5, '2026-04-08 12:55:35'),
(213, '159036', 52, 5, '2026-04-08 12:55:35'),
(214, '159037', 52, 5, '2026-04-08 12:55:35'),
(215, '159038', 52, 5, '2026-04-08 12:55:35'),
(216, '159039', 52, 5, '2026-04-08 12:55:35'),
(217, '159040', 52, 5, '2026-04-08 12:55:35'),
(218, '159041', 53, 7, '2026-04-08 12:55:35'),
(219, '159042', 53, 7, '2026-04-08 12:55:35'),
(220, '159043', 53, 7, '2026-04-08 12:55:35'),
(221, '159044', 53, 7, '2026-04-08 12:55:35'),
(222, '159045', 53, 7, '2026-04-08 12:55:35'),
(223, '159046', 54, 8, '2026-04-08 12:55:35'),
(224, '159047', 54, 8, '2026-04-08 12:55:35'),
(225, '159101', 52, 5, '2026-04-08 12:57:49'),
(226, '159102', 52, 5, '2026-04-08 12:57:49'),
(227, '159103', 52, 5, '2026-04-08 12:57:49'),
(228, '159104', 52, 5, '2026-04-08 12:57:49'),
(229, '159105', 52, 5, '2026-04-08 12:57:49'),
(230, '159106', 52, 5, '2026-04-08 12:57:49'),
(231, '159107', 52, 5, '2026-04-08 12:57:49'),
(232, '159108', 52, 5, '2026-04-08 12:57:49'),
(233, '159109', 52, 5, '2026-04-08 12:57:49'),
(234, '159110', 52, 5, '2026-04-08 12:57:49'),
(235, '159111', 52, 5, '2026-04-08 12:57:49'),
(236, '159112', 52, 5, '2026-04-08 12:57:49'),
(237, '159113', 52, 5, '2026-04-08 12:57:49'),
(238, '159114', 52, 5, '2026-04-08 12:57:49'),
(239, '159115', 52, 5, '2026-04-08 12:57:49'),
(240, '159116', 52, 5, '2026-04-08 12:57:49'),
(241, '159117', 52, 5, '2026-04-08 12:57:49'),
(242, '159118', 52, 5, '2026-04-08 12:57:49'),
(243, '159119', 52, 5, '2026-04-08 12:57:49'),
(244, '159120', 52, 5, '2026-04-08 12:57:49'),
(245, '159121', 53, 7, '2026-04-08 12:58:01'),
(246, '159122', 53, 7, '2026-04-08 12:58:01'),
(247, '159123', 53, 7, '2026-04-08 12:58:01'),
(248, '159124', 53, 7, '2026-04-08 12:58:01'),
(249, '159125', 53, 7, '2026-04-08 12:58:01'),
(250, '159126', 53, 7, '2026-04-08 12:58:01'),
(251, '159127', 53, 7, '2026-04-08 12:58:01'),
(252, '159128', 53, 7, '2026-04-08 12:58:01'),
(253, '159129', 53, 7, '2026-04-08 12:58:01'),
(254, '159130', 53, 7, '2026-04-08 12:58:01'),
(255, '159101', 54, 8, '2026-04-08 12:58:09'),
(256, '159102', 54, 8, '2026-04-08 12:58:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`course_id`),
  ADD UNIQUE KEY `course_code` (`course_code`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`dept_id`),
  ADD UNIQUE KEY `dept_name` (`dept_name`);

--
-- Indexes for table `plan_course`
--
ALTER TABLE `plan_course`
  ADD PRIMARY KEY (`plan_id`,`course_id`),
  ADD KEY `course_id` (`course_id`);
ALTER TABLE `plan_course` ADD FULLTEXT KEY `category` (`category`);

--
-- Indexes for table `prerequisites`
--
ALTER TABLE `prerequisites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `prereq_id` (`prereq_id`),
  ADD KEY `fk_prereq_plan` (`plan_id`);

--
-- Indexes for table `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`section_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`staff_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `official_id` (`official_id`),
  ADD KEY `fk_staff_dept` (`dept_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `studyplan`
--
ALTER TABLE `studyplan`
  ADD PRIMARY KEY (`plan_id`);

--
-- Indexes for table `vote`
--
ALTER TABLE `vote`
  ADD PRIMARY KEY (`vote_id`),
  ADD UNIQUE KEY `unique_student_course` (`student_id`,`course_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `section_id` (`section_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `dept_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `prerequisites`
--
ALTER TABLE `prerequisites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `section_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1234573;

--
-- AUTO_INCREMENT for table `studyplan`
--
ALTER TABLE `studyplan`
  MODIFY `plan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `vote`
--
ALTER TABLE `vote`
  MODIFY `vote_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=257;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `plan_course`
--
ALTER TABLE `plan_course`
  ADD CONSTRAINT `plan_course_ibfk_1` FOREIGN KEY (`plan_id`) REFERENCES `studyplan` (`plan_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `plan_course_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE;

--
-- Constraints for table `prerequisites`
--
ALTER TABLE `prerequisites`
  ADD CONSTRAINT `fk_prereq_plan` FOREIGN KEY (`plan_id`) REFERENCES `studyplan` (`plan_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `prerequisites_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`),
  ADD CONSTRAINT `prerequisites_ibfk_2` FOREIGN KEY (`prereq_id`) REFERENCES `course` (`course_id`);

--
-- Constraints for table `section`
--
ALTER TABLE `section`
  ADD CONSTRAINT `section_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE;

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `fk_staff_dept` FOREIGN KEY (`dept_id`) REFERENCES `department` (`dept_id`);

--
-- Constraints for table `vote`
--
ALTER TABLE `vote`
  ADD CONSTRAINT `vote_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `vote_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vote_ibfk_3` FOREIGN KEY (`section_id`) REFERENCES `section` (`section_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
