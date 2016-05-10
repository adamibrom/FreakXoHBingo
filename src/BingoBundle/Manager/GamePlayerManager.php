<?php

namespace BingoBundle\Manager;

use BingoBundle\Propel\Game;
use BingoBundle\Propel\GamePlayer;
use BingoBundle\Propel\GamePlayerQuery;
use BingoBundle\Propel\Player;

/**
 * Class GamePlayerManager
 *
 * @package BingoBundle\Manager
 */
class GamePlayerManager
{
    /**
     * @param Game   $game
     * @param Player $player
     * @return \BingoBundle\Propel\GamePlayer
     */
    public function initGamePlayer($game, $player)
    {
        $gamePlayerQuery = new GamePlayerQuery();
        $gamePlayer = $gamePlayerQuery->filterByGame($game)->filterByPlayer($player)->findOne();

        if (is_null($gamePlayer)) {
            $gamePlayer = new GamePlayer();
            $gamePlayer->setGame($game)->setPlayer($player);
            $gamePlayer->save();
        }

        return new GamePlayer();
    }
}
