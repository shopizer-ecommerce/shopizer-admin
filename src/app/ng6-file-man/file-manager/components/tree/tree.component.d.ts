import { AfterViewInit, OnInit, TemplateRef } from '@angular/core';
import { NodeInterface } from '../../interfaces/node.interface';
import { TreeModel } from '../../models/tree.model';
import { NodeService } from '../../services/node.service';
import { Store } from '@ngrx/store';
import { AppStore } from '../../reducers/reducer.factory';
export declare class TreeComponent implements AfterViewInit, OnInit {
    private nodeService;
    private store;
    templateRef: TemplateRef<any>;
    treeModel: TreeModel;
    nodes: NodeInterface;
    currentTreeLevel: string;
    constructor(nodeService: NodeService, store: Store<AppStore>);
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
