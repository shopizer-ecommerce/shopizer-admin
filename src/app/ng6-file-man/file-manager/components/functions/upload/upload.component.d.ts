import { AfterViewInit, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FineUploader } from 'fine-uploader';
import { NodeService } from '../../../services/node.service';
export declare class UploadComponent implements OnInit, AfterViewInit {
    private http;
    private nodeService;
    openDialog: any;
    closeDialog: EventEmitter<{}>;
    createDir: EventEmitter<{}>;
    uploader: FineUploader;
    newFolder: boolean;
    counter: number;
    constructor(http: HttpClient, nodeService: NodeService);
    ngAfterViewInit(): void;
    ngOnInit(): void;
    readonly getCurrentPath: string | number;
    uploadFiles(): void;
    createNewFolder(input?: string): void;
    newClickedAction(): void;
}
