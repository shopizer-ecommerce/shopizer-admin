import { NodeInterface } from './node.interface';
export interface StateInterface {
    path: string;
    selectedNode: NodeInterface;
    isLoading: boolean;
}
