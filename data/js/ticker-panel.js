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

function cleanUp() {
    for (var api in mainData) {
        mainData[api].json = null;
    }
}

var alertMessage = function(id, message) {
    $("#alert-messages").append($("<div>", {
        "class": "alert alert-" + id,
        text: message
    }).delay(25000).fadeOut(300, function() {
        $(this).remove();
    }));
   
};

self.port.on("alertPanel", alertMessage);

var updateData = function(data) {
    mainData = data;
    if (typeof mainData.prefs != "undefined") {
        if (mainData.ui.panelhidden) {
            $("#ticker-news").empty();
            $("#ticker-market").empty();
           $("#wallet-data").empty();
        } else {
            if (mainData.disabled) {
                $("#ticker-news").empty();
                $("#ticker-market").empty();
                $("#ticker-market").append($("<div>", {
                    "class": "offline"
                }).append($("<span>", {
                    "class": "glyphicon glyphicon-off"
                })).append($("<span>", {
                    text: mainData.lang.keyword.offline
                })));
                //display default messages
                updateWallet();
                updateConverter();
            } else {
                if (mainData.update == "prices") {
                    updateMarketTicker();
                    updateWallet();
                    updateConverter();
                } else if (mainData.update == "wallet") {
                    updateWallet();
                    updateConverter();
                } else if (mainData.update == "news") {
                    updateNewsTicker();
                } else {
                    updateMarketTicker();
                    updateNewsTicker();
                    updateWallet();
                    updateConverter();
                }
            }
        }
        cleanUp();
    }
};

self.port.on("updateData", updateData);

var rotationMarketTimer;

var rotationNewsTimer;

function rotationTick(jqDiv) {
    $(jqDiv + " div:first").animate({
        opacity: 0
    }, 300, function() {
        $(jqDiv + "  div:nth-child(2)").css({
            opacity: "1",
            display: "block"
        });
        $(jqDiv + "  div:first").css({
            opacity: "1",
            display: "none"
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
        opacity: "1",
        display: "block"
    });
}

function updateNewsTicker() {
    $("#ticker-news").empty();
    var truncNum = 80;
    if (mainData.coindesknews.enabled && mainData.coindesknews.error == false && mainData.coindesknews.json) {
        var coindeskNews = mainData.coindesknews.json.responseData.feed.entries;
        for (var i = 0; i < coindeskNews.length; i++) {
            var title = coindeskNews[i].title;
            var link = coindeskNews[i].link;
            var titleTruncated = title.substring(0, truncNum);
            var href = link;
            $("#ticker-news").append($("<div>", {
                "class": "ticker-item"
            }).css({
                opacity: "0",
                display: "none"
            }).append($("<div>", {
                "class": "ticker-heading"
            }).append($("<span>", {
                "class": "ticker-label"
            }).text(mainData.lang.keyword.news + " " + mainData.coindesknews.meta.label))).append($("<div>", {
                "class": "ticker-body"
            }).append($("<a>", {
                "class": "ticker-news-url",
                href: href,
                target: "_blank"
            }).text(titleTruncated + "..."))));
        }
    }
    if (mainData.reddit.enabled && mainData.reddit.error == false && mainData.reddit.json) {
        var reddit = mainData.reddit.json;
        for (var i = 0; i < reddit.data.children.length; i++) {
            var title = reddit.data.children[i].data.title;
            var titleTruncated = title.substring(0, truncNum);
            if (i > 0) {
                var href = "http://www.reddit.com/" + reddit.data.children[i].data.permalink + "";
                $("#ticker-news").append($("<div>", {
                    "class": "ticker-item"
                }).css({
                    opacity: "0",
                    display: "none"
                }).append($("<div>", {
                    "class": "ticker-heading"
                }).append($("<span>", {
                    "class": "ticker-label"
                }).text(mainData.lang.keyword.news + " " + mainData.reddit.meta.label))).append($("<div>", {
                    "class": "ticker-body"
                }).append($("<a>", {
                    "class": "ticker-news-url",
                    href: href,
                    target: "_blank"
                }).text(titleTruncated + "..."))));
            }
        }
    }
    rotateNewsTicker();
}

function rotateMarketTicker() {
    clearInterval(rotationMarketTimer);
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
        opacity: "1",
        display: "block"
    });
}

function updateMarketTicker() {
    $("#ticker-market").empty();
    for (var api in mainData) {
        if (typeof mainData[api].price != "undefined" && mainData[api].enabled && mainData[api].error == false && mainData[api].meta.type == "prices") {
            if (isNumber(Number(mainData[api].price))) {
                var tickerPrice = mainData[api].priceLocale;
                var lastPrice = mainData[api].lastpriceLocale;
                var changeAmount = mainData[api].pricechangeamount;
                var changePercent = mainData[api].pricechange + "%";
                var changeText = "";
                var svgH = 10;
                var svgW = 16;
                var changeClass = "";
                var changeColor = "";
                var svgPath = "";
                if (changeAmount < 0) {
                    changeClass = "ticker-price-change-down";
                    changeColor = "#FF7A7A";
                    svgPath = "m -0.38951846,5.9958731 7.93644806,9.8241949 7.9364484,-9.8241949 -15.87289646,0 z";
                    changeText = lastPrice + " " + changeAmount + "  " + changePercent;
                } else if (changeAmount > 0) {
                    changeClass = "ticker-price-change-up";
                    changeColor = "#7DC037";
                    svgPath = "m -0.38951846,15.820068 7.93644806,-9.8241949 7.9364484,9.8241949 -15.87289646,0 z";
                    changeText = lastPrice + " " + changeAmount + "  " + changePercent;
                } else {
                    changeClass = "ticker-price-change-zero";
                    changeColor = "#FFFFFF";
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
                g.appendChild(path);
                $("#ticker-market").append($("<div>", {
                    "class": "ticker-item"
                }).css({
                    opacity: "0",
                    display: "none"
                }).append($("<div>", {
                    "class": "ticker-heading"
                }).append($("<span>", {
                    "class": "ticker-label"
                }).text(mainData[api].meta.label)).append($("<span>", {
                    "class": "ticker-price"
                }).text(" " + tickerPrice))).append($("<div>", {
                    "class": "ticker-body"
                }).append(svgElem).append($("<span>", {
                    "class": "ticker-price-change-text"
                }).text(changeText).css({
                    color: changeColor
                }))));
            }
        }
    }
    rotateMarketTicker();
}

function appendMessage(id, type, message, api) {
    if (typeof message == "undefined") {
        return;
    }
    var box = $(id);
    box.append($("<div>", {
        "class": "message-box text-" + type
    }));
    var n = message.indexOf("[b]");
    if (n > -1) {
        var start = message.slice(0, n);
        $("div:last-child", box).text(start);
    } else {
        $("div:last-child", box).text(message);
        return;
    }
    var m = message.split("[b]");
    for (var i = 1; i < m.length; i++) {
        var m2 = m[i].split("[/b]");
        var bolded = m2[0].replace("[/b]", "").trim();
        if (bolded == "api") {
            bolded = api;
        }
        $("div:last-child", box).append($("<strong>", {
            text: bolded
        }));
        $("div:last-child", box).append(document.createTextNode(m2[1]));
    }
}

function updateWallet() {
    $("#wallet-data").empty();
    var api = mainData.prefs.walletConverterAPI;
    var keyword = mainData.lang.keyword;
    var message = mainData.lang.message;
    if (mainData.wallet.checksumError == false && mainData.wallet.error == false && mainData.wallet.json && mainData.wallet.walletcheck == true && mainData.wallet.balanceBTC) {
        var btcDecimals = mainData.prefs.bitcoinDecimalPlaces;
        var btcSymbol = mainData.wallet.balanceBTCSymbol;
        var balanceBTC = mainData.wallet.balanceBTC;
        var sentBTC = mainData.wallet.sentBTC;
        var receivedBTC = mainData.wallet.receivedBTC;
        var balanceFiat = mainData.wallet.balanceFiatLocale;
        var sentFiat = mainData.wallet.sentFiatLocale;
        var receivedFiat = mainData.wallet.receivedFiatLocale;
        $("#wallet-panel-title-balance").text(btcSymbol + balanceBTC + "  " + balanceFiat);
        $("#wallet-data").append($("<table>", {
            "class": "table"
        }).append($("<thead>").append($("<tr>").append($("<th>").text(keyword.wallet + " " + keyword.balance)))).append($("<tbody>", {
            id: "wallet-data-tbody"
        }).append($("<tr>", {
            "class": "info"
        }).append($("<td>").text("Balance:")).append($("<td>").text(btcSymbol + balanceBTC)).append($("<td>").text(balanceFiat))).append($("<tr>", {
            "class": ""
        }).append($("<td>").text("Total Received:")).append($("<td>").text(btcSymbol + receivedBTC)).append($("<td>").text(receivedFiat))).append($("<tr>", {
            "class": ""
        }).append($("<td>").text("Total Sent:")).append($("<td>").text(btcSymbol + sentBTC)).append($("<td>").text(sentFiat)))));
        appendMessage("#wallet-data", "info", message.service_using, api);
        if ($.isArray(mainData.wallet.json.txs) && mainData.wallet.json.txs.length > 0) {
            var address = mainData.wallet.json["address"];
            var transactionsNum = mainData.wallet.json["n_tx"];
            var transactionsLength = mainData.wallet.json.txs.length;
            var r = 0;
            var firstResult = mainData.wallet.json.txs[0].result;
            if (firstResult == 0 && transactionsLength > 1) {
                r = 1;
            }
            $("#wallet-data").append($("<table>", {
                id: "wallet-transaction-table",
                "class": "table"
            }).append($("<thead>").append($("<tr>").append($("<th>").text("" + keyword.transactions + " (" + transactionsNum + ")")))).append($("<tbody>", {
                id: "wallet-transactions-tbody"
            })));
            for (var i = 0; i < transactionsLength - r; i++) {
                var txs = mainData.wallet.json.txs[i];
                var hash = txs.hash;
                var hashTruncated = hash.substring(0, 8) + "...";
                var time = dateTimeLocale(txs.time, mainData.lang.locale);
                if (r == 0) {
                    var result = mainData.wallet.json.final_balance;
                } else {
                    var result = mainData.wallet.json.txs[i + r].result;
                }
                var trClass = "";
                if (result >= 0) {
                    trClass = "success";
                } else {
                    trClass = "danger";
                }
                var hashLink = "https://blockchain.info/tx/" + hash;
                $("#wallet-transactions-tbody").append($("<tr>", {
                    "class": trClass
                }).append($("<td>").append($("<a>", {
                    href: hashLink,
                    target: "_blank",
                    text: hashTruncated
                }))).append($("<td>").text(btcSymbol + satoshiToBitcoin(result, btcDecimals))).append($("<td>").text(time)));
            }
            $("#wallet-data").append($("<div>", {
                "class": "well well-sm"
            }).text(message.see_more + " ").append($("<span>").append($("<a>", {
                href: "https://blockchain.info/address/" + address,
                target: "_blank",
                text: "blockchain.info"
            }))));
        }
        $("#bitcoinAddress-wrap").removeClass("has-error").addClass("has-success");
    } else {
        $("#wallet-data").empty();
        $("#wallet-panel-title-balance").text("");
        if (mainData.wallet.enabled == false && mainData.prefs.bitcoinAddress != "") {
            appendMessage("#wallet-data", "warning", message.enable_wallet, api);
        } else if (mainData.wallet.enabled == true && mainData.prefs.bitcoinAddress == "") {
            appendMessage("#wallet-data", "warning", message.add_address, api);
        } else if (mainData.wallet.checksumError == true && mainData.wallet.walletcheck == true) {
            appendMessage("#wallet-data", "warning", message.invalid_address, api);
            $("#bitcoinAddress-wrap").removeClass("has-success").addClass("has-error");
            $("#collapseWallet").collapse("show");
        } else if (mainData[api].enabled == false) {
            appendMessage("#wallet-data", "warning", message.service_disabled, api);
            appendMessage("#wallet-data", "warning", message.choose_another, api);
        } else if (typeof mainData[api].price === "undefined" || mainData[api].error == true) {
            appendMessage("#wallet-data", "warning", message.service_down, api);
            appendMessage("#wallet-data", "warning", message.choose_another, api);
        } else if (mainData.wallet.walletcheck == true && mainData.wallet.checksumError == false && mainData.wallet.error == true) {
            appendMessage("#wallet-data", "warning", message.wallet_down, api);
        } else {
            appendMessage("#wallet-data", "warning", message.add_enable, api);
            $("#bitcoinAddress-wrap").removeClass("has-success").removeClass("has-error");
        }
    }
}

function updateConverter() {
    var api = mainData.prefs.walletConverterAPI;
    var message = mainData.lang.message;
    if (mainData[api].enabled) {
        if (mainData[api].error == false && mainData[api].currency) {
            $("#converter-bitcoin-currency1").removeAttr("disabled");
            $("#converter-bitcoin-currency2").removeAttr("disabled");
            $("#converter-currency-label").text(mainData[api].currency);
            $("#converter-info-box").empty();
            appendMessage("#converter-info-box", "info", message.service_using, api);
            appendMessage("#converter-info-box", "info", message.service_updated + " " + mainData[api].datetimeLocale, api);
            if ($("#converter-bitcoin-currency1").is(":focus") == false && $("#converter-bitcoin-currency2").is(":focus") == false) {
                $("#converter-bitcoin-currency1").trigger("blur");
                $("#converter-bitcoin-currency2").trigger("blur");
            }
        } else {
            $("#converter-info-box").empty();
            $("#converter-bitcoin-currency1").val("");
            $("#converter-bitcoin-currency2").val("");
            $("#converter-bitcoin-currency1").attr("disabled", true);
            $("#converter-bitcoin-currency2").attr("disabled", true);
            appendMessage("#converter-info-box", "warning", message.service_down, api);
            appendMessage("#converter-info-box", "warning", message.choose_another, api);
        }
    } else {
        $("#converter-info-box").empty();
        appendMessage("#converter-info-box", "warning", message.service_disabled, api);
        appendMessage("#converter-info-box", "warning", message.choose_another, api);
        $("#converter-bitcoin-currency1").val("");
        $("#converter-bitcoin-currency2").val("");
        $("#converter-bitcoin-currency1").attr("disabled", true);
        $("#converter-bitcoin-currency2").attr("disabled", true);
    }
}

var converterBTC = 0;

var converterFiat = 0;

$("#converter-bitcoin-currency1").focus(function() {
    converterBTC = 0;
}).blur(function() {
    if (mainData.prefs && mainData.lang.locale) {
        var api = mainData.prefs.walletConverterAPI;
        if (mainData[api].enabled && mainData[api].error == false && mainData[api].currency) {
            converterBTC = parseFloat($("#converter-bitcoin-currency1").val().replace(/[^0-9-.]/g, ""));
            if (converterBTC > 0) {
                var amount = bitcoinToPrice(converterBTC, mainData[api].price);
                amount = currencyLocale(amount, mainData.lang.locale, mainData[api].currency);
                $("#converter-bitcoin-currency2").val(amount);
            } else {
                $("#converter-bitcoin-currency2").val("");
            }
            converterBTC = 0;
        }
    }
});

$("#converter-bitcoin-currency2").focus(function() {
    converterFiat = 0;
}).blur(function() {
    if (mainData.prefs && mainData.lang.locale) {
        var api = mainData.prefs.walletConverterAPI;
        if (mainData[api].enabled && mainData[api].error == false && mainData[api].currency) {
            converterFiat = parseFloat($("#converter-bitcoin-currency2").val().replace(/[^0-9-.]/g, ""));
            if (converterFiat > 0) {
                var btcDecimals = 8;
                var amount = fiatToBitcoin(converterFiat, mainData[api].price, btcDecimals);
                $("#converter-bitcoin-currency1").val(parseFloat(amount));
                amount2 = currencyLocale(converterFiat, mainData.lang.locale, mainData[api].currency);
                $("#converter-bitcoin-currency2").val(amount2);
            } else {
                $("#converter-bitcoin-currency1").val("");
            }
            converterFiat = 0;
        }
    }
});
//qr code
$("#qr-code-bitcoin-address").focus(function() {}).blur(function() {
    var qrText = $("#qr-code-bitcoin-address").val().trim();
    if (qrText == "") {
        $("#qrcode").empty();
        $("#qr-box").hide();
    }
});

$("#qr-generate").click(function() {
    $("#qrcode").empty();
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        width: 200,
        height: 200
    });
    var qrText = $("#qr-code-bitcoin-address").val().trim();
    if (qrText != "") {
        qrcode.makeCode(qrText);
        $("#qr-box").show();
    } else {
        $("#qr-code-bitcoin-address").val("");
    }
});

$("#qr-save-btn").click(function() {
    var src = $("#qrcode img").attr("src");
    if (src.charAt(0) == "d") {
        window.open(src);
        self.port.emit("showPanel", false);
    }
});
//prefs
function localize(id, type, str) {
    if (mainData.lang.preference.hasOwnProperty(id + "_" + type)) {
        str = mainData.lang.preference[id + "_" + type];
    }
    return str;
}

var preferences = {
    config: {
        wrapper: "#preferences-body"
    },
    load: function(prefs, packageJSON) {
        $(preferences.config.wrapper).empty();
        html = "";
        var prefJSON = Object.keys(packageJSON.preferences);
        for (var i = 0; i < prefJSON.length; i++) {
            var pkgPref = packageJSON.preferences[i];
            var setVal = prefs[pkgPref.name];
            pkgPref.title = localize(pkgPref.name, "title", pkgPref.title);
            pkgPref.description = localize(pkgPref.name, "description", pkgPref.description);
            switch (pkgPref.type) {
              case "bool":
                preferences.checkbox(pkgPref, setVal);
                break;

              case "string":
                preferences.input(pkgPref, setVal, "text");
                break;

              case "integer":
                preferences.input(pkgPref, setVal, "number");
                break;

              case "color":
                preferences.input(pkgPref, setVal, "color");
                break;

              case "menulist":
                preferences.select(pkgPref, setVal);
                break;

              default:
                html += "need to add element to pkg pref";
                $(preferences.config.wrapper).text(html);
            }
        }
    },
    input: function(pkgPref, setVal, type) {
        $(preferences.config.wrapper).append($("<div>", {
            id: pkgPref.name + "-wrap"
        }).append($("<label>", {
            id: pkgPref.name + "-label",
            "class": "control-label",
            "for": pkgPref.name,
            text: pkgPref.title
        })).append($("<input>", {
            type: type,
            id: pkgPref.name,
            "class": "form-control",
            placeholder: pkgPref.title,
            value: setVal
        })).append($("<span>", {
            "class": "help-block",
            id: pkgPref.name + "-help",
            text: pkgPref.description
        })));
        if (type == "color" || type == "number") {
            $("#" + pkgPref.name).change(function() {
                preferenceChanged(this.id, this.value);
            });
        } else {
            $("#" + pkgPref.name).blur(function() {
                $("#" + this.id).attr("value", this.value);
                preferenceChanged(this.id, this.value);
            });
        }
    },
    select: function(pkgPref, setVal) {
        $(preferences.config.wrapper).append($("<div>", {
            id: pkgPref.name + "-wrap"
        }).append($("<label>", {
            id: pkgPref.name + "-label",
            "class": "control-label",
            "for": pkgPref.name,
            text: pkgPref.title
        })).append($("<select>", {
            id: pkgPref.name,
            "class": "form-control"
        })));
        $.each(pkgPref.options, function(i, item) {
            if (setVal == item.value) {
                $("#" + pkgPref.name).append($("<option>", {
                    value: item.value,
                    text: item.label,
                    selected: "selected"
                }));
            } else {
                $("#" + pkgPref.name).append($("<option>", {
                    value: item.value,
                    text: item.label
                }));
            }
        });
        $("#" + pkgPref.name + "-wrap").append($("<div>", {
            "class": "help-block",
            id: pkgPref.name + "-help",
            text: pkgPref.description
        }));
        $("#" + pkgPref.name).change(function() {
            preferenceChanged(this.id, this.value);
        });
    },
    checkbox: function(pkgPref, setVal) {
        $(preferences.config.wrapper).append($("<div>", {
            id: pkgPref.name + "-wrap"
        }).append($("<label>", {
            id: pkgPref.name + "-label"
        })));
        if (setVal == true) {
            $("#" + pkgPref.name + "-label").append($("<input>", {
                id: pkgPref.name,
                type: "checkbox",
                checked: "checked"
            }));
        } else {
            $("#" + pkgPref.name + "-label").append($("<input>", {
                id: pkgPref.name,
                type: "checkbox"
            }));
        }
        $("#" + pkgPref.name).after(" " + pkgPref.title);
        if (pkgPref.description) {
            $("#" + pkgPref.name + "-wrap").append($("<span>", {
                "class": "help-block",
                text: pkgPref.description
            }));
        }
        $("#" + pkgPref.name).change(function() {
            var bool = $("#" + pkgPref.name + "").prop("checked");
            preferenceChanged(this.id, bool);
        });
    }
};

function loadPrefs(prefs, packageJSON, data) {
    mainData = data;
    var direction = mainData.lang.direction;
    var aligns = "left";
    if (direction == "rtl") {
        aligns = "right";
    }
    $("html").attr({
        dir: direction,
        align: aligns
    });
    $("#eula_link").attr("href", "https://addons.mozilla.org/" + mainData.lang.locale + "/firefox/addon/bitcoin-ticker-plus/eula/").text(mainData.lang.message.about_terms);
    preferences.load(prefs, packageJSON);
    $("#collapseWallet").collapse("show");
    $("#bitcoinDecimalPlaces").attr({
        max: 8,
        min: 0
    });
    $("#tickerDisplaySpeed").attr({
        max: 60,
        min: 1
    });
    $("#toolbarFontSize").attr({
        max: 20,
        min: 10
    });
}

self.port.once("loadprefs", loadPrefs);

self.port.on("refreshprefs", loadPrefs);

$("#reset-default").click(function() {
    self.port.emit("resetPreferences", true);
    $("#reset-default").attr("disabled", true);
    setTimeout(function() {
        $("#reset-default").removeAttr("disabled");
    }, 5e4);
});

function preferenceCheckEnableAPI(api, val) {
    if (mainData.prefs.walletConverterAPI == api && val == false) {
        $("#walletConverterAPI-wrap ").addClass(" has-warning ");
        $("#wallet-panel-title-balance").text("");
    } else if (mainData.prefs.walletConverterAPI == api && val == true) {
        $("#walletConverterAPI-wrap").removeClass("has-warning ");
        $(".alert-warning").remove();
    } else {}
}

function preferenceChanged(id, val) {
    if (!mainData.prefs) {
        return;
    }
    if (id.indexOf("Enabled") != -1) {
        var api = id.replace("Enabled", "");
        if (api == "wallet") {
            if (val == false) {
                $("#wallet-panel-title-balance").text("");
                $("#collapseWallet").collapse("hide");
                $("#wallet-data").empty();
            } else {
                $("#collapseWallet").collapse("show");
            }
        } else {
            if (mainData[api].meta.type == "prices") {
                preferenceCheckEnableAPI(api, val);
            }
        }
        self.port.emit("savePreferences", id, val);
    } else if (id == "bitcoinAddress") {
        val = val.trim();
        if (val != "") {
            if (checkAddress(val)) {
                self.port.emit("savePreferences", id, val);
                $("#collapseWallet").collapse("show");
            } else {
                $("#bitcoinAddress-wrap").removeClass("has-success").addClass("has-error");
            }
        } else {
            $("#bitcoinAddress-wrap").removeClass("has-error").removeClass("has-success");
            self.port.emit("savePreferences", id, "");
        }
    } else if (id == "walletConverterAPI") {
        var api = val;
        if (mainData[api].enabled) {
            $("#walletConverterAPI-wrap").removeClass("has-warning ");
            $(".alert-warning").remove();
        } else {
            $("#wallet-panel-title-balance").text("");
            $("#walletConverterAPI-wrap").addClass("has-warning ");
        }
        self.port.emit("savePreferences", id, val);
    } else if (id == "tickerFontFamily") {
        if (val.trim() == "") {
            var defaultFont = '"Helvetica Neue",Helvetica,Arial,sans-serif';
            self.port.emit("savePreferences", id, defaultFont);
            $("#tickerFontFamily").val(defaultFont);
        } else {
            self.port.emit("savePreferences", id, val);
        }
    } else if ($("#" + id).attr("type") == "number") {
        self.port.emit("savePreferences", id, Number(val));
    } else if (id == "updatePriceData" || id == "updateWalletData" || id == "updateNewsData") {
        self.port.emit("savePreferences", id, Number(val));
    } else if (id.indexOf("Color") != -1) {
        self.port.emit("showPanel", true);
        self.port.emit("savePreferences", id, val);
    } else {
        self.port.emit("savePreferences", id, val);
    }
}
var activeInputId;

$("body").click(function() {
    $("#context-menu-box").remove();
});

function contextCopy() {
    $("#context-menu-box").remove();
    var jqElement = "#" + activeInputId;
    var w = $(jqElement).width() + 25;
    var appendWrap = "";
    if ($(jqElement + "-wrap .input-group-btn").length || $(jqElement + "-wrap .input-group-addon").length) {
        appendWrap = "-wrap";
    }
    $(jqElement + appendWrap).after($("<div>", {
        "class": "copied-alert alert alert-success"
    }).append($("<strong>", {
        text: mainData.lang.message.context_clipboard
    })).css("width", w + "px"));
    
    $(".copied-alert").slideUp(1800, function() {
        $(".copied-alert").remove();
    });
}
function contextPaste(contents) {
    $("#" + activeInputId).focus().val(contents);
    $("#context-menu-box").remove();
}

self.port.on("contextCopy", contextCopy);

self.port.on("contextPaste", contextPaste);

$("#options-menu").on("click", "#btn-copy", function(event) {
    var contents = $("#" + activeInputId).val().trim();
    self.port.emit("contextCopy", contents);
});

$("#options-menu").on("click", "#btn-paste", function(event) {
    self.port.emit("contextPaste");
});

//document.oncontextmenu = function() {
    //return false;
//};

$("body").mousedown('input',function(e) {
    if (e.button == 2) {
        var activeElement = document.activeElement;
        var jqElement = "#" + activeElement.id;
        var jqElementType = $(jqElement).attr("type");
        if (jqElementType == "text" && typeof $(jqElement).val() != "undefined") {
            activeInputId = activeElement.id;
            var appendWrap = "";
            if ($(jqElement + "-wrap .input-group-btn").length || $(jqElement + "-wrap .input-group-addon").length) {
                appendWrap = "-wrap";
            }
            $("#context-menu-box").remove();
            $(jqElement + appendWrap).after($("<div>", {
                id: "context-menu-box",
                "class": "btn-group btn-group-xs"
            }).append($("<button>", {
                id: "btn-copy",
                "class": "btn btn-default",
                type: "button",
                text: mainData.lang.message.context_copy
            })).append($("<button>", {
                id: "btn-paste",
                "class": "btn btn-default",
                type: "button",
                text: mainData.lang.message.context_paste
            })));
        }
    }
});

//end context

