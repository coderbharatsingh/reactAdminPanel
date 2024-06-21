import { EduleteApi, EduleteApiTokenHolders } from 'api';

function isAuth(): boolean {
    return !!EduleteApiTokenHolders.getToken();
}

async function checkToken() {
    if(!!!EduleteApiTokenHolders.getToken() && !!EduleteApiTokenHolders.getRefreshToken()) {
        await EduleteApi.getResult(EduleteApi.refreshToken());
    }
}

function clearAuth(): boolean {
    return !!EduleteApiTokenHolders.clearTokens();
}

function disabledTag(disable: boolean, clickEvent: (e: any) => void): object {
    return disable ? {
        disabled: true,
        onClick: (e) => e.preventDefault()
    } : {
        onClick: clickEvent
    }
}

const htmlDecode = (input) => {
    var e = document.createElement('div');
    e.innerHTML = input;
    let retVal = '';
    for(let i = 0; i < e.childNodes.length; i++) {
        if(e.childNodes[i].nodeName === '#text') {
            retVal += e.childNodes[i].nodeValue;
        }
    }

    return retVal || input;
}

const getCappedString = (str: string, length: number) => {
    return str.length > length ? `${str.slice(0, length)}...` : str;
}

const roundOf = (val, place = 0) => Math.round(val * (10 ** place)) / (10 ** place);

const getBytes = function(bytes) {
    const sizes = ["bytes", "kb", "mb", "gb", "tb"];
    let ret_bytes = parseInt(bytes);
    const type = bytes.replace(ret_bytes, '').trim().toLowerCase();

    return ret_bytes * Math.pow(1024, sizes.indexOf(type));
}

const formatNumber = function(count) {
    count = parseFloat(count) || 0;
    if(count < 1 && count > -1) { return count; }
    const notations = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    const i = Math.floor(Math.log(Math.abs(count)) / Math.log(1000));
    return `${parseFloat((count / Math.pow(1000, i)).toFixed(2))}${notations[i]}`;
}

const convertToSlug = function(text: string) {
    return text.trim().toLowerCase()
        .replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"”“’\\|\/,.<>?\s]/g, ' ')
        .replace(/^\s+|\s+$/gm,'')
        .trim()
        .replace(/\s+/g, '-');
}

const getQueryParams = () => {
    const query = new URLSearchParams(window.location.search);
    let search = {};
    query.forEach((item, index) => {
      search[index] = item;
    });
    return search;
}

export { isAuth, checkToken, clearAuth, disabledTag, htmlDecode, getCappedString, roundOf, getBytes, formatNumber, convertToSlug, getQueryParams };
