import { cssPxProperties, Variables } from 'auth/common/Variables';
import styled from 'styled-components/macro';

export const DashboardCss = styled.div`
    .card {
        .card-header {
            display: flex;
            align-items: center;
        }

        .card-body {
            .body-title {
                font-weight: bold;
                color: #28a745;
                margin-bottom: 15px;
                margin-top: 30px;
                text-decoration: underline;
            }
        }
    }

    .small-box {
        height: calc(100% - 15px);

        h3 {
            font-size: 23px;
            white-space: normal;
        }

        .parent {
            display: flex;
            flex-wrap: wrap;
            max-width: 70%;
            
            .counter {
                color: #000;
                font-size: 16px;
                padding: 2px 5px;
                padding-left: 0px;
                margin-right: 5px;

                &:last-child {
                    border: 0px solid;
                }
    
                span {
                    font-weight: bold;
                }
            }
        }
    }
`;
