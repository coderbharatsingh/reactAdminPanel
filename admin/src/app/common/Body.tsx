import * as React from 'react';

interface BodyParams {
    className?: string
}
const Body: React.FC <BodyParams>= ({children, className = ''}) => {
  return (
    <>
        <div className={`body-part ${className}`}>
            {children}
        </div>
    </>
  );
}

export default Body;