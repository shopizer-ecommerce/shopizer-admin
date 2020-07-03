import { EventEmitter, OnInit, TemplateRef } from '@angular/core';
import { NodeInterface } from '../../interfaces/node.interface';
export declare class SideViewComponent implements OnInit {
    sideViewTemplate: TemplateRef<any>;
    node: NodeInterface;
    allowFolderDownload: boolean;
    clickEvent: EventEmitter<{}>;
    constructor();
    ngOnInit(): void;
    onClick(event: any, type: string): void;
}
