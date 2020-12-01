USE goomer;

CREATE TABLE IF NOT EXISTS `restaurant` (
  `id` VARCHAR(36) NOT NULL,
  `photo` VARCHAR(255) DEFAULT '',
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `businessHours` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
);