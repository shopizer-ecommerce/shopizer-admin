import { NodeInterface } from '../interfaces/node.interface';
import { ConfigInterface } from '../interfaces/config.interface';
export declare class TreeModel {
    private _currentPath;
    private _nodes;
    private _selectedNodeId;
    config: ConfigInterface;
    constructor(config: ConfigInterface);
    currentPath: string;
    nodes: NodeInterface;
    selectedNodeId: string;
}
