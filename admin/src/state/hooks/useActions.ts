import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { actions as userActions } from '../redux/user';
import { isAuth } from "./useAuth";

export function useUserActions() {
    const dispatch = useDispatch();

    return {
        getUserDetails: () => dispatch(userActions.getUserDetails()),
    };
}

export function useNavigationActions() {
    const history = useHistory();
    
    return {
        navigateToPath: (path) => {
            isAuth();
            history.push(path);
        }
    }
}
