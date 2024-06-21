import * as React from 'react';
import { BodyCss, GlobalBodyStyle } from './Css';

interface BodyParam {
  fullScreen?: boolean;
}

const Body: React.FC<BodyParam> = (props) => {
  return (
    <>
        <GlobalBodyStyle />
        
        <BodyCss className={(props.fullScreen ? 'full-screen ' : '') + 'admin-body'}>
            {props.children}
        </BodyCss>
    </>
  );
}

export default Body;
