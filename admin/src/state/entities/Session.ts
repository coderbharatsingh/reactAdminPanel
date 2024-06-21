import { LoadableContainer } from './LoadableContainer';

export type SessionContainer =
    | {
          exists: false;
      }
    | ({
          exists: true;
      } & LoadableContainer<any>);
