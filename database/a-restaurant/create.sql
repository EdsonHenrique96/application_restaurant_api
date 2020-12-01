USE goomer;

CREATE TABLE IF NOT EXISTS `restaurant` (
  `id` VARCHAR(36) NOT NULL,
  `photo` VARCHAR(255) DEFAULT '',
  `name` VARCHAR(255) NOT NULL,
  `adress` VARCHAR(255) NOT NULL,
  `bussiness_hours` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
);