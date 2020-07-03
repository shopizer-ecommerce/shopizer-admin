import { OnInit, TemplateRef } from '@angular/core';
import { NodeInterface } from '../../../interfaces/node.interface';
export declare class NodeListerComponent implements OnInit {
    templateRef: TemplateRef<any>;
    nodes: NodeInterface;
    showFiles: boolean;
    obj: ObjectConstructor;
    constructor();
    ngOnInit(): void;
}
