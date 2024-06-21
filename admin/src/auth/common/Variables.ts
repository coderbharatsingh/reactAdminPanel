import styled from 'styled-components/macro';

export const Variables = {
    redColor: '#e30001',
    blueColor: '#47678b',
    blueSecond: '#100235',
    darkBlue: '#0d6fdc',
    purpleColor: '#6843c6',
    greenColor: '#619a67',
    lightGreen: '#8aff2b',
    greenSecond: '#00ed61',
    blackColor: '#212529',
    greyColor: '#585858',
    lightGrey: '#999',
    lightYellow: '#fefcd1',
    darkYellow: '#eac659',
    gradientPink: 'linear-gradient(to right, #f48681 0%, #c00505 100%)',
    gradientBlue: 'linear-gradient(to bottom, #100235 0%, #340d6a 100%)',
    gradientBtn: 'linear-gradient(to bottom, #facb23 0%, #f83600 100%)',
    borderLightPink: '#fcd6de',
    borderLightColor: '#ececec',
    borderDarkColor: '#cbcbcb',
    bgGrey: '#f0eceb',
    bgDarkGrey: '#b0aaaa',
}

export const cssPxProperties = (size: number | object, property: string = 'font-size', isImportant: boolean = false) => {
    let important = isImportant ? '!important' : '';

    if(typeof size === 'object' && !Array.isArray(size)) {
        let ret = Object.keys(size).map((key, val) => {
            let params = size[key];
            if(Array.isArray(params)) {
                return cssPxProperties(params[0], key, params[1] ? params[1] : false);
            } else if(typeof params === 'number') {
                return cssPxProperties(params, key);
            }
        });
        return ret.join(' ');
    }

    const getSize = (multiplier: number) => {
        if(typeof size === 'object' && Array.isArray(size)) {
            let ret = size.map((val) => {
                return val * multiplier + 'px';
            });
            return ret.join(' ');
        }

        return size * multiplier + 'px';
    }

    return `
        @media (max-width: 575.98px) {
            ${property}: ${getSize(.7)} ${important};
        }

        @media (min-width: 576px) {
            ${property}: ${getSize(.78)} ${important};
        }

        @media (min-width: 768px) {
            ${property}: ${getSize(.87)} ${important};
        }

        @media (min-width: 992px) {
            ${property}: ${getSize(.91)} ${important};
        }

        @media (min-width: 1025px) {
            ${property}: ${getSize(.95)} ${important};
        }

        @media (min-width: 1400px) {
            ${property}: ${getSize(1)} ${important};
        }
    `;
}

export const Color = styled.span`
    color: ${ props => props.color || Variables.blackColor };
`;
