import * as React from 'react';
import { clearAuth } from 'state/hooks/useAuth';
import { useNavigationActions } from 'state/hooks/useActions';
import { EduleteApi } from 'api';

const Logout: React.FC = () => {
    const actions = useNavigationActions();
    
    React.useEffect(() => {
        EduleteApi.logout();
        clearAuth();
        actions.navigateToPath('/login');
    }, []);

    return <></>;
}

export default Logout;
