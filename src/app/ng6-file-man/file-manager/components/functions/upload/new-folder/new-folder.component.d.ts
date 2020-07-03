import { ElementRef, EventEmitter, OnInit } from '@angular/core';
export declare class NewFolderComponent implements OnInit {
    uploadFolder: ElementRef;
    buttonClicked: EventEmitter<{}>;
    buttonText: string;
    inputValue: string;
    constructor();
    ngOnInit(): void;
    onClick(): void;
    onInputChange(event: any): void;
}
