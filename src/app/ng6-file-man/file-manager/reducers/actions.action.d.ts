import { ActionInterface } from '../interfaces/action.interface';
import { NodeInterface } from '../interfaces/node.interface';
export declare const SET_PATH = "SET_PATH";
export declare const SET_LOADING_STATE = "SET_LOADING_STATE";
export declare const SET_SELECTED_NODE = "SET_SELECTED_NODE";
export declare class SetPath implements ActionInterface {
    readonly type: string;
    payload: string;
}
export declare class SetLoadingState implements ActionInterface {
    readonly type: string;
    payload: boolean;
}
export declare class SetSelectedNode implements ActionInterface {
    readonly type: string;
    payload: NodeInterface;
}
export declare type Actions = SetPath | SetLoadingState | SetSelectedNode;
