<?php

namespace BingoBundle\Manager;

use BingoBundle\Propel\Player;
use BingoBundle\Propel\PlayerQuery;
use FOS\UserBundle\Propel\User;

/**
 * Class PlayerManager
 *
 * @package BingoBundle\Manager
 */
class PlayerManager
{
    const ANONYMOUS = 'anonymous';

    /**
     * @param User $user
     * @return \BingoBundle\Propel\Player
     */
    public function initPlayer($user = null)
    {
        $playerQuery = PlayerQuery::create();

        if (!is_null($user)) {
            $player = $playerQuery->findOneByUid($user->getId());
        } else {
            $player = null;
        }

        if (is_null($player)) {
            $player = new Player();

            if (!is_null($user)) {
                $player->setUid($user->getId());
            } else {
                $player->setUid(0);
            }

            $player->setName(self::ANONYMOUS);
        } else {
            if (!is_null($user)) {
                $player->setName($user->getUsername());
                $player->save();
            }
        }

        return $player;
    }
}
