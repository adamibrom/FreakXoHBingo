<?php

namespace BingoBundle\Controller;

// these import the "@Route", "@Method", "@ParamConverter" and "@Template" annotations...
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
//use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

// these import the "@View" annotations for FOS Rest Bundle...
use FOS\RestBundle\Controller\Annotations as Rest;

use BaseBundle\Controller\AbstractRestController;
use BingoBundle\Propel\GameQuery;
//use Propel\Runtime\ActiveQuery\Criteria;
use Criteria;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Kernel;

/**
 * Class RestGamesController
 *
 * @package BingoRestBundle\Controller
 */
class GameController extends AbstractRestController
{
    /**
     * Methode zum Auslesen aller verfügbaren Bingo Spiele.
     *
     * @Route("/games", name="bingo_games")
     * @Route("/rest/games", name="bingo_games_rest", defaults={ "_format" = "json" })
     * @Method("GET")
     * @Rest\View()
     * @return array
     */
    public function listAction()
    {
        $locale = 'de_DE';

        $gamesQuery = new GameQuery();
        $gamesQuery->joinWithI18n($locale);
        $gamesQuery->orderById(Criteria::DESC);
        $games = $gamesQuery->find();

        $gamesData = array();

        foreach ($games as $game) {
            $gamesData[] = array(
                'id' => $game->getId(),
                'slug' => $game->getSlug(),
                'name' => $game->getName(),
                'slogan' => $game->getSlogan(),
                'description' => $game->getDescription()
            );
        }

        return array(
            'name' => 'FreakXoHBingo',
            'version' => Kernel::VERSION,
            'games' => $gamesData
        );
    }

    /**
     * Methode zum Auslesen eines Spiels.
     *
     * @Route("/game/{slug}", name="bingo_game")
     * @Route("/rest/game/{slug}", name="bingo_game_rest_get", defaults={ "_format" = "json" })
     * @Method("GET")
     * @Rest\View()
     * @param string $slug
     * @return array
     */
    public function getAction($slug)
    {
        $locale = 'de_DE';

        $gamesQuery = new GameQuery();
        $gamesQuery->joinWithI18n($locale);
        $game = $gamesQuery->findOneBySlug($slug);

        return array(
            'name' => 'FreakXoHBingo',
            'version' => Kernel::VERSION,
            'game' => $game
        );
    }
}
