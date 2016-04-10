<?php

namespace BingoBundle\Controller;

// these import the "@Route", "@Method", "@ParamConverter" and "@Template" annotations...
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
//use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

// these import the "@View" annotations for FOS Rest Bundle...
//use FOS\RestBundle\Controller\Annotations as Rest;

use BingoBundle\Propel\Click;
use BingoBundle\Propel\ClickQuery;
//use Propel\Runtime\Propel;
//use Propel\Runtime\ActiveQuery\Criteria;
use Criteria;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class RestclickController
 *
 * @package BingoBundle\Controller
 */
class RestClickController extends AbstractRestBaseController
{
    /**
     * Methode zum Festhalten eines Klicks eines Spielers innerhalb eines Spiels.
     *
     * @Route("/rest/click", name="bingo_rest_click", defaults={ "_format" = "json" })
     * @Method("GET")
     * @return array
     */
    public function getClickAction()
    {
        return $this->ok(
            array(
                'name' => 'FreakXoHBingo',
                'clicks' => $this->getClicksManager()->getCardClicksDataWithinSeconds()
            )
        );
    }

    /**
     * Methode zum Festhalten eines Klicks eines Spielers innerhalb eines Spiels.
     *
     * @Route("/rest/click", name="bingo_rest_click_post", defaults={ "_format" = "json" })
     * @Method("POST")
     * @param Request $request
     * @return array
     */
    public function createClickAction(Request $request)
    {
        if ($request->getMethod() == 'POST') {
            $clickRequestData = array();

            if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
                $clickRequestData = json_decode($request->getContent(), true);
                //$request->replace(is_array($data) ? $data : array());
            }

            $click = new Click();
            $click->setCard($clickRequestData['card']);
            $click->save();
        }

        return $this->ok(
            array(
                'name' => 'FreakXoHBingo',
                'clicks' => $this->getClicksManager()->getCardClicksDataWithinSeconds()
            )
        );
    }

    /**
     * Methode zum Lösen des letzen Klicks für eine Karte.
     *
     * @Route("/rest/click", name="bingo_rest_click_delete", defaults={ "_format" = "json" })
     * @Method("DELETE")
     * @param Request $request
     * @return array
     */
    public function deleteClickAction(Request $request)
    {
        if ($request->getMethod() == 'DELETE') {
            $clickRequestData = array();

            if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
                $clickRequestData = json_decode($request->getContent(), true);
                //$request->replace(is_array($data) ? $data : array());
            }

            $click = ClickQuery::create()
                ->orderByTimeCreate(\Criteria::DESC)
                ->findOneByCard($clickRequestData['card']);
            $click->delete();
        }

        return $this->ok(
            array(
                'name' => 'FreakXoHBingo',
                'clicks' => $this->getClicksManager()->getCardClicksDataWithinSeconds()
            )
        );
    }
}
