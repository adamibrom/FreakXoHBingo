$(document).ready(function () {

    
    
    $("#BuzzwordsBody td").click(function () {
        if (userRejectedNum >= missingBingoCardsCount && !$(this).hasClass("rote_zelle")) {
            // nothing!!
        } else {
            if (!playMode) {
                // idx = integerwert der geklickten zelle
                var idx = parseInt($(this).attr('data-img-id'));

                // Frei Logo nicht ausschliessbar machen
                if (idx != 0 && !isNaN(idx)) {
                    if ($(this).hasClass("rote_zelle")) {
                        $(this).removeClass("rote_zelle");
                        userRejected = jQuery.grep(userRejected, function (value) {
                            return value != idx;
                        });
                        userRejectedNum = userRejectedNum - 1;
                    } else {
                        $(this).addClass("rote_zelle", userRejected[userRejectedNum++] = idx);
                    }

                    //console.log(idx);
                    //console.log(userRejectedNum);
                    //console.log(userRejected);
                }
            } else {
                var id_img = parseInt($(this).attr('data-img-id'));

                var buzzwordBusyToNum = _.reduce(buzzwordBusy, function (result, val, idx) {
                    if (val) {
                        result.push(idx);
                    }
                    return result;
                }, []);

                //console.log(buzzwordBusyToNum.length);

                // Wenn die Karte noch nicht geklickt wurde und
                // wenn nicht mehr als 3 Karten gleichzeitig angeklickt wurden, dann
                // werden die Klicks an den Server übertragen...
                if (!buzzwordBusy[id_img] && buzzwordBusyToNum.length < 3) {
                    buzzwordBusy[id_img] = true;
                    $(this).addClass("orange_zelle");
                    $(this).addClass("questionbuzz");
                    $(this).addClass("pulse-button");

                    var timeoutExit = 1;

                    // -- AJAX POST REQUEST :: BEGIN ---------------------------------------------------------------

                    // Buzzword id_img in DB schreiben
                    if (!buzzwordConfirmed[id_img]) {
                        $.ajax({
                            type: 'POST',
                            url: host + '/rest/click',
                            crossDomain: false,
                            data: JSON.stringify({card: id_img}),
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'json',
                            async: false,
                            success: function (bingoResponseData) {
                                bingoResponseData.clicks.forEach(function (entry) {
                                    if (entry.clicks >= 6) {
                                        buzzwordConfirmed[entry.card] = true;
                                    }
                                });
                            },
                            error: function (bingoResponseData, textStatus, errorThrown) {
                                alert("Ajax failed to fetch data")
                            }
                        });
                    }

                    // -- AJAX POST REQUEST :: END -----------------------------------------------------------------

                    // this in das timeout intervall überführen
                    var that = this;

                    // rekursives Timeout für 40 mal alle 14 sekunden, unterbrochen von buzzwordbestätigung per DB
                    (function checkBuzzword() {
                        //console.log(id_img);
                        //console.log(timeoutExit);

                        // simulation nde
                        // needed to wait for next ajax request
                        timeoutExit++;

                        // simulierter probabilistik erfolg -> ENTER DB ABFRAGE HERE!
                        /*
                         if (timeoutExit >= 5) {
                         buzzwordConfirmed[id_img] = true;
                         }
                         */

                        // -- AJAX GET REQUEST :: BEGIN --------------------------------------------------------

                        $.ajax({
                            type: 'GET',
                            url: host + '/rest/clicks',
                            crossDomain: false,
                            cache: false,
                            contentType: 'application/json; charset=utf-8',
                            dataType: 'json',
                            async: true,
                            success: function (bingoResponseData) {
                                bingoResponseData.clicks.forEach(function (entry) {
                                    if (entry.clicks >= 6) {
                                        buzzwordConfirmed[entry.card] = true;
                                    } else {
                                        //buzzwordConfirmed[entry.card] = true;
                                        console.log('entry.clicks ' + entry.clicks);
                                        console.log('entry.card ' + entry.card);
                                        console.log(bingoResponseData);
                                    }

                                });
                            }
                        });

                        /*
                         $.ajax({
                         type: 'GET',
                         url: host + '/rest/click',
                         crossDomain: false,
                         cache: false,
                         contentType: 'application/json; charset=utf-8',
                         dataType: 'json',
                         async: true,
                         success: function (bingoResponseData) {
                         bingoResponseData.clicks.forEach(function (entry) {
                         if (entry.clicks >= 6) {
                         buzzwordConfirmed[entry.card] = true;
                         } else {
                         //buzzwordConfirmed[entry.card] = true;
                         console.log('entry.clicks ' + entry.clicks);
                         console.log('entry.card ' + entry.card);
                         //console.log(bingoResponseData);
                         }

                         });
                         }
                         });
                         */

                        // -- AJAX POST REQUEST :: END ---------------------------------------------------------

                        if (!buzzwordConfirmed[id_img] && timeoutExit < 13) {
                            //console.log(buzzwordConfirmed[id_img]);
                            setTimeout(checkBuzzword, 14000);
                        }

                        if (buzzwordConfirmed[id_img]) {
                            $(that).removeClass("orange_zelle");
                            $(that).removeClass("questionbuzz");
                            $(that).removeClass("pulse-button");
                            $(that).addClass("gelbe_zelle");
                            // idx = integerwert der geklickten zelle
                            var idx = parseInt($(that).attr('data-id'));
                            // geklickete Zelle in bingoCard true setzen
                            // model.bingoCard[idx] = true;
                            // checkWin(model.bingoCard);
                            // $('#score').html('<div style="width: 198px" id="scoreback">' + pad(totalScore, 6) + '</div>');
                            buzzwordConfirmed[id_img] = true;
                            buzzwordBusy[id_img] = false;
                        } else {
                            if (!buzzwordConfirmed[id_img] && timeoutExit >= 13) {
                                $(that).removeClass("orange_zelle");
                                $(that).removeClass("questionbuzz");
                                $(that).removeClass("pulse-button");
                                timeoutExit = 1;
                                clearTimeout(checkBuzzword);
                                buzzwordBusy[id_img] = false;

                                // -- AJAX POST REQUEST :: BEGIN ---------------------------------------------------------------

                                // Buzzword id_img in DB schreiben
                                if (!buzzwordConfirmed[id_img]) {
                                    $.ajax({
                                        type: 'DELETE',
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
                                            });
                                        },
                                        error: function (bingoResponseData, textStatus, errorThrown) {
                                            alert("Ajax failed to fetch data")
                                        }
                                    });
                                }

                                // -- AJAX POST REQUEST :: END -----------------------------------------------------------------
                            }
                        }
                    }());
                }
            }
        }
    });
});