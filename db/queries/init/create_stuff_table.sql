CREATE TABLE `stuff` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `item` VARCHAR(45) NOT NULL,
  `quantity` INT NOT NULL,
  `status` VARCHAR(45) NOT NULL,
  `description` VARCHAR(150) NULL,
  PRIMARY KEY (`id`)
);