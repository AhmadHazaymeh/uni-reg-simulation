-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 18, 2026 at 09:10 PM
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
(1, 3, 'مهارات التواصل وأخلاقيات المهنة', 2, 0, 0, 2, 3, 'إجباري كلية', 'وجاهي', 1),
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
(1, 59, 'تحليل النظم ونمذجتها وتصميمها', 3, 0, 0, 3, 2, 'إجباري تخصص', 'وجاهي', 1),
(1, 60, 'تصميم وتطوير الأنظمة المتوازية والموزعة', 3, 0, 0, 4, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 61, 'مختبر تصميم وتطوير الأنظمة المتوازية والموزعة', 1, 0, 0, 4, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 62, 'عمارة وتصميم البرمجيات', 3, 0, 0, 4, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 63, 'هندسة وتوثيق متطلبات البرمجيات', 3, 0, 0, 4, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 64, 'هندسة البرمجيات لتطبيقات الويب', 3, 0, 0, 4, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 65, 'مختبر هندسة البرمجيات لتطبيقات الويب', 1, 0, 0, 4, 1, 'إجباري تخصص', 'وجاهي', 1),
(1, 66, 'التدريب العملي', 3, 0, 0, 4, 3, 'إجباري تخصص', 'وجاهي', 1),
(1, 67, 'فحص البرمجيات وضمان الجودة', 3, 0, 0, 3, 2, 'إجباري تخصص', 'وجاهي', 1),
(1, 68, 'مختبر فحص البرمجيات وضمان الجودة', 1, 0, 0, 3, 2, 'إجباري تخصص', 'وجاهي', 1),
(1, 69, 'عمليات البرمجيات وإدارة المشاريع', 3, 0, 0, 4, 1, 'اختياري تخصص', 'مدمج', 1),
(1, 70, 'صيانة البرمجيات وإدارة الإعدادات', 3, 0, 0, 4, 3, 'اختياري تخصص', 'عن بعد', 1),
(1, 71, 'مشروع تخرج 2', 3, 0, 0, 4, 2, 'إجباري تخصص', 'وجاهي', 1),
(1, 72, 'مختبر تصميم مواقع الإنترنت', 1, 0, 0, 3, 3, 'إجباري تخصص', 'وجاهي', 1),
(1, 73, 'اقتصاديات هندسة البرمجيات', 3, 0, 0, 3, 2, 'اختياري تخصص', 'عن بعد', 1),
(1, 74, 'إدارة منتجات البرمجيات', 3, 0, 0, 4, 1, 'اختياري تخصص', 'مدمج', 1),
(1, 75, 'تطوير تطبيقات الهواتف الذكية', 3, 0, 0, 3, 3, 'اختياري تخصص', 'مدمج', 1),
(1, 76, 'تطوير البرمجيات المعتمدة على المكونات', 3, 0, 0, 4, 3, 'اختياري تخصص', 'وجاهي', 1),
(1, 77, 'الطرق الشكلية في هندسة البرمجيات', 3, 0, 0, 3, 3, 'اختياري تخصص', 'وجاهي', 1),
(1, 78, 'هندسة البرمجيات المضمنة', 3, 0, 0, 4, 2, 'إجباري تخصص', 'وجاهي', 1),
(1, 79, 'تصميم الأنظمة واسعة النطاق', 3, 0, 0, 4, 3, 'اختياري تخصص', 'وجاهي', 1);

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
(5, 52, 1, 'UTR', '18:00:00', '19:00:00', 'م.خلف العناقرة ', '', 'Remote', 50, 0, 1),
(6, 52, 2, 'UTR', '20:00:00', '21:00:00', 'م.خلف العناقرة', '', 'Remote', 50, 0, 1),
(7, 53, 1, 'UTR', '08:00:00', '09:00:00', 'د.دانا الرشيدات', '', 'On-site', 50, 0, 1),
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
(18, 51, 4, 'UT', '08:00:00', '09:00:00', '', '', 'On-site', 50, 0, 0),
(19, 5, 1, 'MW', '08:00:00', '09:00:00', '', '', 'On-site', 50, 0, 0),
(20, 47, 1, 'UT', '10:00:00', '11:00:00', '', '', 'Hybrid', 50, 0, 0),
(21, 56, 1, 'UTR', '11:00:00', '00:00:00', '', '', 'On-site', 50, 0, 0),
(22, 45, 1, 'MW', '13:00:00', '14:00:00', '', '', 'On-site', 50, 0, 0),
(23, 53, 2, 'UTR', '13:00:00', '15:00:00', '', '', 'On-site', 50, 0, 0),
(24, 70, 1, 'UTR', '10:00:00', '11:00:00', '', '', 'On-site', 50, 0, 0),
(25, 6, 1, 'MW', '14:00:00', '15:00:00', '', '', 'On-site', 50, 0, 0),
(26, 81, 1, 'UTR', '02:00:00', '03:00:00', '', '', 'Hybrid', 50, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `staff_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('clerk','admin') DEFAULT 'clerk'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`staff_id`, `name`, `email`, `password`, `role`) VALUES
(1234567, 'ahmadhazaymeh', 'ahmadhazaymeh@gmail.com', '12345678', 'clerk');

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
('158138', 'احمد هزايمة', 'ahmad@just.edu.jo', '123456', 'Software Engineering', '2026-01-18 12:42:19', 1);

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
(3, '158138', 51, 1, '2026-01-18 18:25:55'),
(4, '158138', 52, 5, '2026-01-18 18:26:48'),
(5, '158138', 54, 9, '2026-01-18 18:26:52'),
(6, '158138', 72, 13, '2026-01-18 18:26:56'),
(7, '158138', 7, 11, '2026-01-18 18:36:01'),
(8, '158138', 2, 16, '2026-01-18 18:36:12');

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
  ADD UNIQUE KEY `email` (`email`);

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
-- AUTO_INCREMENT for table `prerequisites`
--
ALTER TABLE `prerequisites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `section_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1234568;

--
-- AUTO_INCREMENT for table `studyplan`
--
ALTER TABLE `studyplan`
  MODIFY `plan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `vote`
--
ALTER TABLE `vote`
  MODIFY `vote_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
-- Constraints for table `vote`
--
ALTER TABLE `vote`
  ADD CONSTRAINT `vote_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vote_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vote_ibfk_3` FOREIGN KEY (`section_id`) REFERENCES `section` (`section_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
