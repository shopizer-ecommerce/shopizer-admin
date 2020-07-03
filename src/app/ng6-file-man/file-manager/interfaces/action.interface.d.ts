import { Action } from '@ngrx/store';
export interface ActionInterface extends Action {
    payload?: any;
}
