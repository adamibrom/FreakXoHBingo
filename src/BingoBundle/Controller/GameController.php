<?php

namespace BingoBundle\Controller;

// these import the "@Route", "@Method", "@ParamConverter" and "@Template" annotations...
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
//use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use BaseBundle\Controller\AbstractController;
use BingoBundle\Manager\GameManager;
use BingoBundle\Manager\GamePlayerManager;
use BingoBundle\Manager\PlayerManager;
use BingoBundle\Propel\GameQuery;
use FOS\UserBundle\Propel\User;

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
        $user = $this->getUser();

        $gameManager = new GameManager();
        $game = $gameManager->getGameBySlug($slug, $locale);

        $playerManager = new PlayerManager();
        $player = $playerManager->initPlayer($user);

        $gamePlayerManager = new GamePlayerManager();
        $gamePlayer = $gamePlayerManager->initGamePlayer($game, $player);

        return $this->render(
            'BingoBundle:Play:play.html.twig',
            array(
                'name' => 'FreakXoHBingo Showview Monitor',
                'user' => $user,
                'game' => $game,
                'player' => $player,
            )
        );
    }

    /**
     * @return \FOS\UserBundle\Propel\User
     */
    /*
    protected function getUser()
    {
        $user = $this->get('security.context')->getToken()->getUser();

        if (!($user instanceof User)) {
            return null;
        }

        return $user;
    }
    */
}
