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
const timers = require("sdk/timers");
const data = require("sdk/self").data;
const panels = require("sdk/panel");
const Request = require("sdk/request").Request;
const clipboard = require("sdk/clipboard");
const prefSet = require("sdk/simple-prefs");
const prefs = prefSet.prefs;
const tabs = require("sdk/tabs");
const hlprs = require("./helpers");
//testing
var testing = false;
//const dev = require("./dev-testing");
require("sdk/preferences/service").set("javascript.options.strict", false);
var _ = require("sdk/l10n").get;
//FF 29+ only
var { ActionButton } = require("sdk/ui/button/action");   
var { Toolbar } = require("sdk/ui/toolbar"); 
var { Frame } = require("sdk/ui/frame");

var button = ActionButton({
    id: "bitcoin-ticker-plus-button",
    label: "Bitcoin Ticker Plus",
    icon: {
        "32": "./icons/icon32.png",
        "64": "./icons/icon64.png"
    },
    onClick: function(state) {
        tickerPanel.show();
    }
});

var frame = new Frame({
    url: "./ticker-frame.html",
    onMessage: function(e) {
        frameURL(e.data);
    }
});

function frameURL(url) {
    tabs.open(url);
}

var toolbar = Toolbar({
    title: "Bitcoin Ticker Plus Toolbar",
    items: [ frame ],
    onShow: toolbarShowing,
    onHide: toolbarHiding
});

function updateToolbarUI() {
     if (typeof toolbar.hidden != "undefined" && typeof mainData.ui != "undefined") {
        mainData.ui.toolbarhidden = toolbar.hidden;
    }
}

function toolbarAttached() {
  updateToolbarUI();
}
toolbar.on("attach", toolbarAttached);

//only called when toolbar is hidden or shown by user.
function toolbarShowing(e) {
  updateToolbarUI();
  frame.postMessage(JSON.stringify(mainData), frame.url);
}

function toolbarHiding(e) {
  updateToolbarUI();
  frame.postMessage(JSON.stringify(mainData), frame.url);
}

//frame loads late sometimes. 
function frameLoaded(e) {
    frame.postMessage(JSON.stringify(mainData), frame.url);
}

frame.on("load", frameLoaded);

var tickerPanel = panels.Panel({
    width: 550,
    height: 520,
    contentURL: data.url("ticker-panel.html"),
    contentScriptFile: [ data.url("js/jquery-2.1.0.min.js"), data.url("js/collapse.js"), data.url("js/transition.js"), data.url("js/helpers.js"), data.url("js/qrcode.js"), data.url("js/ticker-panel.js") ]
});
var checkOfflineTimeout;
tickerPanel.on("show", function() {
    mainData.ui.panelhidden = false;
    tickerPanel.port.emit("loadprefs", prefs, hlprs.packageJSON, mainData);
    tickerPanel.port.emit("updateData", mainData);
    timers.clearTimeout(checkOfflineTimeout);
    checkOfflineTimeout = timers.setTimeout(checkOffline, 10000);
    
});
tickerPanel.on("hide", function() {
    mainData.ui.panelhidden = true;
    tickerPanel.port.emit("updateData", mainData);
});

tickerPanel.port.on("showPanel", function(val) {
    if (val == true) {
        tickerPanel.show();
        } else {
        tickerPanel.hide();
    }
});
tickerPanel.port.on("contextCopy", function(contents) {
    clipboard.set(contents);
    tickerPanel.port.emit("contextCopy");
});

tickerPanel.port.on("contextPaste", function() {
    var contents = clipboard.get();
    tickerPanel.port.emit("contextPaste", contents);
});
tickerPanel.port.on("savePreferences", function(id, val) {
    panelPrefChange = true;
    if (Array.isArray(id)) {
        for (var i = 0; i < id.length; i++) {
            prefs[id[i]] = val;
        }
    } else {
        prefs[id] = val;
    }
    mainData.prefs = prefs;
});

var resetPref = false;

tickerPanel.port.on("resetPreferences", function(val) {
    resetPref = true;
    var prefJSON = Object.keys(hlprs.packageJSON.preferences);
    for (var i = 0; i < prefJSON.length; i++) {
        var pkgPref = hlprs.packageJSON.preferences[i];
        prefs[pkgPref.name] = pkgPref.value;
    }
    tickerPanel.port.emit("refreshprefs", prefs, hlprs.packageJSON, mainData);
    update("request", "all");
    resetPref = false;
});

var panelPrefChange = false;

function onPrefChange(id) {
    if (resetPref === true) {
        return;
    }
    if (id.indexOf("Enabled") != -1) {
        var api = id.replace("Enabled", "");
        if (prefs[id] === true) {
            if (!!mainData[api].json) {
                update("refresh", mainData[api].meta.type);
            } else {
                mainData[api].timestamp = null;
            }
            update("request", api);
            if (mainData[api].meta.type == "wallet") {
                timerStart(walletTimer, walletTick, parseInt(prefs.updateWalletData) * 1e3);
            } else if (mainData[api].meta.type == "news") {
                timerStart(newsTimer, newsTick, parseInt(prefs.updateNewsData) * 1e3);
            } else {
                timerStart(pricesTimer, pricesTick, parseInt(prefs.updatePriceData) * 1e3);
            }
        } else {
            update("refresh", mainData[api].meta.type);
        }
    } else if (id == "updatePriceData") {
        if (prefs.blockchainEnabled || prefs.coinbaseEnabled || prefs.bitpayEnabled || prefs.coindeskEnabled || prefs.localbitcoinsEnabled) {
            update("request", "prices");
            timerStart(pricesTimer, pricesTick, parseInt(prefs.updatePriceData) * 1e3);
        } else {
            timerStop(pricesTimer);
        }
    } else if (id == "updateWalletData" || id == "bitcoinAddress") {
        if (prefs.bitcoinAddress != "" && prefs.walletEnabled) {
            if (id == "bitcoinAddress") {
                mainData.wallet.timestamp = null;
            }
            update("request", "wallet");
            timerStart(walletTimer, walletTick, parseInt(prefs.updateWalletData) * 1e3);
        } else {
            update("refresh", "wallet");
            timerStop(walletTimer);
        }
    } else if (id == "updateNewsData") {
        if (prefs.coindesknewsEnabled || prefs.redditEnabled) {
            update("request", "news");
            timerStart(newsTimer, newsTick, parseInt(prefs.updateNewsData) * 1e3);
        } else {
            timerStop(newsTimer);
        }
    } else if (id == "blockchainCurrency") {
        update("refresh", "blockchain");
    } else if (id == "bitpayCurrency") {
        update("refresh", "bitpay");
    } else if (id == "coinbaseCurrency") {
        mainData.coinbase.timestamp = null;
        update("request", "coinbase");
    } else if (id == "localbitcoinsCurrency") {
        update("refresh", "localbitcoins");
    } else if (id == "coindeskCurrency") {
        mainData.coindesk.timestamp = null;
        update("request", "coindesk");
    } else if (id.indexOf("toolbar") != -1 && (id.indexOf("Font") != -1 || id.indexOf("Color") != -1 || id == "toolbarBackgroundTransparent")) {
        if (id == "toolbarFontSize") {
            if (prefs[id] > 20) {
                prefs[id] = 20;
            } else if (prefs[id] < 10) {
                prefs[id] = 10;
            } else {
                update("refresh", "css");
            }
        } else {
            update("refresh", "css");
        }
    } else if (id.indexOf("displayToolbar") != -1) {
        if (id == "displayToolbarBalance") {
            update("refresh", "wallet");
        } else if (id == "displayToolbarNews") {
            update("refresh", "news");
        } else {
            update("refresh", "prices");
        }
    } else if (id == "walletConverterAPI") {
        update("refresh", "wallet");
    } else if (id == "bitcoinDecimalPlaces") {
        if (prefs[id] > 8) {
            prefs[id] = 8;
        } else if (prefs[id] < 0) {
            prefs[id] = 0;
        } else {
            update("refresh", "all");
        }
    } else if (id == "tickerDisplaySpeed") {
        if (prefs[id] > 60) {
            prefs[id] = 60;
        } else if (prefs[id] < 1) {
            prefs[id] = 1;
        } else {
            update("refresh", "all");
        }
    } else {
        update("refresh", "all");
    }
    if (panelPrefChange == false) {
        tickerPanel.port.emit("refreshprefs", prefs, hlprs.packageJSON, mainData);
    }
    panelPrefChange = false;
}

prefSet.on("", onPrefChange);
var pricesTimer = {};

var walletTimer = {};

var newsTimer = {};



function timerStop(timer) {
    timers.clearInterval(timer.fn);
}

function timerStart(timer, ticker, ms) {
    timers.clearInterval(timer.fn);
    timer.fn = timers.setInterval(ticker, ms);
}

function pricesTick() {
    update("request", "prices");
}

function newsTick() {
    update("request", "news");
}

function walletTick() {
    update("request", "wallet");
}

function timeStamp(item) {
    var d = new Date();
    item.timestamp = d.getTime();
    item.datetimeLocale = hlprs.dateTimeLocale(item.timestamp, mainData.lang.locale);
}

function checkTimeStamp(item, ms) {
    var d = new Date();
    var t = d.getTime();
    if (item.timestamp) {
        var timeSince = t - item.timestamp;
        if (timeSince > ms) {
            return true;
        }
    }
    return false;
}

function checkOffline() {
    
    if (mainData.checkoffline && updating == false) {
        mainData.checkoffline = false;
        for (var api in mainData) {
            if (mainData[api].enabled && mainData[api].offline) {
                mainData[api].timestamp = null;
                mainData[api].offline = false;
                update("request", api);
            }
        }
    }
}


function apiRequest(requests, callback) {
    
    if (testing) {
        for (var key in requests) {
            console.log("req", requests[key].api);
        }
        callback();
    } else {
        var count = 1;
        var total = requests.length;
        requests.forEach(function(item) {
            var api = item.api;
            var url = item.url;
            if (typeof item.url == "undefined") {
                return;
            }
            var req = Request({
                url: item.url,
                headers: {
                    "Cache-Control": "max-age=60"
                },
                onComplete: function(response) {
                    if (response.json) {
                        mainData[api].json = response.json;
                        timeStamp(mainData[api]);
                        mainData[api].error = false;
                        mainData[api].offline = false;
                    } else {
                        var txt = response.text.toLowerCase();
                        if (txt.indexOf("validate") > -1 || txt.indexOf("character") > -1) {
                            mainData[api].checksumError = true;
                            mainData[api].json = null;
                        } else if (txt.indexOf("generating") > -1) {} else {
                            if (response.status != "0") {
                                mainData[api].json = null;
                                mainData[api].error = true;
                                tickerPanel.port.emit("alertPanel", "danger", mainData.lang.keyword.request + " " + mainData.lang.keyword.error +": " + mainData[api].meta.label  + " URL:" + url + "  Status:" + response.status + " " + response.statusText);
                                mainData[api].requestErrors++;
                            } else {
                                 tickerPanel.port.emit("alertPanel", "danger", mainData.lang.keyword.request + " " + mainData.lang.keyword.error +": " + mainData[api].meta.label + " URL:" + url);
                                mainData[api].offline = true;
                                mainData.checkoffline = true;
                                
                            }
                        }
                    }
                    if (count == total) {
                        callback();
                    } else {
                        count++;
                    }
                    mainData[api].requests++;
                }
            });
            req.get();
        });
    }
}
function updateToolTip() {
    var tooltipInfo = "Bitcoin Ticker Plus" + "\n";
    //tooltipInfo += "―――――― ―――――― ――――――" + "\n";
    tooltipInfo += "  " + "\n";
    if (mainData.disabled == false) {
        for (var api in mainData) {
            if (mainData[api].timestamp) {
                mainData[api].datetimeLocale = hlprs.dateTimeLocale(mainData[api].timestamp, mainData.lang.locale);
                if (mainData[api].enabled && mainData[api].meta.type == "prices" && mainData[api].price) {
                    tooltipInfo += mainData[api].meta.label + "\n" + mainData[api].priceLocale + " " + mainData[api].currency + " " + mainData[api].datetimeLocale + "\n";
                } else if (mainData.wallet.walletcheck && mainData[api].meta.type == "wallet" && mainData[api].balanceBTC) {
                    tooltipInfo += mainData.lang.keyword.balance + "\n" + mainData.wallet.balanceBTCSymbol + mainData.wallet.balanceBTC + " - " + mainData.wallet.balanceFiatLocale + " " + mainData.wallet.balanceFiatCurrency + " " + mainData[api].datetimeLocale + "\n";
                } else {
                    
                }
            }
        }
    } else {
        tooltipInfo += mainData.lang.keyword.offline + "\n";
    }
    button.label = tooltipInfo;
}

function isWalletOnCheck() {
    var api = mainData.prefs.walletConverterAPI;
    if (prefs.bitcoinAddress == "" || mainData.wallet.enabled == false || mainData[api].enabled == false) {
        return false;
    }
    return true;
}

function updateLocales() {
    var localeval = _("locale");
    if (localeval == "locale") {
        mainData.lang = hlprs.defaultlang;
        return;
    }
    var direction = "";
    if (localeval == "ar-EG") {
        direction = "rtl";
    } else {
        direction = "ltr";
    }
    mainData.lang = {
        locale: _("locale"),
        direction: direction,
        keyword: {
            bitcoin: _("bitcoin_keyword"),
            bitcoinaddress: _("bitcoin_address_keyword"),
            wallet: _("wallet_keyword"),
            balance: _("balance_keyword"),
            transactions: _("transactions_keyword"),
            price: _("price_keyword"),
            news: _("news_keyword"),
            currency: _("currency_keyword"),
            toolbar: _("toolbar_keyword"),
            ticker: _("ticker_keyword"),
            offline: _("offline_keyword"),
            error: _("error_keyword"),
            request: _("request_keyword")
        },
        preference: {
            bitcoinAddress_title: _("bitcoinAddress_title"),
            bitcoinAddress_description: _("bitcoinAddress_description"),
            walletConverterAPI_title: _("walletConverterAPI_title"),
            walletConverterAPI_description: _("walletConverterAPI_description"),
            blockchainCurrency_title: _("blockchainCurrency_title"),
            coinbaseCurrency_title: _("coinbaseCurrency_title"),
            bitpayCurrency_title: _("bitpayCurrency_title"),
            localbitcoinsCurrency_title: _("localbitcoinsCurrency_title"),
            coindeskCurrency_title: _("coindeskCurrency_title"),
            updatePriceData_title: _("updatePriceData_title"),
            updateWalletData_title: _("updateWalletData_title"),
            updateNewsData_title: _("updateNewsData_title"),
            updatePriceData_description: _("updatePriceData_description"),
            updateWalletData_description: _("updateWalletData_description"),
            updateNewsData_description: _("updateNewsData_description"),
            bitcoinDecimalPlaces_title: _("bitcoinDecimalPlaces_title"),
            bitcoinDecimalPlaces_description: _("bitcoinDecimalPlaces_description"),
            tickerDisplaySpeed_title: _("tickerDisplaySpeed_title"),
            tickerDisplaySpeed_description: _("tickerDisplaySpeed_description"),
            enableBlockchain_title: _("enableBlockchain_title"),
            enableCoinbase_title: _("enableCoinbase_title"),
            enableBitpay_title: _("enableBitpay_title"),
            enableLocalbitcoins_title: _("enableLocalbitcoins_title"),
            enableCoindesk_title: _("enableCoindesk_title"),
            enableCoindesknews_title: _("enableCoindesknews_title"),
            enableReddit_title: _("enableReddit_title"),
            enableWallet_title: _("enableWallet_title"),
            displayToolbarBalance_title: _("displayToolbarBalance_title"),
            displayToolbarPrices_title: _("displayToolbarPrices_title"),
            displayToolbarNews_title: _("displayToolbarNews_title"),
            displayToolbarPriceChange_title: _("displayToolbarPriceChange_title"),
            toolbarFontFamily_title: _("toolbarFontFamily_title"),
            toolbarFontSize_title: _("toolbarFontSize_title"),
            toolbarLabelFontColor_title: _("toolbarLabelFontColor_title"),
            toolbarBalanceFontColor_title: _("toolbarBalanceFontColor_title"),
            toolbarPriceFontColor_title: _("toolbarPriceFontColor_title"),
            toolbarPriceChangeUpColor_title: _("toolbarPriceChangeUpColor_title"),
            toolbarPriceChangeDownColor_title: _("toolbarPriceChangeDownColor_title"),
            toolbarLinkColor_title: _("toolbarLinkColor_title"),
            toolbarBackgroundColor_title: _("toolbarBackgroundColor_title"),
            toolbarBackgroundTransparent_title: _("toolbarBackgroundTransparent_title")
        },
        message: {
            service_using: _("message_service_using"),
            enable_wallet: _("message_enable_wallet"),
            add_address: _("message_add_address"),
            invalid_address: _("message_invalid_address"),
            service_disabled: _("message_service_disabled"),
            service_down: _("message_service_down"),
            service_updated: _("message_service_updated"),
            choose_another: _("message_choose_another"),
            wallet_down: _("message_wallet_down"),
            add_enable: _("message_add_enable"),
            see_more: _("message_see_more"),
            about_terms: _("about_terms"),
            context_copy: _("context_copy"),
            context_paste: _("context_paste"),
            context_clipboard: _("context_clipboard")
        }
    };
}

function checkDisabled() {
    for (var api in mainData) {
        if (mainData[api].enabled) {
            mainData.disabled = false;
            return
        }
    }
    mainData.disabled = true;
   
}
var updating = false;

function update(option, s) {
    if (updating == true && s == mainData.update) {
        return;
    }
 
    updating = true;
    mainData.updateoption = option;
    mainData.update = s;
    mainData.prefs = prefs;
    mainData.blockchain.enabled = prefs.blockchainEnabled;
    mainData.coinbase.enabled = prefs.coinbaseEnabled;
    mainData.bitpay.enabled = prefs.bitpayEnabled;
    mainData.localbitcoins.enabled = prefs.localbitcoinsEnabled;
    mainData.wallet.enabled = prefs.walletEnabled;
    mainData.coindesk.enabled = prefs.coindeskEnabled;
    mainData.coindesknews.enabled = prefs.coindesknewsEnabled;
    mainData.reddit.enabled = prefs.redditEnabled;
    checkDisabled();
    mainData.wallet.walletcheck = isWalletOnCheck();
    mainData.wallet.checksumError = false;
    updateLocales();
    updateToolbarUI();
    var requests = [];
    mainData.blockchain.meta = {
        api: "blockchain",
        url: "https://blockchain.info/ticker",
        label: "Blockchain",
        type: "prices"
    };
    mainData.coinbase.meta = {
        api: "coinbase",
        url: "https://coinbase.com/api/v1/prices/spot_rate?currency=" + prefs.coinbaseCurrency + "",
        label: "Coinbase",
        type: "prices"
    };
    mainData.bitpay.meta = {
        api: "bitpay",
        url: "https://bitpay.com/api/rates",
        label: "BitPay",
        type: "prices"
    };
    mainData.localbitcoins.meta = {
        api: "localbitcoins",
        url: "https://localbitcoins.com/bitcoinaverage/ticker-all-currencies/",
        label: "LocalBitcoins",
        type: "prices"
    };
    mainData.coindesk.meta = {
        api: "coindesk",
        url: "https://api.coindesk.com/v1/bpi/currentprice/" + prefs.coindeskCurrency + ".json",
        label: "CoinDesk",
        type: "prices"
    };
    mainData.coindesknews.meta = {
        api: "coindesknews",
        url: "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://feeds.feedburner.com/CoinDesk",
        label: "CoinDesk",
        type: "news"
    };
    mainData.reddit.meta = {
        api: "reddit",
        url: "http://www.reddit.com/r/Bitcoin/.json",
        label: "r/Bitcoin",
        type: "news"
    };
    mainData.wallet.meta = {
        api: "wallet",
        url: "https://blockchain.info/address/" + prefs.bitcoinAddress + "?format=json&limit=10",
        label: "Balance",
        type: "wallet"
    };
    if (option == "request") {
        for (var api in mainData) {
            if (mainData[api].meta) {
                if (s == api || s == mainData[api].meta.type || s == "all") {
                    if (mainData[api].enabled) {
                        if (mainData[api].timestamp) {
                            if (checkTimeStamp(mainData[api], 6e4)) {
                                if (api == "wallet" && mainData.wallet.walletcheck == false) {
                                    continue;
                                }
                                if (mainData[api].requestErrors < 16) {
                                    requests.push(mainData[api].meta);
                                } else {
                                    prefs[api + "Enabled"] = false;
                                    mainData[api].requestErrors = 0;
                                }
                            }
                        } else {
                            if (api == "wallet" && mainData.wallet.walletcheck == false) {
                                continue;
                            }
                            if (mainData[api].requestErrors < 16) {
                                requests.push(mainData[api].meta);
                            } else {
                                prefs[api + "Enabled"] = false;
                                mainData[api].requestErrors = 0;
                            }
                        }
                    }
                }
            }
        }
        if (requests.length > 0) {
            apiRequest(requests, function() {
                doUpdate();
            });
        } else {
            doUpdate();
        }
    } else {
        doUpdate();
    }
}


function errorJSON(api) {
    mainData[api].error = true;
    tickerPanel.port.emit("alertPanel", "danger", "JSON " + mainData.lang.keyword.error + " " + api + ". JSON has changed. You can disable " + api + " and notify developer.");
}

function checkUpdateExchange(api, price) {
    if (mainData.updateoption == "request" && (mainData.update == api || mainData.update == mainData[api].meta.type || mainData.update == "all") && mainData[api].price != price) {
        return true;
    }
    if (mainData.updateoption == "refresh" && mainData.update != "css" && (mainData.update == api || mainData.update == mainData[api].meta.type || mainData.update == "all") || mainData[api].price != price) {
        return true;
    }
    return false;
}

function updateExchange(exch, price, currency, buy, sell, locales) {
    exch.buy = buy;
    exch.sell = sell;
    if (!exch.lastprice) {
        exch.lastprice = price;
    }
    if (exch.price) {
        exch.lastprice = exch.price;
    }
    if (exch.lastcurrency != currency) {
        exch.lastprice = price;
        exch.lastcurrency = currency;
    }
    exch.pricechange = hlprs.priceChange(price, exch.lastprice);
    exch.pricechangeamount = hlprs.priceChangeAmount(price, exch.lastprice);
    exch.price = price;
    exch.currency = currency;
    exch.priceLocale = hlprs.currencyLocale(exch.price, locales, exch.currency);
    exch.lastpriceLocale = hlprs.currencyLocale(exch.lastprice, locales, exch.currency);
    exch.buyLocale = hlprs.currencyLocale(exch.buy, locales, exch.currency);
    exch.sellLocale = hlprs.currencyLocale(exch.sell, locales, exch.currency);
}

function doUpdate() {
 
    for (var api in mainData) {
        var price = 0;
        var currency = "USD";
        var buy = 0;
        var sell = 0;
        if (typeof mainData[api].meta == "undefined") {
            continue;
        }
        if (api == "blockchain" && mainData.blockchain.json && mainData[api].enabled) {
            currency = prefs.blockchainCurrency;
            if (mainData[api].json.hasOwnProperty(currency) && mainData[api].json[currency].hasOwnProperty("last")) {
                price = mainData.blockchain.json[currency]["last"];
                if (checkUpdateExchange(api, price)) {
                    updateExchange(mainData[api], price, currency, buy, sell, mainData.lang.locale);
                }
            } else {
                errorJSON(api);
            }
        }
        if (api == "coinbase" && mainData[api].json && mainData[api].enabled) {
            currency = prefs.coinbaseCurrency;
            if (mainData[api].json.hasOwnProperty("amount")) {
                price = mainData.coinbase.json["amount"];
                if (checkUpdateExchange(api, price)) {
                    updateExchange(mainData[api], price, currency, buy, sell, mainData.lang.locale);
                }
            } else {
                errorJSON(api);
            }
        }
        if (api == "bitpay" && mainData[api].json && mainData[api].enabled) {
            currency = prefs.bitpayCurrency;
            price = 0;
            for (var i = 0; i < mainData.bitpay.json.length; i++) {
                var c = mainData.bitpay.json[i];
                if (c.code == currency) {
                    price = c.rate;
                    if (checkUpdateExchange(api, price)) {
                        updateExchange(mainData[api], price, currency, buy, sell, mainData.lang.locale);
                    }
                }
            }
            if (price < 1) {
                errorJSON(api);
            }
        }
        if (api == "localbitcoins" && mainData.localbitcoins.json && mainData[api].enabled) {
            currency = prefs.localbitcoinsCurrency;
            if (mainData[api].json.hasOwnProperty(currency) && mainData[api].json[currency].hasOwnProperty("rates") && mainData[api].json[currency].rates.hasOwnProperty("last")) {
                price = mainData.localbitcoins.json[currency].rates.last;
                if (checkUpdateExchange(api, price)) {
                    updateExchange(mainData[api], price, currency, buy, sell, mainData.lang.locale);
                }
            } else {
                errorJSON(api);
            }
        }
        if (api == "coindesk" && mainData[api].json && mainData[api].enabled) {
            currency = prefs.coindeskCurrency;
            if (mainData[api].json.hasOwnProperty("bpi") && mainData[api].json["bpi"].hasOwnProperty(currency) && mainData[api].json["bpi"][currency].hasOwnProperty("rate_float")) {
                price = mainData.coindesk.json["bpi"][currency]["rate_float"];
                if (checkUpdateExchange(api, price)) {
                    updateExchange(mainData[api], price, currency, buy, sell, mainData.lang.locale);
                }
            } else {
                errorJSON(api);
            }
        }
        if (api == "reddit" && mainData[api].json && mainData[api].enabled) {
            if (!mainData[api].json.hasOwnProperty("data") && !mainData[api].json["data"].hasOwnProperty("children")) {
                errorJSON(api);
            }
        }
        if (api == "coindesknews" && mainData[api].json && mainData[api].enabled) {
            if (!mainData[api].json.hasOwnProperty("responseData") && !mainData[api].json.responseData.hasOwnProperty("feed") && !mainData[api].json.responseData.feed.hasOwnProperty("entries")) {
                errorJSON(api);
            }
        }
        if (api == "wallet" && mainData[api].json && mainData[api].enabled) {
            if (mainData[api].checksumError == false) {
                if (mainData.wallet.json.hasOwnProperty("final_balance") && mainData.wallet.json.hasOwnProperty("total_sent") && mainData.wallet.json.hasOwnProperty("total_received")) {
                    var api = mainData.prefs.walletConverterAPI;
                    var balanceSAT = mainData.wallet.json["final_balance"];
                    var sentSAT = mainData.wallet.json["total_sent"];
                    var receivedSAT = mainData.wallet.json["total_received"];
                    var btcDecimals = Number(mainData.prefs.bitcoinDecimalPlaces);
                    var balanceBTC8 = hlprs.satoshiToBitcoin(balanceSAT, 8);
                    var sentBTC8 = hlprs.satoshiToBitcoin(sentSAT, 8);
                    var receivedBTC8 = hlprs.satoshiToBitcoin(receivedSAT, 8);
                    var balanceBTC = hlprs.satoshiToBitcoin(balanceSAT, btcDecimals);
                    var sentBTC = hlprs.satoshiToBitcoin(sentSAT, btcDecimals);
                    var receivedBTC = hlprs.satoshiToBitcoin(receivedSAT, btcDecimals);
                    var balanceFiat = hlprs.bitcoinToPrice(balanceBTC8, mainData[api].price);
                    var sentFiat = hlprs.bitcoinToPrice(sentBTC8, mainData[api].price);
                    var receivedFiat = hlprs.bitcoinToPrice(receivedBTC8, mainData[api].price);
                    mainData.wallet.balanceFiatLocale = hlprs.currencyLocale(balanceFiat, mainData.lang.locale, mainData[api].currency);
                    mainData.wallet.sentFiatLocale = hlprs.currencyLocale(sentFiat, mainData.lang.locale, mainData[api].currency);
                    mainData.wallet.receivedFiatLocale = hlprs.currencyLocale(receivedFiat, mainData.lang.locale, mainData[api].currency);
                    mainData.wallet.balanceBTCSymbol = "฿";
                    mainData.wallet.balanceBTC = balanceBTC;
                    mainData.wallet.balanceFiat = balanceFiat;
                    mainData.wallet.balanceFiatCurrency = mainData[api].currency;
                    mainData.wallet.sentBTC = sentBTC;
                    mainData.wallet.receivedBTC = receivedBTC;
                    mainData.wallet.sentFiat = sentFiat;
                    mainData.wallet.receivedFiat = receivedFiat;
                } else {
                    mainData.wallet.json = null;
                    errorJSON(api);
                }
            }
        }
    }
    
   
     if (mainData.ui.panelhidden == false){
    tickerPanel.port.emit("updateData", mainData);
    }
    if (mainData.ui.toolbarhidden == false){
    frame.postMessage(JSON.stringify(mainData), frame.url);
    }
    updateToolTip();
    mainData.update = "";
    mainData.updateoption = "";
    updating = false;
}
var mainData = {};

function init() {
    mainData = {};
    mainData.blockchain = {};
    mainData.coinbase = {};
    mainData.bitpay = {};
    mainData.localbitcoins = {};
    mainData.coindesk = {};
    mainData.coindesknews = {};
    mainData.reddit = {};
    mainData.wallet = {};
    for (var api in mainData) {
        mainData[api].requests = 0;
        mainData[api].requestErrors = 0;
        mainData[api].error = false;
        mainData[api].offline = false;
        mainData[api].json = null;
    }
    mainData.ui = {};
    mainData.disabled = false;
    mainData.wallet.checksumError = false;
    mainData.checkoffline = false;
    mainData.prefs = prefs;
    updateLocales();
    mainData.blockchain.enabled = prefs.blockchainEnabled;
    mainData.coinbase.enabled = prefs.coinbaseEnabled;
    mainData.bitpay.enabled = prefs.bitpayEnabled;
    mainData.localbitcoins.enabled = prefs.localbitcoinsEnabled;
    mainData.wallet.enabled = prefs.walletEnabled;
    mainData.coindesk.enabled = prefs.coindeskEnabled;
    mainData.coindesknews.enabled = prefs.coindesknewsEnabled;
    mainData.reddit.enabled = prefs.redditEnabled;
    timerStart(pricesTimer, pricesTick, parseInt(prefs.updatePriceData) * 1e3);
    if (prefs.bitcoinAddress != "" && mainData.wallet.enabled) {
        timerStart(walletTimer, walletTick, parseInt(prefs.updateWalletData) * 1e3);
    }
    if (mainData.reddit.enabled || mainData.coindesknews.enabled) {
        timerStart(newsTimer, newsTick, parseInt(prefs.updateNewsData) * 1e3);
    }
    mainData.ui.toolbarhidden = true;
    mainData.ui.panelhidden = true;
    update("request", "all");
    
    //in case there is a first run delay with one of the requests, update what we have after 2 secs
    timers.setTimeout(doUpdate, 2000);
}

function firstRun() {
    var localeval = _("locale");
    if (localeval != "locale") {
        resetPref = true;
        if (testing) {
            console.log("*****testing*****");
            prefs.blockchainEnabled = false;
            prefs.coinbaseEnabled = false;
            prefs.bitpayEnabled = false;
            prefs.localbitcoinsEnabled = false;
            prefs.walletEnabled = false;
            prefs.coindeskEnabled = false;
            prefs.coindesknewsEnabled = false;
            prefs.redditEnabled = false;
            prefs.bitcoinAddress = "1helloworldtest12345";
        }
        prefs.coinbaseCurrency = _("default_currency");
        prefs.bitpayCurrency = _("default_currency");
        prefs.coindeskCurrency = _("default_currency");
        if (localeval == "es-MX" || localeval == "ar-EG" || localeval == "en-IN") {
            prefs.blockchainCurrency = "USD";
        } else {
            prefs.blockchainCurrency = _("default_currency");
        }
        if (localeval == "zh-CN") {
            prefs.localbitcoinsCurrency = "HKD";
        } else if (localeval == "ar-EG" || localeval == "ja-JP") {
            prefs.localbitcoinsCurrency = "USD";
        } else {
            prefs.localbitcoinsCurrency = _("default_currency");
        }
        resetPref = false;
    }
}
exports.main = function(options, callbacks) {
    if (options.loadReason == "install") {
        firstRun();
    }
   init();
};



