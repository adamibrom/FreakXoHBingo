<?php

namespace BingoBundle\Manager;

use BingoBundle\Propel\Click;
use BingoBundle\Propel\ClickQuery;
//use BingoBundle\Propel\Map\ClickTableMap;
//use Propel\Runtime\ActiveQuery\Criteria;
//use Propel\Runtime\Propel;
use BingoBundle\Propel\om\BaseClickPeer;
use Criteria;
use Propel;

/**
 * Class ClicksManager
 *
 * @package BingoBundle\Manager
 */
class ClicksManager
{
    /**
     * ClicksManager constructor.
     *
     * @param \Lsw\MemcacheBundle\Cache\AntiDogPileMemcache $memcache
     */
    public function __construct($memcache = null)
    {
        if (!is_null($memcache)) {
            $this->memcache = $memcache;
        }
    }

    /**
     * @return array
     */
    public function getCardClicksData()
    {
        $clicksData = $this->getMemcache()->get('CardClicksData');

        if ($clicksData) {
            return $clicksData;
        }

        $clicksQuery = new ClickQuery();
        $clicksQuery->groupBy(BaseClickPeer::CARD);
        //$clicksQuery->groupBy(ClickTableMap::COL_CARD);
        $clicksQuery->orderByTimeCreate(Criteria::DESC);
        $clicks = $clicksQuery->find();

        // -- Copy Object to Array
        $clicksData = array();

        foreach ($clicks as $row => $click) {
            $clicksData[$row]['id'] = $click->getId();
            $clicksData[$row]['card'] = $click->getCard();
            $clicksData[$row]['clicks'] = $click->get();
            $clicksData[$row]['sort_order'] = $row;
        }

        // Result cachen um MySQL Server zu entlasten...
        $this->getMemcache()->set('CardClicksData', $clicksData, 0, $this->getTimeToLive());

        return $clicksData;
    }

    /**
     * Methode zum Auslesen von Klicks, die mind. innerhalb eines Intervals erfolgt sind.
     *
     * @param int $interval
     * @return array
     */
    public function getCardClicksDataWithinInterval($interval = 45)
    {
        $clicksResult = $this->getMemcache()->get('CardClicksDataWithinInterval');

        if ($clicksResult) {
            return $clicksResult;
        }

        $query = "
            SELECT bc.game_id,
                   bc.player_id,
                   bc.card,
                   COUNT(bc.card) AS clicks,
                   MAX(bc.time_create) AS time_create_max
            FROM `bingo_click` bc
            WHERE (
                SELECT COUNT(*) AS count_within_interval
                FROM `bingo_click` bcwi
                WHERE bcwi.card=bc.card
                AND (bcwi.time_create > (bcwi.time_create - INTERVAL {$interval} SECOND)
                OR bcwi.time_create > (bcwi.time_create + INTERVAL {$interval} SECOND))
                GROUP BY bcwi.card
            ) > 5
            GROUP BY bc.card
            HAVING COUNT(bc.card) > 5
            ORDER BY time_create_max DESC
        ";

        $con = \Propel::getConnection();
        $stmt = $con->prepare($query);
        $stmt->execute();
        $clicksResult = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        // Result cachen um MySQL Server zu entlasten...
        $this->getMemcache()->set('CardClicksDataWithinInterval', $clicksResult, 0, $this->getTimeToLive());

        return $clicksResult;
    }

    /**
     * Get Card Clicks count within Seconds.
     *
     * @param int $seconds
     * @return array
     */
    public function getCardClicksDataWithinSeconds($seconds = 45)
    {
        $clickResult = $this->getMemcache()->get('CardClicksDataWithinSeconds');

        if ($clickResult) {
            return $clickResult;
        }

        $query = "
            SELECT game_id,card,count(card) as clicks
            FROM `bingo_click`
            WHERE time_create > (NOW() - INTERVAL {$seconds} SECOND)
            GROUP BY card
            ORDER BY clicks DESC
        ";

        $con = \Propel::getConnection();
        $stmt = $con->prepare($query);
        $stmt->execute();
        $clickResult = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        // Result cachen um MySQL Server zu entlasten...
        $this->getMemcache()->set('CardClicksDataWithinSeconds', $clickResult, 0, $this->getTimeToLive());

        return $clickResult;
    }

    /**
     * @param Click $card
     * @return bool
     */
    public function deleteCard($card)
    {
        $delete = "
            DELETE FROM logintime t1
            JOIN (
                SELECT MAX(datetime) AS max_dt
                FROM logintime
                WHERE user_id = 1
            ) t2
            WHERE t1.datetime  = t2.max_dt
            AND card = {$card->get}
        ";
        $con = Propel::getConnection();
        $stmt = $con->prepare($delete);

        return $stmt->execute();
    }

    // -- PROTECTED ----------------------------------------------------------------------------------------------------

    /**
     * @var \Lsw\MemcacheBundle\Cache\AntiDogPileMemcache
     */
    protected $memcache = null;

    /**
     * @return \Lsw\MemcacheBundle\Cache\AntiDogPileMemcache
     */
    protected function getMemcache()
    {
        return $this->memcache;
    }

    /**
     * @return int
     */
    protected function getTimeToLive()
    {
        //return 42 * 6;
        return 42;
    }
}
