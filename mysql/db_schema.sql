CREATE DATABASE  IF NOT EXISTS `school_trip` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `school_trip`;
-- MySQL dump 10.13  Distrib 8.0.27, for macos11 (x86_64)
--
-- Host: 127.0.0.1    Database: school_trip
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grades` (
  `idgrades` int NOT NULL AUTO_INCREMENT,
  `grade` int DEFAULT NULL,
  `studentID` int DEFAULT NULL,
  `school_tripID` int DEFAULT NULL,
  `class` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idgrades`),
  UNIQUE KEY `idschool_trip_UNIQUE` (`idgrades`),
  KEY `studentID_idx` (`studentID`),
  KEY `school_tripID_idx` (`school_tripID`),
  CONSTRAINT `s_tID` FOREIGN KEY (`school_tripID`) REFERENCES `school_trip` (`idschool_trip`),
  CONSTRAINT `studentID` FOREIGN KEY (`studentID`) REFERENCES `person` (`idperson`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person` (
  `idperson` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `type` varchar(45) NOT NULL,
  `class` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idperson`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `idperson_UNIQUE` (`idperson`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `qa`
--

DROP TABLE IF EXISTS `qa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `qa` (
  `idqa` int NOT NULL AUTO_INCREMENT,
  `question` mediumtext,
  `answers` mediumtext,
  `correct_answer` int DEFAULT NULL,
  `summary` mediumtext,
  `school_tripID` int DEFAULT NULL,
  `quizID` int DEFAULT NULL,
  PRIMARY KEY (`idqa`),
  UNIQUE KEY `idq&a_UNIQUE` (`idqa`),
  KEY `school_tripID_idx` (`school_tripID`),
  KEY `quizID_idx` (`quizID`),
  CONSTRAINT `quiz` FOREIGN KEY (`quizID`) REFERENCES `quiz` (`idquiz`) ON DELETE SET NULL,
  CONSTRAINT `school_trip` FOREIGN KEY (`school_tripID`) REFERENCES `school_trip` (`idschool_trip`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=329 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `qa_images`
--

DROP TABLE IF EXISTS `qa_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `qa_images` (
  `idqa_images` int NOT NULL AUTO_INCREMENT,
  `image_quiz_id` int NOT NULL,
  `name` mediumtext NOT NULL,
  `url` longblob NOT NULL,
  PRIMARY KEY (`idqa_images`),
  UNIQUE KEY `idqa_images_UNIQUE` (`idqa_images`),
  KEY `image_quiz_id_idx` (`image_quiz_id`),
  CONSTRAINT `image_quiz_id` FOREIGN KEY (`image_quiz_id`) REFERENCES `quiz` (`idquiz`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=167 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `quiz`
--

DROP TABLE IF EXISTS `quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz` (
  `idquiz` int NOT NULL AUTO_INCREMENT,
  `school_tripID` int DEFAULT NULL,
  `studentID` int DEFAULT NULL,
  `submited` tinyint NOT NULL DEFAULT '0',
  `grade` int DEFAULT NULL,
  `teacher_comment` mediumtext,
  PRIMARY KEY (`idquiz`),
  UNIQUE KEY `idquiz_UNIQUE` (`idquiz`),
  KEY `creatorID_idx` (`studentID`),
  KEY `school_tripID_idx` (`school_tripID`),
  CONSTRAINT `school_tripID` FOREIGN KEY (`school_tripID`) REFERENCES `school_trip` (`idschool_trip`) ON DELETE SET NULL,
  CONSTRAINT `student` FOREIGN KEY (`studentID`) REFERENCES `person` (`idperson`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `quiz_solutions`
--

DROP TABLE IF EXISTS `quiz_solutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz_solutions` (
  `idquiz_solutions` int NOT NULL AUTO_INCREMENT,
  `qs_idquiz` int DEFAULT NULL,
  `qs_iduser` int DEFAULT NULL,
  `answers` mediumtext,
  `score` float DEFAULT NULL,
  `grade` int DEFAULT NULL,
  `qs_idschool_trip` int DEFAULT NULL,
  PRIMARY KEY (`idquiz_solutions`),
  KEY `qs_iduser_idx` (`qs_iduser`),
  KEY `qs_idquiz_idx` (`qs_idquiz`),
  KEY `qs_idschool_trip_idx` (`qs_idschool_trip`),
  CONSTRAINT `qs_idquiz` FOREIGN KEY (`qs_idquiz`) REFERENCES `quiz` (`idquiz`) ON DELETE CASCADE,
  CONSTRAINT `qs_idschool_trip` FOREIGN KEY (`qs_idschool_trip`) REFERENCES `school_trip` (`idschool_trip`) ON DELETE CASCADE,
  CONSTRAINT `qs_iduser` FOREIGN KEY (`qs_iduser`) REFERENCES `person` (`idperson`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `school_trip`
--

DROP TABLE IF EXISTS `school_trip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `school_trip` (
  `idschool_trip` int NOT NULL AUTO_INCREMENT,
  `teacherID` int DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `class` varchar(45) DEFAULT NULL,
  `n_questions` int NOT NULL,
  `summary` mediumtext,
  `quizes_to_solve` int DEFAULT NULL,
  PRIMARY KEY (`idschool_trip`),
  UNIQUE KEY `idschool_trip_UNIQUE` (`idschool_trip`),
  KEY `creatorID_idx` (`teacherID`),
  CONSTRAINT `teacherID` FOREIGN KEY (`teacherID`) REFERENCES `person` (`idperson`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-01-05 11:19:25
