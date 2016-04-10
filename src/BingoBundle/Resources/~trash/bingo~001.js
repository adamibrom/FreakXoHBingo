$(document).ready(function () {
    var host = location.protocol.concat('//').concat(window.location.hostname);

    if (window.location.href.indexOf('app_dev.php') > -1) {
        host = host.concat('/app_dev.php');
    }

    var config = {
        bingoCard: {
            width: 7,
            height: 7,
            size: 49,

        },
        // Anzahl der Buzzwords +1...
        buzzwordCount: 66
    };

    var WinBoards = {
        "Horizontal1": [0, 1, 2, 3, 4, 5, 6],
        "Horizontal2": [7, 8, 9, 10, 11, 12, 13],
        "Horizontal3": [14, 15, 16, 17, 18, 19, 20],
        "Horizontal4": [21, 22, 23, 24, 25, 26, 27],
        "Horizontal5": [28, 29, 30, 31, 32, 33, 34],
        "Horizontal6": [35, 36, 37, 38, 39, 40, 41],
        "Horizontal7": [42, 43, 44, 45, 46, 47, 48],
        "Vertikal1": [0, 7, 14, 21, 28, 35, 42],
        "Vertikal2": [1, 8, 15, 22, 29, 36, 43],
        "Vertikal3": [2, 9, 16, 23, 30, 37, 44],
        "Vertikal4": [3, 10, 17, 24, 31, 38, 45],
        "Vertikal5": [4, 11, 18, 25, 32, 39, 46],
        "Vertikal6": [5, 12, 19, 26, 33, 40, 47],
        "Vertikal7": [6, 13, 20, 27, 34, 41, 48],
        "Diagonal1": [0, 8, 16, 24, 32, 40, 48],
        "Diagonal2": [6, 12, 18, 24, 30, 36, 42],
        "FreakshowF": [9, 10, 11, 12, 16, 23, 24, 25, 30, 37],
        "Jede Ecke (oben links)": [0, 1, 2, 7, 8, 14],
        "Jede Ecke (oben rechts)": [4, 5, 6, 12, 13, 20],
        "Jede Ecke (unten rechts)": [34, 40, 41, 46, 47, 48],
        "Jede Ecke (unten links)": [28, 35, 36, 42, 43, 44],
        "Echo Kammer": [23, 24, 25, 29, 33, 35, 41, 42, 48],
        "Diamant": [3, 9, 11, 15, 19, 21, 27, 29, 33, 37, 39, 45],
        "atzeichen": [1, 2, 3, 4, 5, 7, 13, 14, 17, 20, 21, 23, 25, 27, 28, 30, 31, 32, 33, 35, 43, 44, 45, 46, 47, 48],
        "Bierkrug": [8, 11, 12, 15, 18, 20, 22, 25, 27, 29, 32, 33, 36, 39, 44, 45],
        "Ecken_aussen": [0, 6, 42, 48],
        "Zen Garten": [11, 15, 33, 37],
        "Saphir": [10, 16, 18, 22, 26, 30, 32, 38],
        "CCC": [1, 2, 7, 14, 18, 19, 21, 27, 29, 30, 33, 41, 46, 47],
        "Knochen": [15, 19, 22, 23, 24, 25, 26, 29, 33],
        "Schluessel": [8, 9, 15, 16, 24, 32, 39, 40],
        "Sternhimmel": [1, 4, 7, 13, 17, 23, 24, 25, 28, 31, 40, 44, 48],
        "Schachbrett": [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47],
        "Ecken_innen": [16, 18, 30, 32],
        "Hangman": [9, 10, 11, 15, 18, 22, 24, 25, 26, 29, 32, 36, 38, 40, 43],
        "Sinus": [7, 11, 15, 17, 19, 22, 24, 26, 29, 31, 33, 37, 41],
        "Space Invaders": [0, 2, 4, 6, 15, 17, 19, 30, 39, 45, 46, 47],
        "Nethack": [9, 11, 12, 13, 18, 21, 22, 23, 25, 30, 32, 39, 44, 46],
        "Bloecke": [8, 9, 11, 12, 15, 16, 18, 19, 29, 30, 32, 33, 36, 37, 39, 40],
        "Six_Pack": [17, 18, 24, 25, 31, 32],
        "Jeder Pfeil (unten)": [29, 33, 37, 39, 45],
        "Jeder Pfeil (rechts)": [11, 19, 27, 33, 39],
        "Jeder Pfeil (oben)": [3, 9, 11, 15, 19],
        "Jeder Pfeil (links)": [9, 15, 21, 29, 37],
        "Jeder Winkel (unten rechts)": [26, 33, 38, 39, 40],
        "Jeder Winkel (oben rechts)": [10, 11, 12, 19, 26],
        "Jeder Winkel (oben links)": [8, 9, 10, 15, 22],
        "Jeder Winkel (unten links)": [22, 29, 36, 37, 38],
        "W&uuml;rfel 6": [9, 11, 23, 25, 37, 39],
        "Twin Peaks": [2, 8, 10, 39, 45, 47],
        "Slashes": [16, 19, 22, 25, 28, 31],
        "Ungleich": [16, 18, 22, 26, 30, 32],
        "3er Ecken": [0, 1, 5, 6, 7, 13, 35, 41, 42, 43, 47, 48],
        "Snake": [8, 9, 10, 15, 17, 22, 24, 25, 26, 33, 34, 36],
        "Double Six_Pack": [11, 12, 18, 19, 22, 23, 25, 26, 29, 30, 36, 37],
        "Satellit": [8, 12, 16, 17, 18, 23, 25, 30, 31, 32, 36, 40],
        "Bulls_Eye": [9, 10, 11, 15, 19, 22, 24, 26, 29, 33, 37, 38, 39],
        "Schmetterling": [8, 12, 15, 16, 18, 19, 22, 24, 26, 29, 30, 32, 33, 36, 40],
        "Vogelscheuche": [10, 15, 16, 17, 18, 19, 24, 30, 32, 36, 40],
        "Defender": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 14, 23, 35, 36, 38, 39, 40, 42, 43, 44, 45, 46, 47, 48],
        "Jedes 1/4 Dreieck (unten)": [24, 30, 31, 32, 36, 37, 38, 39, 40, 42, 43, 44, 45, 46, 47, 48],
        "Jedes 1/4 Dreieck (links)": [0, 7, 8, 14, 15, 16, 21, 22, 23, 24, 28, 29, 30, 35, 36, 42],
        "Jedes 1/4 Dreieck (oben)": [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 16, 17, 18, 24],
        "Jedes 1/4 Dreieck (rechts)": [6, 12, 13, 18, 19, 20, 24, 25, 26, 27, 32, 33, 34, 40, 41, 48],
        "Tannenbaum": [3, 9, 10, 11, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 29, 31, 33, 38, 44, 45, 46],
        "Monster_Bingo": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48],
        "Apfel": [4, 10, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 28, 29, 30, 31, 32, 36, 37, 38, 39, 40, 44, 46]
    }

    var wonBingos = new Array(67);
    var UserRejected = new Array(21);
    var totalScore = 0;
    var $bingoBody = $('#BingoBody');
    var PlayMode = false;

    var model = {
        bingoCard: _.fill(new Array(config.bingoCard.size), false)
    };

    /**
     * Bingo Game aufbauen.
     */
    function init() {
        createBingoCard();
        bindEventHandler();
        initBingoCard();
    }

    init();

    function createBingoCard() {
        var $row = $('<tr>');

        _.times(config.bingoCard.size, function (i) {
            $cell = $('<td>');

            // 24= Freifeld in der Mitte mit Freakshow Logo
            if (i != 24) {
                $cell.attr('id', 'cell' + i);
            } else {
                $cell.attr('id', 'cell24');
            }

            $cell.attr('data-id', i);
            $cell.append($('<img>'));
            $row.append($cell);

            // Ueberpruefe ob Reihe voll
            if (i % config.bingoCard.width == config.bingoCard.width - 1) {
                $bingoBody.append($row);
                $row = $('<tr>');
            }
        });
    }

    function initBingoCard() {
        var allBingoCards = _.range(1, config.buzzwordCount);

        // Benuztzer abgewaehlte buzzwords vom array abziehen
        diff = allBingoCards.filter(function (x) {
            return UserRejected.indexOf(x) < 0
        });

        // Mische alle Bingo-Karten außer die ausgeschlossenen und Teile alle Karten in Zwei-Teile auf
        var tmp = _.chunk(_.shuffle(diff), config.bingoCard.size - 1);
        var usedBingoCards = tmp[0];
        var missingBingoCards = tmp[1];

        setImgOnFree('#cell24', 'frei');
        setImgOn('#cell', usedBingoCards);
        setImgOff('#missing', usedBingoCards);
        setImgOn('#missing', missingBingoCards);
        $("#BingoBody td").removeClass('gelbe_zelle');
        $("#BingoBody td").removeClass('gruene_zelle');
        $("#BuzzwordsBody td").removeClass('rote_zelle');
        setImgOnRejected('#missing', UserRejected);
        wonBingos = [];
        model.bingoCard.length = 0;
    }

    function resetUserdata() {
        UserRejected = [];
    }

    function setImgOn(htmlId, imgIds) {
        _.times(imgIds.length, function (id) {
            // wenn id 24 erreicht, in cell48 schreiben
            if (id == 24) {
                var $elem = $(htmlId + 48);
                $elem.find('img').attr('src', '/bundles/bingo/img/' + imgIds[id] + '.svg');
                $elem.attr('data-img-id', imgIds[id]);
            } else {

                var $elem = $(htmlId + id);
                $elem.find('img').attr('src', '/bundles/bingo/img/' + imgIds[id] + '.svg');
                $elem.attr('data-img-id', imgIds[id]);
            }
        });
    }

    function setImgOnRejected(htmlId, imgIds) {
        _.times(imgIds.length + 1, function (id) {
            if (isNaN(imgIds[id])) {
            } else {
                var $elem = $(htmlId + (23 - id));
                $elem.find('img').attr('src', '/bundles/bingo/img/' + imgIds[id] + '.svg');
                $elem.attr('data-img-id', imgIds[id]);
                $(this).addClass("rote_zelle");
            }
        });
    }

    /**
     * Zum Reseten der Buzzword Tabelle nach einem ausschluss
     *
     * @param htmlId
     * @param imgIds
     */
    function setImgOff(htmlId, imgIds) {
        _.times(imgIds.length, function (id) {
            var $elem = $(htmlId + id);
            $elem.find('img').attr('src', '/bundles/bingo/img/vorschlag.svg');
        });
    }

    /**
     * Frei Feld Logo setzen
     *
     * @param htmlId
     * @param imgId
     */
    function setImgOnFree(htmlId, imgId) {
        var $elem = $(htmlId);
        $elem.find('img').attr('src', '/bundles/bingo/img/' + imgId + '.svg');
        $elem.attr('data-img-id', '0');
    }

    /**
     * bindEventHandler
     */
    function bindEventHandler() {
        // m Taste an mischen funktion binden
        $(document).keydown(function (evt) {
            if (!PlayMode) {
                if (evt.keyCode == 77) {
                    evt.preventDefault();
                    initBingoCard();
                }
            }
        });

        $('#neueKarte').click(function () {
            if (!PlayMode) {
                initBingoCard();
            }
        });

        $('#reset').click(function () {
            if (!PlayMode) {
                resetUserdata();
                initBingoCard();
            }
        });

        $('#spielstart').click(function () {
            PlayMode = true;
            $('#logohori').html(' Punkte: ' + totalScore);
            $("#BuzzwordsBody td").removeClass('missing');
            $("#BuzzwordsBody td").removeClass('rote_zelle');
        });

        /*
         $('.resizeTiles').click(function () {
         resizeTiles(parseInt($(this).attr('data-tile-size')));
         });
         */

        /**
         * Initiate the Bingo Klick request data.
         */
        var bingoRequestData = {};

        $("#BingoBody td").click(function () {
            PlayMode = true;

            // idx = integerwert der geklickten zelle
            var idx = parseInt($(this).attr('data-id'));
            var idimg = parseInt($(this).attr('data-img-id'));

            bingoRequestData.idx = idx;
            bingoRequestData.idimg = idimg;

            $.ajax({
                type: 'POST',
                url: host + 'admin/rest/game',
                crossDomain: true,
                data: JSON.stringify(bingoRequestData),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                async: true,
                success: function (bingoResponseData, textStatus, jqXHR) {
                    console.log(bingoResponseData);
                },
                error: function (bingoResponseData, textStatus, errorThrown) {
                    alert("Ajax failed to fetch data")
                }
            });

            $(this).addClass("gelbe_zelle");

            // geklickete Zelle in bingoCard true setzen
            model.bingoCard[idx] = true;
            checkWin(model.bingoCard);

            $('#logohori').html(' Punkte: ' + totalScore);
        });

        var UserRejectedNum = 0;

        $("#BuzzwordsBody td").click(function () {
            if (!PlayMode) {
                $(this).addClass("rote_zelle");

                // idx = integerwert der geklickten zelle
                var idx = parseInt($(this).attr('data-img-id'));

                if (isNaN(idx) || $.inArray(idx, UserRejected) != -1) {
                    // nothing ;)
                } else {
                    UserRejected[UserRejectedNum] = idx;
                    UserRejectedNum++;
                }
            } else {
                $(this).addClass("gelbe_zelle");
            }
        });
    }

    /**
     * containsAll
     *
     * @param needle
     * @param haystack
     * @returns {boolean}
     */
    function containsAll(needle, haystack) {
        for (var i = 0, len = needle.length; i < len; i++) {
            if ($.inArray(needle[i], haystack) == -1) return false;
        }

        return true;
    }

    /**
     * checkWin
     *
     * @param bingoCard
     */
    function checkWin(bingoCard) {
        var convertedToNum = _.reduce(bingoCard, function (result, val, idx) {
            if (val) {
                result.push(idx);
            }
            return result;
        }, []);
        console.log(convertedToNum);
        var i = 1;
        totalScore = 0;

        $.each(WinBoards, function (key, value) {
            if (containsAll(value, convertedToNum)) {
                wonBingos[i] = key;
                $('#result' + i).html(key + ' Punkte: ' + value.length * 10);
                totalScore = (totalScore + value.length * 10);

                $.each(WinBoards, function (key, value) {

                    if (containsAll(value, convertedToNum)) {
                        for (var j = 0; j < value.length;) {
                            $('#cell' + value[j]).addClass("gruene_zelle");
                            j++;
                        }
                    }
                });
                i++;
            }
        });
    }

    /*
     function resizeTiles(tileSize) {
     $('div.resize img').width(tileSize).height(tileSize);
     $('div.resize td').width(tileSize).height(tileSize);
     $('div.resize').width(tileSize * config.bingoCard.width + 50)
     }
     */
});