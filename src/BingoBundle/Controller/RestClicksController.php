<?php

namespace BingoBundle\Controller;

// these import the "@Route", "@Method", "@ParamConverter" and "@Template" annotations...
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
//use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

// these import the "@View" annotations for FOS Rest Bundle...
//use FOS\RestBundle\Controller\Annotations as Rest;

/**
 * Class RestClicksController
 *
 * @package BingoBundle\Controller
 */
class RestClicksController extends AbstractRestBaseController
{
    /**
     * Methode zum Erhalten einer Liste der zuletzt getätigten Klicks innerhalb eines Spiels.
     *
     * @Route("/rest/clicks", name="bingo_rest_list_clicks", defaults={ "_format" = "json" })
     * @Method("GET")
     * @return array
     */
    public function listAction()
    {
        $clicksManager = $this->getClicksManager();
        $clicksData = $clicksManager->getCardClicksDataWithinInterval();

        return $this->ok(
            array(
                'name' => 'FreakXoHBingo',
                'all_clicks' => $clicksData
            )
        );
    }
}
