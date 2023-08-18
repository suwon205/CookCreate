-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: i9c111.p.ssafy.io    Database: cookcreate
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `badge`
--

DROP TABLE IF EXISTS `badge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `badge` (
  `badge_id` int NOT NULL AUTO_INCREMENT,
  `created_date` datetime(6) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL,
  `capture` varchar(255) DEFAULT NULL,
  `certificated` int DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`badge_id`),
  KEY `FKcf5ksp5bbs5e9dkmu3dknriqg` (`user_id`),
  CONSTRAINT `FKcf5ksp5bbs5e9dkmu3dknriqg` FOREIGN KEY (`user_id`) REFERENCES `member` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `badge`
--

LOCK TABLES `badge` WRITE;
/*!40000 ALTER TABLE `badge` DISABLE KEYS */;
INSERT INTO `badge` VALUES (1,'2023-08-17 23:06:49.002544','2023-08-17 23:06:49.002544','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/license/a73be652-e97e-469c-aa2c-e222a81d6a97califo.jpg',0,'sucook926'),(2,'2023-08-17 23:17:26.912281','2023-08-17 23:17:26.912281','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/license/36948e3c-3def-414e-a59e-75475a5c7e0dppp.jpg',0,'sucook926'),(3,'2023-08-18 00:01:35.669720','2023-08-18 00:01:35.669720','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/license/795ee695-b33a-4dd5-967b-ec306a68e247ppp.jpg',0,'cookyer');
/*!40000 ALTER TABLE `badge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `created_date` datetime(6) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `type` int DEFAULT NULL,
  `lesson_id` int DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`message_id`),
  KEY `FKdcv5bfhvj6p3jdav728tfhpo7` (`lesson_id`),
  KEY `FK6wej46hc569ysspn7h4uybova` (`user_id`),
  CONSTRAINT `FK6wej46hc569ysspn7h4uybova` FOREIGN KEY (`user_id`) REFERENCES `member` (`user_id`),
  CONSTRAINT `FKdcv5bfhvj6p3jdav728tfhpo7` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`lesson_id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
INSERT INTO `chat` VALUES (1,'2023-08-17 23:14:15.995183','2023-08-17 23:14:15.995183','안녕하세요!',1,1,'cookyer'),(2,'2023-08-17 23:14:51.323445','2023-08-17 23:14:51.323445','안녕하세요~',1,1,'suwon'),(3,'2023-08-17 23:15:00.486989','2023-08-17 23:15:00.486989','화채 많이 달까요? 단걸 잘 못먹습니다',1,1,'suwon'),(4,'2023-08-17 23:15:20.086185','2023-08-17 23:15:20.086185','아니요~ 기호에 맞게 조절해서 넣으시면 괜찮습니다!',1,1,'cookyer'),(5,'2023-08-17 23:15:23.500729','2023-08-17 23:15:23.500729','ㅎㅎㅎㅎㅎ',1,1,'suwon'),(6,'2023-08-17 23:15:27.143728','2023-08-17 23:15:27.143728','감사합니다~!!!',1,1,'suwon'),(7,'2023-08-17 23:25:10.376218','2023-08-17 23:25:10.376218','어디 계세요?',1,5,'suwon'),(8,'2023-08-17 23:25:16.702621','2023-08-17 23:25:16.702621','여긴가요?',1,6,'suwon'),(9,'2023-08-17 23:25:17.256574','2023-08-17 23:25:17.256574','여기 있어요..',1,5,'cookyer'),(10,'2023-08-17 23:25:20.331079','2023-08-17 23:25:20.331079','ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ',1,5,'suwon'),(11,'2023-08-17 23:25:28.309504','2023-08-17 23:25:28.309504','녹화 하고 계신가요..?',1,5,'cookyer'),(12,'2023-08-17 23:25:31.396813','2023-08-17 23:25:31.396813','저희 다같이,, 쳐야 합니다',1,5,'suwon'),(13,'2023-08-17 23:25:38.952055','2023-08-17 23:25:38.952055','하 잠시만요 저 반디캠 깔아야 해요',1,5,'suwon'),(14,'2023-08-17 23:25:40.518562','2023-08-17 23:25:40.518562','저희 단둘밖에 없나요..?',1,5,'cookyer'),(15,'2023-08-17 23:25:47.675195','2023-08-17 23:25:47.675195','괜찮아요..천천히 하세요..',1,5,'cookyer'),(16,'2023-08-17 23:26:50.899985','2023-08-17 23:26:50.899985','녹화할까요?!!!',1,5,'suwon'),(17,'2023-08-17 23:28:29.952712','2023-08-17 23:28:29.952712','안녕하세요!',1,5,'cookyer'),(18,'2023-08-17 23:28:40.898426','2023-08-17 23:28:40.898426','안녕하세요!',1,6,'cookyer'),(19,'2023-08-17 23:28:42.951091','2023-08-17 23:28:42.951091','안녕하세요!',1,5,'suwon'),(20,'2023-08-17 23:28:46.456604','2023-08-17 23:28:46.456604','새로운 곳이군요',1,6,'cookyer'),(21,'2023-08-17 23:28:57.150025','2023-08-17 23:28:57.150025','꼭 제철 과일을 사용해야 하나요?',1,5,'suwon'),(22,'2023-08-17 23:29:06.363989','2023-08-17 23:29:06.363989','통조림 써도 되나요? 냉동 과일이나????',1,5,'suwon'),(23,'2023-08-17 23:29:17.808380','2023-08-17 23:29:17.808380','통조림 쓰면 맛없을 수도 있어요~',1,5,'cookyer'),(24,'2023-08-17 23:29:19.029128','2023-08-17 23:29:19.029128','너무 단 건 싫어요... 덜 달게 할 수 있을까요?',1,5,'suwon'),(25,'2023-08-17 23:29:26.984256','2023-08-17 23:29:26.984256','냉동과일은 가능합니다!',1,5,'cookyer'),(26,'2023-08-17 23:29:34.566115','2023-08-17 23:29:34.566115','사이다 대신 탄산수 사용하시면 돼요!!',1,5,'cookyer'),(27,'2023-08-17 23:29:37.334851','2023-08-17 23:29:37.334851','감사합니다!',1,5,'suwon'),(28,'2023-08-17 23:30:40.912655','2023-08-17 23:30:40.912655','안녕하세요~',1,6,'suwon'),(29,'2023-08-17 23:30:52.125758','2023-08-17 23:30:52.125758','오늘 과외 팁 알려주세요!',1,6,'suwon'),(30,'2023-08-17 23:31:04.031094','2023-08-17 23:31:04.031094','통조림 과일을 쓰는 건 힘들겠죠?',1,6,'suwon'),(31,'2023-08-17 23:31:11.558343','2023-08-17 23:31:11.558343','얼음 많이 넣어도 되나요?',1,6,'suwon'),(32,'2023-08-17 23:31:15.819819','2023-08-17 23:31:15.819819','통조림은 맛없을 수도 있어요!',1,6,'cookyer'),(33,'2023-08-17 23:31:17.281568','2023-08-17 23:31:17.281568','정량이 정해져 있는지가 궁금해요!',1,6,'suwon'),(34,'2023-08-17 23:31:23.553715','2023-08-17 23:31:23.553715','신선한 과일이나 냉동 과일 사용해주세요',1,6,'cookyer'),(35,'2023-08-17 23:31:32.250585','2023-08-17 23:31:32.250585','감사합니다 희쿠커님!',1,6,'suwon'),(36,'2023-08-18 02:42:08.410032','2023-08-18 02:42:08.410032','연어 캘리포니아롤 빨리 만들어보고 싶어요!',1,3,'cookiee1'),(37,'2023-08-18 02:42:20.134870','2023-08-18 02:42:20.134870','야호! 김치볶음밥 맛있겠다!',1,9,'cookiee1'),(38,'2023-08-18 02:42:32.863841','2023-08-18 02:42:32.863841','브런치로는 샌드위치 만한게 없지~',1,12,'cookiee1'),(39,'2023-08-18 02:42:45.157067','2023-08-18 02:42:45.157067','우와, 진짜 백종원이에요?',1,8,'cookiee1'),(40,'2023-08-18 02:43:14.212255','2023-08-18 02:43:14.212255','백종원 아니고 천종원입니다..',1,8,'cookyer1'),(41,'2023-08-18 02:43:33.353742','2023-08-18 02:43:33.353742','내가만든 김볶~ 너를위해 볶지~',1,9,'cookyer1'),(42,'2023-08-18 02:47:59.166968','2023-08-18 02:47:59.166968','지금까지 이런 맛은 없었다. 이것은 두부인가 파스타인가',1,11,'cookyer2'),(43,'2023-08-18 02:49:42.980677','2023-08-18 02:49:42.980677','오전에 먹어도 맛있어요~',1,10,'cookyer3'),(44,'2023-08-18 02:50:46.507116','2023-08-18 02:50:46.507116','아점은 영어로 브런치인데, 점저는 영어로 뭐죠?',1,12,'cookyer4'),(45,'2023-08-18 02:57:48.208282','2023-08-18 02:57:48.208282','두부에 단백질 많나요?',1,7,'cookiee2'),(46,'2023-08-18 02:58:07.106938','2023-08-18 02:58:07.106938','저랑 텐동 같이 먹으실분?',1,2,'cookiee2'),(47,'2023-08-18 02:58:29.631450','2023-08-18 02:58:29.631450','네 안녕하세요~ 쿡 크리에이트 입니다.',1,11,'cookiee2'),(48,'2023-08-18 02:58:48.592409','2023-08-18 02:58:48.592409','티라미수 만들기 힘들지 않나요? ㅜㅜ',1,10,'cookiee2'),(49,'2023-08-18 02:59:56.975735','2023-08-18 02:59:56.975735','두부로는 몸 못키웁니다..;;',1,7,'cookiee3'),(50,'2023-08-18 03:00:18.016006','2023-08-18 03:00:18.016006','백종원씨! 일루와봐유',1,8,'cookiee3'),(51,'2023-08-18 03:10:01.810602','2023-08-18 03:10:01.810602','고운 우리말을 사랑합시다~',1,12,'cookiee4');
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hibernate_sequence`
--

DROP TABLE IF EXISTS `hibernate_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hibernate_sequence` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hibernate_sequence`
--

LOCK TABLES `hibernate_sequence` WRITE;
/*!40000 ALTER TABLE `hibernate_sequence` DISABLE KEYS */;
INSERT INTO `hibernate_sequence` VALUES (69);
/*!40000 ALTER TABLE `hibernate_sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson`
--

DROP TABLE IF EXISTS `lesson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson` (
  `lesson_id` int NOT NULL AUTO_INCREMENT,
  `created_date` datetime(6) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL,
  `cookyer_id` varchar(255) DEFAULT NULL,
  `cookyer_name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `difficulty` int DEFAULT NULL,
  `is_chat_room_over` tinyint(1) DEFAULT '0',
  `is_end` tinyint(1) DEFAULT '0',
  `is_over` tinyint(1) DEFAULT '0',
  `jjim_count` int NOT NULL,
  `lesson_date` varchar(255) DEFAULT NULL,
  `lesson_title` varchar(255) DEFAULT NULL,
  `materials` varchar(255) DEFAULT NULL,
  `maximum` int NOT NULL,
  `price` int NOT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `time_taken` int NOT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`lesson_id`),
  KEY `FK3ru4sfp4g9tfpgth6h8fm67r7` (`category_id`),
  CONSTRAINT `FK3ru4sfp4g9tfpgth6h8fm67r7` FOREIGN KEY (`category_id`) REFERENCES `lesson_category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson`
--

LOCK TABLES `lesson` WRITE;
/*!40000 ALTER TABLE `lesson` DISABLE KEYS */;
INSERT INTO `lesson` VALUES (1,'2023-08-17 22:27:44.681484','2023-08-17 23:16:19.884934','cookyer','희쿠커','요즘 날씨가 많이 더운데 여러분은 어떻게 더위를 나고 계시나요? 시원하게 화채 한사바리 어떠세요?',0,0,1,1,0,'2023-08-17T22:00:00','더운 여름 시원하게 화채 만들어요~','수박 1/4통,천도복숭아 1개,블루베리 한 줌,산딸기 한 줌,라임 반개(생략가능),우유 1컵,사이다 1컵,올리고당 1큰술,얼음',6,1000,'nhBRyklzxm3NfCe','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/lesson/91c309cc-9210-40bd-8f9e-8180f40a18f9%ED%99%94%EC%B1%84.jpeg',60,'',7),(2,'2023-08-17 22:49:16.321487','2023-08-18 02:38:34.474800','sucook926','sucocok9','오늘 소개 할 요리는 텐동입니다.\r\n텐동은 밥 위에 튀김을 올리고 텐동소스를 뿌려먹는 튀김 덮밥이랍니다.',1,0,0,1,0,'2023-08-19T17:30:00','고독한 미식가의 고로상이 먹던 텐동만들기','두릅 3~4개,고구마 1개,가지 1/3개,깻잎 2장,새우 3마리,계란 1개,밥 1인분,튀김가루 4큰술,감자전분 2큰술,물 적당량,얼음 2~3개,식용유 1티스푼,[텐동간장소스 재료],물 60g,간장 35g,쯔유 15g,설탕 2큰술,맛술',2,20000,NULL,'https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/lesson/d48d46cc-11fe-4eaa-8cc6-bc052de294edtendo.jpg',90,'',4),(3,'2023-08-17 22:52:23.228562','2023-08-17 22:52:23.228562','sucook926','sucocok9','제가 캘리포니아롤을 굉장히 좋아하는데요 \r\n특히 요 연어롤이 제일 좋아서 집에 있는 재료들로 간단하게 한번 해보았는데 색감이며 비주얼이 너무 예뻐서 손님접대용으로도 너무 좋을 것 같네요^^',0,0,0,0,0,'2023-08-20T22:00:00','간단하지만 맛있는 연어캘리포니아롤','생연어 100g,양파 1/4개,크래미 30g,사과 1/4개,오이 1/2개,깻잎 2장,쌀밥',4,10000,NULL,'https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/lesson/4fd8c0c1-10f5-4567-97c3-9a2aade24363ca.jpg',60,'',4),(4,'2023-08-17 22:58:38.406989','2023-08-17 23:10:28.004794','sucook926','sucocok9','우동을 차갑게 시원하게 먹을 수 있는 냉우동 샐러드에요.\r\n우동면과 소스만 준비하면 간단하게 완성된답니다.\r\n눈 깜빡할 사이에 끝나니 놀라지 마세요.^^',0,0,0,1,0,'2023-08-17T12:00:00','초간단 우동샐러드','우동면 구매1개,믹스샐러드 크게 구매1줌,방울토마토 구매5개,[간장드레싱],간장 구매4큰술,설탕 구매1큰술,꿀 구매1큰술,식초 구매1큰술,레몬즙 구매2큰술,다진마늘 구매1큰술,참기름',3,5000,NULL,'https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/lesson/a606019a-ab64-43ec-b9d2-5bb2a49acf8buuuu.jpg',60,'',4),(5,'2023-08-17 23:05:58.745049','2023-08-17 23:30:00.006123','cookyer','희쿠커','요즘 날씨가 많이 더운데 여러분은 어떻게 더위를 나고 계시나요? 시원하게 화채 한사바리 어떠세요?',0,0,0,1,0,'2023-08-18T11:30:00','더운 여름 시원하게 화채 만들어요~','수박 1/4통,천도복숭아 1개,블루베리 한 줌,산딸기 한 줌,라임 반개(생략가능),우유 1컵,사이다 1컵,올리고당 1큰술,얼음',6,1000,NULL,'https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/lesson/6a91877a-0a1a-4cb6-b431-3265c8356460%ED%99%94%EC%B1%84.jpeg',60,'',7),(6,'2023-08-17 23:23:47.930266','2023-08-17 23:26:46.004764','cookyer','희쿠커','요즘 날씨가 많이 더운데 여러분은 어떻게 더위를 나고 계시나요? 시원하게 화채 한사바리 어떠세요?',0,0,0,1,0,'2023-08-17T23:50:00','더운 여름 시원하게 화채 만들어요~','수박 1/4통,천도복숭아 1개,블루베리 한 줌,산딸기 한 줌,라임 반개(생략가능),우유 1컵,사이다 1컵,올리고당 1큰술,얼음',6,1000,NULL,'https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/lesson/baef16f0-408e-4c4d-817e-9b0f67112efb%ED%99%94%EC%B1%84.jpeg',60,'',7),(7,'2023-08-18 00:00:57.656630','2023-08-18 08:59:56.203519','cookyer','희쿠커','탄수화물로부터 벗어난 칼로리가 적은 채식 파스타를 소개 합니다.',0,0,0,0,0,'2023-08-19T17:30:00','건강해지는 포두부파스타','포두부 구매1/2봉지,대추토마토 3-4개,느타리버섯 4-5개,브로콜리 구매10-15g,레몬 구매1/2개,토판염 ( 천일염 ) 취향껏,후추가루 ( 캄폿 흑후추 ) 취향껏,생바질,바질오일',3,15000,NULL,'https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/lesson/2e44980f-fb38-4989-884f-5f52e53d5a5bpopo.jpg',90,'',6),(8,'2023-08-18 00:47:06.296004','2023-08-18 04:34:46.291390','cookyer1','백종원이에유','부모님 생신 날에 직접 만든 미역국을 끓여주시는 거 어떠세유.',0,0,0,1,0,'2023-08-18T04:30:00','생일 미역국 직접 만들어보아씨일로와봐유','소고기(양지) 1/2컵,자른미역 1/3컵,참기름 2큰술,국간장 3큰술,다진마늘 2/3큰술,멸치액젓 1과1/2큰술,물 약7컵',6,50000,'tBokGwloZwky6jA','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/lesson/d4b47a31-2d09-4cc3-be6f-2f14662f6b9dg1zZE6XkQ4n7mpw2H7bsrF2JxLfUsoEcpYiYwJB62_U1nOoHQIk-ggl9qK2cXWsQ_-8Vm-IsksS5y4C8awDg5WPZbtNoRAmHpzB9Ikrr4fdgbAQnKMClgiUrduEFim8oStS_O9MFtXVQW7BQmDddhg.webp',120,'https://www.youtube.com/watch?v=xsTFsunt6-8',1),(9,'2023-08-18 01:10:00.952017','2023-08-18 04:29:32.015620','cookyer1','백종원이에유','냉장고에 먹을 게 없을 때, 간편하고 든든하게 김치볶음밥 어떠세요?\r\n',0,0,0,1,0,'2023-08-18T04:00:00','간편한 한 끼 식사, 김치볶음밥!','김치 한 컵,밥 한공기,계란 1개,간장 한스푼,고춧가루 한스푼,설탕 반스푼 혹은 식초 반스푼,스팸이나 햄(선택)',4,30000,'SxeCK5xyvPtPRY9','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/lesson/0c44e421-12a5-4401-a992-0bfb9b8edc65PAltRkStXL2xP9zLaENy9uuFnbueTrLKVv39DPnUQiJPBaS2AfSrlqayje48qNqhqDZdimFNdrXYpPKko1U1B220GA3DntDJj46S3wGomN_ryNY-b9Iyxq8zhAy2EXcJEqokKJjL8RP15Txw9h1XPg.webp',60,'https://www.youtube.com/watch?v=eIo2BaE6LxI',1),(10,'2023-08-18 01:13:12.227057','2023-08-18 01:13:12.227057','cookyer3','쿠킹파파','달달하고 부드러운 티라미수, 집에서 직접 만들어서 먹을 수 있어요!\r\n',2,0,0,0,0,'2023-08-22T00:00:00','오후에 먹기 좋은 티라미수 만들기','휘핑크림 200ml,계란 노른자 2개,설탕 2스푼,필라델피아 크림치즈 200g,카누미니 3봉지(27g),물 100ml,카스테라빵 2개(360g),코코아파우더',6,70000,NULL,'https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/lesson/414075b8-e464-4a86-9f72-33e8f1a8d699u6cKDQjrYEpXzTIACd9zJSvFv3ya_OkYuVZkhKj7v-xICXUJ6DNOb1tkDO7N13AZ_cJFHC7V5EGJRcDU_YnnJRY4egOLdHDcwhQOi-cG5K2s4cgd0m7PdPbjGZLdNc0O7xnJ7b2iaGfRJuOxyNE2DA.webp',90,'https://www.youtube.com/watch?v=2FsHfvXrx4g',7),(11,'2023-08-18 01:23:53.156282','2023-08-18 01:27:53.698604','cookyer2','골든램지','쉽게 만들 수 있는 비건식 요리, 비건 단호박크림 두부면 파스타 함께 만들어보아요!\r\n',1,0,0,0,0,'2023-09-06T17:30:00','쉽게 만들 수 있는 비건식 요리, 비건 단호박크림 두부면 파스타','두부면 1인분,단호박 1개,식물성 크림,브로콜리,양파 반 개,파프리카 반 개,오리엔탈 소스',4,35000,NULL,'https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/lesson/a5c11d75-e372-4025-a31e-54bdec0a7da131fcc2a3e0559b09ea524c622ea8a0dd1.jpg',60,'https://www.youtube.com/watch?v=VOKZDnT60Fo',2),(12,'2023-08-18 01:32:40.448866','2023-08-18 01:38:00.981909','cookyer4','쿡크하세요쿡크','간단한 샌드위치 만들어서 주말 아침에 우아하고 느긋하게 브런치를 즐겨보아요!\r\n',0,0,0,0,0,'2023-08-26T10:00:00','샌드위치로 브런치 해결해요~','식빵 2장,토마토 반 개,상추,계란 한 개,슬라이스 햄,머스타드 한 스푼,마요네즈 한 스푼',3,27500,NULL,'https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/lesson/99e58d8b-bf0c-40aa-af51-ef19415a77706d6941d611d34c90c5dc19f4d67c857a1.jpg',60,'https://www.youtube.com/watch?v=RvDu833RSek',7);
/*!40000 ALTER TABLE `lesson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson_category`
--

DROP TABLE IF EXISTS `lesson_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson_category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson_category`
--

LOCK TABLES `lesson_category` WRITE;
/*!40000 ALTER TABLE `lesson_category` DISABLE KEYS */;
INSERT INTO `lesson_category` VALUES (1,'한식'),(2,'양식'),(3,'중식'),(4,'일식'),(5,'아시안'),(6,'건강식'),(7,'디저트');
/*!40000 ALTER TABLE `lesson_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson_participant`
--

DROP TABLE IF EXISTS `lesson_participant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson_participant` (
  `lesson_participant_id` int NOT NULL AUTO_INCREMENT,
  `created_date` datetime(6) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL,
  `is_completed` bit(1) NOT NULL,
  `is_leave_chat` bit(1) NOT NULL,
  `lesson_id` int DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`lesson_participant_id`),
  KEY `FK4wj8p73vlsmwy8bhbnyju4lu2` (`lesson_id`),
  KEY `FKos8ole16wj1byf28iowqd6xq6` (`user_id`),
  CONSTRAINT `FK4wj8p73vlsmwy8bhbnyju4lu2` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`lesson_id`),
  CONSTRAINT `FKos8ole16wj1byf28iowqd6xq6` FOREIGN KEY (`user_id`) REFERENCES `member` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson_participant`
--

LOCK TABLES `lesson_participant` WRITE;
/*!40000 ALTER TABLE `lesson_participant` DISABLE KEYS */;
INSERT INTO `lesson_participant` VALUES (1,'2023-08-17 22:27:44.713070','2023-08-17 22:27:44.713070',_binary '',_binary '\0',1,'cookyer'),(2,'2023-08-17 22:35:43.665110','2023-08-17 22:35:43.665110',_binary '',_binary '\0',1,'yeji'),(3,'2023-08-17 22:41:08.146388','2023-08-17 22:41:08.146388',_binary '',_binary '\0',1,'gihong'),(4,'2023-08-17 22:42:26.974356','2023-08-17 23:30:28.778539',_binary '',_binary '',1,'suwon'),(5,'2023-08-17 22:43:25.574704','2023-08-17 22:43:25.574704',_binary '',_binary '\0',1,'sua926'),(6,'2023-08-17 22:49:16.328286','2023-08-17 22:49:16.328286',_binary '\0',_binary '\0',2,'sucook926'),(7,'2023-08-17 22:52:23.234489','2023-08-17 22:52:23.234489',_binary '\0',_binary '\0',3,'sucook926'),(8,'2023-08-17 22:58:38.411378','2023-08-17 22:58:38.411378',_binary '\0',_binary '\0',4,'sucook926'),(9,'2023-08-17 23:05:58.768370','2023-08-17 23:05:58.768370',_binary '\0',_binary '\0',5,'cookyer'),(11,'2023-08-17 23:23:47.936001','2023-08-17 23:23:47.936001',_binary '\0',_binary '\0',6,'cookyer'),(12,'2023-08-17 23:24:38.375554','2023-08-17 23:24:38.375554',_binary '\0',_binary '\0',6,'suwon'),(13,'2023-08-17 23:25:46.201168','2023-08-17 23:25:46.201168',_binary '\0',_binary '\0',3,'sua926'),(14,'2023-08-17 23:27:35.207649','2023-08-17 23:27:35.207649',_binary '\0',_binary '\0',5,'yeji'),(15,'2023-08-17 23:28:12.133822','2023-08-17 23:30:23.966157',_binary '\0',_binary '',5,'suwon'),(16,'2023-08-18 00:00:57.661476','2023-08-18 00:00:57.661476',_binary '\0',_binary '\0',7,'cookyer'),(17,'2023-08-18 00:47:06.303294','2023-08-18 00:47:06.303294',_binary '\0',_binary '\0',8,'cookyer1'),(18,'2023-08-18 01:10:00.958263','2023-08-18 01:10:00.958263',_binary '\0',_binary '\0',9,'cookyer1'),(19,'2023-08-18 01:13:12.236143','2023-08-18 01:13:12.236143',_binary '\0',_binary '\0',10,'cookyer3'),(20,'2023-08-18 01:23:53.161827','2023-08-18 01:23:53.161827',_binary '\0',_binary '\0',11,'cookyer2'),(21,'2023-08-18 01:32:40.454771','2023-08-18 01:32:40.454771',_binary '\0',_binary '\0',12,'cookyer4'),(22,'2023-08-18 02:07:37.309151','2023-08-18 02:07:37.309151',_binary '\0',_binary '\0',9,'heecookiee'),(23,'2023-08-18 02:08:46.220228','2023-08-18 02:08:46.220228',_binary '\0',_binary '\0',3,'cookiee1'),(24,'2023-08-18 02:09:35.744890','2023-08-18 02:09:35.744890',_binary '\0',_binary '\0',9,'cookiee1'),(25,'2023-08-18 02:10:05.958242','2023-08-18 02:10:05.958242',_binary '\0',_binary '\0',12,'cookiee1'),(26,'2023-08-18 02:10:50.049352','2023-08-18 02:10:50.049352',_binary '\0',_binary '\0',8,'cookiee1'),(27,'2023-08-18 02:11:25.663566','2023-08-18 02:11:25.663566',_binary '\0',_binary '\0',10,'cookiee1'),(28,'2023-08-18 02:12:33.772914','2023-08-18 02:12:33.772914',_binary '\0',_binary '\0',7,'cookiee2'),(29,'2023-08-18 02:13:07.527523','2023-08-18 02:13:07.527523',_binary '\0',_binary '\0',2,'cookiee2'),(30,'2023-08-18 02:13:39.387124','2023-08-18 02:13:39.387124',_binary '\0',_binary '\0',11,'cookiee2'),(31,'2023-08-18 02:15:06.084938','2023-08-18 02:15:06.084938',_binary '\0',_binary '\0',10,'cookiee2'),(32,'2023-08-18 02:16:31.420893','2023-08-18 02:16:31.420893',_binary '\0',_binary '\0',7,'cookiee3'),(33,'2023-08-18 02:17:34.801039','2023-08-18 02:17:34.801039',_binary '\0',_binary '\0',8,'cookiee3'),(34,'2023-08-18 02:35:30.450813','2023-08-18 02:35:30.450813',_binary '\0',_binary '\0',9,'cookiee4'),(35,'2023-08-18 02:36:05.586947','2023-08-18 02:36:05.586947',_binary '\0',_binary '\0',12,'cookiee4'),(36,'2023-08-18 02:37:06.801820','2023-08-18 02:37:06.801820',_binary '\0',_binary '\0',10,'cookiee5'),(37,'2023-08-18 02:37:41.526377','2023-08-18 02:37:41.526377',_binary '\0',_binary '\0',11,'cookiee5'),(38,'2023-08-18 02:38:34.460599','2023-08-18 02:38:34.460599',_binary '\0',_binary '\0',2,'cookiee6'),(39,'2023-08-18 02:39:05.902557','2023-08-18 02:39:05.902557',_binary '\0',_binary '\0',3,'cookiee6');
/*!40000 ALTER TABLE `lesson_participant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson_step`
--

DROP TABLE IF EXISTS `lesson_step`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson_step` (
  `lesson_step_id` int NOT NULL AUTO_INCREMENT,
  `step_content` varchar(255) DEFAULT NULL,
  `step_order` int NOT NULL,
  `lesson_id` int DEFAULT NULL,
  PRIMARY KEY (`lesson_step_id`),
  KEY `FKl6nj2hj3tngms5xsuyglg0vb4` (`lesson_id`),
  CONSTRAINT `FKl6nj2hj3tngms5xsuyglg0vb4` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`lesson_id`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson_step`
--

LOCK TABLES `lesson_step` WRITE;
/*!40000 ALTER TABLE `lesson_step` DISABLE KEYS */;
INSERT INTO `lesson_step` VALUES (5,'텐동소스부터 만들께요 위에 적어놓은 재료를 냄비에 넣어주세요',1,2),(6,'보글보글 끓으면 불을 꺼준뒤 식혀줍니다',2,2),(7,'모든재료는 튀겨주세요',3,2),(8,'밥위에 텐동소스 뿌리기',4,2),(9,'밥 한공기 기준 설탕0.5, 소금0.5, 식초1, 참기름 0.5를 넣고 골고루 섞어준다',1,3),(10,'김 한장을 깔고 그 위에 간해둔 밥알을 김전체 면적에 얇게 펴준다',2,3),(11,'사과와 오이위에 깻잎을 두장깔고 그 위로 크래미를 올려준다',3,3),(14,'→끓는 물에 우동면 삶기 →찬물에 헹구기',1,4),(15,'드레싱뿌리기',2,4),(16,'수박과 복숭아를 한 입 크기로 썬다',1,5),(17,'블루베리와 산딸기를 깨끗이 씻어 물기를 닦는다',2,5),(18,'우유와 사이다, 올리고당을 섞는다',3,5),(19,'그릇에 과일과 우유를 넣어 섞고 기호에 따라 얼음을 추가한다',4,5),(24,'수박과 복숭아를 한 입 크기로 썬다',1,6),(25,'블루베리와 산딸기를 깨끗이 씻어 물기를 닦는다',2,6),(26,'우유와 사이다, 올리고당을 섞는다',3,6),(27,'그릇에 과일과 우유를 넣어 섞고 기호에 따라 얼음을 추가한다',4,6),(28,'수박과 복숭아를 두 입 크기로 썬다',1,1),(29,'블루베리와 산딸기를 깨끗이 씻어 물기를 닦는다',2,1),(30,'우유와 사이다, 올리고당을 섞는다',3,1),(31,'그릇에 과일과 우유를 넣어 섞고 기호에 따라 얼음을 추가한다',4,1),(38,'미역은 물에 불려 준비한다. ',1,8),(39,'냄비에 참기름을 두르고 소고기를 넣어 중약불에서 볶아준다.',2,8),(40,'소고기가 익으면 불린 미역을 넣어 함께 볶아준다.',3,8),(41,'볶아진 미역에 국간장을 넣어 볶고 물을 넣어 끓여준다.',4,8),(42,'물이 끓으면 다진 마늘을 넣어 끓여준다.',5,8),(43,'마지막에 액젓을 이용하여 간을 맞춰 완성한다.',6,8),(44,'팬에 기름을 두르고 김치를 볶아유',1,9),(45,'신김치라면 설탕 반스푼을 넣고 안익은 김치라면 식초 반스푼을 넣어유',2,9),(46,'스팸이나 햄을 넣고 볶다가 간장과 고춧가루를 넣고 볶아유',3,9),(47,'밥도 같이 넣고 볶은 후에 그릇에 담고 계란후라이를 올려유',4,9),(48,'크림치즈는 핸드믹서로 부드럽게 풀어주세요	',1,10),(49,'생크림은 설탕을 넣고 핸드믹서로 휘핑해주세요	',2,10),(50,'단단하게 휘핑한 생크림에 크림치즈를 넣고 잘 섞어주세요	',3,10),(51,'카스테라빵을 컵 밑면에 넣고 커피를 윗면 부어 적셔주세요	',4,10),(52,'인스턴트 커피에 뜨거운 물을 넣고 잘 풀어주세요	',5,10),(53,'크림을 위에 부어준 뒤에 카스테라 빵을 올리고 커피을 다시 부어주고 다시 크림으로 덮어주세요	',6,10),(54,'윗면을 칼로 매끈하게 만들어주세요	',7,10),(55,'코코아가루를 윗면에 뿌려주세요 냉장고에 넣고 굳혀주세요	',8,10),(68,'팬에 올리브유를 두르고 마늘과 양파를 넣어 볶는다.',1,11),(69,'마늘과 양파가 익으면 파프리카와 닭가슴살 소세지를 넣어 볶는다.',2,11),(70,'재료가 노릇노릇해지면 디벨라 토마토 퓨레와 청양고추를 넣어 볶는다.',3,11),(71,'두부면을 넣어서 섞고 후추를 뿌려 마무리한다.',4,11),(77,'냄비에 물과 약간의 소금을 넣고 달걀을 15분간 삶아서 바로 찬물에 넣어 식힌 후 껍질을 벗겨주세요. 토마토는 0.7cm 두께로 둥글게 썰고 키친타월로 물기를 제거해주세요.',1,12),(78,'적양파는 얇게 채 썰고 양상추는 한 장씩 뜯어서 찬물에 담갔다가 물기를 뺍니다. 피클은 잘게 다져서 준비해주세요.',2,12),(79,'달걀흰자는 굵게 다지고, 노른자는 체에 곱게 내려주세요. 볼에 달걀, 피클, 소스 재료를 넣고 잘 섞어주세요.',3,12),(80,'스프레드 재료를 섞어 빵 한 쪽에 바른 후 양상추-STEP3-적양파-토마토-무순 순으로 올려주세요. 빵으로 덮고 가볍게 누른 후 반으로 잘라주세요.',4,12),(81,'완성된 요리를 그릇에 담아 마무리해주세요.',5,12),(82,'2저는 이렇게 작은 도마를 자 대신에 놓고서 칼로 제가 좋아하는 탈리아텔레 폭과 비슷하게 자르고',1,7),(83,'선 잘 달궈진 후라이팬에 바질오일을 두르고',2,7),(84,'이제 맛을 내기 위해서 레몬 즙도 내서 넣고 토판염으로 간도 하고 취향껏 후추도 뿌려서 맛을 냅니다.',3,7);
/*!40000 ALTER TABLE `lesson_step` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `user_id` varchar(255) NOT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL,
  `food` varchar(255) DEFAULT NULL,
  `introduce` varchar(255) DEFAULT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `profile_img` varchar(255) DEFAULT NULL,
  `role` int DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `user_pw` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES ('cookiee1','2023-08-18 00:21:03.238433','2023-08-18 03:25:01.444809','6','내가만든 쿠키~','너를위해굽지','01057483933','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/profile/e421bff6-00f9-4197-a5e7-4ca2fb5539edpasta-1181189_640.jpg',2,'cookiee@naver.com','$2a$10$Mxoizm1Xkal5nukmKivXbuqO0B2qmnq1PM1m41Pnkn7XPtNyzPBmK'),('cookiee10','2023-08-18 00:42:45.725357','2023-08-18 03:31:14.289176','1','버거왕이랑 결혼할래요','버거퀸','01054547878','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/profile/7d1b4e26-76e4-4bb0-b812-2a7668537032woman-1979272_1280.jpg',2,'burgerqueen@daum.net','$2a$10$XscKg/YVSZKXgId4jrIb9O7DKW0IqmZ3eH4a6wl3Zxd3depFlM6CW'),('cookiee2','2023-08-18 00:22:58.868381','2023-08-18 03:25:34.053862','5','단백질이 가득한 요리를 만들고 싶습니다','프로틴중독자','01098754321','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/profile/a62fe684-a56a-449b-8f0e-1e545153f206pizza-2589575_640.jpg',2,'onlymuscle@hanmail.net','$2a$10$njV4CNwycv5LHbC.zoSDQ./BV30IoBH95LUPeZV0GpT/We/PkRZ..'),('cookiee3','2023-08-18 00:25:25.596033','2023-08-18 03:27:23.380557','','라면도 못끓여요 ㅠㅠ','','01054321123','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/profile/3fdbd6b2-c20e-464d-bc1b-8894201c2cecshish-kebab-417994_640.jpg',2,'yorihard@naver.com','$2a$10$4FHGuIvIGTgZc/T9x97OEuV7IVR2pJKllfz87TRthFQLNjdGRcsOu'),('cookiee4','2023-08-18 00:26:54.210435','2023-08-18 03:28:14.151786','5,2','하늘을 날 만큼 요리를 잘 하고 싶어요','요리왕익룡','01054312342','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/profile/c23b8697-fad1-46af-b498-2ad40adb54f1spices-1191945_640.jpg',2,'cookking@gmail.com','$2a$10$ap.oHxl2yl3FaAfK1qFu3e9LrqMZpfbzAG6HPbdhdIxlHaPqesHQK'),('cookiee5','2023-08-18 00:30:07.128303','2023-08-18 00:30:07.128303','2',NULL,'내혈관에마라탕이','01099998888',NULL,2,'spicy@naver.com','$2a$10$Bkyb7KRpSekZwNyj54fg3uHAcuWrmGfdsDrEIdCS7392.pFWyJN9S'),('cookiee6','2023-08-18 00:32:55.099845','2023-08-18 00:32:55.099845','4,3,2',NULL,'안고독한미식가','01067895432',NULL,2,'manyfriends@naver.com','$2a$10$GIig9wkVseorYHWU70o1W.RZ8/TEkmS7IZJPd8.WHSoO.hENfPrWm'),('cookiee7','2023-08-18 00:34:31.773672','2023-08-18 03:28:40.645322','0','솔직히 싸밥 너무 맛있어요','싸밥먹으러싸피옴','01078906543','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/profile/ecb85bdf-6014-47c7-9f25-638394139790spices-2548653_640.jpg',2,'baegopa@hanmai.net','$2a$10$WBuvJc8JLZpfWqdBtzGtF.l.3Jy1jvUZmsxnwSwTOeG1Mve5E62bm'),('cookiee8','2023-08-18 00:36:58.960907','2023-08-18 03:29:10.794893','4','라면인건가~ 라면인건가오~ 라면인건가~야~','오늘도라면인건가','01077778888','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/profile/a566d3ab-ecdb-49f9-b55a-fa04ca3318b8vegetables-1006694_640.jpg',2,'naruto@hanmail.net','$2a$10$GJ0IoeGc4beES3hT/6THJ.LZu76/3hiTGG2pIGLQT/hFXQCu4bXcS'),('cookiee9','2023-08-18 00:41:03.022425','2023-08-18 03:29:44.920654','0,1,2,3,4,5,6','더이상 올라갈 곳이 없다. 나를 쓰러트릴자 누구인가?','푸드파이팅유단자','01065454545','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/profile/7b163965-0827-4cbe-8aff-3cd511a63098vegetables-1212845_640.jpg',2,'foodfighter@naver.com','$2a$10$FvJtzeYMYUX2PzZ8wU/1w.n8wKrUd2Vtbmq7o1KZPzGHxVJSwnmWy'),('cookyer','2023-08-17 22:24:17.479899','2023-08-18 00:08:13.047396','0,6','안녕하세요 저는 희쿠커라고해요 희희','희쿠커','0103423423','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/profile/fa7446ca-44b7-41e8-b626-cf6709606224foodddd.jpg',1,'ere@naver.com','$2a$10$h1sCkwfNcsQXOYUQQyWbs.9shwkQKSpv5ouyvNECFaAYElVbfwxoK'),('cookyer1','2023-08-18 00:11:13.741974','2023-08-18 03:21:36.456010','0,2,3','잘부탁 드립니다!','백종원이에유','01012345678','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/profile/92a380c7-6ef2-4f34-83d7-238a05cfeff4bread-2589595_640.jpg',1,'baik@naver.com','$2a$10$Vza3680g1gASohNUtG5K9eKu6DDN/enEa79HlFlCEcNvdUJnj5o0S'),('cookyer2','2023-08-18 00:12:03.272509','2023-08-18 03:22:06.474208','4,5,6','황금같은 요리사 골든램지입니다!','골든램지','01056781234','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/profile/e9b78c85-378c-4933-8a4d-208adec05b32cooking-2132874_640.jpg',1,'ilovegold@gmail.com','$2a$10$iYOnLgItbuTZ3G4saO4k8uHjT4XqQoehwvvvFsjSCyauEnp6uNqWm'),('cookyer3','2023-08-18 00:15:24.328523','2023-08-18 03:22:47.421218','5,3,1','아빠의 손맛으로 요리하겠습니다','쿠킹파파','01013131313','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/profile/4651b6a2-d49c-4f83-843f-20ee6d14d6dfgarlic-2556022_640.jpg',1,'imyourfather@daum.net','$2a$10$VOgejekl8R4tnYK.w8YfY.Cr7DV8mNOzqvJHTAe.xDfv9y4OdcGyS'),('cookyer4','2023-08-18 00:17:10.114036','2023-08-18 03:23:12.269692','3,2,4','밥솥 아닙니다~','쿡크하세요쿡크','01054321987','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/profile/1dafebf1-f82d-4dcf-a4af-935a04c67edakettles-2178442_640.jpg',1,'cookcreategood@gmail.com','$2a$10$ysQ6A5TanVi4iVCOeA31huiIPK/l29G7bXYLnNBJwgEZwHf/2oYwy'),('cookyer5','2023-08-18 00:19:27.724048','2023-08-18 03:24:25.270380','0,1,4','안녕하세요~~','이제바질을곁들인','01098765432','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/profile/b6a99274-0d95-44a3-a2a4-ddba90535ae7man-890885_640.jpg',1,'choi-gang@yahoo.net','$2a$10$jMqh.lU.ITNroslW4YB4JufHas2imnmFyhwvR6qmC5xPfUvfEIHwC'),('gihong','2023-08-17 22:40:25.311281','2023-08-17 22:40:25.311281','0,1,2',NULL,'김요똥','01012345678',NULL,2,'yo-al-mot@naver.com','$2a$10$Z1beLHDGHmG1fDvhGrcIS.x.w127mG6XUwSb4r/lm1UQwQBrqqvf.'),('heecookiee','2023-08-18 02:03:02.750694','2023-08-18 02:03:02.750694','0',NULL,'heecook','01012345678',NULL,2,'heecookiee@ssafy.com','$2a$10$wA2iWaoAsx46Rjpeeejngein3mfp8uKPHaPBFg4w1VncjHuTlu9AS'),('heera','2023-08-18 01:45:40.549900','2023-08-18 01:45:40.549900','',NULL,'heera','',NULL,2,'','$2a$10$7ynAooY2ITq94KBCfhG3y.oAoQs26sNYsoq0M9W2mYeKVhfplOpky'),('sua926','2023-08-17 22:42:54.989058','2023-08-17 23:26:48.167415','5,6,1','안녕하세요!! 저는 밀푀유나뵈를 좋아하는 밀곰이애오','sua926','0102349824','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/profile/dd8347c0-2957-470a-89a7-d03771157bdbfoooooooooo.jpg',2,'fedfs@naver.com','$2a$10$3FN9VcTSMAm179dpNiSVSuVxO0El9rvMhspMuwOtcVWeL/LfK3GQq'),('sucook926','2023-08-17 22:45:14.279312','2023-08-17 23:20:19.388255','3,5','안녕하세요 저는 일식 경력 3년차의 요리사 sucook926입니다','sucocok9','0103242345','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/profile/ee3cdb1f-0b49-45e2-9e83-9ee1f64b10fdcalifo.jpg',1,'dfsf@naver.com','$2a$10$I.F0kY2N0w9UxxmGv8e6oOfBUNGSgTMf9GYMHmgahjnsh45rd9M42'),('suwon','2023-08-17 22:41:28.793708','2023-08-18 09:00:37.193649','5,6','경기도 수원시 팔달구에 거주중인 양수원입니다','경기도수원시','0103423442','https://mmtbucket-s3.s3.ap-northeast-2.amazonaws.com/profile/a89db213-3ae8-40dc-b9c5-e3ceb992ff5budo.jpg',2,'sdf@naver.com','$2a$10$AfVRXh/ZHNwJSidFHoqHjOB61tNatheMAJavk.5IW0e4DaHbSs1rq'),('test','2023-08-18 01:46:39.294828','2023-08-18 01:46:39.294828','',NULL,'test','',NULL,2,'','$2a$10$VH0R.o7CIt7Jxbh729YFUelJFmA9jBYnCrBRTODILZMvWHg7WkRA2'),('yeji','2023-08-17 22:35:04.134382','2023-08-17 22:35:04.134382','0',NULL,'요리짱','',NULL,2,'','$2a$10$Lc/ZZIkQKG.8HWRSr7PRBehnxSpbhdK37QtgBm3T40h35mg4ciY5q');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_history`
--

DROP TABLE IF EXISTS `payment_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_history` (
  `payment_id` int NOT NULL,
  `approved_at` datetime(6) DEFAULT NULL,
  `canceled_at` datetime(6) DEFAULT NULL,
  `pay_status` int DEFAULT NULL,
  `total_amount` int NOT NULL,
  `lesson_id` int DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `FK3obdhljc631a88g6bsd5yu99i` (`lesson_id`),
  KEY `FKdn9pr71ha5wgrareb76lfjkpp` (`user_id`),
  CONSTRAINT `FK3obdhljc631a88g6bsd5yu99i` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`lesson_id`),
  CONSTRAINT `FKdn9pr71ha5wgrareb76lfjkpp` FOREIGN KEY (`user_id`) REFERENCES `member` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_history`
--

LOCK TABLES `payment_history` WRITE;
/*!40000 ALTER TABLE `payment_history` DISABLE KEYS */;
INSERT INTO `payment_history` VALUES (1,'2023-08-17 22:35:43.000000',NULL,3,1000,1,'yeji'),(2,'2023-08-17 22:41:07.000000',NULL,3,1000,1,'gihong'),(3,'2023-08-17 22:42:26.000000','2023-08-17 23:27:37.000000',4,1000,1,'suwon'),(4,'2023-08-17 22:43:25.000000',NULL,3,1000,1,'sua926'),(5,'2023-08-17 23:12:51.000000','2023-08-17 23:27:34.000000',4,1000,5,'suwon'),(6,'2023-08-17 23:24:38.000000','2023-08-17 23:27:32.000000',4,1000,6,'suwon'),(7,'2023-08-17 23:25:45.000000',NULL,3,10000,3,'sua926'),(8,NULL,NULL,0,1000,5,'yeji'),(9,'2023-08-17 23:27:35.000000',NULL,3,1000,5,'yeji'),(10,'2023-08-17 23:28:11.000000',NULL,3,1000,5,'suwon'),(47,'2023-08-18 02:07:35.000000',NULL,3,30000,9,'heecookiee'),(48,'2023-08-18 02:08:45.000000',NULL,3,10000,3,'cookiee1'),(49,'2023-08-18 02:09:35.000000',NULL,3,30000,9,'cookiee1'),(50,'2023-08-18 02:10:05.000000',NULL,3,27500,12,'cookiee1'),(51,'2023-08-18 02:10:49.000000',NULL,3,50000,8,'cookiee1'),(52,'2023-08-18 02:11:25.000000',NULL,3,70000,10,'cookiee1'),(53,'2023-08-18 02:12:33.000000',NULL,3,15000,7,'cookiee2'),(54,'2023-08-18 02:13:07.000000',NULL,3,20000,2,'cookiee2'),(55,'2023-08-18 02:13:39.000000',NULL,3,35000,11,'cookiee2'),(56,'2023-08-18 02:15:05.000000',NULL,3,70000,10,'cookiee2'),(57,'2023-08-18 02:16:31.000000',NULL,3,15000,7,'cookiee3'),(58,'2023-08-18 02:17:34.000000',NULL,3,50000,8,'cookiee3'),(59,NULL,NULL,1,30000,9,'cookiee4'),(60,'2023-08-18 02:35:30.000000',NULL,3,30000,9,'cookiee4'),(61,'2023-08-18 02:36:05.000000',NULL,3,27500,12,'cookiee4'),(62,'2023-08-18 02:37:06.000000',NULL,3,70000,10,'cookiee5'),(63,'2023-08-18 02:37:41.000000',NULL,3,35000,11,'cookiee5'),(64,'2023-08-18 02:38:34.000000',NULL,3,20000,2,'cookiee6'),(65,'2023-08-18 02:39:05.000000',NULL,3,10000,3,'cookiee6'),(66,NULL,NULL,2,10000,3,'suwon'),(67,NULL,NULL,0,10000,3,'suwon'),(68,NULL,NULL,0,10000,3,'suwon');
/*!40000 ALTER TABLE `payment_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `created_date` datetime(6) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL,
  `rating` float NOT NULL,
  `review_contents` varchar(255) DEFAULT NULL,
  `lesson_id` int DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  KEY `FKap6dvmf94mv603qyjyydvbwba` (`lesson_id`),
  KEY `FKftigstljpbfi7sken0ai131nk` (`user_id`),
  CONSTRAINT `FKap6dvmf94mv603qyjyydvbwba` FOREIGN KEY (`lesson_id`) REFERENCES `lesson` (`lesson_id`),
  CONSTRAINT `FKftigstljpbfi7sken0ai131nk` FOREIGN KEY (`user_id`) REFERENCES `member` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (2,'2023-08-18 02:09:31.083762','2023-08-18 09:01:42.703414',4.5,'희쿠커의 화채는 최고!\n더위가 싹 달아나는 맛이였어요!!! ',1,'suwon'),(3,'2023-08-18 04:28:57.028389','2023-08-18 04:28:57.028389',4,'오늘 과외 너무너무 좋았어요! 그런데 똑같이 따라하니까 약간 짠 것 같아요... 그것만 빼곤 좋았습니다!',9,'cookiee1'),(4,'2023-08-18 04:32:47.488116','2023-08-18 04:32:47.488116',5,'너무 맛있었어요! 요리왕에 한 발자국 더 나아간 것 같아요',9,'cookiee4'),(5,'2023-08-18 04:35:50.698694','2023-08-18 04:35:50.698694',5,'어머니가 끓여주시던 미역국 맛이 납니다... 너무 맛있어요',8,'cookiee1');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-18  9:01:55
