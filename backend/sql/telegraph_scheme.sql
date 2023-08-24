-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema telegraph
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `telegraph` ;
USE `telegraph` ;


-- -----------------------------------------------------
-- Table `telegraph`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `telegraph`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(10) NOT NULL UNIQUE,
  `first_name` VARCHAR(45) NOT NULL,
  `second_name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `telegraph`.`chats`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `telegraph`.`chats` (
  `chat_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id1` INT NOT NULL,
  `user_id2` INT NOT NULL,
  PRIMARY KEY (`chat_id`),
  INDEX `fk_chats_users1_idx` (`user_id1` ASC) VISIBLE,
  INDEX `fk_chats_users2_idx` (`user_id2` ASC) VISIBLE,
  CONSTRAINT `fk_chats_users1`
    FOREIGN KEY (`user_id1`)
    REFERENCES `telegraph`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_chats_users2`
    FOREIGN KEY (`user_id2`)
    REFERENCES `telegraph`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `telegraph`.`chat_messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `telegraph`.`chat_messages` (
  `message_id` INT NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(45) NOT NULL,
  `sent_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `user_id` INT NULL,
  `chat_id` INT NOT NULL,
  PRIMARY KEY (`message_id`),
  INDEX `fk_messages_users_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_messages_chats1_idx` (`chat_id` ASC) VISIBLE,
  CONSTRAINT `fk_messages_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `telegraph`.`users` (`user_id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_messages_chats1`
    FOREIGN KEY (`chat_id`)
    REFERENCES `telegraph`.`chats` (`chat_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `telegraph`.`group`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `telegraph`.`group` (
  `group_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`group_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `telegraph`.`user_groups`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `telegraph`.`user_groups` (
  `group_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  INDEX `fk_user_groups_group1_idx` (`group_id` ASC) VISIBLE,
  INDEX `fk_user_groups_users1_idx` (`user_id` ASC) VISIBLE,
  PRIMARY KEY (`group_id`, `user_id`),
  CONSTRAINT `fk_user_groups_group1`
    FOREIGN KEY (`group_id`)
    REFERENCES `telegraph`.`group` (`group_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_groups_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `telegraph`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `telegraph`.`group_messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `telegraph`.`group_messages` (
  `message_id` INT NOT NULL,
  `content` VARCHAR(45) NOT NULL,
  `sent_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `group_id` INT NOT NULL,
  `user_id` INT NULL,
  PRIMARY KEY (`message_id`),
  INDEX `fk_group_messages_group1_idx` (`group_id` ASC) VISIBLE,
  INDEX `fk_group_messages_users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_group_messages_group1`
    FOREIGN KEY (`group_id`)
    REFERENCES `telegraph`.`group` (`group_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_group_messages_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `telegraph`.`users` (`user_id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
