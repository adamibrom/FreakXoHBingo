$(document).ready(function () {
    /**
     * @type {string}
     */
    var host = location.protocol.concat('//').concat(window.location.hostname);

    if (window.location.href.indexOf('app_dev.php') > -1) {
        host = host.concat('/app_dev.php');
    }

    /**
     * @type {{bingoCard: {width: number, height: number, size: number}, buzzwordCard: {width: number, height: number, size: number}, buzzwordCount: number}}
     */
    var config = {
        srcImg: '/bundles/bingo/img',
        bingoCard: {
            width: 7,
            height: 7,
            size: 49,
        },
        buzzwordCard: {
            width: 6,
            height: 8,
            size: 48,
        },

        // Anzahl der Buzzwords +1 wegen Freifeld
        buzzwordCount: 97
    };

    var timeoutArray = new Array(49);
    var buzzwordConfirmed = new Array(config.buzzwordCount);
    var buzzwordBusy = new Array(config.buzzwordCount);
    var wonBingos = new Array(143);
    var wonBuzzwords = new Array(0);
    var intervallBuzzwords = new Array(0);
    var userRejected = new Array(19,88,71,59,8,55,1,20,35,7,31,57,44,4,67,86,52,89);
    var userRejectedNum = userRejected.length;
    var totalScore = 0;
    var $bingoBody = $('#BingoBody');
    var $BuzzwordsBody = $('#BuzzwordsBody');
    var playMode = false;
    var missingBingoCardsCount = config.buzzwordCount - config.bingoCard.size;
    var captionOff = true;
    var placeCaptionLeftOfMousecourser = false;

    var model = {
        bingoCard: _.fill(new Array(config.bingoCard.size), false)
    };

    function goodbye(e) {
        if (playMode) {
            if (!e) e = window.event;
            //IE
            e.cancelBubble = true;
            e.returnValue = 'SICHER?!? -> Die aktuelle Karte und der Punktestand gehen dann verloren!';
            //Firefox
            if (e.stopPropagation) {
                e.stopPropagation();
                e.preventDefault();
            }
        }
    }

    function contains(arr, obj) {
      for(var i=0; i<arr.length; i++) {
        if (arr[i] == obj) return true;
      }
    }

    window.onbeforeunload = goodbye;

    window.onload = function () {
        var bsDiv = document.getElementById("buzzwordText");
        var x, y;

        // On mousemove use event.clientX and event.clientY to set the location of the div to the location of the cursor:
        window.addEventListener('mousemove', function (event) {
            x = event.clientX;
            y = event.clientY;
            if (typeof x !== 'undefined') {
                if (!placeCaptionLeftOfMousecourser) {
                    bsDiv.style.left = (x + 35) + "px";
                    bsDiv.style.top = (y - 35) + "px";
                } else {
                    bsDiv.style.left = (x - 405) + "px";
                    bsDiv.style.top = (y - 35) + "px";
                }
            }
        }, false);
    }

    init();

    function init() {
        createBingoCard();
        createBuzzwordCard();
        bindEventHandler();
        initBingoCard();
        //toggleCaptionOnOff();
        //alert("Ajax failed to fetch data");
    }

    function createBingoCard() {
        var $row = $('<tr>');

        _.times(config.bingoCard.size, function (i) {
            var $cell = $('<td>');
            // 24= Freifeld in der Mitte mit Show-Logo definieren
            if (i !== 24) {
                $cell.attr('id', 'cell' + i);
            } else {
                $cell.attr('id', 'cell24');
            }
            $cell.attr('data-id', i);
            $cell.append($('<img>'));
            $cell.attr('class', 'cell');
            $row.append($cell);

            // Ueberpruefe ob Reihe voll
            if (i % config.bingoCard.width == config.bingoCard.width - 1) {
                $bingoBody.append($row);
                $row = $('<tr>');
            }
        });
    }

    function createBuzzwordCard() {
        var $row = $('<tr>');

        _.times(config.buzzwordCard.size, function (i) {
            $cell = $('<td>');
            $cell.attr('id', 'missing' + i);
            $cell.attr('data-id', i);
            $cell.append($('<img>'));
            $cell.attr('class', 'missing');
            $row.append($cell);
            // Ueberpruefe ob Reihe voll
            if (i % config.buzzwordCard.width == config.buzzwordCard.width - 1) {
                $BuzzwordsBody.append($row);
                $row = $('<tr>');
            }
        });
    }

    function initBingoCard() {
        var allBingoCards = _.range(1, config.buzzwordCount);
        // Benutzer abgewaehlte buzzwords vom array abziehen
        var diff = allBingoCards.filter(function (card) {
            return userRejected.indexOf(card) < 0;
        });
        // Mische alle Bingo-Karten außer die ausgeschlossenen und Teile alle Karten in Zwei-Teile auf
        var tmp = _.chunk(_.shuffle(diff), config.bingoCard.size - 1);
        var usedBingoCards = tmp[0];
        if (typeof tmp[1] != 'undefined') {
            missingBingoCards = tmp[1];
        } else {
            missingBingoCards = 1;
        }
        setImgOn('#cell', usedBingoCards);
        setImgOff('#missing', usedBingoCards);
        setImgOnSpare('#missing', missingBingoCards);
        $("#BingoBody td").removeClass('gelbe_zelle');
        $("#BingoBody td").removeClass('gruene_zelle');
        $("#BingoBody td").removeClass('rote_zelle');
        $("#BuzzwordsBody td").removeClass('rote_zelle');
        setImgOnRejected('#missing', userRejected);
        setImgOnFree('#cell24', 'frei');
        wonBingos = [];
        model.bingoCard.length = 0;
    }

    function resetUserdata() {
        userRejected = [];
        userRejectedNum = 0;
    }

    function toggleCaptionOnOff() {
        if (captionOff) {
            captionOff = false;
            if (!playMode) {
                for (var i = 0; i < config.bingoCard.size; i++) {
                    $('#cell' + i).removeClass('cell'); 
                }
                for (var i = 0; i < config.buzzwordCard.size; i++) {
                    $('#missing' + i).removeClass('missing');
                }
            }else{
                for (var i = 0; i < config.bingoCard.size; i++) {
                    $('#cell' + i).removeClass('mouseoverbingo'); 
                }
                for (var i = 0; i < config.buzzwordCard.size; i++) {
                    $('#missing' + i).removeClass('mouseoverbuzz');
                }
            }
        } else {
            captionOff = true;
            $('#buzzwordText').removeClass('buzzwordTextFilled');
            $('#buzzwordText').html("");
            if (!playMode) {

                for (var i = 0; i < config.bingoCard.size; i++) {
                    $('#cell' + i).addClass('cell');
                }
                for (var i = 0; i < config.buzzwordCard.size; i++) {
                    $('#missing' + i).addClass('missing');
                }
            }else{
                for (var i = 0; i < config.bingoCard.size; i++) {
                    $('#cell' + i).addClass('mouseoverbingo'); 
                }
                for (var i = 0; i < config.buzzwordCard.size; i++) {
                    $('#missing' + i).addClass('mouseoverbuzz');
                }
            }

        }
    }

    function setImgOn(htmlId, imgIds) {
        _.times(imgIds.length, function (id) {
            if (id == 24) {                    // wenn id 24 erreicht, in cell48 schreiben
                var $elem = $(htmlId + 48);
                $elem.find('img').attr('src', config.srcImg + '/' + imgIds[id] + '.svg');
                $elem.attr('data-img-id', imgIds[id]);
                $elem.addClass("gelbe_zelle");
            } else {
                var $elem = $(htmlId + id);
                $elem.find('img').attr('src', config.srcImg + '/' + imgIds[id] + '.svg');
                $elem.attr('data-img-id', imgIds[id]);
            }
        });
    }

    function setImgOnSpare(htmlId, imgIds) {
        _.times(imgIds.length, function (id) {
            var $elem = $(htmlId + id);
            $elem.find('img').attr('src', config.srcImg + '/' + imgIds[id] + '.svg');
            $elem.attr('data-img-id', imgIds[id]);
        });
    }

    function setImgOnRejected(htmlId, imgIds) {
        _.times(imgIds.length + 1, function (id) {
            if (!isNaN(imgIds[id])) {
                var $elem = $(htmlId + (47 - id));
                $elem.find('img').attr('src', config.srcImg + '/' + imgIds[id] + '.svg');
                $elem.attr('data-img-id', imgIds[id]);
                $elem.addClass("rote_zelle");
            }
        });
    }

    /**
     * Zum Reseten der Buzzword Tabelle nach einem Ausschluss.
     *
     * @param htmlId
     * @param imgIds
     */
    function setImgOff(htmlId, imgIds) {
        _.times(imgIds.length, function (id) {
            var $elem = $(htmlId + id);
            $elem.find('img').attr('src', config.srcImg + '/vorschlag.svg');

        });
    }

    // Frei Feld Logo setzen
    function setImgOnFree(htmlId, imgId) {
        var $elem = $(htmlId);
        $elem.find('img').attr('src', config.srcImg + '/' + imgId + '.svg');
        $elem.attr('data-img-id', '0');
        // Freifeld im Playmode immer gelb starten
        // if (playMode) {
           // $elem.addClass("gelbe_zelle");
        // }
    }

    function bindEventHandler() {
        $(document).keydown(function (evt) { // m Taste an mischen funktion binden
            if (!playMode) {
                if (evt.keyCode == 77) {
                    evt.preventDefault();
                    initBingoCard();
                }
            }
        });

        $(document).keydown(function (evt) { // c Taste an captionOff binden
          //  if (!playMode) {
                if (evt.keyCode == 67) {
                    evt.preventDefault();
                    toggleCaptionOnOff();
                }
          //  }
        });

        $(document).keydown(function (evt) { // r Taste an reset binden
            if (!playMode) {
                if (evt.keyCode == 82) {
                    userRejectedNum = 0;
                    resetUserdata();
                    $("#BuzzwordsBody td").removeClass('rote_zelle');
                    $("#BingoBody td").removeClass('rote_zelle');
                }
            }
        });

        $('#BingoBody td').mouseover(function () {
            if (!captionOff) {
                var idx = parseInt($(this).attr('data-img-id'));
                if (idx != '0') {
                    placeCaptionLeftOfMousecourser = false;
                    $('#buzzwordText').html('<img src="' + config.srcImg + '/' + idx + '.svg" height="150px" width="150px" align="left">' + BuzzwordText[idx]);
                    $('#buzzwordText').removeClass('buzzwordTextEmpty');
                    $('#buzzwordText').addClass('buzzwordTextFilled');
                }
            }
        });

        $('#BingoBody td').mouseleave(function () {
            if (!captionOff) {
                $('#buzzwordText').removeClass('buzzwordTextFilled');
                $('#buzzwordText').addClass('buzzwordTextEmpty');
            }
        });

        $('#BuzzwordsBody td').mouseover(function () {
            if (!captionOff) {
                var idx = parseInt($(this).attr('data-img-id'));
                if (!isNaN(idx)) {
                    placeCaptionLeftOfMousecourser = true;
                    $('#buzzwordText').html('<img src="' + config.srcImg + '/' + idx + '.svg" height="150px" width="150px" align="right">' + BuzzwordText[idx]);
                    $('#buzzwordText').removeClass('buzzwordTextEmpty');
                    $('#buzzwordText').addClass('buzzwordTextFilled');
                }
            }
        });

        $('#BuzzwordsBody td').mouseleave(function () {
            if (!captionOff) {
                $('#buzzwordText').removeClass('buzzwordTextFilled');
                $('#buzzwordText').addClass('buzzwordTextEmpty');
            }
        });

        $('#mischen').mouseover(function () {
            if (!captionOff && !playMode) {
                var idx = parseInt($(this).attr('data-img-id'));
                placeCaptionLeftOfMousecourser = true;
                $('#buzzwordText').html('Dieser Button mischt alle nicht per klick abgewählten buzzwords. auch die "m" taste mischt!');
                $('#buzzwordText').removeClass('buzzwordTextEmpty');
                $('#buzzwordText').addClass('buzzwordTextFilled');
            }
        });

        $('#mischen').mouseleave(function () {
            if (!playMode) {
                $('#buzzwordText').removeClass('buzzwordTextFilled');
                $('#buzzwordText').addClass('buzzwordTextEmpty');
            }
        });

        $('#reset').mouseover(function () {
            if (!captionOff && !playMode) {
                var idx = parseInt($(this).attr('data-img-id'));
                placeCaptionLeftOfMousecourser = true;
                $('#buzzwordText').html('reset loest alle abgewählten karten wieder und entfernt die mit der "c" taste schaltbaren erklär captionsb');
                $('#buzzwordText').removeClass('buzzwordTextEmpty');
                $('#buzzwordText').addClass('buzzwordTextFilled');
            }
        });

        $('#reset').mouseleave(function () {
            if (!playMode) {
                $('#buzzwordText').removeClass('buzzwordTextFilled');
                $('#buzzwordText').addClass('buzzwordTextEmpty');
            }
        });

        $('#start').mouseover(function () {
            if (!captionOff && !playMode) {
                var idx = parseInt($(this).attr('data-img-id'));
                placeCaptionLeftOfMousecourser = true;
                $('#buzzwordText').html('mit dem spielstart wird die karte fixiert und die spielzeit an dieser stelle angezeigt');
                $('#buzzwordText').removeClass('buzzwordTextEmpty');
                $('#buzzwordText').addClass('buzzwordTextFilled');
            }
        });

        $('#start').mouseleave(function () {
            $('#buzzwordText').removeClass('buzzwordTextFilled');
            $('#buzzwordText').addClass('buzzwordTextEmpty');
        });

        $('#neueKarte').click(function () {
            if (!playMode) {
                initBingoCard();
            }
        });

        $('#reset').click(function () {
            if (!playMode) {
                userRejectedNum = 0;
                resetUserdata();
                $("#BuzzwordsBody td").removeClass('rote_zelle');
                $("#BingoBody td").removeClass('rote_zelle');
            }
        });

        $('#spielstart').click(function () {
            playMode = true;
            userRejectedNum = 0;
            $('#score').html('<div style="width: 198px" id="scoreback">' + pad(totalScore, 6) + '</div>');
            new CountUp(((new Date()).getTime()), 'counter');
            $('#counter').html('<div id="start">&nbsp</div>');
            $('#reset').html('<div id="reset">&nbsp</div>');
            $("#BuzzwordsBody td").removeClass('missing');
            $("#BuzzwordsBody td").removeClass('rote_zelle');
            $("#BingoBody td").removeClass('missing');
            $("#BingoBody td").removeClass('rote_zelle');
            $("#BuzzwordsBody td").addClass('mouseoverbuzz');
            $("#BingoBody td").addClass('mouseoverbingo');
            setImgOnFree('#cell24', 'frei');
            // mittleres Show-Freifeld immer aktivieren
            model.bingoCard[24] = true;
        });

        var userRejectedNum = 25; //vorrübergehender ausschluss der csch buzzwords
    }

    /**
     * Timeout Exit wird immer in "BuzzwordHandling" zurückgesetzt und in "checkBuzzword" verwendet.
     *
     * @type {number}
     */
    var timeoutExit = 1;

    /**
     * Funktion zum Handhaben der Klicks in den Spielkarten (Links Bingo und rechts Buzzword).
     *
     * @param clickSource
     * @constructor
     */
    var BuzzwordHandling = function ($that, clickSource) {
        //console.log('clickSource = ' + clickSource);
        //console.log(userRejectedNum);
        //console.log(missingBingoCardsCount);
        //console.log($that.hasClass("rote_zelle"));

        if (userRejectedNum >= missingBingoCardsCount && !$that.hasClass("rote_zelle")) {
            return null;
        }

        if (!playMode) {
            // idx = integerwert der geklickten zelle
            var idx = parseInt($that.attr('data-img-id'));

            // Frei Logo nicht ausschliessbar machen
            if (idx != 0 && !isNaN(idx)) {
                if ($that.hasClass("rote_zelle")) {
                    $that.removeClass("rote_zelle");
                    userRejected = jQuery.grep(userRejected, function (value) {
                        return value != idx;
                    });
                    userRejectedNum = userRejectedNum - 1;
                } else {
                    $that.addClass("rote_zelle", userRejected[userRejectedNum++] = idx);
                }
            }

            return null;
        }

        var id_img = parseInt($that.attr('data-img-id'));

        //console.log($that.attr('data-img-id'));
        //console.log(id_img);

        var buzzwordBusyToNum = _.reduce(buzzwordBusy, function (result, val, idx) {
            if (val) {
                result.push(idx);
            }
            return result;
        }, []);

        //console.log(buzzwordBusyToNum.length);
        //console.log(buzzwordBusy[id_img]);
        //console.log(buzzwordBusyToNum.length);

        // Wenn die Karte noch nicht geklickt wurde und
        // wenn nicht mehr als 6 Karten gleichzeitig angeklickt wurden, dann
        // werden die Klicks an den Server übertragen...
        if (buzzwordBusy[id_img] || buzzwordBusyToNum.length >= 6) {
            return null;
        }

        timeoutExit = 1;
        buzzwordBusy[id_img] = true;

        $that.addClass("orange_zelle");

        if ('BuzzwordsBody' == clickSource) {
            $that.addClass("questionbuzz");
        } else {
            $that.addClass("question");
        }

        $that.addClass("pulse-button");

        // -- AJAX POST REQUEST :: BEGIN -------------------------------------------------------------------

        // Buzzword id_img in DB schreiben
        if (!buzzwordConfirmed[id_img]) {
            $.ajax({
                type: 'POST',
                url: host + '/rest/click',
                crossDomain: false,
                data: JSON.stringify({card: id_img}),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                async: true,
                success: function (bingoResponseData) {
                    bingoResponseData.clicks.forEach(function (entry) {
                        if (entry.clicks >= 6) {
                            buzzwordConfirmed[entry.card] = true;
                        }
                        if (entry.clicks <= 6) {
                            if (!contains(intervallBuzzwords, entry.card)) {
                                intervallBuzzwords.push(entry.card);
                             }
                             console.log('intervallBuzzwords = ' + intervallBuzzwords);
                             console.log('entry.clicks = ' + entry.clicks);
                             console.log('entry.card = ' + entry.card);
                         } 
                    });

                    bingoResponseData.all_clicks.forEach(function (entry) {
                        if (entry.clicks >= 6) {
                            buzzwordConfirmed[entry.card] = true;
                            // karte aus intervallbuzzwords entfernen wenn all_clicks >6
                                if (contains(intervallBuzzwords, entry.card)) {
                                    intervallBuzzwords.splice($.inArray(entry.card, intervallBuzzwords),1);
                                }

                            console.log('all.clicks = ' + entry.clicks);
                            console.log('entry.card = ' + entry.card);
                        }
                    });

                    if (!buzzwordConfirmed[id_img]) {
                        checkBuzzword($that, clickSource, id_img);
                    } else {
                        activateBuzzword($that, clickSource, id_img);
                    }
                },
                error: function (bingoResponseData, textStatus, errorThrown) {
                    alert("Ajax failed to fetch data")
                }
            });
        } else {
            activateBuzzword($that, clickSource, id_img);
        }

        // -- AJAX POST REQUEST :: END ---------------------------------------------------------------------
    };

    /**
     * Check Buzzword.
     *
     * @param $that
     * @param clickSource
     * @param id_img
     */
    function checkBuzzword($that, clickSource, id_img) {
        // needed to wait for next ajax request
        timeoutExit++;

        // -- AJAX GET REQUEST :: BEGIN --------------------------------------------------------------------------------

        if (timeoutExit >= 2) {
            $.ajax({
                type: 'GET',
                url: host + '/rest/clicks',
                crossDomain: false,
                cache: false,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                async: false,
                success: function (bingoResponseData) {
                    bingoResponseData.all_clicks.forEach(function (entry) {
                        if (entry.clicks >= 6) {
                            buzzwordConfirmed[entry.card] = true;
                        }
                    });

                    activateBuzzword($that, clickSource, id_img);
                },
                error: function (bingoResponseData, textStatus, errorThrown) {
                    alert("Ajax failed to fetch data")
                }
            });
        }

        // -- AJAX POST REQUEST :: END ---------------------------------------------------------------------------------

        // rekursives Timeout für 40 mal alle 14 sekunden, unterbrochen von buzzwordbestätigung per DB
        if (!buzzwordConfirmed[id_img] && timeoutExit < 13) {
            setTimeout(function() {
                checkBuzzword($that, clickSource, id_img);
            }, 14000);
        }
    }

    /**
     * Activate Buzzword.
     *
     * @param $that
     * @param clickSource
     * @param id_img
     */
    function activateBuzzword($that, clickSource, id_img) {
        if (buzzwordConfirmed[id_img]) {
            clearTimeout(checkBuzzword);

            $that.removeClass("orange_zelle");

            if ('BuzzwordsBody' == clickSource) {
                $that.removeClass("questionbuzz");
            } else {
                $that.removeClass("question");
            }

            $that.removeClass("pulse-button");
            $that.addClass("gelbe_zelle");
            
            // idx = integerwert der geklickten zelle
            var idx = parseInt($that.attr('data-id'));

            // geklickete Zelle in bingoCard true setzen
            if ('BingoBody' == clickSource) {
                model.bingoCard[idx] = true;
            }

            // prüfen ob wonBuzzword Bonuspunkte vergeben werden und sternchen aufs feld setzen
            if (contains(intervallBuzzwords, id_img)) {
                  wonBuzzwords.push(id_img);
                  console.log('intervallBuzzwords = ' + intervallBuzzwords);
                  console.log('id_img = ' + id_img);
                  console.log('wonBuzzwords = ' + wonBuzzwords + 'wonBuzzwords = ' + $(wonBuzzwords).size());
                if ('BuzzwordsBody' == clickSource) {
                    $that.addClass("sternchenbuzz");
                } else {
                    $that.addClass("sternchen");
                }
            }

            // gewinnprüfen und score updaten
            checkWin(model.bingoCard);
            $('#score').html('<div style="width: 198px" id="scoreback">' + pad(totalScore, 6) + '</div>');


            buzzwordConfirmed[id_img] = true;
            buzzwordBusy[id_img] = false;
        } else if (!buzzwordConfirmed[id_img] && timeoutExit >= 13) {
            $that.removeClass("orange_zelle");

            if ('BuzzwordsBody' == clickSource) {
                $that.removeClass("questionbuzz");
            } else {
                $that.removeClass("question");
            }

            $that.removeClass("pulse-button");

            timeoutExit = 1;
            clearTimeout(checkBuzzword);

            buzzwordBusy[id_img] = false;

            // -- AJAX POST REQUEST :: BEGIN ---------------------------------------------------------------------------

            // Buzzword id_img aus der DB löschen!
            if (!buzzwordConfirmed[id_img]) {
                $.ajax({
                    type: 'DELETE',
                    url: host + '/rest/click/' + id_img,
                    crossDomain: false,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    async: true,
                    success: function (bingoResponseData) {
                    },
                    error: function (bingoResponseData, textStatus, errorThrown) {
                        alert("Ajax failed to fetch data");
                    }
                });
            }

            // -- AJAX POST REQUEST :: END -----------------------------------------------------------------------------
        }
    }

    $("#BingoBody td").click(function () {
        BuzzwordHandling($(this), 'BingoBody');
    });

    $("#BuzzwordsBody td").click(function () {
        BuzzwordHandling($(this), 'BuzzwordsBody');
    });

    function pad(n, width, z) {
        z = z || '0';
        n = n + '';

        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    function containsAll(needle, haystack) {
        for (var i = 0, len = needle.length; i < len; i++) {
            if ($.inArray(needle[i], haystack) == -1) return false;
        }

        return true;
    }

    function checkWin(bingoCard) {
        var convertedToNum = _.reduce(bingoCard, function (result, val, idx) {
            if (val) {
                result.push(idx);
            }
            return result;
        }, []);
        var i = 1;
        totalScore = 0;
        totalScore = wonBuzzwords.length * 10;
        $.each(winBoards, function (key, value) {
            if (containsAll(value, convertedToNum)) {
                wonBingos[i] = key;
                $('#result' + i).html(key + ' ' + value.length * 10 + ' punkte');
                totalScore = (totalScore + value.length * 10);

                $.each(winBoards, function (key, value) {

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

    /**********************************************************************************************
     * CountUp script by Praveen Lobo (http://PraveenLobo.com/techblog/javascript-countup-timer/)
     * This notice MUST stay intact(in both JS file and SCRIPT tag) for legal use.
     * http://praveenlobo.com/blog/disclaimer/
     **********************************************************************************************/
    function CountUp(initDate, id) {
        this.beginDate = new Date(initDate);
        this.countainer = document.getElementById(id);
        this.numOfDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.borrowed = 0, this.years = 0, this.months = 0, this.days = 0;
        this.hours = 0, this.minutes = 0, this.seconds = 0;
        this.updateNumOfDays();
        this.updateCounter();
    }

    CountUp.prototype.updateNumOfDays = function () {
        var dateNow = new Date();
        var currYear = dateNow.getFullYear();
        if ((currYear % 4 == 0 && currYear % 100 != 0 ) || currYear % 400 == 0) {
            this.numOfDays[1] = 29;
        }
        var self = this;
        setTimeout(function () {
            self.updateNumOfDays();
        }, (new Date((currYear + 1), 1, 2) - dateNow));
    };

    CountUp.prototype.datePartDiff = function (then, now, MAX) {
        var diff = now - then - this.borrowed;
        this.borrowed = 0;
        if (diff > -1) return diff;
        this.borrowed = 1;
        return (MAX + diff);
    };

    CountUp.prototype.calculate = function () {
        var currDate = new Date();
        var prevDate = this.beginDate;
        this.seconds = this.datePartDiff(prevDate.getSeconds(), currDate.getSeconds(), 60);
        this.minutes = this.datePartDiff(prevDate.getMinutes(), currDate.getMinutes(), 60);
        this.hours = this.datePartDiff(prevDate.getHours(), currDate.getHours(), 24);
        this.days = this.datePartDiff(prevDate.getDate(), currDate.getDate(), this.numOfDays[currDate.getMonth()]);
        this.months = this.datePartDiff(prevDate.getMonth(), currDate.getMonth(), 12);
        this.years = this.datePartDiff(prevDate.getFullYear(), currDate.getFullYear(), 0);
    };

    CountUp.prototype.addLeadingZero = function (value) {
        return value < 10 ? ("0" + value) : value;
    };

    CountUp.prototype.formatTime = function () {
        this.seconds = this.addLeadingZero(this.seconds);
        this.minutes = this.addLeadingZero(this.minutes);
        this.hours = this.addLeadingZero(this.hours);
    };

    CountUp.prototype.updateCounter = function () {
        this.calculate();
        this.formatTime();
        this.countainer.innerHTML =
            '<div style="padding-left: 5px; padding-top: 34px; overflow: visible;">' +
            this.hours + ':' +
            this.minutes + ':' +
            this.seconds +
            '</div>';
        var self = this;
        setTimeout(function () {
            self.updateCounter();
        }, 1000);
    };
});
