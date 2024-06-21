import * as React from 'react';
import { Switch } from 'react-router-dom';
import { Dashboard, AdminPage, Masquerade, QuizOverview } from './pages/Loadable';
import { NotFoundPage } from 'app/components/NotFoundPage/Loadable';
import { isAuth } from 'state/hooks/useAuth';
import CheckAuth from './CheckAuth';
import { useUserActions } from 'state/hooks/useActions';

export function Auth() {
    const userActions = useUserActions();

    React.useEffect(() => {
        if(isAuth()) {
            userActions.getUserDetails();
        }
    }, []);

    return (
        <Switch>
            <CheckAuth exact path="/" component={Dashboard} />
            <CheckAuth exact path="/quiz-overview" component={QuizOverview} />
            <CheckAuth exact path="/masquerade" component={Masquerade} />
            <CheckAuth exact path="/:page/:pageNo?" component={AdminPage} />
            
            <CheckAuth path="*" component={NotFoundPage} />
        </Switch>
    );
}
 