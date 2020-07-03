import { NodeInterface } from '../interfaces/node.interface';
import { NodeService } from './node.service';
import { TreeModel } from '../models/tree.model';
import { HttpClient } from '@angular/common/http';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AppStore } from '../reducers/reducer.factory';
import { Store } from '@ngrx/store';
export declare class NodeClickedService {
    ngxSmartModalService: NgxSmartModalService;
    private nodeService;
    private store;
    private http;
    tree: TreeModel;
    constructor(ngxSmartModalService: NgxSmartModalService, nodeService: NodeService, store: Store<AppStore>, http: HttpClient);
    startDownload(node: NodeInterface): void;
    initDelete(node: NodeInterface): void;
    searchForString(input: string): void;
    createFolder(currentParent: number, newDirName: string): void;
    rename(id: number, newName: string): void;
    private sideEffectHelper(name, parameters, httpMethod, apiURL, successMethod?, failMethod?);
    private reachServer(method, apiUrl, data?);
    private parseParams(params);
    private successWithModalClose();
    private searchSuccess(input, data);
    private actionSuccess(response?);
    private actionFailed(name, error);
}
