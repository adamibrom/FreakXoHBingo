<?php

namespace BaseBundle\Controller;

use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\View\View;

/**
 * Class AbstractRestController
 *
 * @package BaseBundle\Controller
 */
abstract class AbstractRestController extends FOSRestController
{
    const HTTP_OK = 200;
    const HTTP_FOUND = 302;
    const HTTP_BAD_REQUEST  = 400;
    const HTTP_UNAUTHORIZED = 401;
    const HTTP_NOT_FOUND    = 404;

    /**
     * Create a response with code 200
     *
     * @param array $data
     * @return \FOS\RestBundle\View\View
     */
    protected function ok($data = array())
    {
        return View::create()
            ->setStatusCode(self::HTTP_OK)
            ->setData($data);
    }

    /**
     * Get a user from the Security Token Storage.
     *
     * @return \FOS\UserBundle\Propel\User
     */
    public function getUser()
    {
        return parent::getUser();
    }

    /**
     * @return array
     */
    public function getUserData()
    {
        $user = $this->getUser();
        $userData = [
            'id' => $user->getId(),
            'username' => $user->getUsername(),
        ];

        return $userData;
    }
}
