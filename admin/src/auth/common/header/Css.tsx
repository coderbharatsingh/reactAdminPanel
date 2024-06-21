import styled from 'styled-components/macro';
import { Variables } from '../Variables';

export const NavbarCss = styled.div`
    background: #1b3a5e;
    padding-left: 0px;
    padding-right: 40px;
    position: sticky;
    top: 0px;
    z-index: 10;
    background: #fdfaf5 url('/images/pattern.png');
    box-shadow: 0px 0px 3px #ddd;
    height: 150px;

    .navbar-brand {
        max-height: 150px;
        overflow:hidden;
        margin: -0.5rem 0px;
        padding: 0px;

        .logo {
            width: 300px;
        }
    }
`;

export const NavRightCss = styled.div`
    .nav-link {
        height: 35px;
        width: 35px;
        background: #2c507a;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        margin: 0px 20px;
        align-self: center;
        
        &.cart-link {
            width: auto;
            border-radius: 0px;
            color: #fff;
            
            span {
                padding: 18px;
                font-size: 18px;
            }
    
            .svg-icon:first-child {
                height: 28px;
                width: 28px;
                padding: 7px;
                background: ${ Variables.lightGreen };
                border-radius: 50%;
                margin-left: -20px;
            }
        }
    }
`;

export const CardCss = styled.div`
    background: transparent;
    width: 300px;
    border: 0px solid;
    
    .card-icon {
        font-size: 50px;
        width: 60px;
        margin: auto;
    }

    .card-body {
        padding-bottom: 0px;
        text-align: center;
        letter-spacing: 1px;

        .badge {
            background: ${ Variables.redColor };
            font-size: 16px;
            color: #fff;
            padding: 5px 15px;
            border-radius: 5px;
            margin-bottom: 5px;
        }

        .card-title {
            color: ${ Variables.blueColor };
            font-size: 23px;
        }
    }
`;
