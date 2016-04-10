<?php

namespace BingoBundle\Controller;

// these import the "@Route", "@Method", "@ParamConverter" and "@Template" annotations...
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
//use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

// these import the "@View" annotations for FOS Rest Bundle...
//use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\View;

/**
 * Class RestPlayController
 *
 * @package BingoBundle\Controller
 */
class RestTestController extends AbstractRestBaseController
{
    /**
     * Controller zum Testen ;)
     *
     * @Route("/rest/test", name="bingo_rest_test", defaults={ "_format" = "json" })
     * @Method("GET")
     * @return array
     */
    public function testAction()
    {
        $responseData = [
            'name' => 'FreakXoHBingo',
            'clicks' => [0 => 42]
        ];

        return View::create()->setData($responseData);
    }
}
