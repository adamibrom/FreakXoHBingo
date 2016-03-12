<?php

/**
 * Data object containing the SQL and PHP code to migrate the database
 * up to version 1457818167.
 * Generated on 2016-03-12 22:29:27 by adam
 */
class PropelMigration_1457818167
{

    /**
     * @param PropelMigrationManager $manager
     *
     * @return bool|void
     */
    public function preUp($manager)
    {
        // add the pre-migration code here
    }

    /**
     * @param PropelMigrationManager $manager
     */
    public function postUp($manager)
    {
        // add the post-migration code here
    }

    /**
     * @param PropelMigrationManager $manager
     *
     * @return bool|void
     */
    public function preDown($manager)
    {
        // add the pre-migration code here
    }

    /**
     * @param PropelMigrationManager $manager
     */
    public function postDown($manager)
    {
        // add the post-migration code here
    }

    /**
     * Get the SQL statements for the Up migration
     *
     * @return array list of the SQL strings to execute for the Up migration
     *               the keys being the datasources
     */
    public function getUpSQL()
    {
        return array (
  'default' => '
# This is a fix for InnoDB in MySQL >= 4.1.x
# It "suspends judgement" for fkey relationships until are tables are set.
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE `client`
(
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `random_id` VARCHAR(255) NOT NULL,
    `redirect_uris` TEXT NOT NULL,
    `secret` VARCHAR(255) NOT NULL,
    `allowed_grant_types` TEXT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `token`
(
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(255) NOT NULL,
    `expires_at` INTEGER,
    `scope` VARCHAR(255),
    `client_id` INTEGER NOT NULL,
    `user` TEXT,
    `class_key` INTEGER,
    PRIMARY KEY (`id`),
    INDEX `token_FI_1` (`client_id`),
    CONSTRAINT `token_FK_1`
        FOREIGN KEY (`client_id`)
        REFERENCES `client` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `auth_code`
(
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(255) NOT NULL,
    `redirect_uri` VARCHAR(255) NOT NULL,
    `expires_at` INTEGER,
    `scope` VARCHAR(255),
    `client_id` INTEGER NOT NULL,
    `user` TEXT,
    PRIMARY KEY (`id`),
    INDEX `auth_code_FI_1` (`client_id`),
    CONSTRAINT `auth_code_FK_1`
        FOREIGN KEY (`client_id`)
        REFERENCES `client` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `fos_user`
(
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255),
    `username_canonical` VARCHAR(255),
    `email` VARCHAR(255),
    `email_canonical` VARCHAR(255),
    `enabled` TINYINT(1) DEFAULT 0,
    `salt` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `last_login` DATETIME,
    `locked` TINYINT(1) DEFAULT 0,
    `expired` TINYINT(1) DEFAULT 0,
    `expires_at` DATETIME,
    `confirmation_token` VARCHAR(255),
    `password_requested_at` DATETIME,
    `credentials_expired` TINYINT(1) DEFAULT 0,
    `credentials_expire_at` DATETIME,
    `roles` TEXT,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `fos_user_U_1` (`username_canonical`),
    UNIQUE INDEX `fos_user_U_2` (`email_canonical`)
) ENGINE=InnoDB;

CREATE TABLE `fos_group`
(
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `roles` TEXT,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `fos_user_group`
(
    `fos_user_id` INTEGER NOT NULL,
    `fos_group_id` INTEGER NOT NULL,
    PRIMARY KEY (`fos_user_id`,`fos_group_id`),
    INDEX `fos_user_group_FI_2` (`fos_group_id`),
    CONSTRAINT `fos_user_group_FK_1`
        FOREIGN KEY (`fos_user_id`)
        REFERENCES `fos_user` (`id`),
    CONSTRAINT `fos_user_group_FK_2`
        FOREIGN KEY (`fos_group_id`)
        REFERENCES `fos_group` (`id`)
) ENGINE=InnoDB;

# This restores the fkey checks, after having unset them earlier
SET FOREIGN_KEY_CHECKS = 1;
',
);
    }

    /**
     * Get the SQL statements for the Down migration
     *
     * @return array list of the SQL strings to execute for the Down migration
     *               the keys being the datasources
     */
    public function getDownSQL()
    {
        return array (
  'default' => '
# This is a fix for InnoDB in MySQL >= 4.1.x
# It "suspends judgement" for fkey relationships until are tables are set.
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `client`;

DROP TABLE IF EXISTS `token`;

DROP TABLE IF EXISTS `auth_code`;

DROP TABLE IF EXISTS `fos_user`;

DROP TABLE IF EXISTS `fos_group`;

DROP TABLE IF EXISTS `fos_user_group`;

# This restores the fkey checks, after having unset them earlier
SET FOREIGN_KEY_CHECKS = 1;
',
);
    }

}