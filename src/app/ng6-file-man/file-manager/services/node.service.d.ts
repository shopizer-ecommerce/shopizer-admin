import { NodeInterface } from '../interfaces/node.interface';
import { TreeModel } from '../models/tree.model';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppStore } from '../reducers/reducer.factory';
export declare class NodeService {
    private http;
    private store;
    tree: TreeModel;
    private _path;
    constructor(http: HttpClient, store: Store<AppStore>);
    startManagerAt(path: string): void;
    refreshCurrentPath(): void;
    getNodes(path: string): void;
    private getParentPath(path);
    private parseNodes(path);
    private createNode(path, node);
    private getNodesFromServer;
    findNodeByPath(nodePath: string): NodeInterface;
    findNodeById(id: number): NodeInterface;
    findNodeByIdHelper(id: number, node?: NodeInterface): NodeInterface;
    foldRecursively(node: NodeInterface): void;
    foldAll(): void;
    currentPath: string;
}
