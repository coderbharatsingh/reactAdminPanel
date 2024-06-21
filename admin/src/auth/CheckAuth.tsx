import { ComponentType } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuth } from 'state/hooks/useAuth';
import PageTheme from './PageTheme';

interface CheckAuthParams {
    path: string,
    auth?: boolean,
    exact?: boolean,
    component: ComponentType
}
const CheckAuth: React.FC<CheckAuthParams> = ({ path, component, auth = true, exact = true }) => {
    const Comp = component;
    const checkAuthUser = () => {
        return auth ? isAuth() : !isAuth();
    }

    return (
        <Route {...{path, exact}} render={() => 
            checkAuthUser() ? <PageTheme>
                <Comp />
            </PageTheme> : <Redirect to={auth ? "/login" : "/dashboard"} />
        } />
    );
}
 
export default CheckAuth;
