<?php

namespace BingoBundle\Manager;

use BingoBundle\Propel\GameQuery;

/**
 * Class GameManager
 *
 * @package BingoBundle\Manager
 */
class GameManager
{
    /**
     * @param string $slug
     * @param string $locale
     * @return \BingoBundle\Propel\Game
     */
    public function getGameBySlug($slug, $locale = 'de_DE')
    {
        $gamesQuery = new GameQuery();
        $gamesQuery->joinWithI18n($locale);
        $game = $gamesQuery->findOneBySlug($slug);

        return $game;
    }
}
