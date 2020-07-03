import { OnInit } from '@angular/core';
import { NodeInterface } from '../../../interfaces/node.interface';
import { Store } from '@ngrx/store';
import { AppStore } from '../../../reducers/reducer.factory';
import { NodeService } from '../../../services/node.service';
import { NodeClickedService } from '../../../services/node-clicked.service';
export declare class NodeComponent implements OnInit {
    private store;
    private nodeService;
    private nodeClickedService;
    node: NodeInterface;
    isSingleClick: boolean;
    constructor(store: Store<AppStore>, nodeService: NodeService, nodeClickedService: NodeClickedService);
    method1CallForClick(event: MouseEvent): void;
    method2CallForDblClick(event: any): void;
    ngOnInit(): void;
    private open();
    private showMenu();
    private toggleNodeExpanded();
    private setNodeSelectedState();
}
