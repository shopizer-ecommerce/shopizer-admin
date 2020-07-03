import { ActionReducerMap } from '@ngrx/store';
import { StateInterface } from '../interfaces/state.interface';
export interface AppStore {
    fileManagerState: StateInterface;
}
export declare const reducers: ActionReducerMap<AppStore>;
