import * as React from 'react';
import { Link } from 'react-router-dom';

interface LinkParams {
    to: string;
    target?: string;
    className?: string;
}
  
const ReactLinks: React.FC<LinkParams> = ({ to, target = '_self', className = '', children }) => {
    if(to.match(/^https?:\/\//)) {
        return <a {...{ href: to, target, className }}>{children}</a>;
    }

    return <Link {...{ to, target, className }}>{children}</Link>;
}

export default ReactLinks;
