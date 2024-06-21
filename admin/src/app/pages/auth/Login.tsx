import * as React from 'react';
import { useNavigationActions } from 'state/hooks/useActions';
import { checkToken, isAuth } from 'state/hooks/useAuth';
import { EduleteApiTokenHolders } from 'api';

const Login: React.FC = () => {
    const actions = useNavigationActions();
    
    const checkTokenHandler = async () => {
        await checkToken();
        if(!isAuth()){
            EduleteApiTokenHolders.clearTokens();
            window.open(process.env.REACT_APP_BASEURL + 'admin/login', '_self');
        }else {
            actions.navigateToPath('/');
        }
    }
    
    React.useEffect(() => {
        checkTokenHandler();
    }, []);

    return <></>;
}

export default Login;
