import { EventEmitter, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { TreeModel } from '../../models/tree.model';
import { NodeService } from '../../services/node.service';
import { NodeInterface } from '../../interfaces/node.interface';
import { AppStore } from '../../reducers/reducer.factory';
export declare class FolderContentComponent implements OnInit {
    private nodeService;
    private store;
    folderContentTemplate: TemplateRef<any>;
    folderContentBackTemplate: TemplateRef<any>;
    folderContentNewTemplate: TemplateRef<any>;
    treeModel: TreeModel;
    openUploadDialog: EventEmitter<{}>;
    nodes: NodeInterface;
    obj: ObjectConstructor;
    constructor(nodeService: NodeService, store: Store<AppStore>);
    ngOnInit(): void;
    newClickedAction(): void;
}
