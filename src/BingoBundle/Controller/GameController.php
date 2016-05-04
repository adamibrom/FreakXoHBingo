<?php

namespace BingoBundle\Controller;

// these import the "@Route", "@Method", "@ParamConverter" and "@Template" annotations...
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
//use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use BaseBundle\Controller\AbstractController;
use BingoBundle\Propel\GameQuery;

/**
 * Class GameController
 *
 * @package BingoBundle\Controller
 */
class GameController extends AbstractController
{
    /**
     * Methode zum Auslesen eines Spiels.
     *
     * @Route("/play", name="bingo_game_play_null")
     * @Route("/play/{slug}", name="bingo_game_play")
     * @param string $slug
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function playAction($slug = null)
    {
        $locale = 'de_DE';

        $gamesQuery = new GameQuery();
        $gamesQuery->joinWithI18n($locale);
        $game = $gamesQuery->findOneBySlug($slug);

        return $this->render(
            'BingoBundle:Play:play.html.twig',
            array(
                'name' => 'FreakXoHBingo Showview Monitor',
                'game' => $game
            )
        );
    }
}
