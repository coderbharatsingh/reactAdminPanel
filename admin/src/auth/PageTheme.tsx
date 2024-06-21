import Header from 'auth/common/header/Header';
import LHS from 'auth/common/lhs/LHS';
import { ComponentType } from 'react';
import { Route } from 'react-router-dom';

interface PageThemeParams {
    path?: string,
    auth?: boolean,
    exact?: boolean,
    component?: ComponentType
}
const PageTheme: React.FC<PageThemeParams> = (props) => {
    const renderComp = (children) => {
        return (<>
            <Header />
            <LHS />

            <div className="content-wrapper">
                <section className="content-header">
                    <div className="container-fluid">
                        {children}
                    </div>
                </section>
            </div>
        </>);
    }

    if(props?.component && props?.path) {
        const path = props.path;
        const exact = props?.exact || false;
        const Comp = props.component;
        return <Route {...{path, exact}} render={() => 
            renderComp(<Comp />)
        } />
    }

    return renderComp(props.children);

}
 
export default PageTheme;
