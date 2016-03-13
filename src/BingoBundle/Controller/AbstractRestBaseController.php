<?php

namespace BingoBundle\Controller;

use BaseBundle\Controller\AbstractRestController;
use BingoBundle\Manager\ClicksManager;

/**
 * Class AbstractRestBaseController
 *
 * @package BingoBundle\Controller
 */
abstract class AbstractRestBaseController extends AbstractRestController
{
    /**
     * @return ClicksManager
     */
    protected function getClicksManager()
    {
        return $this->get('bingo.clicks.manager');
    }
}
