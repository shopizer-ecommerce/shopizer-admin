import { Injectable, Pipe, Component, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation, ContentChild, ViewChild, NgModule, defineInjectable, inject } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { HttpClient, HttpParams, HttpClientModule } from '@angular/common/http';
import { Store, select, StoreModule } from '@ngrx/store';
import { NgxSmartModalService, NgxSmartModalModule } from 'ngx-smart-modal';
import { TranslateService, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { FineUploader } from 'fine-uploader';
import { CommonModule } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class TreeModel {
    /**
     * @param {?} config
     */
    constructor(config) {
        // this._currentPath = config.startingFolder; // todo implement (config.interfce.ts)
        this._currentPath = '';
        this.config = config;
        this.nodes = /** @type {?} */ ({
            id: 0,
            pathToNode: '',
            pathToParent: null,
            isFolder: true,
            isExpanded: true,
            stayOpen: true,
            name: 'root',
            children: {}
        });
    }
    /**
     * @return {?}
     */
    get currentPath() {
        return this._currentPath;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set currentPath(value) {
        this._currentPath = value;
    }
    /**
     * @return {?}
     */
    get nodes() {
        return this._nodes;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set nodes(value) {
        this._nodes = value;
    }
    /**
     * @return {?}
     */
    get selectedNodeId() {
        return this._selectedNodeId;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set selectedNodeId(value) {
        this._selectedNodeId = value;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const SET_PATH = 'SET_PATH';
/** @type {?} */
const SET_LOADING_STATE = 'SET_LOADING_STATE';
/** @type {?} */
const SET_SELECTED_NODE = 'SET_SELECTED_NODE';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NodeService {
    /**
     * @param {?} http
     * @param {?} store
     */
    constructor(http, store) {
        this.http = http;
        this.store = store;
        this.getNodesFromServer = (path) => {
            /** @type {?} */
            let folderId = this.findNodeByPath(path).id;
            folderId = folderId === 0 ? '' : folderId;
            return this.http.get(this.tree.config.baseURL + this.tree.config.api.listFile, { params: new HttpParams().set('parentPath', folderId) });
        };
    }
    /**
     * @param {?} path
     * @return {?}
     */
    startManagerAt(path) {
        this.store.dispatch({ type: SET_PATH, payload: path });
    }
    /**
     * @return {?}
     */
    refreshCurrentPath() {
        this.findNodeByPath(this.currentPath).children = {};
        this.getNodes(this.currentPath);
    }
    /**
     * @param {?} path
     * @return {?}
     */
    getNodes(path) {
        this.parseNodes(path).subscribe((data) => {
            for (let i = 0; i < data.length; i++) {
                /** @type {?} */
                const parentPath = this.getParentPath(data[i].pathToNode);
                this.findNodeByPath(parentPath).children[data[i].name] = data[i];
            }
        });
    }
    /**
     * @param {?} path
     * @return {?}
     */
    getParentPath(path) {
        /** @type {?} */
        let parentPath = path.split('/');
        parentPath = parentPath.slice(0, parentPath.length - 1);
        return parentPath.join('/');
    }
    /**
     * @param {?} path
     * @return {?}
     */
    parseNodes(path) {
        return new Observable(observer => {
            this.getNodesFromServer(path).subscribe((data) => {
                observer.next(data.map(node => this.createNode(path, node)));
                this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
            });
        });
    }
    /**
     * @param {?} path
     * @param {?} node
     * @return {?}
     */
    createNode(path, node) {
        if (node.path[0] !== '/') {
            console.warn('[Node Service] Server should return initial path with "/"');
            node.path = '/' + node.path;
        }
        /** @type {?} */
        const ids = node.path.split('/');
        if (ids.length > 2 && ids[ids.length - 1] === '') {
            ids.splice(-1, 1);
            node.path = ids.join('/');
        }
        /** @type {?} */
        const cachedNode = this.findNodeByPath(node.path);
        return /** @type {?} */ ({
            id: node.id,
            isFolder: node.dir,
            isExpanded: cachedNode ? cachedNode.isExpanded : false,
            pathToNode: node.path,
            pathToParent: this.getParentPath(node.path),
            name: node.name || node.id,
            children: cachedNode ? cachedNode.children : {}
        });
    }
    /**
     * @param {?} nodePath
     * @return {?}
     */
    findNodeByPath(nodePath) {
        /** @type {?} */
        const ids = nodePath.split('/');
        ids.splice(0, 1);
        return ids.length === 0 ? this.tree.nodes : ids.reduce((value, index) => value['children'][index], this.tree.nodes);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    findNodeById(id) {
        /** @type {?} */
        const result = this.findNodeByIdHelper(id);
        if (result === null) {
            console.warn('[Node Service] Cannot find node by id. Id not existing or not fetched. Returning root.');
            return this.tree.nodes;
        }
        return result;
    }
    /**
     * @param {?} id
     * @param {?=} node
     * @return {?}
     */
    findNodeByIdHelper(id, node = this.tree.nodes) {
        if (node.id === id)
            return node;
        /** @type {?} */
        const keys = Object.keys(node.children);
        for (let i = 0; i < keys.length; i++) {
            if (typeof node.children[keys[i]] == 'object') {
                /** @type {?} */
                const obj = this.findNodeByIdHelper(id, node.children[keys[i]]);
                if (obj != null)
                    return obj;
            }
        }
        return null;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    foldRecursively(node) {
        /** @type {?} */
        const children = node.children;
        Object.keys(children).map((child) => {
            if (!children.hasOwnProperty(child) || !children[child].isExpanded) {
                return null;
            }
            this.foldRecursively(children[child]);
            //todo put this getElById into one func (curr inside node.component.ts + fm.component.ts) - this won't be maintainable
            document.getElementById('tree_' + children[child].pathToNode).classList.add('deselected');
            children[child].isExpanded = false;
        });
    }
    /**
     * @return {?}
     */
    foldAll() {
        this.foldRecursively(this.tree.nodes);
    }
    /**
     * @return {?}
     */
    get currentPath() {
        return this._path;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set currentPath(value) {
        this._path = value;
    }
}
NodeService.decorators = [
    {
        type: Injectable, args: [{
            providedIn: 'root'
        },]
    },
];
/** @nocollapse */
NodeService.ctorParameters = () => [
    { type: HttpClient },
    { type: Store }
];
/** @nocollapse */ NodeService.ngInjectableDef = defineInjectable({ factory: function NodeService_Factory() { return new NodeService(inject(HttpClient), inject(Store)); }, token: NodeService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NodeClickedService {
    /**
     * @param {?} ngxSmartModalService
     * @param {?} nodeService
     * @param {?} store
     * @param {?} http
     */
    constructor(ngxSmartModalService, nodeService, store, http) {
        this.ngxSmartModalService = ngxSmartModalService;
        this.nodeService = nodeService;
        this.store = store;
        this.http = http;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    startDownload(node) {
        /** @type {?} */
        const parameters = this.parseParams({ path: node.id });
        this.reachServer('download', this.tree.config.api.downloadFile + parameters);
    }
    /**
     * @param {?} node
     * @return {?}
     */
    initDelete(node) {
        this.sideEffectHelper('Delete', { path: node.id }, 'delete', this.tree.config.api.deleteFile, () => this.successWithModalClose());
    }
    /**
     * @param {?} input
     * @return {?}
     */
    searchForString(input) {
        this.sideEffectHelper('Search', { query: input }, 'get', this.tree.config.api.searchFiles, (res) => this.searchSuccess(input, res));
    }
    /**
     * @param {?} currentParent
     * @param {?} newDirName
     * @return {?}
     */
    createFolder(currentParent, newDirName) {
        this.sideEffectHelper('Create Folder', { dirName: newDirName, parentPath: currentParent === 0 ? null : currentParent }, 'post', this.tree.config.api.createFolder);
    }
    /**
     * @param {?} id
     * @param {?} newName
     * @return {?}
     */
    rename(id, newName) {
        this.sideEffectHelper('Rename', { path: id, newName: newName }, 'post', this.tree.config.api.renameFile, () => this.successWithModalClose());
    }
    /**
     * @param {?} name
     * @param {?} parameters
     * @param {?} httpMethod
     * @param {?} apiURL
     * @param {?=} successMethod
     * @param {?=} failMethod
     * @return {?}
     */
    sideEffectHelper(name, parameters, httpMethod, apiURL, successMethod = (a) => this.actionSuccess(a), failMethod = (a, b) => this.actionFailed(a, b)) {
        /** @type {?} */
        const params = this.parseParams(parameters);
        this.ngxSmartModalService.getModal('waitModal').open();
        this.reachServer(httpMethod, apiURL + params)
            .subscribe((a) => successMethod(a), (err) => failMethod(name, err));
    }
    /**
     * @param {?} method
     * @param {?} apiUrl
     * @param {?=} data
     * @return {?}
     */
    reachServer(method, apiUrl, data = {}) {
        switch (method.toLowerCase()) {
            case 'get':
                return this.http.get(this.tree.config.baseURL + apiUrl);
            case 'post':
                return this.http.post(this.tree.config.baseURL + apiUrl, data);
            case 'delete':
                return this.http.delete(this.tree.config.baseURL + apiUrl);
            case 'download':
                window.open(this.tree.config.baseURL + apiUrl, '_blank');
                return null;
            default:
                console.warn('[NodeClickedService] Incorrect params for this side-effect');
                return null;
        }
    }
    /**
     * @param {?} params
     * @return {?}
     */
    parseParams(params) {
        /** @type {?} */
        let query = '?';
        Object.keys(params).filter(item => params[item] !== null).map(key => {
            query += key + '=' + params[key] + '&';
        });
        return query.slice(0, -1);
    }
    /**
     * @return {?}
     */
    successWithModalClose() {
        this.actionSuccess();
        document.getElementById('side-view').classList.remove('selected');
    }
    /**
     * @param {?} input
     * @param {?} data
     * @return {?}
     */
    searchSuccess(input, data) {
        /** @type {?} */
        const obj = {
            searchString: input,
            response: data
        };
        this.actionSuccess();
        this.ngxSmartModalService.setModalData(obj, 'searchModal', true);
        this.ngxSmartModalService.getModal('searchModal').open();
    }
    /**
     * @param {?=} response
     * @return {?}
     */
    actionSuccess(response = '') {
        this.nodeService.refreshCurrentPath();
        this.ngxSmartModalService.getModal('waitModal').close();
    }
    /**
     * @param {?} name
     * @param {?} error
     * @return {?}
     */
    actionFailed(name, error) {
        this.ngxSmartModalService.getModal('waitModal').close();
        this.ngxSmartModalService.getModal('errorModal').open();
        console.warn('[NodeClickedService] Action "' + name + '" failed', error);
    }
}
NodeClickedService.decorators = [
    {
        type: Injectable, args: [{
            providedIn: 'root'
        },]
    },
];
/** @nocollapse */
NodeClickedService.ctorParameters = () => [
    { type: NgxSmartModalService },
    { type: NodeService },
    { type: Store },
    { type: HttpClient }
];
/** @nocollapse */ NodeClickedService.ngInjectableDef = defineInjectable({ factory: function NodeClickedService_Factory() { return new NodeClickedService(inject(NgxSmartModalService), inject(NodeService), inject(Store), inject(HttpClient)); }, token: NodeClickedService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class FileManagerComponent {
    /**
     * @param {?} store
     * @param {?} nodeService
     * @param {?} nodeClickedService
     * @param {?} ngxSmartModalService
     * @param {?} translate
     */
    constructor(store, nodeService, nodeClickedService, ngxSmartModalService, translate) {
        this.store = store;
        this.nodeService = nodeService;
        this.nodeClickedService = nodeClickedService;
        this.ngxSmartModalService = ngxSmartModalService;
        this.translate = translate;
        this.isPopup = false;
        this.itemClicked = new EventEmitter();
        this._language = 'en';
        this.sideMenuClosed = true;
        this.fmOpen = false;
        this.newDialog = false;
        translate.setDefaultLang('en');
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set language(value) {
        this._language = value;
        this.translate.use(this.language);
    }
    /**
     * @return {?}
     */
    get language() {
        return this._language;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // @ts-ignore
        window.console = window.console || {};
        window.console.log = window.console.log || function () {
        };
        this.nodeService.tree = this.tree;
        this.nodeClickedService.tree = this.tree;
        this.nodeService.startManagerAt(this.tree.currentPath);
        this.store
            .pipe(select(state => state.fileManagerState.isLoading))
            .subscribe((data) => {
                this.loading = data;
            });
        this.store
            .pipe(select(state => state.fileManagerState.selectedNode))
            .subscribe((node) => {
                if (!node) {
                    return;
                }
                // fixed highlighting error when closing node but not changing path
                if ((node.isExpanded && node.pathToNode !== this.nodeService.currentPath) && !node.stayOpen) {
                    return;
                }
                this.handleFileManagerClickEvent({ type: 'select', node: node });
            });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onItemClicked(event) {
        this.itemClicked.emit(event);
    }
    /**
     * @param {?} data
     * @return {?}
     */
    searchClicked(data) {
        /** @type {?} */
        const node = this.nodeService.findNodeById(data.id);
        this.ngxSmartModalService.getModal('searchModal').close();
        this.store.dispatch({ type: SET_SELECTED_NODE, payload: node });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleFileManagerClickEvent(event) {
        switch (event.type) {
            case 'closeSideView':
                return this.nodeClickHandler(event.node, true);
            case 'select':
                this.onItemClicked(event);
                this.highlightSelected(event.node);
                return this.nodeClickHandler(event.node);
            case 'download':
                this.nodeClickedService.startDownload(event.node);
                return this.onItemClicked(event);
            case 'renameConfirm':
                return this.ngxSmartModalService.getModal('renameModal').open();
            case 'rename':
                this.ngxSmartModalService.getModal('renameModal').close();
                this.nodeClickedService.rename(this.selectedNode.id, event.value);
                return this.onItemClicked({
                    type: event.type,
                    node: this.selectedNode,
                    newName: event.value
                });
            case 'removeAsk':
                return this.ngxSmartModalService.getModal('confirmDeleteModal').open();
            case 'remove':
                this.ngxSmartModalService.getModal('confirmDeleteModal').close();
                this.nodeClickedService.initDelete(this.selectedNode);
                return this.onItemClicked({
                    type: event.type,
                    node: this.selectedNode
                });
            case 'createFolder':
                /** @type {?} */
                const parentId = this.nodeService.findNodeByPath(this.nodeService.currentPath).id;
                this.nodeClickedService.createFolder(parentId, event.payload);
                return this.onItemClicked({
                    type: event.type,
                    parentId: parentId,
                    newDirName: event.payload
                });
        }
    }
    /**
     * @param {?} node
     * @param {?=} closing
     * @return {?}
     */
    nodeClickHandler(node, closing) {
        if (node.name === 'root') {
            return;
        }
        if (closing) {
            /** @type {?} */
            const parentNode = this.nodeService.findNodeByPath(this.nodeService.currentPath);
            this.store.dispatch({ type: SET_SELECTED_NODE, payload: parentNode });
            this.sideMenuClosed = true;
        }
        else {
            // todo fix this (kvoli tomu ze sa klika na ten isty node tak store ho ignoruje)
            if (this.selectedNode === node && this.sideMenuClosed)
                this.sideMenuClosed = false;
            else if (this.selectedNode === node && !this.sideMenuClosed)
                this.sideMenuClosed = true;
            else if (this.selectedNode !== node && this.sideMenuClosed)
                this.sideMenuClosed = false;
            else if (this.selectedNode !== node && !this.sideMenuClosed)
                this.sideMenuClosed = false;
        }
        this.selectedNode = node;
        if (this.sideMenuClosed) {
            document.getElementById('side-view').classList.remove('selected');
        }
        else {
            document.getElementById('side-view').classList.add('selected');
        }
    }
    /**
     * @param {?} node
     * @return {?}
     */
    highlightSelected(node) {
        /** @type {?} */
        let pathToNode = node.pathToNode;
        if (pathToNode.length === 0) {
            pathToNode = 'root';
        }
        /** @type {?} */
        const treeElement = this.getElementById(pathToNode, 'tree_');
        /** @type {?} */
        const fcElement = this.getElementById(pathToNode, 'fc_');
        if (!treeElement && !fcElement) {
            console.warn('[File Manager] failed to find requested node for path:', pathToNode);
            return;
        }
        this.removeClass('highlighted');
        this.removeClass('light');
        if (fcElement)
            this.highilghtChildElement(fcElement);
        if (treeElement)
            this.highilghtChildElement(treeElement, true);
        /** @type {?} */
        let pathToParent = node.pathToParent;
        if (pathToParent === null || node.pathToNode === this.nodeService.currentPath) {
            return;
        }
        if (pathToParent.length === 0) {
            pathToParent = 'root';
        }
        /** @type {?} */
        const parentElement = this.getElementById(pathToParent, 'tree_');
        if (!parentElement) {
            console.warn('[File Manager] failed to find requested parent node for path:', pathToParent);
            return;
        }
        this.highilghtChildElement(parentElement);
    }
    /**
     * @param {?} el
     * @param {?=} light
     * @return {?}
     */
    highilghtChildElement(el, light = false) {
        el.children[0] // appnode div wrapper
            .children[0] // ng template first item
            .classList.add('highlighted');
        if (light)
            el.children[0]
                .children[0]
                .classList.add('light');
    }
    /**
     * @param {?} id
     * @param {?=} prefix
     * @return {?}
     */
    getElementById(id, prefix = '') {
        /** @type {?} */
        const fullId = prefix + id;
        return document.getElementById(fullId);
    }
    /**
     * @param {?} className
     * @return {?}
     */
    removeClass(className) {
        Array.from(document.getElementsByClassName(className))
            .map((el) => el.classList.remove(className));
    }
    /**
     * @return {?}
     */
    fmShowHide() {
        this.fmOpen = !this.fmOpen;
    }
    /**
     * @return {?}
     */
    backdropClicked() {
        // todo get rid of this ugly workaround
        // todo fire userCanceledLoading event
        this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleUploadDialog(event) {
        this.newDialog = event;
    }
}
FileManagerComponent.decorators = [
    {
        type: Component, args: [{
            selector: 'fm-file-manager',
            template: `<ng-container *ngIf="isPopup; then itIsPopup else showContent"></ng-container>

<ng-template #itIsPopup>
  <div *ngIf="!fmOpen">
    <button class="button big" (click)="fmShowHide()" translate="">Open file manager</button>
  </div>
  <div class="file-manager-backdrop" *ngIf="fmOpen">
    <div class="fmModalInside">
      <div *ngIf="fmOpen; then showContent"></div>
    </div>
  </div>
</ng-template>

<ng-template #showContent>
  <div class="content">
    <div class="file-manager-navbar">
      <div class="path">
        <app-nav-bar></app-nav-bar>
      </div>

      <div class="navigation">
        <app-navigation>
          <div class="button close" (click)="fmShowHide()" *ngIf="isPopup">
            <i class="fas fa-2x fa-times"></i>
          </div>
        </app-navigation>
      </div>
    </div>

    <div class="holder">
      <div class="file-manager-left">
        <app-tree [treeModel]="tree">
          <ng-template let-nodes>
            <ng-container [ngTemplateOutletContext]="{$implicit: nodes}"
                          [ngTemplateOutlet]="iconTemplate ? iconTemplate : defaultIconTemplate">
            </ng-container>
          </ng-template>
        </app-tree>
      </div>

      <div class="right">
        <app-folder-content
          [treeModel]="tree"
          (openUploadDialog)="handleUploadDialog($event)"
          [folderContentTemplate]="folderContentTemplate ? folderContentTemplate : defaultFolderContentTemplate"
          [folderContentNewTemplate]="folderContentNewTemplate ? folderContentNewTemplate : defaultFolderContentNewTemplate"
          [folderContentBackTemplate]="folderContentBackTemplate ? folderContentBackTemplate : defaultFolderContentBackTemplate">
        </app-folder-content>
      </div>

      <app-side-view id="side-view"
                     [node]="selectedNode"
                     [sideViewTemplate]="sideViewTemplate ? sideViewTemplate : defaultSideViewTemplate"
                     [allowFolderDownload]="tree.config.options.allowFolderDownload"
                     (clickEvent)="handleFileManagerClickEvent($event)">
      </app-side-view>
    </div>
  </div>

  <app-upload *ngIf="newDialog"
              [openDialog]="newDialog"
              (closeDialog)="handleUploadDialog(false)"
              (createDir)="handleFileManagerClickEvent({type: 'createFolder', payload: $event})">
  </app-upload>

  <app-loading-overlay
    *ngIf="loading"
    [loadingOverlayTemplate]="loadingOverlayTemplate ? loadingOverlayTemplate : defaultLoadingOverlayTemplate">
  </app-loading-overlay>
</ng-template>

<ng-template let-node #defaultIconTemplate>
  <div class="file-manager-node" style="display: inline-block; padding: 3px">
    <div *ngIf="node.isFolder; then itIsFolder else showFile"></div>

    <ng-template #itIsFolder>
      <div *ngIf="node.isExpanded; then isFolderExpanded else isFolderClosed"></div>
    </ng-template>

    <ng-template #showFile><i class="fas fa-file child"></i></ng-template>
    <ng-template #isFolderExpanded><i class="fas fa-folder-open child"></i></ng-template>
    <ng-template #isFolderClosed><i class="fas fa-folder child"></i></ng-template>

    <span>{{node.name}}</span>
  </div>
</ng-template>
<ng-template let-node #defaultFolderContentTemplate>
  <div class="file-manager-item">
    <div class="file-preview">
      <div *ngIf="node.isFolder; then itIsFolder else showFile"></div>
      <ng-template #itIsFolder><i class="fas fa-3x fa-folder child"></i></ng-template>
      <ng-template #showFile><i class="fas fa-3x fa-file child"></i></ng-template>
    </div>
    <div class="file-name">
      {{node.name}}
    </div>
  </div>
</ng-template>
<ng-template #defaultFolderContentNewTemplate>
  <div class="file-manager-item">
    <div class="file-preview" style="width: 100%; height:100%">
      <i class="fas fa-3x fa-plus child" style="line-height: 2"></i>
    </div>
  </div>
</ng-template>
<ng-template let-node #defaultFolderContentBackTemplate>
  <div class="file-manager-item">
    <div class="file-preview" style="width: 100%; height:100%">
      <i class="fas fa-2x fa-ellipsis-h" style="line-height: 5"></i>
    </div>
  </div>
</ng-template>
<ng-template let-timeoutMessage #defaultLoadingOverlayTemplate>
  <div class="file-manager-backdrop loading" (click)="backdropClicked()">
    <div class="file-manager-error" *ngIf="timeoutMessage">{{timeoutMessage | translate}}</div>
  </div>
  <div class="spinner">
    <i class="fas fa-5x fa-spin fa-sync-alt"></i>
  </div>
</ng-template>
<ng-template let-node #defaultSideViewTemplate>
  <div style="position: absolute; bottom: 0; width: 100%; margin: 5px auto">
    <span *ngIf="node.isFolder" translate>No data available for this folder</span>
    <span *ngIf="!node.isFolder" translate>No data available for this file</span>
  </div>
</ng-template>

<ngx-smart-modal identifier="renameModal" [dismissable]="false" [closable]="false" *ngIf="selectedNode" #renameModal>
  <h2 class="modal-title" translate>
    Rename file
  </h2>
  <p class="rename-name" translate>
    Old name
  </p>
  <span style="margin: 8px">{{selectedNode.name}}</span>
  <p class="rename-name" translate>
    New name
  </p>
  <input placeholder="New name" type="text" class="rename-input" [value]="selectedNode.name" #renameInput
         (keyup.enter)="handleFileManagerClickEvent({type: 'rename', value: renameInput.value})"
         onclick="this.select();">
  <br>

  <div class="rename-button">
    <button class="button big" translate
            (click)="handleFileManagerClickEvent({type: 'rename', value: renameInput.value})"
            [disabled]="renameInput.value === selectedNode.name || renameInput.value.length === 0">
      Rename
    </button>
    <button class="button big" (click)="renameModal.close()" translate>
      Cancel
    </button>
  </div>

</ngx-smart-modal>
<ngx-smart-modal *ngIf="selectedNode" identifier="confirmDeleteModal" #deleteModal
                 [dismissable]="false" [closable]="false">
  <h2 class="modal-title">
    <span translate>You are trying to delete following </span>
    <span *ngIf="selectedNode.isFolder" translate>folder</span>
    <span *ngIf="!selectedNode.isFolder" translate>file</span>
  </h2>

  <div style="width: 100%; margin: 5px auto; text-align: center">{{selectedNode.name}}</div>

  <div class="rename-button">
    <button class="button big" (click)="handleFileManagerClickEvent({type: 'remove'})">
      <span translate>Yes, delete this </span>
      <span *ngIf="selectedNode.isFolder" translate>folder</span>
      <span *ngIf="!selectedNode.isFolder" translate>file</span>
    </button>
    <button class="button big " (click)="deleteModal.close()" translate>
      Cancel
    </button>
  </div>
</ngx-smart-modal>
<ngx-smart-modal identifier="searchModal" #searchModal [closable]="true">
  <h2 class="modal-title" style="margin-bottom: 2px" translate
      *ngIf="searchModal.hasData() && searchModal.getData().response.length !== 0">
    Search results for
  </h2>
  <h2 class="modal-title" style="margin-bottom: 2px" translate
      *ngIf="!searchModal.hasData() || searchModal.getData().response.length === 0">
    No results found for
  </h2>
  <div style="text-align: center" *ngIf="searchModal.hasData()">{{searchModal.getData().searchString}}</div>

  <div *ngIf="searchModal.hasData() && searchModal.getData().response.length !== 0">
    <table style="margin: 0 auto">
      <tr>
        <td class="table-item table-head" translate>File name</td>
        <td class="table-item-short table-head" translate>Size</td>
      </tr>
      <tr *ngFor="let item of searchModal.getData().response" (click)="searchClicked(item)">
        <td style="cursor: pointer">
          <ng-container *ngIf="item.fileCategory === 'D'; else file">
            <i class="fas fa-folder search-output-icon"></i>
          </ng-container>
          <ng-template #file>
            <i class="fas fa-file search-output-icon"></i>
          </ng-template>
          <span style="text-overflow: ellipsis">{{item.name}}</span>
        </td>
        <td class="table-item-short">{{item.size}}</td>
      </tr>
    </table>
  </div>
</ngx-smart-modal>
<ngx-smart-modal identifier="waitModal" [closable]="true">
  <h2 class="modal-title" style="margin-top: 20px">
  {{'Your request has been completed' | translate}}
  </h2>

  <div style="text-align: center; height: 70px">
    <i class="fas fa-spinner fa-spin fa-4x"></i>
  </div>
</ngx-smart-modal>
<ngx-smart-modal identifier="errorModal" [closable]="true">
  <h2 class="modal-title" style="margin-top: 20px">
    {{'Something went wrong with your request' | translate}}...
  </h2>
</ngx-smart-modal>
`,
            styles: [`.content{height:100%;min-width:850px}.holder{display:flex;height:calc(100% - 75px)}.path{margin:auto 0;display:block}.navigation{margin:auto 0;display:flex}.navigation .button{margin:0 10px;padding:0;position:relative}.right{width:100%;position:relative;overflow:auto}.file-name{width:100px;height:25px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.file-preview{margin:auto}.file-preview i{line-height:1.5}.spinner{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);cursor:progress}.rename-button{margin:20px auto;display:block;text-align:center}.modal-title{margin-top:5px;text-align:center}.search-output{margin:15px 0}.search-output-icon{margin:2px 5px}.table-item{width:80%}.table-item-short{width:20%;text-align:right}`],
            encapsulation: ViewEncapsulation.None
        },]
    },
];
/** @nocollapse */
FileManagerComponent.ctorParameters = () => [
    { type: Store },
    { type: NodeService },
    { type: NodeClickedService },
    { type: NgxSmartModalService },
    { type: TranslateService }
];
FileManagerComponent.propDecorators = {
    iconTemplate: [{ type: Input }],
    modalTemplate: [{ type: Input }],
    folderContentTemplate: [{ type: Input }],
    folderContentBackTemplate: [{ type: Input }],
    folderContentNewTemplate: [{ type: Input }],
    loadingOverlayTemplate: [{ type: Input }],
    sideViewTemplate: [{ type: Input }],
    tree: [{ type: Input }],
    isPopup: [{ type: Input }],
    itemClicked: [{ type: Output }],
    language: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class FolderContentComponent {
    /**
     * @param {?} nodeService
     * @param {?} store
     */
    constructor(nodeService, store) {
        this.nodeService = nodeService;
        this.store = store;
        this.openUploadDialog = new EventEmitter();
        this.obj = Object;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.store
            .pipe(select(state => state.fileManagerState.path))
            .subscribe((path) => {
                this.nodes = this.nodeService.findNodeByPath(path);
            });
    }
    /**
     * @return {?}
     */
    newClickedAction() {
        this.openUploadDialog.emit(true);
    }
}
FolderContentComponent.decorators = [
    {
        type: Component, args: [{
            selector: 'app-folder-content',
            template: `<div class="item-holder">
  <ng-container *ngIf="nodes.id !== 0">
    <app-node [node]=nodes id="{{nodes.pathToNode}}">
      <ng-container [ngTemplateOutletContext]="{$implicit: nodes}"
                    [ngTemplateOutlet]="folderContentBackTemplate">
      </ng-container>
    </app-node>
  </ng-container>

  <ng-container *ngFor="let node of obj.keys(nodes.children)">
    <app-node [node]="nodes.children[node]"
              id="fc_{{nodes.children[node].pathToNode}}">
      <ng-container [ngTemplateOutletContext]="{$implicit: nodes.children[node]}"
                    [ngTemplateOutlet]="folderContentTemplate">
      </ng-container>
    </app-node>
  </ng-container>

  <div class="new" (click)="newClickedAction()">
    <ng-container [ngTemplateOutlet]="folderContentNewTemplate"></ng-container>
  </div>
</div>
`,
            styles: [`.item-holder{box-sizing:border-box;display:flex;flex-flow:wrap}.item-holder .new{display:inline}`]
        },]
    },
];
/** @nocollapse */
FolderContentComponent.ctorParameters = () => [
    { type: NodeService },
    { type: Store }
];
FolderContentComponent.propDecorators = {
    folderContentTemplate: [{ type: Input }],
    folderContentBackTemplate: [{ type: Input }],
    folderContentNewTemplate: [{ type: Input }],
    treeModel: [{ type: Input }],
    openUploadDialog: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class TreeComponent {
    /**
     * @param {?} nodeService
     * @param {?} store
     */
    constructor(nodeService, store) {
        this.nodeService = nodeService;
        this.store = store;
        this.currentTreeLevel = '';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.nodes = this.treeModel.nodes;
        //todo move this store to proper place
        this.store
            .pipe(select(state => state.fileManagerState.path))
            .subscribe((path) => {
                this.nodeService.getNodes(path);
                this.currentTreeLevel = this.treeModel.currentPath;
                return this.treeModel.currentPath = path;
            });
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.store
            .pipe(select(state => state.fileManagerState.path))
            .pipe(first())
            .subscribe((path) => {
                /** @type {?} */
                const nodes = this.nodeService.findNodeByPath(path);
                this.store.dispatch({ type: SET_SELECTED_NODE, payload: nodes });
            });
    }
}
TreeComponent.decorators = [
    {
        type: Component, args: [{
            selector: 'app-tree',
            template: `<app-node-lister [showFiles]="treeModel.config.options.showFilesInsideTree"
                 [nodes]="{children: nodes}">
  <ng-template let-nodes>
    <ng-container [ngTemplateOutletContext]="{$implicit: nodes}" [ngTemplateOutlet]="templateRef"></ng-container>
  </ng-template>
</app-node-lister>
`,
            styles: [``]
        },]
    },
];
/** @nocollapse */
TreeComponent.ctorParameters = () => [
    { type: NodeService },
    { type: Store }
];
TreeComponent.propDecorators = {
    templateRef: [{ type: ContentChild, args: [TemplateRef,] }],
    treeModel: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NodeListerComponent {
    constructor() {
        this.obj = Object;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
NodeListerComponent.decorators = [
    {
        type: Component, args: [{
            selector: 'app-node-lister',
            template: `<ul class="node-lister-flist">
  <!--In order to avoid having to create that extra div, we can instead use ng-container directive-->
  <ng-container *ngFor="let node of obj.keys(nodes)">
    <li class="node-lister-list-item" *ngIf="nodes[node].isFolder || showFiles">

      <app-node class="node-lister-app-node" [node]="nodes[node]" id="tree_{{nodes[node].id === 0 ? 'root' : nodes[node].pathToNode}}">
        <ng-container [ngTemplateOutletContext]="{$implicit: (nodes[node])}"
                      [ngTemplateOutlet]="templateRef">
        </ng-container>
      </app-node>

      <app-node-lister class="node-lister" *ngIf="obj.keys(nodes[node].children).length > 0"
                       [showFiles]="showFiles" [nodes]="nodes[node].children">
        <ng-template let-nodes>
          <ng-container [ngTemplateOutletContext]="{$implicit: (nodes)}"
                        [ngTemplateOutlet]="templateRef">
          </ng-container>
        </ng-template>
      </app-node-lister>
    </li>
  </ng-container>
</ul>
`,
            styles: [`.node-lister-flist{margin:0 0 0 1em;padding:0;list-style:none;white-space:nowrap}.node-lister-list-item{list-style:none;line-height:1.2em;font-size:1em;display:inline}.node-lister-list-item .node-lister-app-node.deselected+.node-lister ul{display:none}`]
        },]
    },
];
/** @nocollapse */
NodeListerComponent.ctorParameters = () => [];
NodeListerComponent.propDecorators = {
    templateRef: [{ type: ContentChild, args: [TemplateRef,] }],
    nodes: [{ type: Input }],
    showFiles: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NodeComponent {
    /**
     * @param {?} store
     * @param {?} nodeService
     * @param {?} nodeClickedService
     */
    constructor(store, nodeService, nodeClickedService) {
        this.store = store;
        this.nodeService = nodeService;
        this.nodeClickedService = nodeClickedService;
        this.isSingleClick = true;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    method1CallForClick(event) {
        event.preventDefault();
        this.isSingleClick = true;
        setTimeout(() => {
            if (this.isSingleClick) {
                this.showMenu();
            }
        }, 200);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    method2CallForDblClick(event) {
        event.preventDefault();
        this.isSingleClick = false;
        this.open();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @return {?}
     */
    open() {
        if (!this.node.isFolder) {
            this.nodeClickedService.startDownload(this.node);
            return;
        }
        if (this.node.stayOpen) {
            if (this.node.name == 'root') {
                this.nodeService.foldAll();
            }
            this.store.dispatch({ type: SET_PATH, payload: this.node.pathToNode });
            return;
        }
        this.toggleNodeExpanded();
        if (this.node.isExpanded) {
            this.store.dispatch({ type: SET_PATH, payload: this.node.pathToNode });
        }
        this.setNodeSelectedState();
    }
    /**
     * @return {?}
     */
    showMenu() {
        this.store.dispatch({ type: SET_SELECTED_NODE, payload: this.node });
    }
    /**
     * @return {?}
     */
    toggleNodeExpanded() {
        this.node.isExpanded = !this.node.isExpanded;
    }
    /**
     * @return {?}
     */
    setNodeSelectedState() {
        if (!this.node.isExpanded) {
            document.getElementById('tree_' + this.node.pathToNode).classList.add('deselected');
            this.nodeService.foldRecursively(this.node);
            this.store.dispatch({ type: SET_PATH, payload: this.node.pathToParent });
        }
        else {
            document.getElementById('tree_' + this.node.pathToNode).classList.remove('deselected');
        }
    }
}
NodeComponent.decorators = [
    {
        type: Component, args: [{
            selector: 'app-node',
            template: `<div #customTemplate (dblclick)="method2CallForDblClick($event)" (click)="method1CallForClick($event)">
  <ng-content></ng-content>
</div>
`,
            styles: [``]
        },]
    },
];
/** @nocollapse */
NodeComponent.ctorParameters = () => [
    { type: Store },
    { type: NodeService },
    { type: NodeClickedService }
];
NodeComponent.propDecorators = {
    node: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class MapToIterablePipe {
    /**
     * @param {?} dict
     * @return {?}
     */
    transform(dict) {
        /** @type {?} */
        const a = [];
        for (const key in dict) {
            if (dict.hasOwnProperty(key)) {
                a.push({ key: key, val: dict[key] });
            }
        }
        return a;
    }
}
MapToIterablePipe.decorators = [
    {
        type: Pipe, args: [{
            name: 'mapToIterablePipe'
        },]
    },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NavBarComponent {
    /**
     * @param {?} store
     * @param {?} nodeService
     */
    constructor(store, nodeService) {
        this.store = store;
        this.nodeService = nodeService;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.store
            .pipe(select(state => state.fileManagerState.path))
            .subscribe((data) => {
                this.nodeService.currentPath = data;
                this.currentPath = data.split('/');
            });
    }
    /**
     * @param {?} path
     * @param {?} index
     * @return {?}
     */
    onClick(path, index) {
        /** @type {?} */
        const newPath = path.slice(0, index + 1).join('/');
        this.store.dispatch({ type: SET_PATH, payload: newPath });
    }
}
NavBarComponent.decorators = [
    {
        type: Component, args: [{
            selector: 'app-nav-bar',
            template: `<div>
  >> <span *ngFor="let to of currentPath; let i = index">
  <a class="link" href="#" (click)="onClick(currentPath, i)">
    <div *ngIf="to === '' || to === 'root'; then icon else name"></div>
    <ng-template #icon><i class="fas fa-home"></i></ng-template>
    <ng-template #name>{{to}}</ng-template>
  </a> /
  </span>
</div>
`,
            styles: [``]
        },]
    },
];
/** @nocollapse */
NavBarComponent.ctorParameters = () => [
    { type: Store },
    { type: NodeService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const initialState = {
    path: '',
    isLoading: true,
    selectedNode: null
};
/**
 * @param {?=} state
 * @param {?=} action
 * @return {?}
 */
function stateReducer(state = initialState, action) {
    // console.log('Previous state: ', state);
    // console.log('ACTION type: ', action.type);
    // console.log('ACTION payload: ', action.payload);
    switch (action.type) {
        case SET_PATH:
            if (state.path === action.payload) {
                return state;
            }
            return Object.assign({}, state, { path: action.payload, isLoading: true });
        case SET_LOADING_STATE:
            return Object.assign({}, state, { isLoading: action.payload });
        case SET_SELECTED_NODE:
            return Object.assign({}, state, { selectedNode: action.payload });
        default:
            return initialState;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const reducers = {
    fileManagerState: stateReducer
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class LoadingOverlayComponent {
    /**
     * @return {?}
     */
    ngOnInit() {
        timer(2000).subscribe(() => {
            this.timeoutMessage = _('Troubles with loading? Click anywhere to cancel loading');
        });
    }
}
LoadingOverlayComponent.decorators = [
    {
        type: Component, args: [{
            selector: 'app-loading-overlay',
            template: `<ng-container
  [ngTemplateOutletContext]="{$implicit: timeoutMessage}"
  [ngTemplateOutlet]="loadingOverlayTemplate">
</ng-container>
`,
            styles: [``]
        },]
    },
];
LoadingOverlayComponent.propDecorators = {
    loadingOverlayTemplate: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class FileSizePipe {
    constructor() {
        this.units = [
            'bytes',
            'KB',
            'MB',
            'GB',
            'TB',
            'PB'
        ];
    }
    /**
     * @param {?=} bytes
     * @param {?=} precision
     * @return {?}
     */
    transform(bytes = 0, precision = 2) {
        if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes))
            return '?';
        /** @type {?} */
        let unit = 0;
        while (bytes >= 1024) {
            bytes /= 1024;
            unit++;
        }
        return bytes.toFixed(+precision) + ' ' + this.units[unit];
    }
}
FileSizePipe.decorators = [
    { type: Pipe, args: [{ name: 'fileSize' },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class UploadComponent {
    /**
     * @param {?} http
     * @param {?} nodeService
     */
    constructor(http, nodeService) {
        this.http = http;
        this.nodeService = nodeService;
        this.closeDialog = new EventEmitter();
        this.createDir = new EventEmitter();
        this.newFolder = false;
        this.counter = 0;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.uploader = new FineUploader({
            debug: false,
            autoUpload: false,
            maxConnections: 1,
            // todo configurable
            element: document.getElementById('fine-uploader'),
            template: document.getElementById('fine-uploader-template'),
            request: {
                endpoint: this.nodeService.tree.config.baseURL + this.nodeService.tree.config.api.uploadFile,
                // forceMultipart: false,
                paramsInBody: false,
                params: {
                    parentPath: this.getCurrentPath
                }
            },
            retry: {
                enableAuto: false
            },
            callbacks: {
                onSubmitted: () => this.counter++,
                onCancel: () => {
                    this.counter < 0 ? console.warn('wtf?') : this.counter--;
                },
                onAllComplete: (succ, fail) => {
                    if (succ.length > 0) {
                        this.counter = 0;
                        this.nodeService.refreshCurrentPath();
                    }
                }
            }
        });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @return {?}
     */
    get getCurrentPath() {
        /** @type {?} */
        const parentPath = this.nodeService.findNodeByPath(this.nodeService.currentPath).id;
        return parentPath === 0 ? '' : parentPath;
    }
    /**
     * @return {?}
     */
    uploadFiles() {
        this.uploader.uploadStoredFiles();
    }
    /**
     * @param {?=} input
     * @return {?}
     */
    createNewFolder(input) {
        if (!this.newFolder) {
            this.newFolder = true;
        }
        else {
            this.newFolder = false;
            if (input.length > 0) {
                this.createDir.emit(input);
                this.newClickedAction();
            }
        }
    }
    /**
     * @return {?}
     */
    newClickedAction() {
        this.uploader.cancelAll();
        this.closeDialog.emit();
    }
}
UploadComponent.decorators = [
    {
        type: Component, args: [{
            selector: 'app-upload',
            template: `<div class="backdrop" (click)="newClickedAction()"></div>
<div class="upload-background">
  <div class="buttons">
    <button class="button" [disabled]="newFolder" (click)="createNewFolder()" translate>Create new folder</button>
  </div>

  <div *ngIf="newFolder">
    <div class="buttons">
      <app-new-folder (buttonClicked)="createNewFolder($event)"></app-new-folder>
    </div>
  </div>

  <div id="fine-uploader">
  </div>


  <div class="buttons">
    <button class="button big" [disabled]="this.counter < 1" (click)="uploadFiles()" translate>
      Upload
    </button>
    <button class="button big" (click)="newClickedAction()" translate>
      Close
    </button>
  </div>

</div>

<div id="fine-uploader-template" style="display: none;">
  <div class="qq-uploader-selector qq-uploader" qq-drop-area-text="Drop files here">
    <div class="qq-upload-drop-area-selector qq-upload-drop-area" qq-hide-dropzone>
      <span class="qq-upload-drop-area-text-selector"></span>
    </div>

    <div class="upload-top-bar">
      <div class="qq-upload-button-selector qq-upload-button">
        <div translate>Upload a file</div>
      </div>

      <div class="qq-total-progress-bar-container-selector qq-total-progress-bar-container">
        <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
             class="qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar"></div>
      </div>
    </div>

    <span class="qq-drop-processing-selector qq-drop-processing">
            <span translate>Processing dropped files</span>...
            <span class="qq-drop-processing-spinner-selector qq-drop-processing-spinner"></span>
    </span>

    <ul class="qq-upload-list-selector qq-upload-list" aria-live="polite" aria-relevant="additions removals">
      <li>
        <div class="qq-progress-bar-container-selector">
          <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
               class="qq-progress-bar-selector qq-progress-bar"></div>
        </div>
        <span class="qq-upload-spinner-selector qq-upload-spinner"></span>
        <img class="qq-thumbnail-selector" qq-max-size="100" qq-server-scale>
        <span class="qq-upload-file-selector qq-upload-file"></span>
        <span class="qq-edit-filename-icon-selector qq-edit-filename-icon" aria-label="Edit filename"></span>
        <input class="qq-edit-filename-selector qq-edit-filename" tabindex="0" type="text">
        <span class="qq-upload-size-selector qq-upload-size"></span>
        <button type="button" class="qq-btn qq-upload-cancel-selector qq-upload-cancel" translate>Cancel</button>
        <button type="button" class="qq-btn qq-upload-retry-selector qq-upload-retry" translate>Retry</button>
        <button type="button" class="qq-btn qq-upload-delete-selector qq-upload-delete" translate>Delete</button>
        <span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span>
      </li>
    </ul>

    <dialog class="qq-alert-dialog-selector">
      <div class="qq-dialog-message-selector"></div>
      <div class="qq-dialog-buttons">
        <button type="button" class="qq-cancel-button-selector" translate>Close</button>
      </div>
    </dialog>

    <dialog class="qq-confirm-dialog-selector">
      <div class="qq-dialog-message-selector"></div>
      <div class="qq-dialog-buttons">
        <button type="button" class="qq-cancel-button-selector" translate>No</button>
        <button type="button" class="qq-ok-button-selector" translate>Yes</button>
      </div>
    </dialog>

    <dialog class="qq-prompt-dialog-selector">
      <div class="qq-dialog-message-selector"></div>
      <input type="text">
      <div class="qq-dialog-buttons">
        <button type="button" class="qq-cancel-button-selector" translate>Cancel</button>
        <button type="button" class="qq-ok-button-selector" translate>Ok</button>
      </div>
    </dialog>
  </div>
</div>
`,
            styles: [`.upload-content{text-align:center;max-height:25vh;overflow:auto;margin:10px auto}.fa-times:before{content:"\\f00d"}.buttons{background:#fff;padding:5px;margin:10px 0}`, `.qq-upload-button div{line-height:25px}.qq-upload-button-focus{outline:0}.qq-uploader{position:relative;min-height:200px;max-height:490px;overflow-y:hidden;width:inherit;border-radius:6px;background-color:#fdfdfd;border:1px dashed #ccc;padding:20px}.qq-uploader:before{content:attr(qq-drop-area-text) " ";position:absolute;font-size:200%;left:0;width:100%;text-align:center;top:45%;opacity:.25}.qq-upload-drop-area,.qq-upload-extra-drop-area{position:absolute;top:0;left:0;width:100%;height:100%;min-height:30px;z-index:2;background:#f9f9f9;border-radius:4px;border:1px dashed #ccc;text-align:center}.qq-upload-drop-area span{display:block;position:absolute;top:50%;width:100%;margin-top:-8px;font-size:16px}.qq-upload-extra-drop-area{position:relative;margin-top:50px;font-size:16px;padding-top:30px;height:20px;min-height:40px}.qq-upload-drop-area-active{background:#fdfdfd;border-radius:4px;border:1px dashed #ccc}.qq-upload-list{margin:0;padding:0;list-style:none;max-height:450px;overflow-y:auto;clear:both}.qq-upload-list li{margin:0;padding:9px;line-height:15px;font-size:16px;color:#424242;background-color:#f6f6f6;border-top:1px solid #fff;border-bottom:1px solid #ddd}.qq-upload-list li:first-child{border-top:none}.qq-upload-list li:last-child{border-bottom:none}.qq-upload-cancel,.qq-upload-continue,.qq-upload-delete,.qq-upload-failed-text,.qq-upload-file,.qq-upload-pause,.qq-upload-retry,.qq-upload-size,.qq-upload-spinner{margin-right:12px;display:inline}.qq-upload-file{vertical-align:middle;display:inline-block;width:300px;text-overflow:ellipsis;white-space:nowrap;overflow-x:hidden;height:18px}.qq-upload-spinner{display:inline-block;background:url(loading.gif);width:15px;height:15px;vertical-align:text-bottom}.qq-drop-processing{display:block}.qq-drop-processing-spinner{display:inline-block;background:url(processing.gif);width:24px;height:24px;vertical-align:text-bottom}.qq-upload-cancel,.qq-upload-continue,.qq-upload-delete,.qq-upload-pause,.qq-upload-retry,.qq-upload-size{font-size:12px;font-weight:400;cursor:pointer;vertical-align:middle}.qq-upload-status-text{font-size:14px;font-weight:700;display:block}.qq-upload-failed-text{display:none;font-style:italic;font-weight:700}.qq-upload-failed-icon{display:none;width:15px;height:15px;vertical-align:text-bottom}.qq-upload-fail .qq-upload-failed-text,.qq-upload-retrying .qq-upload-failed-text{display:inline}.qq-upload-list li.qq-upload-success{background-color:#ebf6e0;color:#424242;border-bottom:1px solid #d3ded1;border-top:1px solid #f7fff5}.qq-upload-list li.qq-upload-fail{background-color:#f5d7d7;color:#424242;border-bottom:1px solid #decaca;border-top:1px solid #fce6e6}.qq-total-progress-bar{height:25px;border-radius:9px}INPUT.qq-edit-filename{position:absolute;opacity:0;z-index:-1}.qq-upload-file.qq-editable{cursor:pointer;margin-right:4px}.qq-edit-filename-icon.qq-editable{display:inline-block;cursor:pointer}INPUT.qq-edit-filename.qq-editing{position:static;height:28px;padding:0 8px;margin-right:10px;margin-bottom:-5px;border:1px solid #ccc;border-radius:2px;font-size:16px;opacity:1}.qq-edit-filename-icon{display:none;background:url(edit.gif);width:15px;height:15px;vertical-align:text-bottom;margin-right:16px}.qq-hide{display:none}.qq-thumbnail-selector{vertical-align:middle;margin-right:12px}.qq-uploader DIALOG{display:none}.qq-uploader DIALOG[open]{display:block}.qq-uploader DIALOG .qq-dialog-buttons{text-align:center;padding-top:10px}.qq-uploader DIALOG .qq-dialog-buttons BUTTON{margin-left:5px;margin-right:5px}.qq-uploader DIALOG .qq-dialog-message-selector{padding-bottom:10px}.qq-uploader DIALOG::-webkit-backdrop{background-color:rgba(0,0,0,.7)}.qq-uploader DIALOG::backdrop{background-color:rgba(0,0,0,.7)}`],
            encapsulation: ViewEncapsulation.None
        },]
    },
];
/** @nocollapse */
UploadComponent.ctorParameters = () => [
    { type: HttpClient },
    { type: NodeService }
];
UploadComponent.propDecorators = {
    openDialog: [{ type: Input }],
    closeDialog: [{ type: Output }],
    createDir: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NewFolderComponent {
    constructor() {
        this.buttonClicked = new EventEmitter();
        this.buttonText = _('Close').toString();
        this.inputValue = '';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @return {?}
     */
    onClick() {
        /** @type {?} */
        const el = (/** @type {?} */ (this.uploadFolder.nativeElement));
        // @ts-ignore
        this.buttonClicked.emit(el.value);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onInputChange(event) {
        this.inputValue = event.target.value;
        if (this.inputValue.length > 0) {
            this.buttonText = _('Confirm').toString();
        }
        else {
            this.buttonText = _('Close').toString();
        }
    }
}
NewFolderComponent.decorators = [
    {
        type: Component, args: [{
            selector: 'app-new-folder',
            template: `<p class="new-folder-description" translate>Type new folder name</p>
<input #uploadFolder placeholder="{{'Folder name' | translate}}" (keyup)="onInputChange($event)"
       (keyup.enter)="onClick()" onclick="this.select();" type="text" class="new-folder-input"/>
<button class="button new-folder-send" (click)="onClick()">{{buttonText | translate}}</button>
`,
            styles: [`.new-folder-description{margin:0 auto;padding:0}`]
        },]
    },
];
/** @nocollapse */
NewFolderComponent.ctorParameters = () => [];
NewFolderComponent.propDecorators = {
    uploadFolder: [{ type: ViewChild, args: ['uploadFolder',] }],
    buttonClicked: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class SideViewComponent {
    constructor() {
        this.allowFolderDownload = false;
        this.clickEvent = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @param {?} event
     * @param {?} type
     * @return {?}
     */
    onClick(event, type) {
        this.clickEvent.emit({ type: type, event: event, node: this.node });
    }
}
SideViewComponent.decorators = [
    {
        type: Component, args: [{
            selector: 'app-side-view',
            template: `<div class="side-view" *ngIf="node">
  <div class="side-view-preview">
    <i (click)="onClick($event, 'closeSideView')" class="fas fa-times side-view-close"></i>

    <div class="side-view-preview-title">{{node.name}}</div>

    <div class="side-view-preview-content">
      <ng-container
        [ngTemplateOutletContext]="{$implicit: node}"
        [ngTemplateOutlet]="sideViewTemplate">
      </ng-container>
    </div>

    <div class="side-view-buttons">
      <button (click)="onClick($event, 'download')" class="button"
              [disabled]="!allowFolderDownload && node.isFolder" translate>
        Download
      </button>
      <button (click)="onClick($event, 'renameConfirm')" class="button" translate>Rename</button>
      <button (click)="onClick($event, 'removeAsk')" class="button" translate>Delete</button>
    </div>
  </div>
</div>
`,
            styles: [`.side-view-close{position:absolute;cursor:pointer;top:0;right:0;padding:15px}.side-view-buttons{width:100%;display:flex;justify-content:center;flex-flow:column}.side-view-buttons .button{margin:5px 0}`],
            encapsulation: ViewEncapsulation.None
        },]
    },
];
/** @nocollapse */
SideViewComponent.ctorParameters = () => [];
SideViewComponent.propDecorators = {
    sideViewTemplate: [{ type: Input }],
    node: [{ type: Input }],
    allowFolderDownload: [{ type: Input }],
    clickEvent: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NavigationComponent {
    /**
     * @param {?} nodeClickedService
     */
    constructor(nodeClickedService) {
        this.nodeClickedService = nodeClickedService;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @param {?} input
     * @return {?}
     */
    onClick(input) {
        this.nodeClickedService.searchForString(input);
    }
}
NavigationComponent.decorators = [
    {
        type: Component, args: [{
            selector: 'app-navigation',
            template: `<div class="navigation-component">
  <input #input class="navigation-search" onclick="this.select();" (keyup.enter)="onClick(input.value)"
         placeholder="{{'Search' | translate}}">

  <button [disabled]="input.value.length === 0" class="navigation-search-icon" (click)="onClick(input.value)">
    <i class="fas fa-search"></i>
  </button>

  <div>
    <ng-content></ng-content>
  </div>
</div>


`,
            styles: [`.navigation-component{display:flex}`],
            encapsulation: ViewEncapsulation.None
        },]
    },
];
/** @nocollapse */
NavigationComponent.ctorParameters = () => [
    { type: NodeClickedService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?} http
 * @return {?}
 */
function createTranslateLoader(http) {
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}
const ɵ0 = (createTranslateLoader);
class FileManagerModule {
}
FileManagerModule.decorators = [
    {
        type: NgModule, args: [{
            imports: [
                HttpClientModule,
                StoreModule.forRoot(reducers),
                CommonModule,
                NgxSmartModalModule.forRoot(),
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: ɵ0,
                        deps: [HttpClient]
                    }
                })
            ],
            declarations: [
                FileManagerComponent,
                FolderContentComponent,
                NodeComponent,
                TreeComponent,
                NodeListerComponent,
                MapToIterablePipe,
                NavBarComponent,
                LoadingOverlayComponent,
                FileSizePipe,
                UploadComponent,
                NewFolderComponent,
                SideViewComponent,
                NavigationComponent
            ],
            exports: [
                FileManagerComponent,
                LoadingOverlayComponent,
                SideViewComponent
            ]
        },]
    },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { FileManagerComponent, createTranslateLoader, FileManagerModule, TreeModel, NodeService, FolderContentComponent as ɵe, LoadingOverlayComponent as ɵk, NodeComponent as ɵf, NewFolderComponent as ɵn, UploadComponent as ɵm, NavBarComponent as ɵj, NavigationComponent as ɵp, SideViewComponent as ɵo, NodeListerComponent as ɵh, TreeComponent as ɵg, FileSizePipe as ɵl, MapToIterablePipe as ɵi, reducers as ɵb, stateReducer as ɵd, NodeClickedService as ɵc };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmc2LWZpbGUtbWFuLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL21vZGVscy90cmVlLm1vZGVsLnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uLnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3NlcnZpY2VzL25vZGUuc2VydmljZS50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9zZXJ2aWNlcy9ub2RlLWNsaWNrZWQuc2VydmljZS50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9maWxlLW1hbmFnZXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvZm9sZGVyLWNvbnRlbnQvZm9sZGVyLWNvbnRlbnQuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvdHJlZS90cmVlLmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL3RyZWUvbm9kZS1saXN0ZXIvbm9kZS1saXN0ZXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvZnVuY3Rpb25zL25vZGUvbm9kZS5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvcGlwZXMvbWFwLXRvLWl0ZXJhYmxlLnBpcGUudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9uYXYtYmFyL25hdi1iYXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3JlZHVjZXJzL3N0YXRlUmVkdWNlci50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnkudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvbG9hZGluZy1vdmVybGF5L2xvYWRpbmctb3ZlcmxheS5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvcGlwZXMvZmlsZS1zaXplLnBpcGUudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL3VwbG9hZC5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL25ldy1mb2xkZXIvbmV3LWZvbGRlci5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9zaWRlLXZpZXcvc2lkZS12aWV3LmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvZmlsZS1tYW5hZ2VyLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge0NvbmZpZ0ludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9jb25maWcuaW50ZXJmYWNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmVlTW9kZWwge1xyXG4gIHByaXZhdGUgX2N1cnJlbnRQYXRoOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBfbm9kZXM6IE5vZGVJbnRlcmZhY2U7XHJcbiAgcHJpdmF0ZSBfc2VsZWN0ZWROb2RlSWQ6IHN0cmluZztcclxuICBwdWJsaWMgY29uZmlnOiBDb25maWdJbnRlcmZhY2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29uZmlnSW50ZXJmYWNlKSB7XHJcbiAgICAvLyB0aGlzLl9jdXJyZW50UGF0aCA9IGNvbmZpZy5zdGFydGluZ0ZvbGRlcjsgLy8gdG9kbyBpbXBsZW1lbnQgKGNvbmZpZy5pbnRlcmZjZS50cylcclxuICAgIHRoaXMuX2N1cnJlbnRQYXRoID0gJyc7XHJcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuXHJcbiAgICB0aGlzLm5vZGVzID0gPE5vZGVJbnRlcmZhY2U+e1xyXG4gICAgICBpZDogMCxcclxuICAgICAgcGF0aFRvTm9kZTogJycsXHJcbiAgICAgIHBhdGhUb1BhcmVudDogbnVsbCxcclxuICAgICAgaXNGb2xkZXI6IHRydWUsXHJcbiAgICAgIGlzRXhwYW5kZWQ6IHRydWUsXHJcbiAgICAgIHN0YXlPcGVuOiB0cnVlLFxyXG4gICAgICBuYW1lOiAncm9vdCcsXHJcbiAgICAgIGNoaWxkcmVuOiB7fVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGdldCBjdXJyZW50UGF0aCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRQYXRoO1xyXG4gIH1cclxuXHJcbiAgc2V0IGN1cnJlbnRQYXRoKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuX2N1cnJlbnRQYXRoID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgbm9kZXMoKTogTm9kZUludGVyZmFjZSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbm9kZXM7XHJcbiAgfVxyXG5cclxuICBzZXQgbm9kZXModmFsdWU6IE5vZGVJbnRlcmZhY2UpIHtcclxuICAgIHRoaXMuX25vZGVzID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgc2VsZWN0ZWROb2RlSWQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZE5vZGVJZDtcclxuICB9XHJcblxyXG4gIHNldCBzZWxlY3RlZE5vZGVJZCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLl9zZWxlY3RlZE5vZGVJZCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLy8gdG9kbyBpbXBsZW1lbnQgKGNvbmZpZy5pbnRlcmZjZS50cylcclxuICAvLyBnZXQgaXNDYWNoZSgpOiBib29sZWFuIHtcclxuICAvLyAgIHJldHVybiB0aGlzLmNvbmZpZy5vZmZsaW5lTW9kZTtcclxuICAvLyB9XHJcbiAgLy9cclxuICAvLyBzZXQgaXNDYWNoZSh2YWx1ZTogYm9vbGVhbikge1xyXG4gIC8vICAgdGhpcy5jb25maWcub2ZmbGluZU1vZGUgPSB2YWx1ZTtcclxuICAvLyB9XHJcbn1cclxuIiwiaW1wb3J0IHtBY3Rpb25JbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvYWN0aW9uLmludGVyZmFjZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcblxyXG5leHBvcnQgY29uc3QgU0VUX1BBVEggPSAnU0VUX1BBVEgnO1xyXG5leHBvcnQgY29uc3QgU0VUX0xPQURJTkdfU1RBVEUgPSAnU0VUX0xPQURJTkdfU1RBVEUnO1xyXG5leHBvcnQgY29uc3QgU0VUX1NFTEVDVEVEX05PREUgPSAnU0VUX1NFTEVDVEVEX05PREUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNldFBhdGggaW1wbGVtZW50cyBBY3Rpb25JbnRlcmZhY2Uge1xyXG4gIHJlYWRvbmx5IHR5cGUgPSBTRVRfUEFUSDtcclxuICBwYXlsb2FkOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTZXRMb2FkaW5nU3RhdGUgaW1wbGVtZW50cyBBY3Rpb25JbnRlcmZhY2Uge1xyXG4gIHJlYWRvbmx5IHR5cGUgPSBTRVRfTE9BRElOR19TVEFURTtcclxuICBwYXlsb2FkOiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2V0U2VsZWN0ZWROb2RlIGltcGxlbWVudHMgQWN0aW9uSW50ZXJmYWNlIHtcclxuICByZWFkb25seSB0eXBlID0gU0VUX1NFTEVDVEVEX05PREU7XHJcbiAgcGF5bG9hZDogTm9kZUludGVyZmFjZTtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQWN0aW9ucyA9IFNldFBhdGggfCBTZXRMb2FkaW5nU3RhdGUgfCBTZXRTZWxlY3RlZE5vZGU7XHJcbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cFBhcmFtc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4uL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTm9kZVNlcnZpY2Uge1xyXG4gIHB1YmxpYyB0cmVlOiBUcmVlTW9kZWw7XHJcbiAgcHJpdmF0ZSBfcGF0aDogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPikge1xyXG4gIH1cclxuXHJcbiAgLy8gdG9kbyBhc2sgc2VydmVyIHRvIGdldCBwYXJlbnQgc3RydWN0dXJlXHJcbiAgcHVibGljIHN0YXJ0TWFuYWdlckF0KHBhdGg6IHN0cmluZykge1xyXG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfUEFUSCwgcGF5bG9hZDogcGF0aH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlZnJlc2hDdXJyZW50UGF0aCgpIHtcclxuICAgIHRoaXMuZmluZE5vZGVCeVBhdGgodGhpcy5jdXJyZW50UGF0aCkuY2hpbGRyZW4gPSB7fTtcclxuICAgIHRoaXMuZ2V0Tm9kZXModGhpcy5jdXJyZW50UGF0aCk7XHJcbiAgfVxyXG5cclxuICBnZXROb2RlcyhwYXRoOiBzdHJpbmcpIHtcclxuICAgIHRoaXMucGFyc2VOb2RlcyhwYXRoKS5zdWJzY3JpYmUoKGRhdGE6IEFycmF5PE5vZGVJbnRlcmZhY2U+KSA9PiB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHBhcmVudFBhdGggPSB0aGlzLmdldFBhcmVudFBhdGgoZGF0YVtpXS5wYXRoVG9Ob2RlKTtcclxuICAgICAgICB0aGlzLmZpbmROb2RlQnlQYXRoKHBhcmVudFBhdGgpLmNoaWxkcmVuW2RhdGFbaV0ubmFtZV0gPSBkYXRhW2ldO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0UGFyZW50UGF0aChwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgbGV0IHBhcmVudFBhdGggPSBwYXRoLnNwbGl0KCcvJyk7XHJcbiAgICBwYXJlbnRQYXRoID0gcGFyZW50UGF0aC5zbGljZSgwLCBwYXJlbnRQYXRoLmxlbmd0aCAtIDEpO1xyXG4gICAgcmV0dXJuIHBhcmVudFBhdGguam9pbignLycpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYXJzZU5vZGVzKHBhdGg6IHN0cmluZyk6IE9ic2VydmFibGU8Tm9kZUludGVyZmFjZVtdPiB7XHJcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xyXG4gICAgICB0aGlzLmdldE5vZGVzRnJvbVNlcnZlcihwYXRoKS5zdWJzY3JpYmUoKGRhdGE6IEFycmF5PGFueT4pID0+IHtcclxuICAgICAgICBvYnNlcnZlci5uZXh0KGRhdGEubWFwKG5vZGUgPT4gdGhpcy5jcmVhdGVOb2RlKHBhdGgsIG5vZGUpKSk7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfTE9BRElOR19TVEFURSwgcGF5bG9hZDogZmFsc2V9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlTm9kZShwYXRoLCBub2RlKTogTm9kZUludGVyZmFjZSB7XHJcbiAgICBpZiAobm9kZS5wYXRoWzBdICE9PSAnLycpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbTm9kZSBTZXJ2aWNlXSBTZXJ2ZXIgc2hvdWxkIHJldHVybiBpbml0aWFsIHBhdGggd2l0aCBcIi9cIicpO1xyXG4gICAgICBub2RlLnBhdGggPSAnLycgKyBub2RlLnBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaWRzID0gbm9kZS5wYXRoLnNwbGl0KCcvJyk7XHJcbiAgICBpZiAoaWRzLmxlbmd0aCA+IDIgJiYgaWRzW2lkcy5sZW5ndGggLSAxXSA9PT0gJycpIHtcclxuICAgICAgaWRzLnNwbGljZSgtMSwgMSk7XHJcbiAgICAgIG5vZGUucGF0aCA9IGlkcy5qb2luKCcvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2FjaGVkTm9kZSA9IHRoaXMuZmluZE5vZGVCeVBhdGgobm9kZS5wYXRoKTtcclxuXHJcbiAgICByZXR1cm4gPE5vZGVJbnRlcmZhY2U+e1xyXG4gICAgICBpZDogbm9kZS5pZCxcclxuICAgICAgaXNGb2xkZXI6IG5vZGUuZGlyLFxyXG4gICAgICBpc0V4cGFuZGVkOiBjYWNoZWROb2RlID8gY2FjaGVkTm9kZS5pc0V4cGFuZGVkIDogZmFsc2UsXHJcbiAgICAgIHBhdGhUb05vZGU6IG5vZGUucGF0aCxcclxuICAgICAgcGF0aFRvUGFyZW50OiB0aGlzLmdldFBhcmVudFBhdGgobm9kZS5wYXRoKSxcclxuICAgICAgbmFtZTogbm9kZS5uYW1lIHx8IG5vZGUuaWQsXHJcbiAgICAgIGNoaWxkcmVuOiBjYWNoZWROb2RlID8gY2FjaGVkTm9kZS5jaGlsZHJlbiA6IHt9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXROb2Rlc0Zyb21TZXJ2ZXIgPSAocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICBsZXQgZm9sZGVySWQ6IGFueSA9IHRoaXMuZmluZE5vZGVCeVBhdGgocGF0aCkuaWQ7XHJcbiAgICBmb2xkZXJJZCA9IGZvbGRlcklkID09PSAwID8gJycgOiBmb2xkZXJJZDtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChcclxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgdGhpcy50cmVlLmNvbmZpZy5hcGkubGlzdEZpbGUsXHJcbiAgICAgIHtwYXJhbXM6IG5ldyBIdHRwUGFyYW1zKCkuc2V0KCdwYXJlbnRQYXRoJywgZm9sZGVySWQpfVxyXG4gICAgKTtcclxuICB9O1xyXG5cclxuICBwdWJsaWMgZmluZE5vZGVCeVBhdGgobm9kZVBhdGg6IHN0cmluZyk6IE5vZGVJbnRlcmZhY2Uge1xyXG4gICAgY29uc3QgaWRzID0gbm9kZVBhdGguc3BsaXQoJy8nKTtcclxuICAgIGlkcy5zcGxpY2UoMCwgMSk7XHJcblxyXG4gICAgcmV0dXJuIGlkcy5sZW5ndGggPT09IDAgPyB0aGlzLnRyZWUubm9kZXMgOiBpZHMucmVkdWNlKCh2YWx1ZSwgaW5kZXgpID0+IHZhbHVlWydjaGlsZHJlbiddW2luZGV4XSwgdGhpcy50cmVlLm5vZGVzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmaW5kTm9kZUJ5SWQoaWQ6IG51bWJlcik6IE5vZGVJbnRlcmZhY2Uge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5maW5kTm9kZUJ5SWRIZWxwZXIoaWQpO1xyXG5cclxuICAgIGlmIChyZXN1bHQgPT09IG51bGwpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbTm9kZSBTZXJ2aWNlXSBDYW5ub3QgZmluZCBub2RlIGJ5IGlkLiBJZCBub3QgZXhpc3Rpbmcgb3Igbm90IGZldGNoZWQuIFJldHVybmluZyByb290LicpO1xyXG4gICAgICByZXR1cm4gdGhpcy50cmVlLm5vZGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZmluZE5vZGVCeUlkSGVscGVyKGlkOiBudW1iZXIsIG5vZGU6IE5vZGVJbnRlcmZhY2UgPSB0aGlzLnRyZWUubm9kZXMpOiBOb2RlSW50ZXJmYWNlIHtcclxuICAgIGlmIChub2RlLmlkID09PSBpZClcclxuICAgICAgcmV0dXJuIG5vZGU7XHJcblxyXG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG5vZGUuY2hpbGRyZW4pO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodHlwZW9mIG5vZGUuY2hpbGRyZW5ba2V5c1tpXV0gPT0gJ29iamVjdCcpIHtcclxuICAgICAgICBjb25zdCBvYmogPSB0aGlzLmZpbmROb2RlQnlJZEhlbHBlcihpZCwgbm9kZS5jaGlsZHJlbltrZXlzW2ldXSk7XHJcbiAgICAgICAgaWYgKG9iaiAhPSBudWxsKVxyXG4gICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGZvbGRSZWN1cnNpdmVseShub2RlOiBOb2RlSW50ZXJmYWNlKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnZm9sZGluZyAnLCBub2RlKTtcclxuICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcclxuXHJcbiAgICBPYmplY3Qua2V5cyhjaGlsZHJlbikubWFwKChjaGlsZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGlmICghY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoY2hpbGQpIHx8ICFjaGlsZHJlbltjaGlsZF0uaXNFeHBhbmRlZCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmZvbGRSZWN1cnNpdmVseShjaGlsZHJlbltjaGlsZF0pO1xyXG4gICAgICAvL3RvZG8gcHV0IHRoaXMgZ2V0RWxCeUlkIGludG8gb25lIGZ1bmMgKGN1cnIgaW5zaWRlIG5vZGUuY29tcG9uZW50LnRzICsgZm0uY29tcG9uZW50LnRzKSAtIHRoaXMgd29uJ3QgYmUgbWFpbnRhaW5hYmxlXHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmVlXycgKyBjaGlsZHJlbltjaGlsZF0ucGF0aFRvTm9kZSkuY2xhc3NMaXN0LmFkZCgnZGVzZWxlY3RlZCcpO1xyXG4gICAgICBjaGlsZHJlbltjaGlsZF0uaXNFeHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZm9sZEFsbCgpIHtcclxuICAgIHRoaXMuZm9sZFJlY3Vyc2l2ZWx5KHRoaXMudHJlZS5ub2Rlcyk7XHJcbiAgfVxyXG5cclxuICBnZXQgY3VycmVudFBhdGgoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9wYXRoO1xyXG4gIH1cclxuXHJcbiAgc2V0IGN1cnJlbnRQYXRoKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuX3BhdGggPSB2YWx1ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuL25vZGUuc2VydmljZSc7XG5pbXBvcnQge1RyZWVNb2RlbH0gZnJvbSAnLi4vbW9kZWxzL3RyZWUubW9kZWwnO1xuaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtOZ3hTbWFydE1vZGFsU2VydmljZX0gZnJvbSAnbmd4LXNtYXJ0LW1vZGFsJztcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XG5pbXBvcnQge1N0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5vZGVDbGlja2VkU2VydmljZSB7XG4gIHB1YmxpYyB0cmVlOiBUcmVlTW9kZWw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIG5neFNtYXJ0TW9kYWxTZXJ2aWNlOiBOZ3hTbWFydE1vZGFsU2VydmljZSxcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4sXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50XG4gICkge1xuICB9XG5cbiAgcHVibGljIHN0YXJ0RG93bmxvYWQobm9kZTogTm9kZUludGVyZmFjZSk6IHZvaWQge1xuICAgIGNvbnN0IHBhcmFtZXRlcnMgPSB0aGlzLnBhcnNlUGFyYW1zKHtwYXRoOiBub2RlLmlkfSk7XG4gICAgdGhpcy5yZWFjaFNlcnZlcignZG93bmxvYWQnLCB0aGlzLnRyZWUuY29uZmlnLmFwaS5kb3dubG9hZEZpbGUgKyBwYXJhbWV0ZXJzKTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0RGVsZXRlKG5vZGU6IE5vZGVJbnRlcmZhY2UpOiB2b2lkIHtcbiAgICB0aGlzLnNpZGVFZmZlY3RIZWxwZXIoXG4gICAgICAnRGVsZXRlJyxcbiAgICAgIHtwYXRoOiBub2RlLmlkfSxcbiAgICAgICdkZWxldGUnLFxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkuZGVsZXRlRmlsZSxcbiAgICAgICgpID0+IHRoaXMuc3VjY2Vzc1dpdGhNb2RhbENsb3NlKClcbiAgICApO1xuICB9XG5cbiAgcHVibGljIHNlYXJjaEZvclN0cmluZyhpbnB1dDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zaWRlRWZmZWN0SGVscGVyKFxuICAgICAgJ1NlYXJjaCcsXG4gICAgICB7cXVlcnk6IGlucHV0fSxcbiAgICAgICdnZXQnLFxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkuc2VhcmNoRmlsZXMsXG4gICAgICAocmVzKSA9PiB0aGlzLnNlYXJjaFN1Y2Nlc3MoaW5wdXQsIHJlcylcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZUZvbGRlcihjdXJyZW50UGFyZW50OiBudW1iZXIsIG5ld0Rpck5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuc2lkZUVmZmVjdEhlbHBlcihcbiAgICAgICdDcmVhdGUgRm9sZGVyJyxcbiAgICAgIHtkaXJOYW1lOiBuZXdEaXJOYW1lLCBwYXJlbnRQYXRoOiBjdXJyZW50UGFyZW50ID09PSAwID8gbnVsbCA6IGN1cnJlbnRQYXJlbnR9LFxuICAgICAgJ3Bvc3QnLFxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkuY3JlYXRlRm9sZGVyXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyByZW5hbWUoaWQ6IG51bWJlciwgbmV3TmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zaWRlRWZmZWN0SGVscGVyKFxuICAgICAgJ1JlbmFtZScsXG4gICAgICB7cGF0aDogaWQsIG5ld05hbWU6IG5ld05hbWV9LFxuICAgICAgJ3Bvc3QnLFxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkucmVuYW1lRmlsZSxcbiAgICAgICgpID0+IHRoaXMuc3VjY2Vzc1dpdGhNb2RhbENsb3NlKClcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBzaWRlRWZmZWN0SGVscGVyKG5hbWU6IHN0cmluZywgcGFyYW1ldGVyczoge30sIGh0dHBNZXRob2Q6IHN0cmluZywgYXBpVVJMOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWV0aG9kID0gKGEpID0+IHRoaXMuYWN0aW9uU3VjY2VzcyhhKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWxNZXRob2QgPSAoYSwgYikgPT4gdGhpcy5hY3Rpb25GYWlsZWQoYSwgYilcbiAgKSB7XG4gICAgY29uc3QgcGFyYW1zID0gdGhpcy5wYXJzZVBhcmFtcyhwYXJhbWV0ZXJzKTtcblxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3dhaXRNb2RhbCcpLm9wZW4oKTtcblxuICAgIHRoaXMucmVhY2hTZXJ2ZXIoaHR0cE1ldGhvZCwgYXBpVVJMICsgcGFyYW1zKVxuICAgICAgLnN1YnNjcmliZShcbiAgICAgICAgKGEpID0+IHN1Y2Nlc3NNZXRob2QoYSksXG4gICAgICAgIChlcnIpID0+IGZhaWxNZXRob2QobmFtZSwgZXJyKVxuICAgICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVhY2hTZXJ2ZXIobWV0aG9kOiBzdHJpbmcsIGFwaVVybDogc3RyaW5nLCBkYXRhOiBhbnkgPSB7fSk6IE9ic2VydmFibGU8T2JqZWN0PiB7XG4gICAgc3dpdGNoIChtZXRob2QudG9Mb3dlckNhc2UoKSkge1xuICAgICAgY2FzZSAnZ2V0JzpcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgYXBpVXJsKTtcbiAgICAgIGNhc2UgJ3Bvc3QnOlxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgYXBpVXJsLCBkYXRhKTtcbiAgICAgIGNhc2UgJ2RlbGV0ZSc6XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIGFwaVVybCk7XG4gICAgICBjYXNlICdkb3dubG9hZCc6XG4gICAgICAgIHdpbmRvdy5vcGVuKHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIGFwaVVybCwgJ19ibGFuaycpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnNvbGUud2FybignW05vZGVDbGlja2VkU2VydmljZV0gSW5jb3JyZWN0IHBhcmFtcyBmb3IgdGhpcyBzaWRlLWVmZmVjdCcpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlUGFyYW1zKHBhcmFtczoge30pOiBzdHJpbmcge1xuICAgIGxldCBxdWVyeSA9ICc/JztcblxuICAgIE9iamVjdC5rZXlzKHBhcmFtcykuZmlsdGVyKGl0ZW0gPT4gcGFyYW1zW2l0ZW1dICE9PSBudWxsKS5tYXAoa2V5ID0+IHtcbiAgICAgIHF1ZXJ5ICs9IGtleSArICc9JyArIHBhcmFtc1trZXldICsgJyYnO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHF1ZXJ5LnNsaWNlKDAsIC0xKTtcbiAgfVxuXG4gIHByaXZhdGUgc3VjY2Vzc1dpdGhNb2RhbENsb3NlKCkge1xuICAgIHRoaXMuYWN0aW9uU3VjY2VzcygpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWRlLXZpZXcnKS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZWFyY2hTdWNjZXNzKGlucHV0OiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIGNvbnN0IG9iaiA9IHtcbiAgICAgIHNlYXJjaFN0cmluZzogaW5wdXQsXG4gICAgICByZXNwb25zZTogZGF0YVxuICAgIH07XG5cbiAgICB0aGlzLmFjdGlvblN1Y2Nlc3MoKTtcblxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2Uuc2V0TW9kYWxEYXRhKG9iaiwgJ3NlYXJjaE1vZGFsJywgdHJ1ZSk7XG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnc2VhcmNoTW9kYWwnKS5vcGVuKCk7XG4gIH1cblxuICBwcml2YXRlIGFjdGlvblN1Y2Nlc3MocmVzcG9uc2U6IHN0cmluZyA9ICcnKSB7XG4gICAgdGhpcy5ub2RlU2VydmljZS5yZWZyZXNoQ3VycmVudFBhdGgoKTtcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCd3YWl0TW9kYWwnKS5jbG9zZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhY3Rpb25GYWlsZWQobmFtZTogc3RyaW5nLCBlcnJvcjogYW55KSB7XG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnd2FpdE1vZGFsJykuY2xvc2UoKTtcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdlcnJvck1vZGFsJykub3BlbigpO1xuICAgIGNvbnNvbGUud2FybignW05vZGVDbGlja2VkU2VydmljZV0gQWN0aW9uIFwiJyArIG5hbWUgKyAnXCIgZmFpbGVkJywgZXJyb3IpO1xuICB9XG59XG4iLCJpbXBvcnQge0NvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFRlbXBsYXRlUmVmLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7c2VsZWN0LCBTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge1RyZWVNb2RlbH0gZnJvbSAnLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge1NFVF9MT0FESU5HX1NUQVRFfSBmcm9tICcuL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQge05neFNtYXJ0TW9kYWxTZXJ2aWNlfSBmcm9tICduZ3gtc21hcnQtbW9kYWwnO1xyXG5pbXBvcnQge05vZGVDbGlja2VkU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlcy9ub2RlLWNsaWNrZWQuc2VydmljZSc7XHJcbmltcG9ydCB7VHJhbnNsYXRlU2VydmljZX0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2ZtLWZpbGUtbWFuYWdlcicsXHJcbiAgdGVtcGxhdGU6IGA8bmctY29udGFpbmVyICpuZ0lmPVwiaXNQb3B1cDsgdGhlbiBpdElzUG9wdXAgZWxzZSBzaG93Q29udGVudFwiPjwvbmctY29udGFpbmVyPlxyXG5cclxuPG5nLXRlbXBsYXRlICNpdElzUG9wdXA+XHJcbiAgPGRpdiAqbmdJZj1cIiFmbU9wZW5cIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgKGNsaWNrKT1cImZtU2hvd0hpZGUoKVwiIHRyYW5zbGF0ZT1cIlwiPk9wZW4gZmlsZSBtYW5hZ2VyPC9idXR0b24+XHJcbiAgPC9kaXY+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1iYWNrZHJvcFwiICpuZ0lmPVwiZm1PcGVuXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZm1Nb2RhbEluc2lkZVwiPlxyXG4gICAgICA8ZGl2ICpuZ0lmPVwiZm1PcGVuOyB0aGVuIHNob3dDb250ZW50XCI+PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuXHJcbjxuZy10ZW1wbGF0ZSAjc2hvd0NvbnRlbnQ+XHJcbiAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItbmF2YmFyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJwYXRoXCI+XHJcbiAgICAgICAgPGFwcC1uYXYtYmFyPjwvYXBwLW5hdi1iYXI+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzcz1cIm5hdmlnYXRpb25cIj5cclxuICAgICAgICA8YXBwLW5hdmlnYXRpb24+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uIGNsb3NlXCIgKGNsaWNrKT1cImZtU2hvd0hpZGUoKVwiICpuZ0lmPVwiaXNQb3B1cFwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS0yeCBmYS10aW1lc1wiPjwvaT5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvYXBwLW5hdmlnYXRpb24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cImhvbGRlclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWxlZnRcIj5cclxuICAgICAgICA8YXBwLXRyZWUgW3RyZWVNb2RlbF09XCJ0cmVlXCI+XHJcbiAgICAgICAgICA8bmctdGVtcGxhdGUgbGV0LW5vZGVzPlxyXG4gICAgICAgICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2Rlc31cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImljb25UZW1wbGF0ZSA/IGljb25UZW1wbGF0ZSA6IGRlZmF1bHRJY29uVGVtcGxhdGVcIj5cclxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgIDwvYXBwLXRyZWU+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzcz1cInJpZ2h0XCI+XHJcbiAgICAgICAgPGFwcC1mb2xkZXItY29udGVudFxyXG4gICAgICAgICAgW3RyZWVNb2RlbF09XCJ0cmVlXCJcclxuICAgICAgICAgIChvcGVuVXBsb2FkRGlhbG9nKT1cImhhbmRsZVVwbG9hZERpYWxvZygkZXZlbnQpXCJcclxuICAgICAgICAgIFtmb2xkZXJDb250ZW50VGVtcGxhdGVdPVwiZm9sZGVyQ29udGVudFRlbXBsYXRlID8gZm9sZGVyQ29udGVudFRlbXBsYXRlIDogZGVmYXVsdEZvbGRlckNvbnRlbnRUZW1wbGF0ZVwiXHJcbiAgICAgICAgICBbZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlXT1cImZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZSA/IGZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZSA6IGRlZmF1bHRGb2xkZXJDb250ZW50TmV3VGVtcGxhdGVcIlxyXG4gICAgICAgICAgW2ZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGVdPVwiZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZSA/IGZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGUgOiBkZWZhdWx0Rm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZVwiPlxyXG4gICAgICAgIDwvYXBwLWZvbGRlci1jb250ZW50PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxhcHAtc2lkZS12aWV3IGlkPVwic2lkZS12aWV3XCJcclxuICAgICAgICAgICAgICAgICAgICAgW25vZGVdPVwic2VsZWN0ZWROb2RlXCJcclxuICAgICAgICAgICAgICAgICAgICAgW3NpZGVWaWV3VGVtcGxhdGVdPVwic2lkZVZpZXdUZW1wbGF0ZSA/IHNpZGVWaWV3VGVtcGxhdGUgOiBkZWZhdWx0U2lkZVZpZXdUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgIFthbGxvd0ZvbGRlckRvd25sb2FkXT1cInRyZWUuY29uZmlnLm9wdGlvbnMuYWxsb3dGb2xkZXJEb3dubG9hZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgIChjbGlja0V2ZW50KT1cImhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudCgkZXZlbnQpXCI+XHJcbiAgICAgIDwvYXBwLXNpZGUtdmlldz5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG5cclxuICA8YXBwLXVwbG9hZCAqbmdJZj1cIm5ld0RpYWxvZ1wiXHJcbiAgICAgICAgICAgICAgW29wZW5EaWFsb2ddPVwibmV3RGlhbG9nXCJcclxuICAgICAgICAgICAgICAoY2xvc2VEaWFsb2cpPVwiaGFuZGxlVXBsb2FkRGlhbG9nKGZhbHNlKVwiXHJcbiAgICAgICAgICAgICAgKGNyZWF0ZURpcik9XCJoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoe3R5cGU6ICdjcmVhdGVGb2xkZXInLCBwYXlsb2FkOiAkZXZlbnR9KVwiPlxyXG4gIDwvYXBwLXVwbG9hZD5cclxuXHJcbiAgPGFwcC1sb2FkaW5nLW92ZXJsYXlcclxuICAgICpuZ0lmPVwibG9hZGluZ1wiXHJcbiAgICBbbG9hZGluZ092ZXJsYXlUZW1wbGF0ZV09XCJsb2FkaW5nT3ZlcmxheVRlbXBsYXRlID8gbG9hZGluZ092ZXJsYXlUZW1wbGF0ZSA6IGRlZmF1bHRMb2FkaW5nT3ZlcmxheVRlbXBsYXRlXCI+XHJcbiAgPC9hcHAtbG9hZGluZy1vdmVybGF5PlxyXG48L25nLXRlbXBsYXRlPlxyXG5cclxuPG5nLXRlbXBsYXRlIGxldC1ub2RlICNkZWZhdWx0SWNvblRlbXBsYXRlPlxyXG4gIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItbm9kZVwiIHN0eWxlPVwiZGlzcGxheTogaW5saW5lLWJsb2NrOyBwYWRkaW5nOiAzcHhcIj5cclxuICAgIDxkaXYgKm5nSWY9XCJub2RlLmlzRm9sZGVyOyB0aGVuIGl0SXNGb2xkZXIgZWxzZSBzaG93RmlsZVwiPjwvZGl2PlxyXG5cclxuICAgIDxuZy10ZW1wbGF0ZSAjaXRJc0ZvbGRlcj5cclxuICAgICAgPGRpdiAqbmdJZj1cIm5vZGUuaXNFeHBhbmRlZDsgdGhlbiBpc0ZvbGRlckV4cGFuZGVkIGVsc2UgaXNGb2xkZXJDbG9zZWRcIj48L2Rpdj5cclxuICAgIDwvbmctdGVtcGxhdGU+XHJcblxyXG4gICAgPG5nLXRlbXBsYXRlICNzaG93RmlsZT48aSBjbGFzcz1cImZhcyBmYS1maWxlIGNoaWxkXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcbiAgICA8bmctdGVtcGxhdGUgI2lzRm9sZGVyRXhwYW5kZWQ+PGkgY2xhc3M9XCJmYXMgZmEtZm9sZGVyLW9wZW4gY2hpbGRcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuICAgIDxuZy10ZW1wbGF0ZSAjaXNGb2xkZXJDbG9zZWQ+PGkgY2xhc3M9XCJmYXMgZmEtZm9sZGVyIGNoaWxkXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcblxyXG4gICAgPHNwYW4+e3tub2RlLm5hbWV9fTwvc3Bhbj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuPG5nLXRlbXBsYXRlIGxldC1ub2RlICNkZWZhdWx0Rm9sZGVyQ29udGVudFRlbXBsYXRlPlxyXG4gIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItaXRlbVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtcHJldmlld1wiPlxyXG4gICAgICA8ZGl2ICpuZ0lmPVwibm9kZS5pc0ZvbGRlcjsgdGhlbiBpdElzRm9sZGVyIGVsc2Ugc2hvd0ZpbGVcIj48L2Rpdj5cclxuICAgICAgPG5nLXRlbXBsYXRlICNpdElzRm9sZGVyPjxpIGNsYXNzPVwiZmFzIGZhLTN4IGZhLWZvbGRlciBjaGlsZFwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG4gICAgICA8bmctdGVtcGxhdGUgI3Nob3dGaWxlPjxpIGNsYXNzPVwiZmFzIGZhLTN4IGZhLWZpbGUgY2hpbGRcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtbmFtZVwiPlxyXG4gICAgICB7e25vZGUubmFtZX19XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuPG5nLXRlbXBsYXRlICNkZWZhdWx0Rm9sZGVyQ29udGVudE5ld1RlbXBsYXRlPlxyXG4gIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItaXRlbVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtcHJldmlld1wiIHN0eWxlPVwid2lkdGg6IDEwMCU7IGhlaWdodDoxMDAlXCI+XHJcbiAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLTN4IGZhLXBsdXMgY2hpbGRcIiBzdHlsZT1cImxpbmUtaGVpZ2h0OiAyXCI+PC9pPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcbjxuZy10ZW1wbGF0ZSBsZXQtbm9kZSAjZGVmYXVsdEZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1pdGVtXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1wcmV2aWV3XCIgc3R5bGU9XCJ3aWR0aDogMTAwJTsgaGVpZ2h0OjEwMCVcIj5cclxuICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtMnggZmEtZWxsaXBzaXMtaFwiIHN0eWxlPVwibGluZS1oZWlnaHQ6IDVcIj48L2k+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuPG5nLXRlbXBsYXRlIGxldC10aW1lb3V0TWVzc2FnZSAjZGVmYXVsdExvYWRpbmdPdmVybGF5VGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1iYWNrZHJvcCBsb2FkaW5nXCIgKGNsaWNrKT1cImJhY2tkcm9wQ2xpY2tlZCgpXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWVycm9yXCIgKm5nSWY9XCJ0aW1lb3V0TWVzc2FnZVwiPnt7dGltZW91dE1lc3NhZ2UgfCB0cmFuc2xhdGV9fTwvZGl2PlxyXG4gIDwvZGl2PlxyXG4gIDxkaXYgY2xhc3M9XCJzcGlubmVyXCI+XHJcbiAgICA8aSBjbGFzcz1cImZhcyBmYS01eCBmYS1zcGluIGZhLXN5bmMtYWx0XCI+PC9pPlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgbGV0LW5vZGUgI2RlZmF1bHRTaWRlVmlld1RlbXBsYXRlPlxyXG4gIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IGJvdHRvbTogMDsgd2lkdGg6IDEwMCU7IG1hcmdpbjogNXB4IGF1dG9cIj5cclxuICAgIDxzcGFuICpuZ0lmPVwibm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5ObyBkYXRhIGF2YWlsYWJsZSBmb3IgdGhpcyBmb2xkZXI8L3NwYW4+XHJcbiAgICA8c3BhbiAqbmdJZj1cIiFub2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPk5vIGRhdGEgYXZhaWxhYmxlIGZvciB0aGlzIGZpbGU8L3NwYW4+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcblxyXG48bmd4LXNtYXJ0LW1vZGFsIGlkZW50aWZpZXI9XCJyZW5hbWVNb2RhbFwiIFtkaXNtaXNzYWJsZV09XCJmYWxzZVwiIFtjbG9zYWJsZV09XCJmYWxzZVwiICpuZ0lmPVwic2VsZWN0ZWROb2RlXCIgI3JlbmFtZU1vZGFsPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgdHJhbnNsYXRlPlxyXG4gICAgUmVuYW1lIGZpbGVcclxuICA8L2gyPlxyXG4gIDxwIGNsYXNzPVwicmVuYW1lLW5hbWVcIiB0cmFuc2xhdGU+XHJcbiAgICBPbGQgbmFtZVxyXG4gIDwvcD5cclxuICA8c3BhbiBzdHlsZT1cIm1hcmdpbjogOHB4XCI+e3tzZWxlY3RlZE5vZGUubmFtZX19PC9zcGFuPlxyXG4gIDxwIGNsYXNzPVwicmVuYW1lLW5hbWVcIiB0cmFuc2xhdGU+XHJcbiAgICBOZXcgbmFtZVxyXG4gIDwvcD5cclxuICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJOZXcgbmFtZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJyZW5hbWUtaW5wdXRcIiBbdmFsdWVdPVwic2VsZWN0ZWROb2RlLm5hbWVcIiAjcmVuYW1lSW5wdXRcclxuICAgICAgICAgKGtleXVwLmVudGVyKT1cImhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudCh7dHlwZTogJ3JlbmFtZScsIHZhbHVlOiByZW5hbWVJbnB1dC52YWx1ZX0pXCJcclxuICAgICAgICAgb25jbGljaz1cInRoaXMuc2VsZWN0KCk7XCI+XHJcbiAgPGJyPlxyXG5cclxuICA8ZGl2IGNsYXNzPVwicmVuYW1lLWJ1dHRvblwiPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiB0cmFuc2xhdGVcclxuICAgICAgICAgICAgKGNsaWNrKT1cImhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudCh7dHlwZTogJ3JlbmFtZScsIHZhbHVlOiByZW5hbWVJbnB1dC52YWx1ZX0pXCJcclxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cInJlbmFtZUlucHV0LnZhbHVlID09PSBzZWxlY3RlZE5vZGUubmFtZSB8fCByZW5hbWVJbnB1dC52YWx1ZS5sZW5ndGggPT09IDBcIj5cclxuICAgICAgUmVuYW1lXHJcbiAgICA8L2J1dHRvbj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgKGNsaWNrKT1cInJlbmFtZU1vZGFsLmNsb3NlKClcIiB0cmFuc2xhdGU+XHJcbiAgICAgIENhbmNlbFxyXG4gICAgPC9idXR0b24+XHJcbiAgPC9kaXY+XHJcblxyXG48L25neC1zbWFydC1tb2RhbD5cclxuPG5neC1zbWFydC1tb2RhbCAqbmdJZj1cInNlbGVjdGVkTm9kZVwiIGlkZW50aWZpZXI9XCJjb25maXJtRGVsZXRlTW9kYWxcIiAjZGVsZXRlTW9kYWxcclxuICAgICAgICAgICAgICAgICBbZGlzbWlzc2FibGVdPVwiZmFsc2VcIiBbY2xvc2FibGVdPVwiZmFsc2VcIj5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiPlxyXG4gICAgPHNwYW4gdHJhbnNsYXRlPllvdSBhcmUgdHJ5aW5nIHRvIGRlbGV0ZSBmb2xsb3dpbmcgPC9zcGFuPlxyXG4gICAgPHNwYW4gKm5nSWY9XCJzZWxlY3RlZE5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+Zm9sZGVyPC9zcGFuPlxyXG4gICAgPHNwYW4gKm5nSWY9XCIhc2VsZWN0ZWROb2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPmZpbGU8L3NwYW4+XHJcbiAgPC9oMj5cclxuXHJcbiAgPGRpdiBzdHlsZT1cIndpZHRoOiAxMDAlOyBtYXJnaW46IDVweCBhdXRvOyB0ZXh0LWFsaWduOiBjZW50ZXJcIj57e3NlbGVjdGVkTm9kZS5uYW1lfX08L2Rpdj5cclxuXHJcbiAgPGRpdiBjbGFzcz1cInJlbmFtZS1idXR0b25cIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgKGNsaWNrKT1cImhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudCh7dHlwZTogJ3JlbW92ZSd9KVwiPlxyXG4gICAgICA8c3BhbiB0cmFuc2xhdGU+WWVzLCBkZWxldGUgdGhpcyA8L3NwYW4+XHJcbiAgICAgIDxzcGFuICpuZ0lmPVwic2VsZWN0ZWROb2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPmZvbGRlcjwvc3Bhbj5cclxuICAgICAgPHNwYW4gKm5nSWY9XCIhc2VsZWN0ZWROb2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPmZpbGU8L3NwYW4+XHJcbiAgICA8L2J1dHRvbj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnIFwiIChjbGljayk9XCJkZWxldGVNb2RhbC5jbG9zZSgpXCIgdHJhbnNsYXRlPlxyXG4gICAgICBDYW5jZWxcclxuICAgIDwvYnV0dG9uPlxyXG4gIDwvZGl2PlxyXG48L25neC1zbWFydC1tb2RhbD5cclxuPG5neC1zbWFydC1tb2RhbCBpZGVudGlmaWVyPVwic2VhcmNoTW9kYWxcIiAjc2VhcmNoTW9kYWwgW2Nsb3NhYmxlXT1cInRydWVcIj5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiIHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMnB4XCIgdHJhbnNsYXRlXHJcbiAgICAgICpuZ0lmPVwic2VhcmNoTW9kYWwuaGFzRGF0YSgpICYmIHNlYXJjaE1vZGFsLmdldERhdGEoKS5yZXNwb25zZS5sZW5ndGggIT09IDBcIj5cclxuICAgIFNlYXJjaCByZXN1bHRzIGZvclxyXG4gIDwvaDI+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIiBzdHlsZT1cIm1hcmdpbi1ib3R0b206IDJweFwiIHRyYW5zbGF0ZVxyXG4gICAgICAqbmdJZj1cIiFzZWFyY2hNb2RhbC5oYXNEYXRhKCkgfHwgc2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnJlc3BvbnNlLmxlbmd0aCA9PT0gMFwiPlxyXG4gICAgTm8gcmVzdWx0cyBmb3VuZCBmb3JcclxuICA8L2gyPlxyXG4gIDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIiAqbmdJZj1cInNlYXJjaE1vZGFsLmhhc0RhdGEoKVwiPnt7c2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnNlYXJjaFN0cmluZ319PC9kaXY+XHJcblxyXG4gIDxkaXYgKm5nSWY9XCJzZWFyY2hNb2RhbC5oYXNEYXRhKCkgJiYgc2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnJlc3BvbnNlLmxlbmd0aCAhPT0gMFwiPlxyXG4gICAgPHRhYmxlIHN0eWxlPVwibWFyZ2luOiAwIGF1dG9cIj5cclxuICAgICAgPHRyPlxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInRhYmxlLWl0ZW0gdGFibGUtaGVhZFwiIHRyYW5zbGF0ZT5GaWxlIG5hbWU8L3RkPlxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInRhYmxlLWl0ZW0tc2hvcnQgdGFibGUtaGVhZFwiIHRyYW5zbGF0ZT5TaXplPC90ZD5cclxuICAgICAgPC90cj5cclxuICAgICAgPHRyICpuZ0Zvcj1cImxldCBpdGVtIG9mIHNlYXJjaE1vZGFsLmdldERhdGEoKS5yZXNwb25zZVwiIChjbGljayk9XCJzZWFyY2hDbGlja2VkKGl0ZW0pXCI+XHJcbiAgICAgICAgPHRkIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyXCI+XHJcbiAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiaXRlbS5maWxlQ2F0ZWdvcnkgPT09ICdEJzsgZWxzZSBmaWxlXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWZvbGRlciBzZWFyY2gtb3V0cHV0LWljb25cIj48L2k+XHJcbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZmlsZT5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtZmlsZSBzZWFyY2gtb3V0cHV0LWljb25cIj48L2k+XHJcbiAgICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgICAgPHNwYW4gc3R5bGU9XCJ0ZXh0LW92ZXJmbG93OiBlbGxpcHNpc1wiPnt7aXRlbS5uYW1lfX08L3NwYW4+XHJcbiAgICAgICAgPC90ZD5cclxuICAgICAgICA8dGQgY2xhc3M9XCJ0YWJsZS1pdGVtLXNob3J0XCI+e3tpdGVtLnNpemV9fTwvdGQ+XHJcbiAgICAgIDwvdHI+XHJcbiAgICA8L3RhYmxlPlxyXG4gIDwvZGl2PlxyXG48L25neC1zbWFydC1tb2RhbD5cclxuPG5neC1zbWFydC1tb2RhbCBpZGVudGlmaWVyPVwid2FpdE1vZGFsXCIgW2Nsb3NhYmxlXT1cImZhbHNlXCIgW2Rpc21pc3NhYmxlXT1cImZhbHNlXCIgW2VzY2FwYWJsZV09XCJmYWxzZVwiPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgc3R5bGU9XCJtYXJnaW4tdG9wOiAyMHB4XCI+XHJcbiAgICB7eydQcm9jZXNzaW5nIHJlcXVlc3QnIHwgdHJhbnNsYXRlfX0uLi5cclxuICA8L2gyPlxyXG5cclxuICA8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyOyBoZWlnaHQ6IDcwcHhcIj5cclxuICAgIDxpIGNsYXNzPVwiZmFzIGZhLXNwaW5uZXIgZmEtc3BpbiBmYS00eFwiPjwvaT5cclxuICA8L2Rpdj5cclxuPC9uZ3gtc21hcnQtbW9kYWw+XHJcbjxuZ3gtc21hcnQtbW9kYWwgaWRlbnRpZmllcj1cImVycm9yTW9kYWxcIiBbY2xvc2FibGVdPVwidHJ1ZVwiPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgc3R5bGU9XCJtYXJnaW4tdG9wOiAyMHB4XCI+XHJcbiAgICB7eydTb21ldGhpbmcgd2VudCB3cm9uZyB3aXRoIHlvdXIgcmVxdWVzdCcgfCB0cmFuc2xhdGV9fS4uLlxyXG4gIDwvaDI+XHJcbjwvbmd4LXNtYXJ0LW1vZGFsPlxyXG5gLFxyXG4gIHN0eWxlczogW2AuY29udGVudHtoZWlnaHQ6MTAwJTttaW4td2lkdGg6ODUwcHh9LmhvbGRlcntkaXNwbGF5OmZsZXg7aGVpZ2h0OmNhbGMoMTAwJSAtIDc1cHgpfS5wYXRoe21hcmdpbjphdXRvIDA7ZGlzcGxheTpibG9ja30ubmF2aWdhdGlvbnttYXJnaW46YXV0byAwO2Rpc3BsYXk6ZmxleH0ubmF2aWdhdGlvbiAuYnV0dG9ue21hcmdpbjowIDEwcHg7cGFkZGluZzowO3Bvc2l0aW9uOnJlbGF0aXZlfS5yaWdodHt3aWR0aDoxMDAlO3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmF1dG99LmZpbGUtbmFtZXt3aWR0aDoxMDBweDtoZWlnaHQ6MjVweDtvdmVyZmxvdzpoaWRkZW47d2hpdGUtc3BhY2U6bm93cmFwO3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7Ym94LXNpemluZzpib3JkZXItYm94Oy13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0uZmlsZS1wcmV2aWV3e21hcmdpbjphdXRvfS5maWxlLXByZXZpZXcgaXtsaW5lLWhlaWdodDoxLjV9LnNwaW5uZXJ7cG9zaXRpb246YWJzb2x1dGU7dG9wOjUwJTtsZWZ0OjUwJTstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwtNTAlKTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSk7Y3Vyc29yOnByb2dyZXNzfS5yZW5hbWUtYnV0dG9ue21hcmdpbjoyMHB4IGF1dG87ZGlzcGxheTpibG9jazt0ZXh0LWFsaWduOmNlbnRlcn0ubW9kYWwtdGl0bGV7bWFyZ2luLXRvcDo1cHg7dGV4dC1hbGlnbjpjZW50ZXJ9LnNlYXJjaC1vdXRwdXR7bWFyZ2luOjE1cHggMH0uc2VhcmNoLW91dHB1dC1pY29ue21hcmdpbjoycHggNXB4fS50YWJsZS1pdGVte3dpZHRoOjgwJX0udGFibGUtaXRlbS1zaG9ydHt3aWR0aDoyMCU7dGV4dC1hbGlnbjpyaWdodH1gXSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGaWxlTWFuYWdlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgaWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIG1vZGFsVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGxvYWRpbmdPdmVybGF5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgc2lkZVZpZXdUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQElucHV0KCkgdHJlZTogVHJlZU1vZGVsO1xyXG4gIEBJbnB1dCgpIGlzUG9wdXA6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBAT3V0cHV0KCkgaXRlbUNsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIHByaXZhdGUgX2xhbmd1YWdlOiBzdHJpbmcgPSAnZW4nO1xyXG4gIEBJbnB1dCgpIHNldCBsYW5ndWFnZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLl9sYW5ndWFnZSA9IHZhbHVlO1xyXG4gICAgdGhpcy50cmFuc2xhdGUudXNlKHRoaXMubGFuZ3VhZ2UpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGxhbmd1YWdlKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fbGFuZ3VhZ2U7XHJcbiAgfVxyXG5cclxuICBzZWxlY3RlZE5vZGU6IE5vZGVJbnRlcmZhY2U7XHJcbiAgc2lkZU1lbnVDbG9zZWQgPSB0cnVlO1xyXG5cclxuICBmbU9wZW4gPSBmYWxzZTtcclxuICBsb2FkaW5nOiBib29sZWFuO1xyXG4gIG5ld0RpYWxvZyA9IGZhbHNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPixcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBub2RlQ2xpY2tlZFNlcnZpY2U6IE5vZGVDbGlja2VkU2VydmljZSxcclxuICAgIHB1YmxpYyBuZ3hTbWFydE1vZGFsU2VydmljZTogTmd4U21hcnRNb2RhbFNlcnZpY2UsXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgICB0cmFuc2xhdGUuc2V0RGVmYXVsdExhbmcoJ2VuJyk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHdpbmRvdy5jb25zb2xlID0gd2luZG93LmNvbnNvbGUgfHwge307XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2cgPSB3aW5kb3cuY29uc29sZS5sb2cgfHwgZnVuY3Rpb24gKCkge1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm5vZGVTZXJ2aWNlLnRyZWUgPSB0aGlzLnRyZWU7XHJcbiAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS50cmVlID0gdGhpcy50cmVlO1xyXG4gICAgdGhpcy5ub2RlU2VydmljZS5zdGFydE1hbmFnZXJBdCh0aGlzLnRyZWUuY3VycmVudFBhdGgpO1xyXG5cclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUuaXNMb2FkaW5nKSlcclxuICAgICAgLnN1YnNjcmliZSgoZGF0YTogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgIHRoaXMubG9hZGluZyA9IGRhdGE7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUuc2VsZWN0ZWROb2RlKSlcclxuICAgICAgLnN1YnNjcmliZSgobm9kZTogTm9kZUludGVyZmFjZSkgPT4ge1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZml4ZWQgaGlnaGxpZ2h0aW5nIGVycm9yIHdoZW4gY2xvc2luZyBub2RlIGJ1dCBub3QgY2hhbmdpbmcgcGF0aFxyXG4gICAgICAgIGlmICgobm9kZS5pc0V4cGFuZGVkICYmIG5vZGUucGF0aFRvTm9kZSAhPT0gdGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCkgJiYgIW5vZGUuc3RheU9wZW4pIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAnc2VsZWN0Jywgbm9kZTogbm9kZX0pO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uSXRlbUNsaWNrZWQoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5pdGVtQ2xpY2tlZC5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIHNlYXJjaENsaWNrZWQoZGF0YTogYW55KSB7XHJcbiAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5SWQoZGF0YS5pZCk7XHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdzZWFyY2hNb2RhbCcpLmNsb3NlKCk7XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFLCBwYXlsb2FkOiBub2RlfSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoZXZlbnQ6IGFueSkge1xyXG4gICAgc3dpdGNoIChldmVudC50eXBlKSB7XHJcbiAgICAgIGNhc2UgJ2Nsb3NlU2lkZVZpZXcnIDpcclxuICAgICAgICByZXR1cm4gdGhpcy5ub2RlQ2xpY2tIYW5kbGVyKGV2ZW50Lm5vZGUsIHRydWUpO1xyXG5cclxuICAgICAgY2FzZSAnc2VsZWN0JyA6XHJcbiAgICAgICAgdGhpcy5vbkl0ZW1DbGlja2VkKGV2ZW50KTtcclxuICAgICAgICB0aGlzLmhpZ2hsaWdodFNlbGVjdGVkKGV2ZW50Lm5vZGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVDbGlja0hhbmRsZXIoZXZlbnQubm9kZSk7XHJcblxyXG4gICAgICBjYXNlICdkb3dubG9hZCcgOlxyXG4gICAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnN0YXJ0RG93bmxvYWQoZXZlbnQubm9kZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub25JdGVtQ2xpY2tlZChldmVudCk7XHJcblxyXG4gICAgICBjYXNlICdyZW5hbWVDb25maXJtJyA6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3JlbmFtZU1vZGFsJykub3BlbigpO1xyXG4gICAgICBjYXNlICdyZW5hbWUnIDpcclxuICAgICAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdyZW5hbWVNb2RhbCcpLmNsb3NlKCk7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnJlbmFtZSh0aGlzLnNlbGVjdGVkTm9kZS5pZCwgZXZlbnQudmFsdWUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uSXRlbUNsaWNrZWQoe1xyXG4gICAgICAgICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgICAgICAgIG5vZGU6IHRoaXMuc2VsZWN0ZWROb2RlLFxyXG4gICAgICAgICAgbmV3TmFtZTogZXZlbnQudmFsdWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIGNhc2UgJ3JlbW92ZUFzayc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ2NvbmZpcm1EZWxldGVNb2RhbCcpLm9wZW4oKTtcclxuICAgICAgY2FzZSAncmVtb3ZlJzpcclxuICAgICAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdjb25maXJtRGVsZXRlTW9kYWwnKS5jbG9zZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5pbml0RGVsZXRlKHRoaXMuc2VsZWN0ZWROb2RlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbkl0ZW1DbGlja2VkKHtcclxuICAgICAgICAgIHR5cGU6IGV2ZW50LnR5cGUsXHJcbiAgICAgICAgICBub2RlOiB0aGlzLnNlbGVjdGVkTm9kZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgY2FzZSAnY3JlYXRlRm9sZGVyJyA6XHJcbiAgICAgICAgY29uc3QgcGFyZW50SWQgPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlQYXRoKHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGgpLmlkO1xyXG5cclxuICAgICAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5jcmVhdGVGb2xkZXIocGFyZW50SWQsIGV2ZW50LnBheWxvYWQpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uSXRlbUNsaWNrZWQoe1xyXG4gICAgICAgICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgICAgICAgIHBhcmVudElkOiBwYXJlbnRJZCxcclxuICAgICAgICAgIG5ld0Rpck5hbWU6IGV2ZW50LnBheWxvYWRcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5vZGVDbGlja0hhbmRsZXIobm9kZTogTm9kZUludGVyZmFjZSwgY2xvc2luZz86IGJvb2xlYW4pIHtcclxuICAgIGlmIChub2RlLm5hbWUgPT09ICdyb290Jykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNsb3NpbmcpIHtcclxuICAgICAgY29uc3QgcGFyZW50Tm9kZSA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeVBhdGgodGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCk7XHJcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUsIHBheWxvYWQ6IHBhcmVudE5vZGV9KTtcclxuICAgICAgdGhpcy5zaWRlTWVudUNsb3NlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgLy8gdG9kbyBmaXggdGhpcyAoa3ZvbGkgdG9tdSB6ZSBzYSBrbGlrYSBuYSB0ZW4gaXN0eSBub2RlIHRhayBzdG9yZSBobyBpZ25vcnVqZSlcclxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWROb2RlID09PSBub2RlICYmIHRoaXMuc2lkZU1lbnVDbG9zZWQpXHJcbiAgICAgICAgdGhpcy5zaWRlTWVudUNsb3NlZCA9IGZhbHNlO1xyXG4gICAgICBlbHNlIGlmICh0aGlzLnNlbGVjdGVkTm9kZSA9PT0gbm9kZSAmJiAhdGhpcy5zaWRlTWVudUNsb3NlZClcclxuICAgICAgICB0aGlzLnNpZGVNZW51Q2xvc2VkID0gdHJ1ZTtcclxuICAgICAgZWxzZSBpZiAodGhpcy5zZWxlY3RlZE5vZGUgIT09IG5vZGUgJiYgdGhpcy5zaWRlTWVudUNsb3NlZClcclxuICAgICAgICB0aGlzLnNpZGVNZW51Q2xvc2VkID0gZmFsc2U7XHJcbiAgICAgIGVsc2UgaWYgKHRoaXMuc2VsZWN0ZWROb2RlICE9PSBub2RlICYmICF0aGlzLnNpZGVNZW51Q2xvc2VkKVxyXG4gICAgICAgIHRoaXMuc2lkZU1lbnVDbG9zZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNlbGVjdGVkTm9kZSA9IG5vZGU7XHJcblxyXG4gICAgaWYgKHRoaXMuc2lkZU1lbnVDbG9zZWQpIHtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGUtdmlldycpLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZS12aWV3JykuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIHRvZG8gc3RheSBEUlkhXHJcbiAgaGlnaGxpZ2h0U2VsZWN0ZWQobm9kZTogTm9kZUludGVyZmFjZSkge1xyXG4gICAgbGV0IHBhdGhUb05vZGUgPSBub2RlLnBhdGhUb05vZGU7XHJcblxyXG4gICAgaWYgKHBhdGhUb05vZGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHBhdGhUb05vZGUgPSAncm9vdCc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdHJlZUVsZW1lbnQgPSB0aGlzLmdldEVsZW1lbnRCeUlkKHBhdGhUb05vZGUsICd0cmVlXycpO1xyXG4gICAgY29uc3QgZmNFbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50QnlJZChwYXRoVG9Ob2RlLCAnZmNfJyk7XHJcbiAgICBpZiAoIXRyZWVFbGVtZW50ICYmICFmY0VsZW1lbnQpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbRmlsZSBNYW5hZ2VyXSBmYWlsZWQgdG8gZmluZCByZXF1ZXN0ZWQgbm9kZSBmb3IgcGF0aDonLCBwYXRoVG9Ob2RlKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVtb3ZlQ2xhc3MoJ2hpZ2hsaWdodGVkJyk7XHJcbiAgICB0aGlzLnJlbW92ZUNsYXNzKCdsaWdodCcpO1xyXG5cclxuICAgIGlmIChmY0VsZW1lbnQpXHJcbiAgICAgIHRoaXMuaGlnaGlsZ2h0Q2hpbGRFbGVtZW50KGZjRWxlbWVudCk7XHJcbiAgICBpZiAodHJlZUVsZW1lbnQpXHJcbiAgICAgIHRoaXMuaGlnaGlsZ2h0Q2hpbGRFbGVtZW50KHRyZWVFbGVtZW50LCB0cnVlKTtcclxuXHJcbiAgICAvLyBwYXJlbnQgbm9kZSBoaWdobGlnaHRcclxuICAgIGxldCBwYXRoVG9QYXJlbnQgPSBub2RlLnBhdGhUb1BhcmVudDtcclxuICAgIGlmIChwYXRoVG9QYXJlbnQgPT09IG51bGwgfHwgbm9kZS5wYXRoVG9Ob2RlID09PSB0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocGF0aFRvUGFyZW50Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBwYXRoVG9QYXJlbnQgPSAncm9vdCc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGFyZW50RWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudEJ5SWQocGF0aFRvUGFyZW50LCAndHJlZV8nKTtcclxuICAgIGlmICghcGFyZW50RWxlbWVudCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1tGaWxlIE1hbmFnZXJdIGZhaWxlZCB0byBmaW5kIHJlcXVlc3RlZCBwYXJlbnQgbm9kZSBmb3IgcGF0aDonLCBwYXRoVG9QYXJlbnQpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5oaWdoaWxnaHRDaGlsZEVsZW1lbnQocGFyZW50RWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGhpZ2hpbGdodENoaWxkRWxlbWVudChlbDogSFRNTEVsZW1lbnQsIGxpZ2h0OiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgIGVsLmNoaWxkcmVuWzBdIC8vIGFwcG5vZGUgZGl2IHdyYXBwZXJcclxuICAgICAgLmNoaWxkcmVuWzBdIC8vIG5nIHRlbXBsYXRlIGZpcnN0IGl0ZW1cclxuICAgICAgLmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodGVkJyk7XHJcblxyXG4gICAgaWYgKGxpZ2h0KVxyXG4gICAgICBlbC5jaGlsZHJlblswXVxyXG4gICAgICAgIC5jaGlsZHJlblswXVxyXG4gICAgICAgIC5jbGFzc0xpc3QuYWRkKCdsaWdodCcpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRFbGVtZW50QnlJZChpZDogc3RyaW5nLCBwcmVmaXg6IHN0cmluZyA9ICcnKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZnVsbElkID0gcHJlZml4ICsgaWQ7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZnVsbElkKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVtb3ZlQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgIEFycmF5LmZyb20oZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWUpKVxyXG4gICAgICAubWFwKChlbDogSFRNTEVsZW1lbnQpID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKSk7XHJcbiAgfVxyXG5cclxuICBmbVNob3dIaWRlKCkge1xyXG4gICAgdGhpcy5mbU9wZW4gPSAhdGhpcy5mbU9wZW47XHJcbiAgfVxyXG5cclxuICBiYWNrZHJvcENsaWNrZWQoKSB7XHJcbiAgICAvLyB0b2RvIGdldCByaWQgb2YgdGhpcyB1Z2x5IHdvcmthcm91bmRcclxuICAgIC8vIHRvZG8gZmlyZSB1c2VyQ2FuY2VsZWRMb2FkaW5nIGV2ZW50XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBTRVRfTE9BRElOR19TVEFURSwgcGF5bG9hZDogZmFsc2V9KTtcclxuICB9XHJcblxyXG4gIGhhbmRsZVVwbG9hZERpYWxvZyhldmVudDogYW55KSB7XHJcbiAgICB0aGlzLm5ld0RpYWxvZyA9IGV2ZW50O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtzZWxlY3QsIFN0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uLy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1mb2xkZXItY29udGVudCcsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwiaXRlbS1ob2xkZXJcIj5cclxuICA8bmctY29udGFpbmVyICpuZ0lmPVwibm9kZXMuaWQgIT09IDBcIj5cclxuICAgIDxhcHAtbm9kZSBbbm9kZV09bm9kZXMgaWQ9XCJ7e25vZGVzLnBhdGhUb05vZGV9fVwiPlxyXG4gICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2Rlc31cIlxyXG4gICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGVcIj5cclxuICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICA8L2FwcC1ub2RlPlxyXG4gIDwvbmctY29udGFpbmVyPlxyXG5cclxuICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBub2RlIG9mIG9iai5rZXlzKG5vZGVzLmNoaWxkcmVuKVwiPlxyXG4gICAgPGFwcC1ub2RlIFtub2RlXT1cIm5vZGVzLmNoaWxkcmVuW25vZGVdXCJcclxuICAgICAgICAgICAgICBpZD1cImZjX3t7bm9kZXMuY2hpbGRyZW5bbm9kZV0ucGF0aFRvTm9kZX19XCI+XHJcbiAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGVzLmNoaWxkcmVuW25vZGVdfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiZm9sZGVyQ29udGVudFRlbXBsYXRlXCI+XHJcbiAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgPC9hcHAtbm9kZT5cclxuICA8L25nLWNvbnRhaW5lcj5cclxuXHJcbiAgPGRpdiBjbGFzcz1cIm5ld1wiIChjbGljayk9XCJuZXdDbGlja2VkQWN0aW9uKClcIj5cclxuICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwiZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2AuaXRlbS1ob2xkZXJ7Ym94LXNpemluZzpib3JkZXItYm94O2Rpc3BsYXk6ZmxleDtmbGV4LWZsb3c6d3JhcH0uaXRlbS1ob2xkZXIgLm5ld3tkaXNwbGF5OmlubGluZX1gXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRm9sZGVyQ29udGVudENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBASW5wdXQoKSB0cmVlTW9kZWw6IFRyZWVNb2RlbDtcclxuXHJcbiAgQE91dHB1dCgpIG9wZW5VcGxvYWREaWFsb2cgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIG5vZGVzOiBOb2RlSW50ZXJmYWNlO1xyXG4gIG9iaiA9IE9iamVjdDtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPlxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLnBhdGgpKVxyXG4gICAgICAuc3Vic2NyaWJlKChwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgICB0aGlzLm5vZGVzID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5UGF0aChwYXRoKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZXdDbGlja2VkQWN0aW9uKCkge1xyXG4gICAgdGhpcy5vcGVuVXBsb2FkRGlhbG9nLmVtaXQodHJ1ZSk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7QWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsIElucHV0LCBPbkluaXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtUcmVlTW9kZWx9IGZyb20gJy4uLy4uL21vZGVscy90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtzZWxlY3QsIFN0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uLy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi4vLi4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQge2ZpcnN0fSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC10cmVlJyxcclxuICB0ZW1wbGF0ZTogYDxhcHAtbm9kZS1saXN0ZXIgW3Nob3dGaWxlc109XCJ0cmVlTW9kZWwuY29uZmlnLm9wdGlvbnMuc2hvd0ZpbGVzSW5zaWRlVHJlZVwiXHJcbiAgICAgICAgICAgICAgICAgW25vZGVzXT1cIntjaGlsZHJlbjogbm9kZXN9XCI+XHJcbiAgPG5nLXRlbXBsYXRlIGxldC1ub2Rlcz5cclxuICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGVzfVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRlbXBsYXRlUmVmXCI+PC9uZy1jb250YWluZXI+XHJcbiAgPC9uZy10ZW1wbGF0ZT5cclxuPC9hcHAtbm9kZS1saXN0ZXI+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYGBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUcmVlQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25Jbml0IHtcclxuICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmKSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQElucHV0KCkgdHJlZU1vZGVsOiBUcmVlTW9kZWw7XHJcblxyXG4gIG5vZGVzOiBOb2RlSW50ZXJmYWNlO1xyXG4gIGN1cnJlbnRUcmVlTGV2ZWwgPSAnJztcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPlxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLm5vZGVzID0gdGhpcy50cmVlTW9kZWwubm9kZXM7XHJcblxyXG4gICAgLy90b2RvIG1vdmUgdGhpcyBzdG9yZSB0byBwcm9wZXIgcGxhY2VcclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUucGF0aCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHRoaXMubm9kZVNlcnZpY2UuZ2V0Tm9kZXMocGF0aCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFRyZWVMZXZlbCA9IHRoaXMudHJlZU1vZGVsLmN1cnJlbnRQYXRoO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy50cmVlTW9kZWwuY3VycmVudFBhdGggPSBwYXRoO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUucGF0aCkpXHJcbiAgICAgIC5waXBlKGZpcnN0KCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5UGF0aChwYXRoKTtcclxuICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFLCBwYXlsb2FkOiBub2Rlc30pO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgSW5wdXQsIE9uSW5pdCwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLW5vZGUtbGlzdGVyJyxcbiAgdGVtcGxhdGU6IGA8dWwgY2xhc3M9XCJub2RlLWxpc3Rlci1mbGlzdFwiPlxyXG4gIDwhLS1JbiBvcmRlciB0byBhdm9pZCBoYXZpbmcgdG8gY3JlYXRlIHRoYXQgZXh0cmEgZGl2LCB3ZSBjYW4gaW5zdGVhZCB1c2UgbmctY29udGFpbmVyIGRpcmVjdGl2ZS0tPlxyXG4gIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IG5vZGUgb2Ygb2JqLmtleXMobm9kZXMpXCI+XHJcbiAgICA8bGkgY2xhc3M9XCJub2RlLWxpc3Rlci1saXN0LWl0ZW1cIiAqbmdJZj1cIm5vZGVzW25vZGVdLmlzRm9sZGVyIHx8IHNob3dGaWxlc1wiPlxyXG5cclxuICAgICAgPGFwcC1ub2RlIGNsYXNzPVwibm9kZS1saXN0ZXItYXBwLW5vZGVcIiBbbm9kZV09XCJub2Rlc1tub2RlXVwiIGlkPVwidHJlZV97e25vZGVzW25vZGVdLmlkID09PSAwID8gJ3Jvb3QnIDogbm9kZXNbbm9kZV0ucGF0aFRvTm9kZX19XCI+XHJcbiAgICAgICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogKG5vZGVzW25vZGVdKX1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwidGVtcGxhdGVSZWZcIj5cclxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgICAgPC9hcHAtbm9kZT5cclxuXHJcbiAgICAgIDxhcHAtbm9kZS1saXN0ZXIgY2xhc3M9XCJub2RlLWxpc3RlclwiICpuZ0lmPVwib2JqLmtleXMobm9kZXNbbm9kZV0uY2hpbGRyZW4pLmxlbmd0aCA+IDBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgIFtzaG93RmlsZXNdPVwic2hvd0ZpbGVzXCIgW25vZGVzXT1cIm5vZGVzW25vZGVdLmNoaWxkcmVuXCI+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlIGxldC1ub2Rlcz5cclxuICAgICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IChub2Rlcyl9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwidGVtcGxhdGVSZWZcIj5cclxuICAgICAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgIDwvYXBwLW5vZGUtbGlzdGVyPlxyXG4gICAgPC9saT5cclxuICA8L25nLWNvbnRhaW5lcj5cclxuPC91bD5cclxuYCxcbiAgc3R5bGVzOiBbYC5ub2RlLWxpc3Rlci1mbGlzdHttYXJnaW46MCAwIDAgMWVtO3BhZGRpbmc6MDtsaXN0LXN0eWxlOm5vbmU7d2hpdGUtc3BhY2U6bm93cmFwfS5ub2RlLWxpc3Rlci1saXN0LWl0ZW17bGlzdC1zdHlsZTpub25lO2xpbmUtaGVpZ2h0OjEuMmVtO2ZvbnQtc2l6ZToxZW07ZGlzcGxheTppbmxpbmV9Lm5vZGUtbGlzdGVyLWxpc3QtaXRlbSAubm9kZS1saXN0ZXItYXBwLW5vZGUuZGVzZWxlY3RlZCsubm9kZS1saXN0ZXIgdWx7ZGlzcGxheTpub25lfWBdXG59KVxuZXhwb3J0IGNsYXNzIE5vZGVMaXN0ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmKSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PjtcbiAgQElucHV0KCkgbm9kZXM6IE5vZGVJbnRlcmZhY2U7XG4gIEBJbnB1dCgpIHNob3dGaWxlczogYm9vbGVhbjtcblxuICBvYmogPSBPYmplY3Q7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge1N0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcblxyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4uLy4uLy4uL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vLi4vLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtOb2RlQ2xpY2tlZFNlcnZpY2V9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL25vZGUtY2xpY2tlZC5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5vZGUnLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiAjY3VzdG9tVGVtcGxhdGUgKGRibGNsaWNrKT1cIm1ldGhvZDJDYWxsRm9yRGJsQ2xpY2soJGV2ZW50KVwiIChjbGljayk9XCJtZXRob2QxQ2FsbEZvckNsaWNrKCRldmVudClcIj5cclxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2BgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTm9kZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgbm9kZTogTm9kZUludGVyZmFjZTtcclxuICBpc1NpbmdsZUNsaWNrID0gdHJ1ZTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4sXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgbm9kZUNsaWNrZWRTZXJ2aWNlOiBOb2RlQ2xpY2tlZFNlcnZpY2VcclxuICApIHtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBtZXRob2QxQ2FsbEZvckNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIHRoaXMuaXNTaW5nbGVDbGljayA9IHRydWU7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgaWYgKHRoaXMuaXNTaW5nbGVDbGljaykge1xyXG4gICAgICAgIHRoaXMuc2hvd01lbnUoKTtcclxuICAgICAgfVxyXG4gICAgfSwgMjAwKTtcclxuICB9XHJcblxyXG4gIC8vIHRvZG8gZXZlbnQucHJldmVudERlZmF1bHQgZm9yIGRvdWJsZSBjbGlja1xyXG4gIHB1YmxpYyBtZXRob2QyQ2FsbEZvckRibENsaWNrKGV2ZW50OiBhbnkpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgdGhpcy5pc1NpbmdsZUNsaWNrID0gZmFsc2U7XHJcbiAgICB0aGlzLm9wZW4oKTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvcGVuKCkge1xyXG4gICAgaWYgKCF0aGlzLm5vZGUuaXNGb2xkZXIpIHtcclxuICAgICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2Uuc3RhcnREb3dubG9hZCh0aGlzLm5vZGUpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMubm9kZS5zdGF5T3Blbikge1xyXG4gICAgICBpZiAodGhpcy5ub2RlLm5hbWUgPT0gJ3Jvb3QnKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlU2VydmljZS5mb2xkQWxsKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1BBVEgsIHBheWxvYWQ6IHRoaXMubm9kZS5wYXRoVG9Ob2RlfSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRvZ2dsZU5vZGVFeHBhbmRlZCgpO1xyXG5cclxuICAgIGlmICh0aGlzLm5vZGUuaXNFeHBhbmRlZCkge1xyXG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiB0aGlzLm5vZGUucGF0aFRvTm9kZX0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0Tm9kZVNlbGVjdGVkU3RhdGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2hvd01lbnUoKSB7XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFLCBwYXlsb2FkOiB0aGlzLm5vZGV9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdG9nZ2xlTm9kZUV4cGFuZGVkKCkge1xyXG4gICAgdGhpcy5ub2RlLmlzRXhwYW5kZWQgPSAhdGhpcy5ub2RlLmlzRXhwYW5kZWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldE5vZGVTZWxlY3RlZFN0YXRlKCkge1xyXG4gICAgaWYgKCF0aGlzLm5vZGUuaXNFeHBhbmRlZCkge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJlZV8nICsgdGhpcy5ub2RlLnBhdGhUb05vZGUpLmNsYXNzTGlzdC5hZGQoJ2Rlc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgIHRoaXMubm9kZVNlcnZpY2UuZm9sZFJlY3Vyc2l2ZWx5KHRoaXMubm9kZSk7XHJcblxyXG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiB0aGlzLm5vZGUucGF0aFRvUGFyZW50fSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJlZV8nICsgdGhpcy5ub2RlLnBhdGhUb05vZGUpLmNsYXNzTGlzdC5yZW1vdmUoJ2Rlc2VsZWN0ZWQnKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtQaXBlLCBQaXBlVHJhbnNmb3JtfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQFBpcGUoe1xuICBuYW1lOiAnbWFwVG9JdGVyYWJsZVBpcGUnXG59KVxuZXhwb3J0IGNsYXNzIE1hcFRvSXRlcmFibGVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIHRyYW5zZm9ybShkaWN0OiBPYmplY3QpIHtcbiAgICBjb25zdCBhID0gW107XG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGljdCkge1xuICAgICAgaWYgKGRpY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBhLnB1c2goe2tleToga2V5LCB2YWw6IGRpY3Rba2V5XX0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhO1xuICB9XG59XG4iLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7c2VsZWN0LCBTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuLi8uLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi8uLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLW5hdi1iYXInLFxuICB0ZW1wbGF0ZTogYDxkaXY+XG4gID4+IDxzcGFuICpuZ0Zvcj1cImxldCB0byBvZiBjdXJyZW50UGF0aDsgbGV0IGkgPSBpbmRleFwiPlxuICA8YSBjbGFzcz1cImxpbmtcIiBocmVmPVwiI1wiIChjbGljayk9XCJvbkNsaWNrKGN1cnJlbnRQYXRoLCBpKVwiPlxuICAgIDxkaXYgKm5nSWY9XCJ0byA9PT0gJycgfHwgdG8gPT09ICdyb290JzsgdGhlbiBpY29uIGVsc2UgbmFtZVwiPjwvZGl2PlxuICAgIDxuZy10ZW1wbGF0ZSAjaWNvbj48aSBjbGFzcz1cImZhcyBmYS1ob21lXCI+PC9pPjwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlICNuYW1lPnt7dG99fTwvbmctdGVtcGxhdGU+XG4gIDwvYT4gL1xuICA8L3NwYW4+XG48L2Rpdj5cbmAsXG4gIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBOYXZCYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBjdXJyZW50UGF0aDogc3RyaW5nW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+LFxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlXG4gICkge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5zdG9yZVxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUucGF0aCkpXG4gICAgICAuc3Vic2NyaWJlKChkYXRhOiBzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCA9IGRhdGE7XG4gICAgICAgIHRoaXMuY3VycmVudFBhdGggPSBkYXRhLnNwbGl0KCcvJyk7XG4gICAgICB9KTtcbiAgfVxuXG4gIG9uQ2xpY2socGF0aDogc3RyaW5nW10sIGluZGV4OiBudW1iZXIpIHtcbiAgICBjb25zdCBuZXdQYXRoID0gcGF0aC5zbGljZSgwLCBpbmRleCArIDEpLmpvaW4oJy8nKTtcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiBuZXdQYXRofSk7XG4gIH1cblxufVxuIiwiaW1wb3J0IHtTdGF0ZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9zdGF0ZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4vYWN0aW9ucy5hY3Rpb24nO1xyXG5cclxuY29uc3QgaW5pdGlhbFN0YXRlOiBTdGF0ZUludGVyZmFjZSA9IHtcclxuICBwYXRoOiAnJyxcclxuICBpc0xvYWRpbmc6IHRydWUsXHJcbiAgc2VsZWN0ZWROb2RlOiBudWxsXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RhdGVSZWR1Y2VyKHN0YXRlOiBTdGF0ZUludGVyZmFjZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uOiBBQ1RJT05TLkFjdGlvbnMpOiBTdGF0ZUludGVyZmFjZSB7XHJcbiAgLy8gY29uc29sZS5sb2coJ1ByZXZpb3VzIHN0YXRlOiAnLCBzdGF0ZSk7XHJcbiAgLy8gY29uc29sZS5sb2coJ0FDVElPTiB0eXBlOiAnLCBhY3Rpb24udHlwZSk7XHJcbiAgLy8gY29uc29sZS5sb2coJ0FDVElPTiBwYXlsb2FkOiAnLCBhY3Rpb24ucGF5bG9hZCk7XHJcblxyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgQUNUSU9OUy5TRVRfUEFUSCA6XHJcbiAgICAgIGlmIChzdGF0ZS5wYXRoID09PSBhY3Rpb24ucGF5bG9hZCkge1xyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gey4uLnN0YXRlLCBwYXRoOiBhY3Rpb24ucGF5bG9hZCwgaXNMb2FkaW5nOiB0cnVlfTtcclxuICAgIGNhc2UgQUNUSU9OUy5TRVRfTE9BRElOR19TVEFURSA6XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUsIGlzTG9hZGluZzogYWN0aW9uLnBheWxvYWR9O1xyXG4gICAgY2FzZSBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFIDpcclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgc2VsZWN0ZWROb2RlOiBhY3Rpb24ucGF5bG9hZH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gaW5pdGlhbFN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge3N0YXRlUmVkdWNlcn0gZnJvbSAnLi9zdGF0ZVJlZHVjZXInO1xuaW1wb3J0IHtBY3Rpb25SZWR1Y2VyTWFwfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQge1N0YXRlSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL3N0YXRlLmludGVyZmFjZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXBwU3RvcmUge1xuICBmaWxlTWFuYWdlclN0YXRlOiBTdGF0ZUludGVyZmFjZTtcbn1cblxuZXhwb3J0IGNvbnN0IHJlZHVjZXJzOiBBY3Rpb25SZWR1Y2VyTWFwPEFwcFN0b3JlPiA9IHtcbiAgZmlsZU1hbmFnZXJTdGF0ZTogc3RhdGVSZWR1Y2VyXG59O1xuIiwiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtffSBmcm9tICdAYmllc2JqZXJnL25neC10cmFuc2xhdGUtZXh0cmFjdC9kaXN0L3V0aWxzL3V0aWxzJztcclxuaW1wb3J0IHt0aW1lcn0gZnJvbSAncnhqcyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1sb2FkaW5nLW92ZXJsYXknLFxyXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRhaW5lclxuICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogdGltZW91dE1lc3NhZ2V9XCJcbiAgW25nVGVtcGxhdGVPdXRsZXRdPVwibG9hZGluZ092ZXJsYXlUZW1wbGF0ZVwiPlxuPC9uZy1jb250YWluZXI+XG5gLFxyXG4gIHN0eWxlczogW2BgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTG9hZGluZ092ZXJsYXlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIGxvYWRpbmdPdmVybGF5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgdGltZW91dE1lc3NhZ2U6IGFueTtcclxuXHJcbiAgLy8gdG9kbyB1bnN1YnNjcmliZSBmcm9tICdsaXN0JyBldmVudCAtIG5vdyB3ZSBhcmUgb25seSBkaXNtaXNzaW5nIHRoaXMgY29tcG9uZW50XHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aW1lcigyMDAwKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLnRpbWVvdXRNZXNzYWdlID0gXygnVHJvdWJsZXMgd2l0aCBsb2FkaW5nPyBDbGljayBhbnl3aGVyZSB0byBjYW5jZWwgbG9hZGluZycpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLypcbiAqIENvbnZlcnQgYnl0ZXMgaW50byBsYXJnZXN0IHBvc3NpYmxlIHVuaXQuXG4gKiBUYWtlcyBhbiBwcmVjaXNpb24gYXJndW1lbnQgdGhhdCBkZWZhdWx0cyB0byAyLlxuICogVXNhZ2U6XG4gKiAgIGJ5dGVzIHwgZmlsZVNpemU6cHJlY2lzaW9uXG4gKiBFeGFtcGxlOlxuICogICB7eyAxMDI0IHwgIGZpbGVTaXplfX1cbiAqICAgZm9ybWF0cyB0bzogMSBLQlxuKi9cbkBQaXBlKHtuYW1lOiAnZmlsZVNpemUnfSlcbmV4cG9ydCBjbGFzcyBGaWxlU2l6ZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICBwcml2YXRlIHVuaXRzID0gW1xuICAgICdieXRlcycsXG4gICAgJ0tCJyxcbiAgICAnTUInLFxuICAgICdHQicsXG4gICAgJ1RCJyxcbiAgICAnUEInXG4gIF07XG5cbiAgdHJhbnNmb3JtKGJ5dGVzOiBudW1iZXIgPSAwLCBwcmVjaXNpb246IG51bWJlciA9IDIgKSA6IHN0cmluZyB7XG4gICAgaWYgKCBpc05hTiggcGFyc2VGbG9hdCggU3RyaW5nKGJ5dGVzKSApKSB8fCAhIGlzRmluaXRlKCBieXRlcyApICkgcmV0dXJuICc/JztcblxuICAgIGxldCB1bml0ID0gMDtcblxuICAgIHdoaWxlICggYnl0ZXMgPj0gMTAyNCApIHtcbiAgICAgIGJ5dGVzIC89IDEwMjQ7XG4gICAgICB1bml0ICsrO1xuICAgIH1cblxuICAgIHJldHVybiBieXRlcy50b0ZpeGVkKCArIHByZWNpc2lvbiApICsgJyAnICsgdGhpcy51bml0c1sgdW5pdCBdO1xuICB9XG59XG4iLCJpbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7RmluZVVwbG9hZGVyfSBmcm9tICdmaW5lLXVwbG9hZGVyJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLXVwbG9hZCcsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwiYmFja2Ryb3BcIiAoY2xpY2spPVwibmV3Q2xpY2tlZEFjdGlvbigpXCI+PC9kaXY+XG48ZGl2IGNsYXNzPVwidXBsb2FkLWJhY2tncm91bmRcIj5cbiAgPGRpdiBjbGFzcz1cImJ1dHRvbnNcIj5cbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uXCIgW2Rpc2FibGVkXT1cIm5ld0ZvbGRlclwiIChjbGljayk9XCJjcmVhdGVOZXdGb2xkZXIoKVwiIHRyYW5zbGF0ZT5DcmVhdGUgbmV3IGZvbGRlcjwvYnV0dG9uPlxuICA8L2Rpdj5cblxuICA8ZGl2ICpuZ0lmPVwibmV3Rm9sZGVyXCI+XG4gICAgPGRpdiBjbGFzcz1cImJ1dHRvbnNcIj5cbiAgICAgIDxhcHAtbmV3LWZvbGRlciAoYnV0dG9uQ2xpY2tlZCk9XCJjcmVhdGVOZXdGb2xkZXIoJGV2ZW50KVwiPjwvYXBwLW5ldy1mb2xkZXI+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuXG4gIDxkaXYgaWQ9XCJmaW5lLXVwbG9hZGVyXCI+XG4gIDwvZGl2PlxuXG5cbiAgPGRpdiBjbGFzcz1cImJ1dHRvbnNcIj5cbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIFtkaXNhYmxlZF09XCJ0aGlzLmNvdW50ZXIgPCAxXCIgKGNsaWNrKT1cInVwbG9hZEZpbGVzKClcIiB0cmFuc2xhdGU+XG4gICAgICBVcGxvYWRcbiAgICA8L2J1dHRvbj5cbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIChjbGljayk9XCJuZXdDbGlja2VkQWN0aW9uKClcIiB0cmFuc2xhdGU+XG4gICAgICBDbG9zZVxuICAgIDwvYnV0dG9uPlxuICA8L2Rpdj5cblxuPC9kaXY+XG5cbjxkaXYgaWQ9XCJmaW5lLXVwbG9hZGVyLXRlbXBsYXRlXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPlxuICA8ZGl2IGNsYXNzPVwicXEtdXBsb2FkZXItc2VsZWN0b3IgcXEtdXBsb2FkZXJcIiBxcS1kcm9wLWFyZWEtdGV4dD1cIkRyb3AgZmlsZXMgaGVyZVwiPlxuICAgIDxkaXYgY2xhc3M9XCJxcS11cGxvYWQtZHJvcC1hcmVhLXNlbGVjdG9yIHFxLXVwbG9hZC1kcm9wLWFyZWFcIiBxcS1oaWRlLWRyb3B6b25lPlxuICAgICAgPHNwYW4gY2xhc3M9XCJxcS11cGxvYWQtZHJvcC1hcmVhLXRleHQtc2VsZWN0b3JcIj48L3NwYW4+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwidXBsb2FkLXRvcC1iYXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJxcS11cGxvYWQtYnV0dG9uLXNlbGVjdG9yIHFxLXVwbG9hZC1idXR0b25cIj5cbiAgICAgICAgPGRpdiB0cmFuc2xhdGU+VXBsb2FkIGEgZmlsZTwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgY2xhc3M9XCJxcS10b3RhbC1wcm9ncmVzcy1iYXItY29udGFpbmVyLXNlbGVjdG9yIHFxLXRvdGFsLXByb2dyZXNzLWJhci1jb250YWluZXJcIj5cbiAgICAgICAgPGRpdiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMFwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiXG4gICAgICAgICAgICAgY2xhc3M9XCJxcS10b3RhbC1wcm9ncmVzcy1iYXItc2VsZWN0b3IgcXEtcHJvZ3Jlc3MtYmFyIHFxLXRvdGFsLXByb2dyZXNzLWJhclwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8c3BhbiBjbGFzcz1cInFxLWRyb3AtcHJvY2Vzc2luZy1zZWxlY3RvciBxcS1kcm9wLXByb2Nlc3NpbmdcIj5cbiAgICAgICAgICAgIDxzcGFuIHRyYW5zbGF0ZT5Qcm9jZXNzaW5nIGRyb3BwZWQgZmlsZXM8L3NwYW4+Li4uXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInFxLWRyb3AtcHJvY2Vzc2luZy1zcGlubmVyLXNlbGVjdG9yIHFxLWRyb3AtcHJvY2Vzc2luZy1zcGlubmVyXCI+PC9zcGFuPlxuICAgIDwvc3Bhbj5cblxuICAgIDx1bCBjbGFzcz1cInFxLXVwbG9hZC1saXN0LXNlbGVjdG9yIHFxLXVwbG9hZC1saXN0XCIgYXJpYS1saXZlPVwicG9saXRlXCIgYXJpYS1yZWxldmFudD1cImFkZGl0aW9ucyByZW1vdmFsc1wiPlxuICAgICAgPGxpPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicXEtcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lci1zZWxlY3RvclwiPlxuICAgICAgICAgIDxkaXYgcm9sZT1cInByb2dyZXNzYmFyXCIgYXJpYS12YWx1ZW5vdz1cIjBcIiBhcmlhLXZhbHVlbWluPVwiMFwiIGFyaWEtdmFsdWVtYXg9XCIxMDBcIlxuICAgICAgICAgICAgICAgY2xhc3M9XCJxcS1wcm9ncmVzcy1iYXItc2VsZWN0b3IgcXEtcHJvZ3Jlc3MtYmFyXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8c3BhbiBjbGFzcz1cInFxLXVwbG9hZC1zcGlubmVyLXNlbGVjdG9yIHFxLXVwbG9hZC1zcGlubmVyXCI+PC9zcGFuPlxuICAgICAgICA8aW1nIGNsYXNzPVwicXEtdGh1bWJuYWlsLXNlbGVjdG9yXCIgcXEtbWF4LXNpemU9XCIxMDBcIiBxcS1zZXJ2ZXItc2NhbGU+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwicXEtdXBsb2FkLWZpbGUtc2VsZWN0b3IgcXEtdXBsb2FkLWZpbGVcIj48L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwicXEtZWRpdC1maWxlbmFtZS1pY29uLXNlbGVjdG9yIHFxLWVkaXQtZmlsZW5hbWUtaWNvblwiIGFyaWEtbGFiZWw9XCJFZGl0IGZpbGVuYW1lXCI+PC9zcGFuPlxuICAgICAgICA8aW5wdXQgY2xhc3M9XCJxcS1lZGl0LWZpbGVuYW1lLXNlbGVjdG9yIHFxLWVkaXQtZmlsZW5hbWVcIiB0YWJpbmRleD1cIjBcIiB0eXBlPVwidGV4dFwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cInFxLXVwbG9hZC1zaXplLXNlbGVjdG9yIHFxLXVwbG9hZC1zaXplXCI+PC9zcGFuPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWJ0biBxcS11cGxvYWQtY2FuY2VsLXNlbGVjdG9yIHFxLXVwbG9hZC1jYW5jZWxcIiB0cmFuc2xhdGU+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtYnRuIHFxLXVwbG9hZC1yZXRyeS1zZWxlY3RvciBxcS11cGxvYWQtcmV0cnlcIiB0cmFuc2xhdGU+UmV0cnk8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1idG4gcXEtdXBsb2FkLWRlbGV0ZS1zZWxlY3RvciBxcS11cGxvYWQtZGVsZXRlXCIgdHJhbnNsYXRlPkRlbGV0ZTwvYnV0dG9uPlxuICAgICAgICA8c3BhbiByb2xlPVwic3RhdHVzXCIgY2xhc3M9XCJxcS11cGxvYWQtc3RhdHVzLXRleHQtc2VsZWN0b3IgcXEtdXBsb2FkLXN0YXR1cy10ZXh0XCI+PC9zcGFuPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuXG4gICAgPGRpYWxvZyBjbGFzcz1cInFxLWFsZXJ0LWRpYWxvZy1zZWxlY3RvclwiPlxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLWJ1dHRvbnNcIj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1jYW5jZWwtYnV0dG9uLXNlbGVjdG9yXCIgdHJhbnNsYXRlPkNsb3NlPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2RpYWxvZz5cblxuICAgIDxkaWFsb2cgY2xhc3M9XCJxcS1jb25maXJtLWRpYWxvZy1zZWxlY3RvclwiPlxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLWJ1dHRvbnNcIj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1jYW5jZWwtYnV0dG9uLXNlbGVjdG9yXCIgdHJhbnNsYXRlPk5vPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtb2stYnV0dG9uLXNlbGVjdG9yXCIgdHJhbnNsYXRlPlllczwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaWFsb2c+XG5cbiAgICA8ZGlhbG9nIGNsYXNzPVwicXEtcHJvbXB0LWRpYWxvZy1zZWxlY3RvclwiPlxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXCI+PC9kaXY+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJxcS1kaWFsb2ctYnV0dG9uc1wiPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWNhbmNlbC1idXR0b24tc2VsZWN0b3JcIiB0cmFuc2xhdGU+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtb2stYnV0dG9uLXNlbGVjdG9yXCIgdHJhbnNsYXRlPk9rPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2RpYWxvZz5cbiAgPC9kaXY+XG48L2Rpdj5cbmAsXHJcbiAgc3R5bGVzOiBbYC51cGxvYWQtY29udGVudHt0ZXh0LWFsaWduOmNlbnRlcjttYXgtaGVpZ2h0OjI1dmg7b3ZlcmZsb3c6YXV0bzttYXJnaW46MTBweCBhdXRvfS5mYS10aW1lczpiZWZvcmV7Y29udGVudDpcIlxcXFxmMDBkXCJ9LmJ1dHRvbnN7YmFja2dyb3VuZDojZmZmO3BhZGRpbmc6NXB4O21hcmdpbjoxMHB4IDB9YCwgYC5xcS11cGxvYWQtYnV0dG9uIGRpdntsaW5lLWhlaWdodDoyNXB4fS5xcS11cGxvYWQtYnV0dG9uLWZvY3Vze291dGxpbmU6MH0ucXEtdXBsb2FkZXJ7cG9zaXRpb246cmVsYXRpdmU7bWluLWhlaWdodDoyMDBweDttYXgtaGVpZ2h0OjQ5MHB4O292ZXJmbG93LXk6aGlkZGVuO3dpZHRoOmluaGVyaXQ7Ym9yZGVyLXJhZGl1czo2cHg7YmFja2dyb3VuZC1jb2xvcjojZmRmZGZkO2JvcmRlcjoxcHggZGFzaGVkICNjY2M7cGFkZGluZzoyMHB4fS5xcS11cGxvYWRlcjpiZWZvcmV7Y29udGVudDphdHRyKHFxLWRyb3AtYXJlYS10ZXh0KSBcIiBcIjtwb3NpdGlvbjphYnNvbHV0ZTtmb250LXNpemU6MjAwJTtsZWZ0OjA7d2lkdGg6MTAwJTt0ZXh0LWFsaWduOmNlbnRlcjt0b3A6NDUlO29wYWNpdHk6LjI1fS5xcS11cGxvYWQtZHJvcC1hcmVhLC5xcS11cGxvYWQtZXh0cmEtZHJvcC1hcmVhe3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO2xlZnQ6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO21pbi1oZWlnaHQ6MzBweDt6LWluZGV4OjI7YmFja2dyb3VuZDojZjlmOWY5O2JvcmRlci1yYWRpdXM6NHB4O2JvcmRlcjoxcHggZGFzaGVkICNjY2M7dGV4dC1hbGlnbjpjZW50ZXJ9LnFxLXVwbG9hZC1kcm9wLWFyZWEgc3BhbntkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7d2lkdGg6MTAwJTttYXJnaW4tdG9wOi04cHg7Zm9udC1zaXplOjE2cHh9LnFxLXVwbG9hZC1leHRyYS1kcm9wLWFyZWF7cG9zaXRpb246cmVsYXRpdmU7bWFyZ2luLXRvcDo1MHB4O2ZvbnQtc2l6ZToxNnB4O3BhZGRpbmctdG9wOjMwcHg7aGVpZ2h0OjIwcHg7bWluLWhlaWdodDo0MHB4fS5xcS11cGxvYWQtZHJvcC1hcmVhLWFjdGl2ZXtiYWNrZ3JvdW5kOiNmZGZkZmQ7Ym9yZGVyLXJhZGl1czo0cHg7Ym9yZGVyOjFweCBkYXNoZWQgI2NjY30ucXEtdXBsb2FkLWxpc3R7bWFyZ2luOjA7cGFkZGluZzowO2xpc3Qtc3R5bGU6bm9uZTttYXgtaGVpZ2h0OjQ1MHB4O292ZXJmbG93LXk6YXV0bztjbGVhcjpib3RofS5xcS11cGxvYWQtbGlzdCBsaXttYXJnaW46MDtwYWRkaW5nOjlweDtsaW5lLWhlaWdodDoxNXB4O2ZvbnQtc2l6ZToxNnB4O2NvbG9yOiM0MjQyNDI7YmFja2dyb3VuZC1jb2xvcjojZjZmNmY2O2JvcmRlci10b3A6MXB4IHNvbGlkICNmZmY7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2RkZH0ucXEtdXBsb2FkLWxpc3QgbGk6Zmlyc3QtY2hpbGR7Ym9yZGVyLXRvcDpub25lfS5xcS11cGxvYWQtbGlzdCBsaTpsYXN0LWNoaWxke2JvcmRlci1ib3R0b206bm9uZX0ucXEtdXBsb2FkLWNhbmNlbCwucXEtdXBsb2FkLWNvbnRpbnVlLC5xcS11cGxvYWQtZGVsZXRlLC5xcS11cGxvYWQtZmFpbGVkLXRleHQsLnFxLXVwbG9hZC1maWxlLC5xcS11cGxvYWQtcGF1c2UsLnFxLXVwbG9hZC1yZXRyeSwucXEtdXBsb2FkLXNpemUsLnFxLXVwbG9hZC1zcGlubmVye21hcmdpbi1yaWdodDoxMnB4O2Rpc3BsYXk6aW5saW5lfS5xcS11cGxvYWQtZmlsZXt2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7ZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MzAwcHg7dGV4dC1vdmVyZmxvdzplbGxpcHNpczt3aGl0ZS1zcGFjZTpub3dyYXA7b3ZlcmZsb3cteDpoaWRkZW47aGVpZ2h0OjE4cHh9LnFxLXVwbG9hZC1zcGlubmVye2Rpc3BsYXk6aW5saW5lLWJsb2NrO2JhY2tncm91bmQ6dXJsKGxvYWRpbmcuZ2lmKTt3aWR0aDoxNXB4O2hlaWdodDoxNXB4O3ZlcnRpY2FsLWFsaWduOnRleHQtYm90dG9tfS5xcS1kcm9wLXByb2Nlc3Npbmd7ZGlzcGxheTpibG9ja30ucXEtZHJvcC1wcm9jZXNzaW5nLXNwaW5uZXJ7ZGlzcGxheTppbmxpbmUtYmxvY2s7YmFja2dyb3VuZDp1cmwocHJvY2Vzc2luZy5naWYpO3dpZHRoOjI0cHg7aGVpZ2h0OjI0cHg7dmVydGljYWwtYWxpZ246dGV4dC1ib3R0b219LnFxLXVwbG9hZC1jYW5jZWwsLnFxLXVwbG9hZC1jb250aW51ZSwucXEtdXBsb2FkLWRlbGV0ZSwucXEtdXBsb2FkLXBhdXNlLC5xcS11cGxvYWQtcmV0cnksLnFxLXVwbG9hZC1zaXple2ZvbnQtc2l6ZToxMnB4O2ZvbnQtd2VpZ2h0OjQwMDtjdXJzb3I6cG9pbnRlcjt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9LnFxLXVwbG9hZC1zdGF0dXMtdGV4dHtmb250LXNpemU6MTRweDtmb250LXdlaWdodDo3MDA7ZGlzcGxheTpibG9ja30ucXEtdXBsb2FkLWZhaWxlZC10ZXh0e2Rpc3BsYXk6bm9uZTtmb250LXN0eWxlOml0YWxpYztmb250LXdlaWdodDo3MDB9LnFxLXVwbG9hZC1mYWlsZWQtaWNvbntkaXNwbGF5Om5vbmU7d2lkdGg6MTVweDtoZWlnaHQ6MTVweDt2ZXJ0aWNhbC1hbGlnbjp0ZXh0LWJvdHRvbX0ucXEtdXBsb2FkLWZhaWwgLnFxLXVwbG9hZC1mYWlsZWQtdGV4dCwucXEtdXBsb2FkLXJldHJ5aW5nIC5xcS11cGxvYWQtZmFpbGVkLXRleHR7ZGlzcGxheTppbmxpbmV9LnFxLXVwbG9hZC1saXN0IGxpLnFxLXVwbG9hZC1zdWNjZXNze2JhY2tncm91bmQtY29sb3I6I2ViZjZlMDtjb2xvcjojNDI0MjQyO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkM2RlZDE7Ym9yZGVyLXRvcDoxcHggc29saWQgI2Y3ZmZmNX0ucXEtdXBsb2FkLWxpc3QgbGkucXEtdXBsb2FkLWZhaWx7YmFja2dyb3VuZC1jb2xvcjojZjVkN2Q3O2NvbG9yOiM0MjQyNDI7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2RlY2FjYTtib3JkZXItdG9wOjFweCBzb2xpZCAjZmNlNmU2fS5xcS10b3RhbC1wcm9ncmVzcy1iYXJ7aGVpZ2h0OjI1cHg7Ym9yZGVyLXJhZGl1czo5cHh9SU5QVVQucXEtZWRpdC1maWxlbmFtZXtwb3NpdGlvbjphYnNvbHV0ZTtvcGFjaXR5OjA7ei1pbmRleDotMX0ucXEtdXBsb2FkLWZpbGUucXEtZWRpdGFibGV7Y3Vyc29yOnBvaW50ZXI7bWFyZ2luLXJpZ2h0OjRweH0ucXEtZWRpdC1maWxlbmFtZS1pY29uLnFxLWVkaXRhYmxle2Rpc3BsYXk6aW5saW5lLWJsb2NrO2N1cnNvcjpwb2ludGVyfUlOUFVULnFxLWVkaXQtZmlsZW5hbWUucXEtZWRpdGluZ3twb3NpdGlvbjpzdGF0aWM7aGVpZ2h0OjI4cHg7cGFkZGluZzowIDhweDttYXJnaW4tcmlnaHQ6MTBweDttYXJnaW4tYm90dG9tOi01cHg7Ym9yZGVyOjFweCBzb2xpZCAjY2NjO2JvcmRlci1yYWRpdXM6MnB4O2ZvbnQtc2l6ZToxNnB4O29wYWNpdHk6MX0ucXEtZWRpdC1maWxlbmFtZS1pY29ue2Rpc3BsYXk6bm9uZTtiYWNrZ3JvdW5kOnVybChlZGl0LmdpZik7d2lkdGg6MTVweDtoZWlnaHQ6MTVweDt2ZXJ0aWNhbC1hbGlnbjp0ZXh0LWJvdHRvbTttYXJnaW4tcmlnaHQ6MTZweH0ucXEtaGlkZXtkaXNwbGF5Om5vbmV9LnFxLXRodW1ibmFpbC1zZWxlY3Rvcnt2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7bWFyZ2luLXJpZ2h0OjEycHh9LnFxLXVwbG9hZGVyIERJQUxPR3tkaXNwbGF5Om5vbmV9LnFxLXVwbG9hZGVyIERJQUxPR1tvcGVuXXtkaXNwbGF5OmJsb2NrfS5xcS11cGxvYWRlciBESUFMT0cgLnFxLWRpYWxvZy1idXR0b25ze3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmctdG9wOjEwcHh9LnFxLXVwbG9hZGVyIERJQUxPRyAucXEtZGlhbG9nLWJ1dHRvbnMgQlVUVE9Oe21hcmdpbi1sZWZ0OjVweDttYXJnaW4tcmlnaHQ6NXB4fS5xcS11cGxvYWRlciBESUFMT0cgLnFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9ye3BhZGRpbmctYm90dG9tOjEwcHh9LnFxLXVwbG9hZGVyIERJQUxPRzo6LXdlYmtpdC1iYWNrZHJvcHtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsLjcpfS5xcS11cGxvYWRlciBESUFMT0c6OmJhY2tkcm9we2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuNyl9YF0sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVXBsb2FkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcclxuICBASW5wdXQoKSBvcGVuRGlhbG9nO1xyXG5cclxuICBAT3V0cHV0KCkgY2xvc2VEaWFsb2cgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGNyZWF0ZURpciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgdXBsb2FkZXI6IEZpbmVVcGxvYWRlcjtcclxuICBuZXdGb2xkZXIgPSBmYWxzZTtcclxuICBjb3VudGVyID0gMDtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlKSB7XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICB0aGlzLnVwbG9hZGVyID0gbmV3IEZpbmVVcGxvYWRlcih7XHJcbiAgICAgIGRlYnVnOiBmYWxzZSxcclxuICAgICAgYXV0b1VwbG9hZDogZmFsc2UsXHJcbiAgICAgIG1heENvbm5lY3Rpb25zOiAxLCAvLyB0b2RvIGNvbmZpZ3VyYWJsZVxyXG4gICAgICBlbGVtZW50OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZS11cGxvYWRlcicpLFxyXG4gICAgICB0ZW1wbGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmUtdXBsb2FkZXItdGVtcGxhdGUnKSxcclxuICAgICAgcmVxdWVzdDoge1xyXG4gICAgICAgIGVuZHBvaW50OiB0aGlzLm5vZGVTZXJ2aWNlLnRyZWUuY29uZmlnLmJhc2VVUkwgKyB0aGlzLm5vZGVTZXJ2aWNlLnRyZWUuY29uZmlnLmFwaS51cGxvYWRGaWxlLFxyXG4gICAgICAgIC8vIGZvcmNlTXVsdGlwYXJ0OiBmYWxzZSxcclxuICAgICAgICBwYXJhbXNJbkJvZHk6IGZhbHNlLFxyXG4gICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgcGFyZW50UGF0aDogdGhpcy5nZXRDdXJyZW50UGF0aFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcmV0cnk6IHtcclxuICAgICAgICBlbmFibGVBdXRvOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBjYWxsYmFja3M6IHtcclxuICAgICAgICBvblN1Ym1pdHRlZDogKCkgPT4gdGhpcy5jb3VudGVyKyssXHJcbiAgICAgICAgb25DYW5jZWw6ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuY291bnRlciA8IDAgPyBjb25zb2xlLndhcm4oJ3d0Zj8nKSA6IHRoaXMuY291bnRlci0tO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25BbGxDb21wbGV0ZTogKHN1Y2M6IGFueSwgZmFpbDogYW55KSA9PiB7XHJcbiAgICAgICAgICBpZiAoc3VjYy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY291bnRlciA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZVNlcnZpY2UucmVmcmVzaEN1cnJlbnRQYXRoKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICBnZXQgZ2V0Q3VycmVudFBhdGgoKSB7XHJcbiAgICBjb25zdCBwYXJlbnRQYXRoID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5UGF0aCh0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoKS5pZDtcclxuICAgIHJldHVybiBwYXJlbnRQYXRoID09PSAwID8gJycgOiBwYXJlbnRQYXRoO1xyXG4gIH1cclxuXHJcbiAgdXBsb2FkRmlsZXMoKSB7XHJcbiAgICB0aGlzLnVwbG9hZGVyLnVwbG9hZFN0b3JlZEZpbGVzKCk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVOZXdGb2xkZXIoaW5wdXQ/OiBzdHJpbmcpIHtcclxuICAgIGlmICghdGhpcy5uZXdGb2xkZXIpIHtcclxuICAgICAgdGhpcy5uZXdGb2xkZXIgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5uZXdGb2xkZXIgPSBmYWxzZTtcclxuICAgICAgaWYgKGlucHV0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZURpci5lbWl0KGlucHV0KTtcclxuICAgICAgICB0aGlzLm5ld0NsaWNrZWRBY3Rpb24oKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmV3Q2xpY2tlZEFjdGlvbigpIHtcclxuICAgIHRoaXMudXBsb2FkZXIuY2FuY2VsQWxsKCk7XHJcbiAgICB0aGlzLmNsb3NlRGlhbG9nLmVtaXQoKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25Jbml0LCBPdXRwdXQsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge199IGZyb20gJ0BiaWVzYmplcmcvbmd4LXRyYW5zbGF0ZS1leHRyYWN0L2Rpc3QvdXRpbHMvdXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtbmV3LWZvbGRlcicsXG4gIHRlbXBsYXRlOiBgPHAgY2xhc3M9XCJuZXctZm9sZGVyLWRlc2NyaXB0aW9uXCIgdHJhbnNsYXRlPlR5cGUgbmV3IGZvbGRlciBuYW1lPC9wPlxuPGlucHV0ICN1cGxvYWRGb2xkZXIgcGxhY2Vob2xkZXI9XCJ7eydGb2xkZXIgbmFtZScgfCB0cmFuc2xhdGV9fVwiIChrZXl1cCk9XCJvbklucHV0Q2hhbmdlKCRldmVudClcIlxuICAgICAgIChrZXl1cC5lbnRlcik9XCJvbkNsaWNrKClcIiBvbmNsaWNrPVwidGhpcy5zZWxlY3QoKTtcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwibmV3LWZvbGRlci1pbnB1dFwiLz5cbjxidXR0b24gY2xhc3M9XCJidXR0b24gbmV3LWZvbGRlci1zZW5kXCIgKGNsaWNrKT1cIm9uQ2xpY2soKVwiPnt7YnV0dG9uVGV4dCB8IHRyYW5zbGF0ZX19PC9idXR0b24+XG5gLFxuICBzdHlsZXM6IFtgLm5ldy1mb2xkZXItZGVzY3JpcHRpb257bWFyZ2luOjAgYXV0bztwYWRkaW5nOjB9YF1cbn0pXG5leHBvcnQgY2xhc3MgTmV3Rm9sZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQFZpZXdDaGlsZCgndXBsb2FkRm9sZGVyJykgdXBsb2FkRm9sZGVyOiBFbGVtZW50UmVmO1xuICBAT3V0cHV0KCkgYnV0dG9uQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBidXR0b25UZXh0ID0gXygnQ2xvc2UnKS50b1N0cmluZygpO1xuICBpbnB1dFZhbHVlID0gJyc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgfVxuXG4gIG9uQ2xpY2soKSB7XG4gICAgY29uc3QgZWw6IEhUTUxFbGVtZW50ID0gKHRoaXMudXBsb2FkRm9sZGVyLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLmJ1dHRvbkNsaWNrZWQuZW1pdChlbC52YWx1ZSk7XG4gIH1cblxuICBvbklucHV0Q2hhbmdlKGV2ZW50OiBhbnkpIHtcbiAgICB0aGlzLmlucHV0VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgaWYgKHRoaXMuaW5wdXRWYWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmJ1dHRvblRleHQgPSBfKCdDb25maXJtJykudG9TdHJpbmcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5idXR0b25UZXh0ID0gXygnQ2xvc2UnKS50b1N0cmluZygpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBUZW1wbGF0ZVJlZiwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtc2lkZS12aWV3JyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJzaWRlLXZpZXdcIiAqbmdJZj1cIm5vZGVcIj5cbiAgPGRpdiBjbGFzcz1cInNpZGUtdmlldy1wcmV2aWV3XCI+XG4gICAgPGkgKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50LCAnY2xvc2VTaWRlVmlldycpXCIgY2xhc3M9XCJmYXMgZmEtdGltZXMgc2lkZS12aWV3LWNsb3NlXCI+PC9pPlxuXG4gICAgPGRpdiBjbGFzcz1cInNpZGUtdmlldy1wcmV2aWV3LXRpdGxlXCI+e3tub2RlLm5hbWV9fTwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cInNpZGUtdmlldy1wcmV2aWV3LWNvbnRlbnRcIj5cbiAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGV9XCJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwic2lkZVZpZXdUZW1wbGF0ZVwiPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwic2lkZS12aWV3LWJ1dHRvbnNcIj5cbiAgICAgIDxidXR0b24gKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50LCAnZG93bmxvYWQnKVwiIGNsYXNzPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cIiFhbGxvd0ZvbGRlckRvd25sb2FkICYmIG5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+XG4gICAgICAgIERvd25sb2FkXG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50LCAncmVuYW1lQ29uZmlybScpXCIgY2xhc3M9XCJidXR0b25cIiB0cmFuc2xhdGU+UmVuYW1lPC9idXR0b24+XG4gICAgICA8YnV0dG9uIChjbGljayk9XCJvbkNsaWNrKCRldmVudCwgJ3JlbW92ZUFzaycpXCIgY2xhc3M9XCJidXR0b25cIiB0cmFuc2xhdGU+RGVsZXRlPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG5gLFxyXG4gIHN0eWxlczogW2Auc2lkZS12aWV3LWNsb3Nle3Bvc2l0aW9uOmFic29sdXRlO2N1cnNvcjpwb2ludGVyO3RvcDowO3JpZ2h0OjA7cGFkZGluZzoxNXB4fS5zaWRlLXZpZXctYnV0dG9uc3t3aWR0aDoxMDAlO2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2ZsZXgtZmxvdzpjb2x1bW59LnNpZGUtdmlldy1idXR0b25zIC5idXR0b257bWFyZ2luOjVweCAwfWBdLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcclxufSlcclxuZXhwb3J0IGNsYXNzIFNpZGVWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBASW5wdXQoKSBzaWRlVmlld1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBASW5wdXQoKSBub2RlOiBOb2RlSW50ZXJmYWNlO1xyXG4gIEBJbnB1dCgpIGFsbG93Rm9sZGVyRG93bmxvYWQgPSBmYWxzZTtcclxuXHJcbiAgQE91dHB1dCgpIGNsaWNrRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKGV2ZW50OiBhbnksIHR5cGU6IHN0cmluZykge1xyXG4gICAgdGhpcy5jbGlja0V2ZW50LmVtaXQoe3R5cGU6IHR5cGUsIGV2ZW50OiBldmVudCwgbm9kZTogdGhpcy5ub2RlfSk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUNsaWNrZWRTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9ub2RlLWNsaWNrZWQuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1uYXZpZ2F0aW9uJyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJuYXZpZ2F0aW9uLWNvbXBvbmVudFwiPlxyXG4gIDxpbnB1dCAjaW5wdXQgY2xhc3M9XCJuYXZpZ2F0aW9uLXNlYXJjaFwiIG9uY2xpY2s9XCJ0aGlzLnNlbGVjdCgpO1wiIChrZXl1cC5lbnRlcik9XCJvbkNsaWNrKGlucHV0LnZhbHVlKVwiXHJcbiAgICAgICAgIHBsYWNlaG9sZGVyPVwie3snU2VhcmNoJyB8IHRyYW5zbGF0ZX19XCI+XHJcblxyXG4gIDxidXR0b24gW2Rpc2FibGVkXT1cImlucHV0LnZhbHVlLmxlbmd0aCA9PT0gMFwiIGNsYXNzPVwibmF2aWdhdGlvbi1zZWFyY2gtaWNvblwiIChjbGljayk9XCJvbkNsaWNrKGlucHV0LnZhbHVlKVwiPlxyXG4gICAgPGkgY2xhc3M9XCJmYXMgZmEtc2VhcmNoXCI+PC9pPlxyXG4gIDwvYnV0dG9uPlxyXG5cclxuICA8ZGl2PlxyXG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxyXG4gIDwvZGl2PlxyXG48L2Rpdj5cclxuXHJcblxyXG5gLFxyXG4gIHN0eWxlczogW2AubmF2aWdhdGlvbi1jb21wb25lbnR7ZGlzcGxheTpmbGV4fWBdLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcclxufSlcclxuZXhwb3J0IGNsYXNzIE5hdmlnYXRpb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgbm9kZUNsaWNrZWRTZXJ2aWNlOiBOb2RlQ2xpY2tlZFNlcnZpY2VcclxuICApIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbiAgb25DbGljayhpbnB1dDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5zZWFyY2hGb3JTdHJpbmcoaW5wdXQpO1xyXG4gIH1cclxufVxyXG4iLCIvLyBpbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQge0ZpbGVNYW5hZ2VyQ29tcG9uZW50fSBmcm9tICcuL2ZpbGUtbWFuYWdlci5jb21wb25lbnQnO1xyXG5pbXBvcnQge0ZvbGRlckNvbnRlbnRDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mb2xkZXItY29udGVudC9mb2xkZXItY29udGVudC5jb21wb25lbnQnO1xyXG5pbXBvcnQge1RyZWVDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy90cmVlL3RyZWUuY29tcG9uZW50JztcclxuaW1wb3J0IHtOb2RlTGlzdGVyQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvdHJlZS9ub2RlLWxpc3Rlci9ub2RlLWxpc3Rlci5jb21wb25lbnQnO1xyXG5pbXBvcnQge05vZGVDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mdW5jdGlvbnMvbm9kZS9ub2RlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7TWFwVG9JdGVyYWJsZVBpcGV9IGZyb20gJy4vcGlwZXMvbWFwLXRvLWl0ZXJhYmxlLnBpcGUnO1xyXG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBDbGllbnRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtTdG9yZU1vZHVsZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge05hdkJhckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL25hdi1iYXIvbmF2LWJhci5jb21wb25lbnQnO1xyXG5pbXBvcnQge3JlZHVjZXJzfSBmcm9tICcuL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCB7TG9hZGluZ092ZXJsYXlDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mdW5jdGlvbnMvbG9hZGluZy1vdmVybGF5L2xvYWRpbmctb3ZlcmxheS5jb21wb25lbnQnO1xyXG5pbXBvcnQge0ZpbGVTaXplUGlwZX0gZnJvbSAnLi9waXBlcy9maWxlLXNpemUucGlwZSc7XHJcbmltcG9ydCB7VXBsb2FkQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZnVuY3Rpb25zL3VwbG9hZC91cGxvYWQuY29tcG9uZW50JztcclxuaW1wb3J0IHtOZXdGb2xkZXJDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL25ldy1mb2xkZXIvbmV3LWZvbGRlci5jb21wb25lbnQnO1xyXG5pbXBvcnQge1NpZGVWaWV3Q29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvc2lkZS12aWV3L3NpZGUtdmlldy5jb21wb25lbnQnO1xyXG5pbXBvcnQge05hdmlnYXRpb25Db21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24uY29tcG9uZW50JztcclxuaW1wb3J0IHtOZ3hTbWFydE1vZGFsTW9kdWxlfSBmcm9tICduZ3gtc21hcnQtbW9kYWwnO1xyXG5pbXBvcnQge1RyYW5zbGF0ZUxvYWRlciwgVHJhbnNsYXRlTW9kdWxlfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcclxuaW1wb3J0IHtUcmFuc2xhdGVIdHRwTG9hZGVyfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9odHRwLWxvYWRlcic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhbnNsYXRlTG9hZGVyKGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICByZXR1cm4gbmV3IFRyYW5zbGF0ZUh0dHBMb2FkZXIoaHR0cCwgJy9hc3NldHMvaTE4bi8nLCAnLmpzb24nKTtcclxufVxyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBIdHRwQ2xpZW50TW9kdWxlLFxyXG4gICAgU3RvcmVNb2R1bGUuZm9yUm9vdChyZWR1Y2VycyksXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBOZ3hTbWFydE1vZGFsTW9kdWxlLmZvclJvb3QoKSxcclxuICAgIFRyYW5zbGF0ZU1vZHVsZS5mb3JSb290KHtcclxuICAgICAgbG9hZGVyOntcclxuICAgICAgICBwcm92aWRlOiBUcmFuc2xhdGVMb2FkZXIsXHJcbiAgICAgICAgdXNlRmFjdG9yeTogKGNyZWF0ZVRyYW5zbGF0ZUxvYWRlciksXHJcbiAgICAgICAgZGVwczogW0h0dHBDbGllbnRdfVxyXG4gICAgfSlcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgRmlsZU1hbmFnZXJDb21wb25lbnQsXHJcbiAgICBGb2xkZXJDb250ZW50Q29tcG9uZW50LFxyXG4gICAgTm9kZUNvbXBvbmVudCxcclxuICAgIFRyZWVDb21wb25lbnQsXHJcbiAgICBOb2RlTGlzdGVyQ29tcG9uZW50LFxyXG4gICAgTWFwVG9JdGVyYWJsZVBpcGUsXHJcbiAgICBOYXZCYXJDb21wb25lbnQsXHJcbiAgICBMb2FkaW5nT3ZlcmxheUNvbXBvbmVudCxcclxuICAgIEZpbGVTaXplUGlwZSxcclxuICAgIFVwbG9hZENvbXBvbmVudCxcclxuICAgIE5ld0ZvbGRlckNvbXBvbmVudCxcclxuICAgIFNpZGVWaWV3Q29tcG9uZW50LFxyXG4gICAgTmF2aWdhdGlvbkNvbXBvbmVudFxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgRmlsZU1hbmFnZXJDb21wb25lbnQsXHJcbiAgICBMb2FkaW5nT3ZlcmxheUNvbXBvbmVudCxcclxuICAgIFNpZGVWaWV3Q29tcG9uZW50XHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRmlsZU1hbmFnZXJNb2R1bGUge1xyXG4gIC8vIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gIC8vICAgcmV0dXJuIHtcclxuICAvLyAgICAgbmdNb2R1bGU6IEZpbGVNYW5hZ2VyTW9kdWxlLFxyXG4gIC8vICAgICBwcm92aWRlcnM6IFtUcmFuc2xhdGVTZXJ2aWNlXVxyXG4gIC8vICAgfTtcclxuICAvLyB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIkFDVElPTlMuU0VUX1BBVEgiLCJBQ1RJT05TLlNFVF9MT0FESU5HX1NUQVRFIiwiQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUdBOzs7O0lBTUUsWUFBWSxNQUF1Qjs7UUFFakMsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIsSUFBSSxDQUFDLEtBQUsscUJBQWtCO1lBQzFCLEVBQUUsRUFBRSxDQUFDO1lBQ0wsVUFBVSxFQUFFLEVBQUU7WUFDZCxZQUFZLEVBQUUsSUFBSTtZQUNsQixRQUFRLEVBQUUsSUFBSTtZQUNkLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFFBQVEsRUFBRSxJQUFJO1lBQ2QsSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsRUFBRTtTQUNiLENBQUEsQ0FBQztLQUNIOzs7O0lBRUQsSUFBSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0tBQzFCOzs7OztJQUVELElBQUksV0FBVyxDQUFDLEtBQWE7UUFDM0IsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7S0FDM0I7Ozs7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7S0FDcEI7Ozs7O0lBRUQs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