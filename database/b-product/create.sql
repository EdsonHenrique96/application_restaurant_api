USE goomer;

CREATE TABLE IF NOT EXISTS `product` (
  `id` VARCHAR(36) NOT NULL,
  `photo` VARCHAR(255) DEFAULT '',
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `category` VARCHAR(255) NOT NULL,
  `promo_description` VARCHAR(255) DEFAULT NULL,
  `promo_price` DECIMAL(10,2) DEFAULT NULL,
  `promo_period` VARCHAR(255) DEFAULT NULL,
  `restaurant_id` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`restaurant_id`) REFERENCES restaurant(`id`)
);