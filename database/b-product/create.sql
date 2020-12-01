USE goomer;

CREATE TABLE IF NOT EXISTS `product` (
  `id` VARCHAR(36) NOT NULL,
  `photo` VARCHAR(255) DEFAULT '',
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `category` VARCHAR(255) NOT NULL,
  `promoDescription` VARCHAR(255) DEFAULT NULL,
  `promoPrice` DECIMAL(10,2) DEFAULT NULL,
  `promoPeriod` VARCHAR(255) DEFAULT NULL,
  `restaurantId` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`restaurantId`) REFERENCES restaurant(`id`)
);