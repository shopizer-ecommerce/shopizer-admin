import { OnInit } from '@angular/core';
import { NodeClickedService } from '../../services/node-clicked.service';
export declare class NavigationComponent implements OnInit {
    private nodeClickedService;
    constructor(nodeClickedService: NodeClickedService);
    ngOnInit(): void;
    onClick(input: string): void;
}
