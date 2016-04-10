<?php

/**
 * Data object containing the SQL and PHP code to migrate the database
 * up to version 1457902322.
 * Generated on 2016-03-13 21:52:02 by adam
 */
class PropelMigration_1457902322
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

ALTER TABLE `bingo_game` ADD `owner_id` INT(11) AFTER `id`;

CREATE INDEX `I_Bingo_Game_OwnerId` ON `bingo_game` (`owner_id`);

ALTER TABLE `bingo_game` ADD CONSTRAINT `FK_Bingo_GameToOwner` FOREIGN KEY (`owner_id`) REFERENCES `fos_user` (`id`);

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

ALTER TABLE `bingo_game` DROP FOREIGN KEY `FK_Bingo_GameToOwner`;

DROP INDEX `I_Bingo_Game_OwnerId` ON `bingo_game`;

ALTER TABLE `bingo_game` DROP `owner_id`;

# This restores the fkey checks, after having unset them earlier
SET FOREIGN_KEY_CHECKS = 1;
',
);
    }

}