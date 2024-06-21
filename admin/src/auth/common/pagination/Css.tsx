import { cssPxProperties, Variables } from 'auth/common/Variables';
import styled from 'styled-components/macro';

export const CustomPaginationStyle = styled.div`
    &.align-left {
        justify-content: left;
    }

    &.align-center {
        justify-content: center;
    }

    &.align-right {
        justify-content: right;
    }

    &.default-css {
        flex-wrap: wrap;
        
        .page-item {
            white-space: nowrap;

            &.active {
                .page-link {
                    border-color: ${ Variables.blueColor };
                    background: ${ Variables.blueColor };
                }
            }
        }
    }
`;
