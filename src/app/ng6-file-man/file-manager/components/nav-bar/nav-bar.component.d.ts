import { OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStore } from '../../reducers/reducer.factory';
import { NodeService } from '../../services/node.service';
export declare class NavBarComponent implements OnInit {
    private store;
    private nodeService;
    currentPath: string[];
    constructor(store: Store<AppStore>, nodeService: NodeService);
    ngOnInit(): void;
    onClick(path: string[], index: number): void;
}
