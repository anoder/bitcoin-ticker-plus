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

//Helper Functions
    
//100000000    
function satoshiToBitcoin(satoshis, dec) {
    var btc = Number(satoshis / 1e8);
    btc = Math.floor(btc * Math.pow(10, dec)) / Math.pow(10, dec);
    return btc.toFixed(dec);
}

function bitcoinToPrice(bitcoins, price) {
    var amount = Number(bitcoins * price);
    return amount;
}

function fiatToBitcoin(fiat, price, dec) {
    var amount = Number(fiat / price).toFixed(dec);
    return amount;
}

function currencyLocale(amount, locales, currencycode) {
    return Number(amount).toLocaleString(locales, {
        style: "currency",
        currency: currencycode
    });
}

function dateTimeLocale(timestamp, locales) {
    var time = new Date(timestamp * 1e3);
    return time.toLocaleString(locales);
}

function priceChange(currentPrice, lastPrice) {
    return ((currentPrice - lastPrice) / lastPrice * 100).toFixed(2);
}
//////
function isNumeric(str) {
    return /^\d+$/.test(str);
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function checkAddress(address) {
    if (address.length > 34 || address.length < 27) {
        return false;
    }
    if (address.charAt(0) == "1" || address.charAt(0) == "3") {
        return true;
    }
    return false;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function sanitizeData(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
