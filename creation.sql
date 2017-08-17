CREATE TABLE `Client` (
  `idClient` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `houseNum` varchar(45) NOT NULL,
  `street` varchar(45) NOT NULL,
  `city` varchar(45) NOT NULL,
  `state` varchar(2) NOT NULL,
  `zip` varchar(12) NOT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idClient`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

CREATE TABLE `Dog` (
  `idDog` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `breed` varchar(45) DEFAULT NULL,
  `fk_idClient` int(11) DEFAULT NULL,
  PRIMARY KEY (`idDog`),
  KEY `owner` (`fk_idClient`),
  CONSTRAINT `owner` FOREIGN KEY (`fk_idClient`) REFERENCES `Client` (`idClient`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

CREATE TABLE `Package` (
  `idPackage` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `cost` decimal(10,0) NOT NULL,
  `numIncludedSessions` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idPackage`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

CREATE TABLE `Package_contents` (
  `fk_idPackage` int(11) NOT NULL,
  `fk_idPlan` int(11) NOT NULL,
  KEY `fk_idPackage_idx` (`fk_idPackage`),
  KEY `fk_idPlan_idx` (`fk_idPlan`),
  CONSTRAINT `fk_idPackage` FOREIGN KEY (`fk_idPackage`) REFERENCES `Package` (`idPackage`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_idPlan` FOREIGN KEY (`fk_idPlan`) REFERENCES `Plan` (`idPlan`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Plan` (
  `idPlan` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` longtext NOT NULL,
  PRIMARY KEY (`idPlan`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

CREATE TABLE `Session` (
  `idSession` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `length` decimal(10,0) DEFAULT NULL,
  `fk_idClient` int(11) NOT NULL,
  `fk_idPlanTaught` int(11) DEFAULT NULL,
  PRIMARY KEY (`idSession`),
  KEY `idClient_idx` (`fk_idClient`),
  KEY `fk_idPlanTaught_idx` (`fk_idPlanTaught`),
  CONSTRAINT `fk_idClient` FOREIGN KEY (`fk_idClient`) REFERENCES `Client` (`idClient`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_idPlanTaught` FOREIGN KEY (`fk_idPlanTaught`) REFERENCES `Plan` (`idPlan`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;