/*
 * This file is part of Bitcoin Ticker Plus <https://addons.mozilla.org/en-US/firefox/user/anoder/>,
 * Copyright (C) 2014 
 *
 * Bitcoin Ticker Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Bitcoin Ticker Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Bitcoin Ticker Plus.  If not, see <http://www.gnu.org/licenses/>.
 */

var mainData = {};

function updateTicker(message) {
    mainData = JSON.parse(message.data);
    if (typeof mainData.prefs != "undefined") {
        if (mainData.ui.toolbarhidden) {
            $("#ticker-wallet").empty();
            $("#ticker-market").empty();
            $("#ticker-news").empty();
        } else {
            if (mainData.disabled) {
                $("#ticker-wallet").empty();
                $("#ticker-market").empty();
                $("#ticker-news").empty();
                $("#ticker-market").append($("<div>", {
                    "class": "offline"
                }).append($("<span>", {
                    text: mainData.lang.keyword.offline
                })));
                updateUserCSS();
            } else {
                if (mainData.update == "prices") {
                    updateMarketTicker();
                    updateWalletTicker();
                    updateUserCSS();
                } else if (mainData.update == "wallet") {
                    updateWalletTicker();
                    updateUserCSS();
                } else if (mainData.update == "news") {
                    updateNewsTicker();
                    updateUserCSS();
                } else if (mainData.update == "css") {
                    updateUserCSS();
                } else {
                    updateMarketTicker();
                    updateWalletTicker();
                    updateNewsTicker();
                    updateUserCSS();
                }
            }
        }
        var prefs = mainData.prefs;
        mainData = {};
        mainData.prefs = prefs;
    }
    doResize();
}
window.addEventListener("message", updateTicker, false);

function updateUserCSS() {
    var direction = mainData.lang.direction;
    var aligns = "left";
    if (direction == "rtl") {
        aligns = "right";
    }
    $("html").attr({
        dir: direction,
        align: aligns
    });
    var bgColor = "";
    var imgDisplay = "";
    if (mainData.prefs.toolbarBackgroundTransparent != true) {
        imgDisplay = "block";
        bgColor = mainData.prefs.toolbarBackgroundColor;
    } else {
        imgDisplay = "none";
        bgColor = "transparent";
    }
    var fontSize = parseInt(mainData.prefs.toolbarFontSize);
    if (fontSize < 8 && fontSize > 18) {
        fontSize = 14;
    }
    $("#ticker-img").css({
        display: imgDisplay
    });
    $(".ticker-label").css({
        color: mainData.prefs.toolbarLabelFontColor
    });
    $(".ticker-price").css({
        color: mainData.prefs.toolbarPriceFontColor
    });
    $(".ticker-balance").css({
        color: mainData.prefs.toolbarBalanceFontColor
    });
    $(".ticker-price-change-down").css({
        color: mainData.prefs.toolbarPriceChangeDownColor
    });
    $(".ticker-price-change-up").css({
        color: mainData.prefs.toolbarPriceChangeUpColor
    });
    $(".ticker-price-change-down-path").css({
        fill: mainData.prefs.toolbarPriceChangeDownColor
    });
    $(".ticker-price-change-up-path").css({
        fill: mainData.prefs.toolbarPriceChangeUpColor
    });
    $(".ticker-price-change-zero").css({
        color: mainData.prefs.toolbarPriceFontColor
    });
    var svgH = parseInt(mainData.prefs.toolbarFontSize) - 5;
    var svgW = svgH + 8;
    $("#ticker-market svg").css({
        width: svgW,
        height: svgH
    });
    $("a").css("color", mainData.prefs.toolbarLinkColor);
    $("#ticker-box").css({
        "font-size": fontSize + "px",
        "font-family": mainData.prefs.toolbarFontFamily,
        "background-color": bgColor
    });
}

function updateWalletTicker() {
    var api = mainData.prefs.walletConverterAPI;
    var html = "";
    $("#ticker-wallet").empty();
    if (mainData.wallet.checksumError == false && mainData.wallet.error == false && mainData.wallet.walletcheck == true && mainData.wallet.balanceBTC && mainData.prefs.displayToolbarBalance && mainData.wallet.json) {
        var btcSymbol = mainData.wallet.balanceBTCSymbol;
        var balanceBTC = mainData.wallet.balanceBTC;
        var balanceFiat = mainData.wallet.balanceFiatLocale;
        var balanceLabel = mainData.lang.keyword.balance; 
        $("#ticker-wallet").append($("<div>", {
            "class": "ticker-item"
        }).append($("<span>", {
            "class": "ticker-label"
        }).text(balanceLabel)).append($("<span>", {
            "class": "ticker-balance"
        }).text(btcSymbol + balanceBTC)).append($("<span>", {
            "class": "ticker-balance"
        }).text(balanceFiat)));
    }
}
var rotationMarketTimer;

var rotationNewsTimer;

function rotationTick(jqDiv) {
    $(jqDiv + " div:first").animate({
        opacity: 0
    }, 200, function() {
        $(jqDiv + "  div:nth-child(2)").css({
            opacity: "1"
        });
        $(jqDiv + "  div:first").css({
            opacity: "0"
        }).appendTo($(jqDiv));
    });
}

$("#ticker-market").hover(function(e) {
    clearInterval(rotationMarketTimer);
}, function(e) {
    if (typeof mainData.prefs != "undefined") {
        rotateMarketTicker();
    }
});

$("#ticker-news").hover(function(e) {
    clearInterval(rotationNewsTimer);
}, function(e) {
    if (typeof mainData.prefs != "undefined") {
        rotateNewsTicker();
    }
});

function rotateMarketTicker() {
    clearInterval(rotationMarketTimer);
    var speed = parseInt(mainData.prefs.tickerDisplaySpeed);
    if (speed < 1) {
        speed = 5;
    }
    var count = $("#ticker-market .ticker-item").length;
    if (count > 1) {
        rotationMarketTimer = setInterval(function() {
            rotationTick("#ticker-market");
        }, 1e3 * speed);
    }
    $("#ticker-market div:first").css({
        opacity: "1"
    });
}

function updateMarketTicker() {
    $("#ticker-market").empty();
    for (var api in mainData) {
        if (typeof mainData[api].price != "undefined" && mainData[api].error == false && mainData[api].enabled && mainData[api].meta.type == "prices" && mainData.prefs.displayToolbarPrices) {
            if (isNumber(Number(mainData[api].price))) {
                var tickerLabel = mainData[api].meta.label;
                var tickerPrice = mainData[api].priceLocale;
                if (mainData.prefs.displayToolbarPriceChange) {
                    var lastPrice = mainData[api].lastpriceLocale;
                    var changeAmount = mainData[api].pricechangeamount;
                    var changePercent = mainData[api].pricechange + "%";
                    var changeText = "";
                    var svgH = parseInt(mainData.prefs.toolbarFontSize) - 5;
                    var svgW = svgH + 8;
                    var changeClass = "";
                    var changeColor = "";
                    var svgPath = "";
                    if (changeAmount < 0) {
                        changeClass = "ticker-price-change-down";
                        changeColor = mainData.prefs.toolbarPriceChangeDownColor;
                        svgPath = "m -0.38951846,5.9958731 7.93644806,9.8241949 7.9364484,-9.8241949 -15.87289646,0 z";
                        changeText = lastPrice + " " + changeAmount + "  " + changePercent;
                    } else if (changeAmount > 0) {
                        changeClass = "ticker-price-change-up";
                        changeColor = mainData.prefs.toolbarPriceChangeUpColor;
                        svgPath = "m -0.38951846,15.820068 7.93644806,-9.8241949 7.9364484,9.8241949 -15.87289646,0 z";
                        changeText = lastPrice + " " + changeAmount + "  " + changePercent;
                    } else {
                        changeClass = "ticker-price-change-zero";
                        changeColor = mainData.prefs.toolbarPriceFontColor;
                        svgPath = "";
                        changeText = lastPrice + " 0.00  0.00%";
                    }
                    var xmlns = "http://www.w3.org/2000/svg";
                    var svgElem = document.createElementNS(xmlns, "svg");
                    svgElem.setAttributeNS(null, "viewBox", "0 0 " + svgW + " " + svgH);
                    svgElem.setAttributeNS(null, "width", svgW);
                    svgElem.setAttributeNS(null, "height", svgH);
                    var g = document.createElementNS(xmlns, "g");
                    svgElem.appendChild(g);
                    g.setAttributeNS(null, "transform", "translate(0.47961747,-5.8651181)");
                    var path = document.createElementNS(xmlns, "path");
                    path.setAttributeNS(null, "stroke", "none");
                    path.setAttributeNS(null, "d", svgPath);
                    path.setAttributeNS(null, "fill", changeColor);
                    path.setAttributeNS(null, "opacity", 1);
                    path.setAttributeNS(null, "class", changeClass + "-path");
                    g.appendChild(path);
                    $("#ticker-market").append($("<div>", {
                        "class": "ticker-item"
                    }).css({
                        opacity: "0"
                    }).append($("<span>", {
                        "class": "ticker-label"
                    }).text(tickerLabel)).append($("<span>", {
                        "class": "ticker-price"
                    }).text(tickerPrice)).append($("<span>", {
                        "class": changeClass
                    }).css({
                        color: changeColor
                    }).append(svgElem).append($("<span>", {
                        "class": "ticker-price-change-text"
                    }).text(changeText))));
                } else {
                    $("#ticker-market").append($("<div>", {
                        "class": "ticker-item"
                    }).css({
                        opacity: "0"
                    }).append($("<span>", {
                        "class": "ticker-label"
                    }).text(tickerLabel)).append($("<span>", {
                        "class": "ticker-price"
                    }).text(tickerPrice)));
                }
            }
        }
    }
    rotateMarketTicker();
}

function rotateNewsTicker() {
    clearInterval(rotationNewsTimer);
    var speed = parseInt(mainData.prefs.tickerDisplaySpeed);
    if (speed < 1) {
        speed = 5;
    }
    var count = $("#ticker-news .ticker-item").length;
    if (count > 1) {
        rotationNewsTimer = setInterval(function() {
            rotationTick("#ticker-news");
        }, 1e3 * speed);
    }
    $("#ticker-news div:first").css({
        opacity: "1"
    });
}

function updateNewsTicker() {
    $("#ticker-news").empty();
    if (mainData.prefs.displayToolbarNews) {
        if (mainData.coindesknews.enabled && mainData.coindesknews.error == false && mainData.coindesknews.json) {
            var coindeskNews = mainData.coindesknews.json.responseData.feed.entries;
            for (var i = 0; i < coindeskNews.length; i++) {
                var title = coindeskNews[i].title;
                var link = coindeskNews[i].link;
                var titleTruncated = title;
                var href = link;
                $("#ticker-news").append($("<div>", {
                    "class": "ticker-item"
                }).css({
                    opacity: "0"
                }).append($("<span>", {
                    "class": "ticker-label"
                }).text(mainData.lang.keyword.news + " " + mainData.coindesknews.meta.label)).append($("<a>", {
                    "class": "ticker-news-url",
                    href: href,
                    target: "_blank"
                }).text(titleTruncated + "...")));
            }
        }
        if (mainData.reddit.enabled && mainData.reddit.error == false && mainData.reddit.json) {
            var reddit = mainData.reddit.json;
            for (var i = 0; i < reddit.data.children.length; i++) {
                var title = reddit.data.children[i].data.title;
                var titleTruncated = title;
                if (i > 0) {
                    var href = "http://www.reddit.com/" + reddit.data.children[i].data.permalink + "";
                    $("#ticker-news").append($("<div>", {
                        "class": "ticker-item"
                    }).css({
                        opacity: "0"
                    }).append($("<span>", {
                        "class": "ticker-label"
                    }).text(mainData.lang.keyword.news + " " + mainData.reddit.meta.label)).append($("<a>", {
                        "class": "ticker-news-url",
                        href: href,
                        target: "_blank"
                    }).text(titleTruncated + "...")));
                }
            }
        }
    }
    rotateNewsTicker();
}

function doResize() {
    $("#ticker-box").css({
        width: $("body").width() + "px"
    });
    var tickerWidth = $("#ticker-box").width();
    var tickerNonScalable = $("#ticker-non-scalable").width();
    var avaliableWidth = tickerWidth - tickerNonScalable - 20;
    $("#ticker-news").css({
        width: avaliableWidth + "px"
    });
}

$(window).resize(function() {
    doResize();
});
//for news urls. You can't click from from frame.
$("#ticker-news").on("click", ".ticker-news-url", function(e) {
    e.preventDefault();
    var url = $(this).attr("href");
    window.parent.postMessage(url, "*");
});


