import { LoadableContainer } from './LoadableContainer';
import { UserContainer } from './User';


export type LoadableUser = LoadableContainer<UserContainer>;

export default interface State {
    error: Error;
    auth: {};
    loadableUser: LoadableUser;
}
