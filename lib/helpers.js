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

exports.priceChange = function(currentPrice, lastPrice) {

return ((currentPrice - lastPrice) / lastPrice * 100).toFixed(2);
}  

exports.priceChangeAmount = function(currentPrice, lastPrice) {
return (currentPrice - lastPrice).toFixed(2);
}  

exports.satoshiToBitcoin = function(satoshis, dec) {
    var btc = Number(satoshis / 1e8);
    btc = Math.floor(btc * Math.pow(10,dec))/Math.pow(10,dec);
    return btc.toFixed(dec);
}

exports.bitcoinToPrice = function(bitcoins, price) {
    var amount = Number(bitcoins * price);
    return amount;
}

exports.fiatToBitcoin = function(fiat, price, dec) {
    var amount = Number(fiat / price).toFixed(dec);
    return amount;
}

exports.currencyLocale = function(amount, locales, currencycode) {
    
    return Number(amount).toLocaleString(locales, {style: "currency", currency: currencycode});
}
exports.dateTimeLocale = function(timestamp, locales) {
    //var options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};
     var time = new Date(timestamp);
    return time.toLocaleString(locales);
}

exports.averageNum = function(numArray) {
    var sum = 0;
    var average = 0;
    for (var i = 0; i < numArray.length; i++) {
        sum += parseInt(numArray[i]);
    }
    return average = sum / numrray.length;
}

//added support for a few languages. This is default.

exports.defaultlang = {
    locale: "en-US",
    direction: "ltr",
    keyword: {
        bitcoin: "Bitcoin",
        bitcoinaddress: "Bitcoin Address",
        wallet: "Wallet",
        balance: "Balance",
        transactions: "Transactions",
        price: "Price",
        news: "News",
        currency: "Currency",
        toolbar: "Toolbar",
        ticker: "Ticker",
        offline: "Offline",
        error: "Error",
        request: "Request"
    },

    preference: {
        bitcoinAddress_title: "Bitcoin Address",
        bitcoinAddress_description: "Add a Bitcoin address. (public key, starts with a 1 or 3)",
        walletConverterAPI_title: "Wallet and Converter Pricing",
        walletConverterAPI_description: "Prices and Currency to use for wallet and converter.",
        blockchainCurrency_title: "Blockchain Currency",
        coinbaseCurrency_title: "Coinbase Currency",
        bitpayCurrency_title: "BitPay Currency",
        localbitcoinsCurrency_title: "LocalBitcoins Currency",
        coindeskCurrency_title: "CoinDesk Currency",
        updatePriceData_title: "Update Price Data",
        updateWalletData_title: "Update Wallet Data",
        updateNewsData_title: "Update News Data",
        updatePriceData_description: "time between updates (minutes)",
        updateWalletData_description: "time between updates (minutes)",
        updateNewsData_description: "time between updates (minutes)",
        bitcoinDecimalPlaces_title: "Bitcoin Decimal Places",
        bitcoinDecimalPlaces_description: " 0-8 default 6 (won't affect currency converter)",
        tickerDisplaySpeed_title: "Ticker Display Speed",
        tickerDisplaySpeed_description: "Rotation speed in seconds",
        enableBlockchain_title: "Enable Blockchain",
        enableCoinbase_title: "Enable Coinbase",
        enableBitpay_title: "Enable Bitpay",
        enableLocalbitcoins_title: "Enable LocalBitcoins",
        enableCoindesk_title: "Enable CoinDesk",
        enableCoindesknews_title: "Enable CoinDesk News",
        enableReddit_title: "Enable Reddit News",
        enableWallet_title: "Enable Wallet",
        displayToolbarBalance_title: "Display Toolbar Balance",
        displayToolbarPrices_title: "Display Toolbar Prices",
        displayToolbarNews_title: "Display Toolbar News",
        displayToolbarPriceChange_title: "Display Toolbar Price Change",
        toolbarFontFamily_title: "Toolbar Font Family",
        toolbarFontSize_title: "Toolbar Font Size",
        toolbarLabelFontColor_title: "Toolbar Label Font Color",
        toolbarBalanceFontColor_title: "Toolbar Balance Font Color",
        toolbarPriceFontColor_title: "Toolbar Price Font Color",
        toolbarPriceChangeUpColor_title: "Toolbar Price Change Up Font Color",
        toolbarPriceChangeDownColor_title: "Toolbar Price Change Down Font Color",
        toolbarLinkColor_title: "Toolbar Link Color",
        toolbarBackgroundColor_title: "Toolbar Background Color",
        toolbarBackgroundTransparent_title: "Toolbar Background Transparent"
    },
    message: {
        service_using: "Using [b]api[/b] prices and currency settings.",
        enable_wallet: "Enable Wallet Balance in Preferences to view wallet.",
        add_address: "Add a Bitcoin Address in Preferences to view wallet.",
        invalid_address: "Bitcoin Address is invalid.",
        service_disabled: "The selected pricing service [b]api[/b] is disabled.",
        service_down: "The selected pricing service [b]api[/b] is down.",
        service_updated: "Prices updated at",
        choose_another: "You can choose another one in preferences.",
        wallet_down: "No data to display. Blockchain.info might be down.",
        add_enable: "Add a Bitcoin Address and Enable Wallet in Preferences to view wallet.",
        see_more: "See more at",
        about_terms:"End-User License Agreement",
        context_clipboard:"Copied to clipboard!",
        context_copy:"Copy",
        context_paste:"Paste"
    }
};



//for rendering preferences in panel. easier this way. or is it...
exports.packageJSON = {
    "name": "bitcoin-ticker-plus-wallet",
    "title": "Bitcoin Ticker Plus Wallet, Converter and QR Code Generator",
    "id": "jid1-vsVS1O2vQdwINg",
    "description": "Bitcoin Ticker Plus",
    "author": "https://addons.mozilla.org/en-US/firefox/user/anoder/",
    "license": "GPL v3",
    "version": "2.5.0",
    "icon": "data/icons/icon48.png",
    "icon64": "data/icons/icon64.png",
    "permissions": {
        "private-browsing": true
    },
    "preferences": [
        {
            "name": "bitcoinAddress",
            "title": "Bitcoin Address",
            "description": "Add a Bitcoin address. (public key, starts with a 1 or 3)",
            "type": "string",
            "value": ""
        },
         {
            "type": "menulist",
            "name": "walletConverterAPI",
            "value": "blockchain",
            "title": "Wallet and Converter Pricing",
            "description": "Prices and Currency to use for wallet and converter.",
            "options": [
                {
                    "value": "blockchain",
                    "label": "Blockchain"
                },
                {
                    "value": "coinbase",
                    "label": "Coinbase"
                },
                {
                    "value": "bitpay",
                    "label": "BitPay"
                },
                {
                    "value": "localbitcoins",
                    "label": "LocalBitcoins"
                },
                {
                    "value": "coindesk",
                    "label": "CoinDesk"
                }
            ]
        },
        {
            "title": "Enable Blockchain",
            "type": "bool",
            "description": "",
            "value": true,
            "name": "blockchainEnabled"
        },
        {
            "title": "Enable Coinbase",
            "type": "bool",
            "description": "",
            "value": true,
            "name": "coinbaseEnabled"
        },
        {
            "title": "Enable Bitpay",
            "type": "bool",
            "description": "",
            "value": true,
            "name": "bitpayEnabled"
        },
        {
            "title": "Enable Localbitcoins",
            "type": "bool",
            "description": "",
            "value": true,
            "name": "localbitcoinsEnabled"
        },
        {
            "title": "Enable CoinDesk",
            "type": "bool",
            "description": "",
            "value": true,
            "name": "coindeskEnabled"
        },
        {
            "title": "Enable CoinDesk News",
            "type": "bool",
            "description": "",
            "value": true,
            "name": "coindesknewsEnabled"
        },
        {
            "title": "Enable Reddit News",
            "type": "bool",
            "description": "",
            "value": true,
            "name": "redditEnabled"
        },
        {
            "title": "Enable Wallet Balance",
            "type": "bool",
            "description": "",
            "value": true,
            "name": "walletEnabled"
        },
        
       
        {
            "type": "menulist",
            "name": "updatePriceData",
            "value": 120,
            "title": "Update Prices",
            "description": "",
            "options": [
                {
                    "value": "60",
                    "label": "1"
                },
                {
                    "value": "120",
                    "label": "2"
                },
                {
                    "value": "180",
                    "label": "3"
                },
                {
                    "value": "240",
                    "label": "4"
                },
                {
                    "value": "300",
                    "label": "5"
                },
                {
                    "value": "600",
                    "label": "10"
                },
                {
                    "value": "900",
                    "label": "15"
                },
                {
                    "value": "1200",
                    "label": "20"
                },
                {
                    "value": "1800",
                    "label": "30"
                },
                {
                    "value": "3600",
                    "label": "60"
                }
            ]
        },
        {
            "type": "menulist",
            "name": "updateWalletData",
            "value": 600,
            "title": "Update Wallet",
            "description": "",
            "options": [
                {
                    "value": "60",
                    "label": "1"
                },
                {
                    "value": "120",
                    "label": "2"
                },
                {
                    "value": "180",
                    "label": "3"
                },
                {
                    "value": "240",
                    "label": "4"
                },
                {
                    "value": "300",
                    "label": "5"
                },
                {
                    "value": "600",
                    "label": "10"
                },
                {
                    "value": "900",
                    "label": "15"
                },
                {
                    "value": "1200",
                    "label": "20"
                },
                {
                    "value": "1800",
                    "label": "30"
                },
                {
                    "value": "3600",
                    "label": "60"
                }
            ]
        },
        {
            "type": "menulist",
            "name": "updateNewsData",
            "value": 900,
            "title": "Update News",
            "description": "",
            "options": [
                {
                    "value": "60",
                    "label": "1"
                },
                {
                    "value": "120",
                    "label": "2"
                },
                {
                    "value": "180",
                    "label": "3"
                },
                {
                    "value": "240",
                    "label": "4"
                },
                {
                    "value": "300",
                    "label": "5"
                },
                {
                    "value": "600",
                    "label": "10"
                },
                {
                    "value": "900",
                    "label": "15"
                },
                {
                    "value": "1200",
                    "label": "20"
                },
                {
                    "value": "1800",
                    "label": "30"
                },
                {
                    "value": "3600",
                    "label": "60"
                }
            ]
        },
        {
            "type": "menulist",
            "name": "blockchainCurrency",
            "value": "USD",
            "title": "Blockchain Currency",
            "description": "",
            "options": [
                {
                    "value": "USD",
                    "label": "USD"
                },
                {
                    "value": "CNY",
                    "label": "CNY"
                },
                {
                    "value": "JPY",
                    "label": "JPY"
                },
                {
                    "value": "SGD",
                    "label": "SGD"
                },
                {
                    "value": "HKD",
                    "label": "HKD"
                },
                {
                    "value": "CAD",
                    "label": "CAD"
                },
                {
                    "value": "NZD",
                    "label": "NZD"
                },
                {
                    "value": "AUD",
                    "label": "AUD"
                },
                {
                    "value": "CLP",
                    "label": "CLP"
                },
                {
                    "value": "GBP",
                    "label": "GBP"
                },
                {
                    "value": "DKK",
                    "label": "DKK"
                },
                {
                    "value": "SEK",
                    "label": "SEK"
                },
                {
                    "value": "ISK",
                    "label": "ISK"
                },
                {
                    "value": "CHF",
                    "label": "CHF"
                },
                {
                    "value": "BRL",
                    "label": "BRL"
                },
                {
                    "value": "EUR",
                    "label": "EUR"
                },
                {
                    "value": "RUB",
                    "label": "RUB"
                },
                {
                    "value": "PLN",
                    "label": "PLN"
                },
                {
                    "value": "THB",
                    "label": "THB"
                },
                {
                    "value": "KRW",
                    "label": "KRW"
                },
                {
                    "value": "TWD",
                    "label": "TWD"
                }
            ]
        },
        {
            "type": "menulist",
            "name": "coinbaseCurrency",
            "value": "USD",
            "title": "Coinbase Currency",
            "description": "",
            "options": [
                {
                    "value": "AFN",
                    "label": "AFN"
                },
                {
                    "value": "ALL",
                    "label": "ALL"
                },
                {
                    "value": "DZD",
                    "label": "DZD"
                },
                {
                    "value": "AOA",
                    "label": "AOA"
                },
                {
                    "value": "ARS",
                    "label": "ARS"
                },
                {
                    "value": "AMD",
                    "label": "AMD"
                },
                {
                    "value": "AWG",
                    "label": "AWG"
                },
                {
                    "value": "AUD",
                    "label": "AUD"
                },
                {
                    "value": "AZN",
                    "label": "AZN"
                },
                {
                    "value": "BSD",
                    "label": "BSD"
                },
                {
                    "value": "BHD",
                    "label": "BHD"
                },
                {
                    "value": "BDT",
                    "label": "BDT"
                },
                {
                    "value": "BBD",
                    "label": "BBD"
                },
                {
                    "value": "BYR",
                    "label": "BYR"
                },
                {
                    "value": "BZD",
                    "label": "BZD"
                },
                {
                    "value": "BMD",
                    "label": "BMD"
                },
                {
                    "value": "BTN",
                    "label": "BTN"
                },
                {
                    "value": "BOB",
                    "label": "BOB"
                },
                {
                    "value": "BAM",
                    "label": "BAM"
                },
                {
                    "value": "BWP",
                    "label": "BWP"
                },
                {
                    "value": "BRL",
                    "label": "BRL"
                },
                {
                    "value": "GBP",
                    "label": "GBP"
                },
                {
                    "value": "BND",
                    "label": "BND"
                },
                {
                    "value": "BGN",
                    "label": "BGN"
                },
                {
                    "value": "BIF",
                    "label": "BIF"
                },
                {
                    "value": "KHR",
                    "label": "KHR"
                },
                {
                    "value": "CAD",
                    "label": "CAD"
                },
                {
                    "value": "CVE",
                    "label": "CVE"
                },
                {
                    "value": "KYD",
                    "label": "KYD"
                },
                {
                    "value": "XAF",
                    "label": "XAF"
                },
                {
                    "value": "XPF",
                    "label": "XPF"
                },
                {
                    "value": "CLP",
                    "label": "CLP"
                },
                {
                    "value": "CNY",
                    "label": "CNY"
                },
                {
                    "value": "COP",
                    "label": "COP"
                },
                {
                    "value": "KMF",
                    "label": "KMF"
                },
                {
                    "value": "CDF",
                    "label": "CDF"
                },
                {
                    "value": "CRC",
                    "label": "CRC"
                },
                {
                    "value": "HRK",
                    "label": "HRK"
                },
                {
                    "value": "CUP",
                    "label": "CUP"
                },
                {
                    "value": "CZK",
                    "label": "CZK"
                },
                {
                    "value": "DKK",
                    "label": "DKK"
                },
                {
                    "value": "DJF",
                    "label": "DJF"
                },
                {
                    "value": "DOP",
                    "label": "DOP"
                },
                {
                    "value": "XCD",
                    "label": "XCD"
                },
                {
                    "value": "EGP",
                    "label": "EGP"
                },
                {
                    "value": "ERN",
                    "label": "ERN"
                },
                {
                    "value": "EEK",
                    "label": "EEK"
                },
                {
                    "value": "ETB",
                    "label": "ETB"
                },
                {
                    "value": "EUR",
                    "label": "EUR"
                },
                {
                    "value": "FKP",
                    "label": "FKP"
                },
                {
                    "value": "FJD",
                    "label": "FJD"
                },
                {
                    "value": "GMD",
                    "label": "GMD"
                },
                {
                    "value": "GEL",
                    "label": "GEL"
                },
                {
                    "value": "GHS",
                    "label": "GHS"
                },
                {
                    "value": "GHS",
                    "label": "GHS"
                },
                {
                    "value": "GIP",
                    "label": "GIP"
                },
                {
                    "value": "GTQ",
                    "label": "GTQ"
                },
                {
                    "value": "GNF",
                    "label": "GNF"
                },
                {
                    "value": "GYD",
                    "label": "GYD"
                },
                {
                    "value": "HTG",
                    "label": "HTG"
                },
                {
                    "value": "HNL",
                    "label": "HNL"
                },
                {
                    "value": "HKD",
                    "label": "HKD"
                },
                {
                    "value": "HUF",
                    "label": "HUF"
                },
                {
                    "value": "ISK",
                    "label": "ISK"
                },
                {
                    "value": "INR",
                    "label": "INR"
                },
                {
                    "value": "IDR",
                    "label": "IDR"
                },
                {
                    "value": "IRR",
                    "label": "IRR"
                },
                {
                    "value": "IQD",
                    "label": "IQD"
                },
                {
                    "value": "ILS",
                    "label": "ILS"
                },
                {
                    "value": "JMD",
                    "label": "JMD"
                },
                {
                    "value": "JPY",
                    "label": "JPY"
                },
                {
                    "value": "JPY",
                    "label": "JPY"
                },
                {
                    "value": "JOD",
                    "label": "JOD"
                },
                {
                    "value": "KZT",
                    "label": "KZT"
                },
                {
                    "value": "KES",
                    "label": "KES"
                },
                {
                    "value": "KWD",
                    "label": "KWD"
                },
                {
                    "value": "KGS",
                    "label": "KGS"
                },
                {
                    "value": "LAK",
                    "label": "LAK"
                },
                {
                    "value": "LVL",
                    "label": "LVL"
                },
                {
                    "value": "LBP",
                    "label": "LBP"
                },
                {
                    "value": "LSL",
                    "label": "LSL"
                },
                {
                    "value": "LRD",
                    "label": "LRD"
                },
                {
                    "value": "LYD",
                    "label": "LYD"
                },
                {
                    "value": "LTL",
                    "label": "LTL"
                },
                {
                    "value": "MOP",
                    "label": "MOP"
                },
                {
                    "value": "MKD",
                    "label": "MKD"
                },
                {
                    "value": "MGA",
                    "label": "MGA"
                },
                {
                    "value": "MWK",
                    "label": "MWK"
                },
                {
                    "value": "MYR",
                    "label": "MYR"
                },
                {
                    "value": "MVR",
                    "label": "MVR"
                },
                {
                    "value": "MRO",
                    "label": "MRO"
                },
                {
                    "value": "MUR",
                    "label": "MUR"
                },
                {
                    "value": "MXN",
                    "label": "MXN"
                },
                {
                    "value": "MDL",
                    "label": "MDL"
                },
                {
                    "value": "MNT",
                    "label": "MNT"
                },
                {
                    "value": "MAD",
                    "label": "MAD"
                },
                {
                    "value": "MZN",
                    "label": "MZN"
                },
                {
                    "value": "MMK",
                    "label": "MMK"
                },
                {
                    "value": "NAD",
                    "label": "NAD"
                },
                {
                    "value": "NPR",
                    "label": "NPR"
                },
                {
                    "value": "ANG",
                    "label": "ANG"
                },
                {
                    "value": "TWD",
                    "label": "TWD"
                },
                {
                    "value": "NZD",
                    "label": "NZD"
                },
                {
                    "value": "NIO",
                    "label": "NIO"
                },
                {
                    "value": "NGN",
                    "label": "NGN"
                },
                {
                    "value": "KPW",
                    "label": "KPW"
                },
                {
                    "value": "NOK",
                    "label": "NOK"
                },
                {
                    "value": "OMR",
                    "label": "OMR"
                },
                {
                    "value": "PKR",
                    "label": "PKR"
                },
                {
                    "value": "PAB",
                    "label": "PAB"
                },
                {
                    "value": "PGK",
                    "label": "PGK"
                },
                {
                    "value": "PYG",
                    "label": "PYG"
                },
                {
                    "value": "PEN",
                    "label": "PEN"
                },
                {
                    "value": "PHP",
                    "label": "PHP"
                },
                {
                    "value": "PLN",
                    "label": "PLN"
                },
                {
                    "value": "QAR",
                    "label": "QAR"
                },
                {
                    "value": "RON",
                    "label": "RON"
                },
                {
                    "value": "RUB",
                    "label": "RUB"
                },
                {
                    "value": "RWF",
                    "label": "RWF"
                },
                {
                    "value": "SHP",
                    "label": "SHP"
                },
                {
                    "value": "SVC",
                    "label": "SVC"
                },
                {
                    "value": "WST",
                    "label": "WST"
                },
                {
                    "value": "SAR",
                    "label": "SAR"
                },
                {
                    "value": "RSD",
                    "label": "RSD"
                },
                {
                    "value": "SCR",
                    "label": "SCR"
                },
                {
                    "value": "SLL",
                    "label": "SLL"
                },
                {
                    "value": "SGD",
                    "label": "SGD"
                },
                {
                    "value": "SBD",
                    "label": "SBD"
                },
                {
                    "value": "SOS",
                    "label": "SOS"
                },
                {
                    "value": "ZAR",
                    "label": "ZAR"
                },
                {
                    "value": "KRW",
                    "label": "KRW"
                },
                {
                    "value": "LKR",
                    "label": "LKR"
                },
                {
                    "value": "SDG",
                    "label": "SDG"
                },
                {
                    "value": "SRD",
                    "label": "SRD"
                },
                {
                    "value": "SZL",
                    "label": "SZL"
                },
                {
                    "value": "SEK",
                    "label": "SEK"
                },
                {
                    "value": "CHF",
                    "label": "CHF"
                },
                {
                    "value": "SYP",
                    "label": "SYP"
                },
                {
                    "value": "STD",
                    "label": "STD"
                },
                {
                    "value": "TJS",
                    "label": "TJS"
                },
                {
                    "value": "TZS",
                    "label": "TZS"
                },
                {
                    "value": "THB",
                    "label": "THB"
                },
                {
                    "value": "TOP",
                    "label": "TOP"
                },
                {
                    "value": "TTD",
                    "label": "TTD"
                },
                {
                    "value": "TND",
                    "label": "TND"
                },
                {
                    "value": "TRY",
                    "label": "TRY"
                },
                {
                    "value": "TMM",
                    "label": "TMM"
                },
                {
                    "value": "TMM",
                    "label": "TMM"
                },
                {
                    "value": "UGX",
                    "label": "UGX"
                },
                {
                    "value": "UAH",
                    "label": "UAH"
                },
                {
                    "value": "AED",
                    "label": "AED"
                },
                {
                    "value": "USD",
                    "label": "USD"
                },
                {
                    "value": "UYU",
                    "label": "UYU"
                },
                {
                    "value": "UZS",
                    "label": "UZS"
                },
                {
                    "value": "VUV",
                    "label": "VUV"
                },
                {
                    "value": "VEF",
                    "label": "VEF"
                },
                {
                    "value": "VND",
                    "label": "VND"
                },
                {
                    "value": "XOF",
                    "label": "XOF"
                },
                {
                    "value": "YER",
                    "label": "YER"
                },
                {
                    "value": "ZMK",
                    "label": "ZMK"
                },
                {
                    "value": "ZWL",
                    "label": "ZWL"
                }
            ]
        },
        {
            "type": "menulist",
            "name": "bitpayCurrency",
            "value": "USD",
            "title": "BitPay Currency",
            "description": "",
            "options": [
                {
                    "value": "USD",
                    "label": "USD"
                },
                {
                    "value": "EUR",
                    "label": "EUR"
                },
                {
                    "value": "GBP",
                    "label": "GBP"
                },
                {
                    "value": "JPY",
                    "label": "JPY"
                },
                {
                    "value": "CAD",
                    "label": "CAD"
                },
                {
                    "value": "AUD",
                    "label": "AUD"
                },
                {
                    "value": "CNY",
                    "label": "CNY"
                },
                {
                    "value": "CHF",
                    "label": "CHF"
                },
                {
                    "value": "SEK",
                    "label": "SEK"
                },
                {
                    "value": "NZD",
                    "label": "NZD"
                },
                {
                    "value": "KRW",
                    "label": "KRW"
                },
                {
                    "value": "RUB",
                    "label": "RUB"
                },
                {
                    "value": "AED",
                    "label": "AED"
                },
                {
                    "value": "AFN",
                    "label": "AFN"
                },
                {
                    "value": "ALL",
                    "label": "ALL"
                },
                {
                    "value": "AMD",
                    "label": "AMD"
                },
                {
                    "value": "ANG",
                    "label": "ANG"
                },
                {
                    "value": "AOA",
                    "label": "AOA"
                },
                {
                    "value": "ARS",
                    "label": "ARS"
                },
                {
                    "value": "AWG",
                    "label": "AWG"
                },
                {
                    "value": "AZN",
                    "label": "AZN"
                },
                {
                    "value": "BAM",
                    "label": "BAM"
                },
                {
                    "value": "BBD",
                    "label": "BBD"
                },
                {
                    "value": "BDT",
                    "label": "BDT"
                },
                {
                    "value": "BGN",
                    "label": "BGN"
                },
                {
                    "value": "BHD",
                    "label": "BHD"
                },
                {
                    "value": "BIF",
                    "label": "BIF"
                },
                {
                    "value": "BMD",
                    "label": "BMD"
                },
                {
                    "value": "BND",
                    "label": "BND"
                },
                {
                    "value": "BOB",
                    "label": "BOB"
                },
                {
                    "value": "BRL",
                    "label": "BRL"
                },
                {
                    "value": "BSD",
                    "label": "BSD"
                },
                {
                    "value": "BTN",
                    "label": "BTN"
                },
                {
                    "value": "BWP",
                    "label": "BWP"
                },
                {
                    "value": "BYR",
                    "label": "BYR"
                },
                {
                    "value": "BZD",
                    "label": "BZD"
                },
                {
                    "value": "CDF",
                    "label": "CDF"
                },
                {
                    "value": "CLF",
                    "label": "CLF"
                },
                {
                    "value": "CLP",
                    "label": "CLP"
                },
                {
                    "value": "COP",
                    "label": "COP"
                },
                {
                    "value": "CRC",
                    "label": "CRC"
                },
                {
                    "value": "CVE",
                    "label": "CVE"
                },
                {
                    "value": "CZK",
                    "label": "CZK"
                },
                {
                    "value": "DJF",
                    "label": "DJF"
                },
                {
                    "value": "DKK",
                    "label": "DKK"
                },
                {
                    "value": "DOP",
                    "label": "DOP"
                },
                {
                    "value": "DZD",
                    "label": "DZD"
                },
                {
                    "value": "EEK",
                    "label": "EEK"
                },
                {
                    "value": "EGP",
                    "label": "EGP"
                },
                {
                    "value": "ETB",
                    "label": "ETB"
                },
                {
                    "value": "FJD",
                    "label": "FJD"
                },
                {
                    "value": "FKP",
                    "label": "FKP"
                },
                {
                    "value": "GEL",
                    "label": "GEL"
                },
                {
                    "value": "GHS",
                    "label": "GHS"
                },
                {
                    "value": "GIP",
                    "label": "GIP"
                },
                {
                    "value": "GMD",
                    "label": "GMD"
                },
                {
                    "value": "GNF",
                    "label": "GNF"
                },
                {
                    "value": "GTQ",
                    "label": "GTQ"
                },
                {
                    "value": "GYD",
                    "label": "GYD"
                },
                {
                    "value": "HKD",
                    "label": "HKD"
                },
                {
                    "value": "HNL",
                    "label": "HNL"
                },
                {
                    "value": "HRK",
                    "label": "HRK"
                },
                {
                    "value": "HTG",
                    "label": "HTG"
                },
                {
                    "value": "HUF",
                    "label": "HUF"
                },
                {
                    "value": "IDR",
                    "label": "IDR"
                },
                {
                    "value": "ILS",
                    "label": "ILS"
                },
                {
                    "value": "INR",
                    "label": "INR"
                },
                {
                    "value": "IQD",
                    "label": "IQD"
                },
                {
                    "value": "ISK",
                    "label": "ISK"
                },
                {
                    "value": "JEP",
                    "label": "JEP"
                },
                {
                    "value": "JMD",
                    "label": "JMD"
                },
                {
                    "value": "JOD",
                    "label": "JOD"
                },
                {
                    "value": "KES",
                    "label": "KES"
                },
                {
                    "value": "KGS",
                    "label": "KGS"
                },
                {
                    "value": "KHR",
                    "label": "KHR"
                },
                {
                    "value": "KMF",
                    "label": "KMF"
                },
                {
                    "value": "KWD",
                    "label": "KWD"
                },
                {
                    "value": "KYD",
                    "label": "KYD"
                },
                {
                    "value": "KZT",
                    "label": "KZT"
                },
                {
                    "value": "LAK",
                    "label": "LAK"
                },
                {
                    "value": "LBP",
                    "label": "LBP"
                },
                {
                    "value": "LKR",
                    "label": "LKR"
                },
                {
                    "value": "LRD",
                    "label": "LRD"
                },
                {
                    "value": "LSL",
                    "label": "LSL"
                },
                {
                    "value": "LTL",
                    "label": "LTL"
                },
                {
                    "value": "LVL",
                    "label": "LVL"
                },
                {
                    "value": "LYD",
                    "label": "LYD"
                },
                {
                    "value": "MAD",
                    "label": "MAD"
                },
                {
                    "value": "MDL",
                    "label": "MDL"
                },
                {
                    "value": "MGA",
                    "label": "MGA"
                },
                {
                    "value": "MKD",
                    "label": "MKD"
                },
                {
                    "value": "MMK",
                    "label": "MMK"
                },
                {
                    "value": "MNT",
                    "label": "MNT"
                },
                {
                    "value": "MOP",
                    "label": "MOP"
                },
                {
                    "value": "MRO",
                    "label": "MRO"
                },
                {
                    "value": "MUR",
                    "label": "MUR"
                },
                {
                    "value": "MVR",
                    "label": "MVR"
                },
                {
                    "value": "MWK",
                    "label": "MWK"
                },
                {
                    "value": "MXN",
                    "label": "MXN"
                },
                {
                    "value": "MYR",
                    "label": "MYR"
                },
                {
                    "value": "MZN",
                    "label": "MZN"
                },
                {
                    "value": "NAD",
                    "label": "NAD"
                },
                {
                    "value": "NGN",
                    "label": "NGN"
                },
                {
                    "value": "NIO",
                    "label": "NIO"
                },
                {
                    "value": "NOK",
                    "label": "NOK"
                },
                {
                    "value": "NPR",
                    "label": "NPR"
                },
                {
                    "value": "OMR",
                    "label": "OMR"
                },
                {
                    "value": "PAB",
                    "label": "PAB"
                },
                {
                    "value": "PEN",
                    "label": "PEN"
                },
                {
                    "value": "PGK",
                    "label": "PGK"
                },
                {
                    "value": "PHP",
                    "label": "PHP"
                },
                {
                    "value": "PKR",
                    "label": "PKR"
                },
                {
                    "value": "PLN",
                    "label": "PLN"
                },
                {
                    "value": "PYG",
                    "label": "PYG"
                },
                {
                    "value": "QAR",
                    "label": "QAR"
                },
                {
                    "value": "RON",
                    "label": "RON"
                },
                {
                    "value": "RSD",
                    "label": "RSD"
                },
                {
                    "value": "RWF",
                    "label": "RWF"
                },
                {
                    "value": "SAR",
                    "label": "SAR"
                },
                {
                    "value": "SBD",
                    "label": "SBD"
                },
                {
                    "value": "SCR",
                    "label": "SCR"
                },
                {
                    "value": "SDG",
                    "label": "SDG"
                },
                {
                    "value": "SGD",
                    "label": "SGD"
                },
                {
                    "value": "SHP",
                    "label": "SHP"
                },
                {
                    "value": "SLL",
                    "label": "SLL"
                },
                {
                    "value": "SOS",
                    "label": "SOS"
                },
                {
                    "value": "SRD",
                    "label": "SRD"
                },
                {
                    "value": "STD",
                    "label": "STD"
                },
                {
                    "value": "SVC",
                    "label": "SVC"
                },
                {
                    "value": "SYP",
                    "label": "SYP"
                },
                {
                    "value": "SZL",
                    "label": "SZL"
                },
                {
                    "value": "THB",
                    "label": "THB"
                },
                {
                    "value": "TJS",
                    "label": "TJS"
                },
                {
                    "value": "TMT",
                    "label": "TMT"
                },
                {
                    "value": "TND",
                    "label": "TND"
                },
                {
                    "value": "TOP",
                    "label": "TOP"
                },
                {
                    "value": "TRY",
                    "label": "TRY"
                },
                {
                    "value": "TTD",
                    "label": "TTD"
                },
                {
                    "value": "TWD",
                    "label": "TWD"
                },
                {
                    "value": "TZS",
                    "label": "TZS"
                },
                {
                    "value": "UAH",
                    "label": "UAH"
                },
                {
                    "value": "UGX",
                    "label": "UGX"
                },
                {
                    "value": "UYU",
                    "label": "UYU"
                },
                {
                    "value": "UZS",
                    "label": "UZS"
                },
                {
                    "value": "VEF",
                    "label": "VEF"
                },
                {
                    "value": "VND",
                    "label": "VND"
                },
                {
                    "value": "VUV",
                    "label": "VUV"
                },
                {
                    "value": "WST",
                    "label": "WST"
                },
                {
                    "value": "XAF",
                    "label": "XAF"
                },
                {
                    "value": "XAG",
                    "label": "XAG"
                },
                {
                    "value": "XAU",
                    "label": "XAU"
                },
                {
                    "value": "XCD",
                    "label": "XCD"
                },
                {
                    "value": "XOF",
                    "label": "XOF"
                },
                {
                    "value": "XPF",
                    "label": "XPF"
                },
                {
                    "value": "YER",
                    "label": "YER"
                },
                {
                    "value": "ZAR",
                    "label": "ZAR"
                },
                {
                    "value": "ZMW",
                    "label": "ZMW"
                },
                {
                    "value": "ZWL",
                    "label": "ZWL"
                }
            ]
        },
        {
            "type": "menulist",
            "name": "localbitcoinsCurrency",
            "value": "USD",
            "title": "Localbitcoins Currency",
            "description": "",
            "options": [
                {
                    "value": "USD",
                    "label": "USD"
                },
                {
                    "value": "ARS",
                    "label": "ARS"
                },
                {
                    "value": "AUD",
                    "label": "AUD"
                },
                {
                    "value": "BRL",
                    "label": "BRL"
                },
                {
                    "value": "CAD",
                    "label": "CAD"
                },
                {
                    "value": "CHF",
                    "label": "CHF"
                },
                {
                    "value": "CZK",
                    "label": "CZK"
                },
                {
                    "value": "DKK",
                    "label": "DKK"
                },
                {
                    "value": "EUR",
                    "label": "EUR"
                },
                {
                    "value": "GBP",
                    "label": "GBP"
                },
                {
                    "value": "HKD",
                    "label": "HKD"
                },
                {
                    "value": "ISK",
                    "label": "ISK"
                },
                {
                    "value": "INR",
                    "label": "INR"
                },
                {
                    "value": "MXN",
                    "label": "MXN"
                },
                {
                    "value": "NOK",
                    "label": "NOK"
                },
                {
                    "value": "NZD",
                    "label": "NZD"
                },
                {
                    "value": "PLN",
                    "label": "PLN"
                },
                {
                    "value": "RUB",
                    "label": "RUB"
                },
                {
                    "value": "SEK",
                    "label": "SEK"
                },
                {
                    "value": "SGD",
                    "label": "SGD"
                },
                {
                    "value": "THB",
                    "label": "THB"
                },
                {
                    "value": "ZAR",
                    "label": "ZAR"
                }
            ]
        },
        {
            "type": "menulist",
            "name": "coindeskCurrency",
            "value": "USD",
            "title": "CoinDesk Currency",
            "description": "",
            "options": [
                {
                    "value": "AED",
                    "label": "AED"
                },
                {
                    "value": "AFN",
                    "label": "AFN"
                },
                {
                    "value": "ALL",
                    "label": "ALL"
                },
                {
                    "value": "AMD",
                    "label": "AMD"
                },
                {
                    "value": "ANG",
                    "label": "ANG"
                },
                {
                    "value": "AOA",
                    "label": "AOA"
                },
                {
                    "value": "ARS",
                    "label": "ARS"
                },
                {
                    "value": "AUD",
                    "label": "AUD"
                },
                {
                    "value": "AWG",
                    "label": "AWG"
                },
                {
                    "value": "AZN",
                    "label": "AZN"
                },
                {
                    "value": "BAM",
                    "label": "BAM"
                },
                {
                    "value": "BBD",
                    "label": "BBD"
                },
                {
                    "value": "BDT",
                    "label": "BDT"
                },
                {
                    "value": "BGN",
                    "label": "BGN"
                },
                {
                    "value": "BHD",
                    "label": "BHD"
                },
                {
                    "value": "BIF",
                    "label": "BIF"
                },
                {
                    "value": "BMD",
                    "label": "BMD"
                },
                {
                    "value": "BND",
                    "label": "BND"
                },
                {
                    "value": "BOB",
                    "label": "BOB"
                },
                {
                    "value": "BRL",
                    "label": "BRL"
                },
                {
                    "value": "BSD",
                    "label": "BSD"
                },
                {
                    "value": "BTC",
                    "label": "BTC"
                },
                {
                    "value": "BTN",
                    "label": "BTN"
                },
                {
                    "value": "BWP",
                    "label": "BWP"
                },
                {
                    "value": "BYR",
                    "label": "BYR"
                },
                {
                    "value": "BZD",
                    "label": "BZD"
                },
                {
                    "value": "CAD",
                    "label": "CAD"
                },
                {
                    "value": "CDF",
                    "label": "CDF"
                },
                {
                    "value": "CHF",
                    "label": "CHF"
                },
                {
                    "value": "CLF",
                    "label": "CLF"
                },
                {
                    "value": "CLP",
                    "label": "CLP"
                },
                {
                    "value": "CNY",
                    "label": "CNY"
                },
                {
                    "value": "COP",
                    "label": "COP"
                },
                {
                    "value": "CRC",
                    "label": "CRC"
                },
                {
                    "value": "CUP",
                    "label": "CUP"
                },
                {
                    "value": "CVE",
                    "label": "CVE"
                },
                {
                    "value": "CZK",
                    "label": "CZK"
                },
                {
                    "value": "DJF",
                    "label": "DJF"
                },
                {
                    "value": "DKK",
                    "label": "DKK"
                },
                {
                    "value": "DOP",
                    "label": "DOP"
                },
                {
                    "value": "DZD",
                    "label": "DZD"
                },
                {
                    "value": "EEK",
                    "label": "EEK"
                },
                {
                    "value": "EGP",
                    "label": "EGP"
                },
                {
                    "value": "ERN",
                    "label": "ERN"
                },
                {
                    "value": "ETB",
                    "label": "ETB"
                },
                {
                    "value": "EUR",
                    "label": "EUR"
                },
                {
                    "value": "FJD",
                    "label": "FJD"
                },
                {
                    "value": "FKP",
                    "label": "FKP"
                },
                {
                    "value": "GBP",
                    "label": "GBP"
                },
                {
                    "value": "GEL",
                    "label": "GEL"
                },
                {
                    "value": "GHS",
                    "label": "GHS"
                },
                {
                    "value": "GIP",
                    "label": "GIP"
                },
                {
                    "value": "GMD",
                    "label": "GMD"
                },
                {
                    "value": "GNF",
                    "label": "GNF"
                },
                {
                    "value": "GTQ",
                    "label": "GTQ"
                },
                {
                    "value": "GYD",
                    "label": "GYD"
                },
                {
                    "value": "HKD",
                    "label": "HKD"
                },
                {
                    "value": "HNL",
                    "label": "HNL"
                },
                {
                    "value": "HRK",
                    "label": "HRK"
                },
                {
                    "value": "HTG",
                    "label": "HTG"
                },
                {
                    "value": "HUF",
                    "label": "HUF"
                },
                {
                    "value": "IDR",
                    "label": "IDR"
                },
                {
                    "value": "ILS",
                    "label": "ILS"
                },
                {
                    "value": "INR",
                    "label": "INR"
                },
                {
                    "value": "IQD",
                    "label": "IQD"
                },
                {
                    "value": "IRR",
                    "label": "IRR"
                },
                {
                    "value": "ISK",
                    "label": "ISK"
                },
                {
                    "value": "JEP",
                    "label": "JEP"
                },
                {
                    "value": "JMD",
                    "label": "JMD"
                },
                {
                    "value": "JOD",
                    "label": "JOD"
                },
                {
                    "value": "JPY",
                    "label": "JPY"
                },
                {
                    "value": "KES",
                    "label": "KES"
                },
                {
                    "value": "KGS",
                    "label": "KGS"
                },
                {
                    "value": "KHR",
                    "label": "KHR"
                },
                {
                    "value": "KMF",
                    "label": "KMF"
                },
                {
                    "value": "KPW",
                    "label": "KPW"
                },
                {
                    "value": "KRW",
                    "label": "KRW"
                },
                {
                    "value": "KWD",
                    "label": "KWD"
                },
                {
                    "value": "KYD",
                    "label": "KYD"
                },
                {
                    "value": "KZT",
                    "label": "KZT"
                },
                {
                    "value": "LAK",
                    "label": "LAK"
                },
                {
                    "value": "LBP",
                    "label": "LBP"
                },
                {
                    "value": "LKR",
                    "label": "LKR"
                },
                {
                    "value": "LRD",
                    "label": "LRD"
                },
                {
                    "value": "LSL",
                    "label": "LSL"
                },
                {
                    "value": "LTL",
                    "label": "LTL"
                },
                {
                    "value": "LVL",
                    "label": "LVL"
                },
                {
                    "value": "LYD",
                    "label": "LYD"
                },
                {
                    "value": "MAD",
                    "label": "MAD"
                },
                {
                    "value": "MDL",
                    "label": "MDL"
                },
                {
                    "value": "MGA",
                    "label": "MGA"
                },
                {
                    "value": "MKD",
                    "label": "MKD"
                },
                {
                    "value": "MMK",
                    "label": "MMK"
                },
                {
                    "value": "MNT",
                    "label": "MNT"
                },
                {
                    "value": "MOP",
                    "label": "MOP"
                },
                {
                    "value": "MRO",
                    "label": "MRO"
                },
                {
                    "value": "MTL",
                    "label": "MTL"
                },
                {
                    "value": "MUR",
                    "label": "MUR"
                },
                {
                    "value": "MVR",
                    "label": "MVR"
                },
                {
                    "value": "MWK",
                    "label": "MWK"
                },
                {
                    "value": "MXN",
                    "label": "MXN"
                },
                {
                    "value": "MYR",
                    "label": "MYR"
                },
                {
                    "value": "MZN",
                    "label": "MZN"
                },
                {
                    "value": "NAD",
                    "label": "NAD"
                },
                {
                    "value": "NGN",
                    "label": "NGN"
                },
                {
                    "value": "NIO",
                    "label": "NIO"
                },
                {
                    "value": "NOK",
                    "label": "NOK"
                },
                {
                    "value": "NPR",
                    "label": "NPR"
                },
                {
                    "value": "NZD",
                    "label": "NZD"
                },
                {
                    "value": "OMR",
                    "label": "OMR"
                },
                {
                    "value": "PAB",
                    "label": "PAB"
                },
                {
                    "value": "PEN",
                    "label": "PEN"
                },
                {
                    "value": "PGK",
                    "label": "PGK"
                },
                {
                    "value": "PHP",
                    "label": "PHP"
                },
                {
                    "value": "PKR",
                    "label": "PKR"
                },
                {
                    "value": "PLN",
                    "label": "PLN"
                },
                {
                    "value": "PYG",
                    "label": "PYG"
                },
                {
                    "value": "QAR",
                    "label": "QAR"
                },
                {
                    "value": "RON",
                    "label": "RON"
                },
                {
                    "value": "RSD",
                    "label": "RSD"
                },
                {
                    "value": "RUB",
                    "label": "RUB"
                },
                {
                    "value": "RWF",
                    "label": "RWF"
                },
                {
                    "value": "SAR",
                    "label": "SAR"
                },
                {
                    "value": "SBD",
                    "label": "SBD"
                },
                {
                    "value": "SCR",
                    "label": "SCR"
                },
                {
                    "value": "SDG",
                    "label": "SDG"
                },
                {
                    "value": "SEK",
                    "label": "SEK"
                },
                {
                    "value": "SGD",
                    "label": "SGD"
                },
                {
                    "value": "SHP",
                    "label": "SHP"
                },
                {
                    "value": "SLL",
                    "label": "SLL"
                },
                {
                    "value": "SOS",
                    "label": "SOS"
                },
                {
                    "value": "SRD",
                    "label": "SRD"
                },
                {
                    "value": "STD",
                    "label": "STD"
                },
                {
                    "value": "SVC",
                    "label": "SVC"
                },
                {
                    "value": "SYP",
                    "label": "SYP"
                },
                {
                    "value": "SZL",
                    "label": "SZL"
                },
                {
                    "value": "THB",
                    "label": "THB"
                },
                {
                    "value": "TJS",
                    "label": "TJS"
                },
                {
                    "value": "TMT",
                    "label": "TMT"
                },
                {
                    "value": "TND",
                    "label": "TND"
                },
                {
                    "value": "TOP",
                    "label": "TOP"
                },
                {
                    "value": "TRY",
                    "label": "TRY"
                },
                {
                    "value": "TTD",
                    "label": "TTD"
                },
                {
                    "value": "TWD",
                    "label": "TWD"
                },
                {
                    "value": "TZS",
                    "label": "TZS"
                },
                {
                    "value": "UAH",
                    "label": "UAH"
                },
                {
                    "value": "UGX",
                    "label": "UGX"
                },
                {
                    "value": "USD",
                    "label": "USD"
                },
                {
                    "value": "UYU",
                    "label": "UYU"
                },
                {
                    "value": "UZS",
                    "label": "UZS"
                },
                {
                    "value": "VEF",
                    "label": "VEF"
                },
                {
                    "value": "VND",
                    "label": "VND"
                },
                {
                    "value": "VUV",
                    "label": "VUV"
                },
                {
                    "value": "WST",
                    "label": "WST"
                },
                {
                    "value": "XAF",
                    "label": "XAF"
                },
                {
                    "value": "XAG",
                    "label": "XAG"
                },
                {
                    "value": "XAU",
                    "label": "XAU"
                },
                {
                    "value": "XBT",
                    "label": "XBT"
                },
                {
                    "value": "XCD",
                    "label": "XCD"
                },
                {
                    "value": "XDR",
                    "label": "XDR"
                },
                {
                    "value": "XOF",
                    "label": "XOF"
                },
                {
                    "value": "XPF",
                    "label": "XPF"
                },
                {
                    "value": "YER",
                    "label": "YER"
                },
                {
                    "value": "ZAR",
                    "label": "ZAR"
                },
                {
                    "value": "ZMK",
                    "label": "ZMK"
                },
                {
                    "value": "ZMW",
                    "label": "ZMW"
                },
                {
                    "value": "ZWL",
                    "label": "ZWL"
                }
            ]
        },
        
        {
            "name": "bitcoinDecimalPlaces",
            "title": "Bitcoin Decimal Places",
            "description": "0-8 default 6 (won't affect currency converter) ",
            "type": "integer",
            "value": 6
        },
        {
            "name": "tickerDisplaySpeed",
            "title": "Ticker Display Speed",
            "description": "Rotation speed in seconds",
            "type": "integer",
            "value": 5
        },
        
        {
            "title": "Display Toolbar Balance",
            "type": "bool",
            "description": "",
            "value": true,
            "name": "displayToolbarBalance"
        },
        {
            "title": "Display Toolbar Prices",
            "type": "bool",
            "description": "",
            "value": true,
            "name": "displayToolbarPrices"
        },
        {
            "title": "Display Toolbar News",
            "type": "bool",
            "description": "",
            "value": true,
            "name": "displayToolbarNews"
        },
        {
            "title": "Display Toolbar Price Change",
            "type": "bool",
            "description": "",
            "value": true,
            "name": "displayToolbarPriceChange"
        },
        {
            "name": "toolbarFontFamily",
            "title": "Toolbar Font",
            "description": "Toolbar Font (Open Sans, Droid Sans, Average Sans, Arimo, Aldrich, Roboto, Nunito, Days One)",
            "type": "string",
            "value": "Helvetica,Arial,sans-serif"
        },
        {
            "name": "toolbarFontSize",
            "title": "Toolbar Font Size",
            "description": "",
            "type": "integer",
            "value": 14
        },
        {
            "name": "toolbarLabelFontColor",
            "title": "Toolbar Label Font Color",
            "description": "",
            "type": "color",
            "value": "#CCC"
        },
        {
            "name": "toolbarBalanceFontColor",
            "title": "Toolbar Balance Font Color",
            "description": "",
            "type": "color",
            "value": "#FFFFFF"
        },
        {
            "name": "toolbarPriceFontColor",
            "title": "Toolbar Price Font Color",
            "description": "",
            "type": "color",
            "value": "#FFFFFF"
        },
        {
            "name": "toolbarPriceChangeUpColor",
            "title": "Toolbar Price Change Up Color",
            "description": "",
            "type": "color",
            "value": "#7DC037"
        },
        {
            "name": "toolbarPriceChangeDownColor",
            "title": "Toolbar Price Change Down Color",
            "description": "",
            "type": "color",
            "value": "#FF7A7A"
        },
        {
            "name": "toolbarLinkColor",
            "title": "Toolbar Link Color",
            "description": "",
            "type": "color",
            "value": "#A0CFFF"
        },
        {
            "name": "toolbarBackgroundColor",
            "title": "Toolbar Background Color",
            "description": "",
            "type": "color",
            "value": "#001837"
        },
        {
            "title": "Toolbar Background Transparent",
            "type": "bool",
            "description": "",
            "value": false,
            "name": "toolbarBackgroundTransparent"
        }
    ]
};
