/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TreeModel } from './models/tree.model';
import { NodeService } from './services/node.service';
import { SET_LOADING_STATE } from './reducers/actions.action';
import * as ACTIONS from './reducers/actions.action';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { NodeClickedService } from './services/node-clicked.service';
import { TranslateService } from '@ngx-translate/core';
export class FileManagerComponent {
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
        this.store.dispatch({ type: ACTIONS.SET_SELECTED_NODE, payload: node });
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
            this.store.dispatch({ type: ACTIONS.SET_SELECTED_NODE, payload: parentNode });
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
    { type: Component, args: [{
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
<ngx-smart-modal identifier="waitModal" [closable]="false" [dismissable]="false" [escapable]="false">
  <h2 class="modal-title" style="margin-top: 20px">
    {{'Processing request' | translate}}...
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
            },] },
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
if (false) {
    /** @type {?} */
    FileManagerComponent.prototype.iconTemplate;
    /** @type {?} */
    FileManagerComponent.prototype.modalTemplate;
    /** @type {?} */
    FileManagerComponent.prototype.folderContentTemplate;
    /** @type {?} */
    FileManagerComponent.prototype.folderContentBackTemplate;
    /** @type {?} */
    FileManagerComponent.prototype.folderContentNewTemplate;
    /** @type {?} */
    FileManagerComponent.prototype.loadingOverlayTemplate;
    /** @type {?} */
    FileManagerComponent.prototype.sideViewTemplate;
    /** @type {?} */
    FileManagerComponent.prototype.tree;
    /** @type {?} */
    FileManagerComponent.prototype.isPopup;
    /** @type {?} */
    FileManagerComponent.prototype.itemClicked;
    /** @type {?} */
    FileManagerComponent.prototype._language;
    /** @type {?} */
    FileManagerComponent.prototype.selectedNode;
    /** @type {?} */
    FileManagerComponent.prototype.sideMenuClosed;
    /** @type {?} */
    FileManagerComponent.prototype.fmOpen;
    /** @type {?} */
    FileManagerComponent.prototype.loading;
    /** @type {?} */
    FileManagerComponent.prototype.newDialog;
    /** @type {?} */
    FileManagerComponent.prototype.store;
    /** @type {?} */
    FileManagerComponent.prototype.nodeService;
    /** @type {?} */
    FileManagerComponent.prototype.nodeClickedService;
    /** @type {?} */
    FileManagerComponent.prototype.ngxSmartModalService;
    /** @type {?} */
    FileManagerComponent.prototype.translate;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1tYW5hZ2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nNi1maWxlLW1hbi8iLCJzb3VyY2VzIjpbImZpbGUtbWFuYWdlci9maWxlLW1hbmFnZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3RyxPQUFPLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMxQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBRXBELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQzVELE9BQU8sS0FBSyxPQUFPLE1BQU0sMkJBQTJCLENBQUM7QUFFckQsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDckQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFDbkUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFzT3JELE1BQU07Ozs7Ozs7O0lBOEJKLFlBQ1UsT0FDQSxhQUNBLG9CQUNELHNCQUNBO1FBSkMsVUFBSyxHQUFMLEtBQUs7UUFDTCxnQkFBVyxHQUFYLFdBQVc7UUFDWCx1QkFBa0IsR0FBbEIsa0JBQWtCO1FBQ25CLHlCQUFvQixHQUFwQixvQkFBb0I7UUFDcEIsY0FBUyxHQUFULFNBQVM7dUJBekJVLEtBQUs7MkJBQ1QsSUFBSSxZQUFZLEVBQUU7eUJBRWQsSUFBSTs4QkFXZixJQUFJO3NCQUVaLEtBQUs7eUJBRUYsS0FBSztRQVNmLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDaEM7Ozs7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OztZQWpkRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0E4Tlg7Z0JBQ0MsTUFBTSxFQUFFLENBQUMsbTRCQUFtNEIsQ0FBQztnQkFDNzRCLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2FBQ3RDOzs7O1lBOU9lLEtBQUs7WUFFYixXQUFXO1lBTVgsa0JBQWtCO1lBRGxCLG9CQUFvQjtZQUVwQixnQkFBZ0I7OzsyQkF1T3JCLEtBQUs7NEJBQ0wsS0FBSztvQ0FDTCxLQUFLO3dDQUNMLEtBQUs7dUNBQ0wsS0FBSztxQ0FDTCxLQUFLOytCQUNMLEtBQUs7bUJBRUwsS0FBSztzQkFDTCxLQUFLOzBCQUNMLE1BQU07dUJBR04sS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVGVtcGxhdGVSZWYsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtzZWxlY3QsIFN0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuL21vZGVscy90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7U0VUX0xPQURJTkdfU1RBVEV9IGZyb20gJy4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCB7Tmd4U21hcnRNb2RhbFNlcnZpY2V9IGZyb20gJ25neC1zbWFydC1tb2RhbCc7XHJcbmltcG9ydCB7Tm9kZUNsaWNrZWRTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2VzL25vZGUtY2xpY2tlZC5zZXJ2aWNlJztcclxuaW1wb3J0IHtUcmFuc2xhdGVTZXJ2aWNlfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZm0tZmlsZS1tYW5hZ2VyJyxcclxuICB0ZW1wbGF0ZTogYDxuZy1jb250YWluZXIgKm5nSWY9XCJpc1BvcHVwOyB0aGVuIGl0SXNQb3B1cCBlbHNlIHNob3dDb250ZW50XCI+PC9uZy1jb250YWluZXI+XHJcblxyXG48bmctdGVtcGxhdGUgI2l0SXNQb3B1cD5cclxuICA8ZGl2ICpuZ0lmPVwiIWZtT3BlblwiPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiAoY2xpY2spPVwiZm1TaG93SGlkZSgpXCIgdHJhbnNsYXRlPVwiXCI+T3BlbiBmaWxlIG1hbmFnZXI8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWJhY2tkcm9wXCIgKm5nSWY9XCJmbU9wZW5cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmbU1vZGFsSW5zaWRlXCI+XHJcbiAgICAgIDxkaXYgKm5nSWY9XCJmbU9wZW47IHRoZW4gc2hvd0NvbnRlbnRcIj48L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG5cclxuPG5nLXRlbXBsYXRlICNzaG93Q29udGVudD5cclxuICA8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1uYXZiYXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInBhdGhcIj5cclxuICAgICAgICA8YXBwLW5hdi1iYXI+PC9hcHAtbmF2LWJhcj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzPVwibmF2aWdhdGlvblwiPlxyXG4gICAgICAgIDxhcHAtbmF2aWdhdGlvbj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24gY2xvc2VcIiAoY2xpY2spPVwiZm1TaG93SGlkZSgpXCIgKm5nSWY9XCJpc1BvcHVwXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLTJ4IGZhLXRpbWVzXCI+PC9pPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9hcHAtbmF2aWdhdGlvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwiaG9sZGVyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItbGVmdFwiPlxyXG4gICAgICAgIDxhcHAtdHJlZSBbdHJlZU1vZGVsXT1cInRyZWVcIj5cclxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSBsZXQtbm9kZXM+XHJcbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGVzfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiaWNvblRlbXBsYXRlID8gaWNvblRlbXBsYXRlIDogZGVmYXVsdEljb25UZW1wbGF0ZVwiPlxyXG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgPC9hcHAtdHJlZT5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzPVwicmlnaHRcIj5cclxuICAgICAgICA8YXBwLWZvbGRlci1jb250ZW50XHJcbiAgICAgICAgICBbdHJlZU1vZGVsXT1cInRyZWVcIlxyXG4gICAgICAgICAgKG9wZW5VcGxvYWREaWFsb2cpPVwiaGFuZGxlVXBsb2FkRGlhbG9nKCRldmVudClcIlxyXG4gICAgICAgICAgW2ZvbGRlckNvbnRlbnRUZW1wbGF0ZV09XCJmb2xkZXJDb250ZW50VGVtcGxhdGUgPyBmb2xkZXJDb250ZW50VGVtcGxhdGUgOiBkZWZhdWx0Rm9sZGVyQ29udGVudFRlbXBsYXRlXCJcclxuICAgICAgICAgIFtmb2xkZXJDb250ZW50TmV3VGVtcGxhdGVdPVwiZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlID8gZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlIDogZGVmYXVsdEZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZVwiXHJcbiAgICAgICAgICBbZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZV09XCJmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlID8gZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZSA6IGRlZmF1bHRGb2xkZXJDb250ZW50QmFja1RlbXBsYXRlXCI+XHJcbiAgICAgICAgPC9hcHAtZm9sZGVyLWNvbnRlbnQ+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGFwcC1zaWRlLXZpZXcgaWQ9XCJzaWRlLXZpZXdcIlxyXG4gICAgICAgICAgICAgICAgICAgICBbbm9kZV09XCJzZWxlY3RlZE5vZGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICBbc2lkZVZpZXdUZW1wbGF0ZV09XCJzaWRlVmlld1RlbXBsYXRlID8gc2lkZVZpZXdUZW1wbGF0ZSA6IGRlZmF1bHRTaWRlVmlld1RlbXBsYXRlXCJcclxuICAgICAgICAgICAgICAgICAgICAgW2FsbG93Rm9sZGVyRG93bmxvYWRdPVwidHJlZS5jb25maWcub3B0aW9ucy5hbGxvd0ZvbGRlckRvd25sb2FkXCJcclxuICAgICAgICAgICAgICAgICAgICAgKGNsaWNrRXZlbnQpPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KCRldmVudClcIj5cclxuICAgICAgPC9hcHAtc2lkZS12aWV3PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcblxyXG4gIDxhcHAtdXBsb2FkICpuZ0lmPVwibmV3RGlhbG9nXCJcclxuICAgICAgICAgICAgICBbb3BlbkRpYWxvZ109XCJuZXdEaWFsb2dcIlxyXG4gICAgICAgICAgICAgIChjbG9zZURpYWxvZyk9XCJoYW5kbGVVcGxvYWREaWFsb2coZmFsc2UpXCJcclxuICAgICAgICAgICAgICAoY3JlYXRlRGlyKT1cImhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudCh7dHlwZTogJ2NyZWF0ZUZvbGRlcicsIHBheWxvYWQ6ICRldmVudH0pXCI+XHJcbiAgPC9hcHAtdXBsb2FkPlxyXG5cclxuICA8YXBwLWxvYWRpbmctb3ZlcmxheVxyXG4gICAgKm5nSWY9XCJsb2FkaW5nXCJcclxuICAgIFtsb2FkaW5nT3ZlcmxheVRlbXBsYXRlXT1cImxvYWRpbmdPdmVybGF5VGVtcGxhdGUgPyBsb2FkaW5nT3ZlcmxheVRlbXBsYXRlIDogZGVmYXVsdExvYWRpbmdPdmVybGF5VGVtcGxhdGVcIj5cclxuICA8L2FwcC1sb2FkaW5nLW92ZXJsYXk+XHJcbjwvbmctdGVtcGxhdGU+XHJcblxyXG48bmctdGVtcGxhdGUgbGV0LW5vZGUgI2RlZmF1bHRJY29uVGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1ub2RlXCIgc3R5bGU9XCJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IHBhZGRpbmc6IDNweFwiPlxyXG4gICAgPGRpdiAqbmdJZj1cIm5vZGUuaXNGb2xkZXI7IHRoZW4gaXRJc0ZvbGRlciBlbHNlIHNob3dGaWxlXCI+PC9kaXY+XHJcblxyXG4gICAgPG5nLXRlbXBsYXRlICNpdElzRm9sZGVyPlxyXG4gICAgICA8ZGl2ICpuZ0lmPVwibm9kZS5pc0V4cGFuZGVkOyB0aGVuIGlzRm9sZGVyRXhwYW5kZWQgZWxzZSBpc0ZvbGRlckNsb3NlZFwiPjwvZGl2PlxyXG4gICAgPC9uZy10ZW1wbGF0ZT5cclxuXHJcbiAgICA8bmctdGVtcGxhdGUgI3Nob3dGaWxlPjxpIGNsYXNzPVwiZmFzIGZhLWZpbGUgY2hpbGRcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuICAgIDxuZy10ZW1wbGF0ZSAjaXNGb2xkZXJFeHBhbmRlZD48aSBjbGFzcz1cImZhcyBmYS1mb2xkZXItb3BlbiBjaGlsZFwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG4gICAgPG5nLXRlbXBsYXRlICNpc0ZvbGRlckNsb3NlZD48aSBjbGFzcz1cImZhcyBmYS1mb2xkZXIgY2hpbGRcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuXHJcbiAgICA8c3Bhbj57e25vZGUubmFtZX19PC9zcGFuPlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgbGV0LW5vZGUgI2RlZmF1bHRGb2xkZXJDb250ZW50VGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1pdGVtXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1wcmV2aWV3XCI+XHJcbiAgICAgIDxkaXYgKm5nSWY9XCJub2RlLmlzRm9sZGVyOyB0aGVuIGl0SXNGb2xkZXIgZWxzZSBzaG93RmlsZVwiPjwvZGl2PlxyXG4gICAgICA8bmctdGVtcGxhdGUgI2l0SXNGb2xkZXI+PGkgY2xhc3M9XCJmYXMgZmEtM3ggZmEtZm9sZGVyIGNoaWxkXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcbiAgICAgIDxuZy10ZW1wbGF0ZSAjc2hvd0ZpbGU+PGkgY2xhc3M9XCJmYXMgZmEtM3ggZmEtZmlsZSBjaGlsZFwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1uYW1lXCI+XHJcbiAgICAgIHt7bm9kZS5uYW1lfX1cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgI2RlZmF1bHRGb2xkZXJDb250ZW50TmV3VGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1pdGVtXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1wcmV2aWV3XCIgc3R5bGU9XCJ3aWR0aDogMTAwJTsgaGVpZ2h0OjEwMCVcIj5cclxuICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtM3ggZmEtcGx1cyBjaGlsZFwiIHN0eWxlPVwibGluZS1oZWlnaHQ6IDJcIj48L2k+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuPG5nLXRlbXBsYXRlIGxldC1ub2RlICNkZWZhdWx0Rm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWl0ZW1cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLXByZXZpZXdcIiBzdHlsZT1cIndpZHRoOiAxMDAlOyBoZWlnaHQ6MTAwJVwiPlxyXG4gICAgICA8aSBjbGFzcz1cImZhcyBmYS0yeCBmYS1lbGxpcHNpcy1oXCIgc3R5bGU9XCJsaW5lLWhlaWdodDogNVwiPjwvaT5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgbGV0LXRpbWVvdXRNZXNzYWdlICNkZWZhdWx0TG9hZGluZ092ZXJsYXlUZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWJhY2tkcm9wIGxvYWRpbmdcIiAoY2xpY2spPVwiYmFja2Ryb3BDbGlja2VkKClcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItZXJyb3JcIiAqbmdJZj1cInRpbWVvdXRNZXNzYWdlXCI+e3t0aW1lb3V0TWVzc2FnZSB8IHRyYW5zbGF0ZX19PC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgPGRpdiBjbGFzcz1cInNwaW5uZXJcIj5cclxuICAgIDxpIGNsYXNzPVwiZmFzIGZhLTV4IGZhLXNwaW4gZmEtc3luYy1hbHRcIj48L2k+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcbjxuZy10ZW1wbGF0ZSBsZXQtbm9kZSAjZGVmYXVsdFNpZGVWaWV3VGVtcGxhdGU+XHJcbiAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgYm90dG9tOiAwOyB3aWR0aDogMTAwJTsgbWFyZ2luOiA1cHggYXV0b1wiPlxyXG4gICAgPHNwYW4gKm5nSWY9XCJub2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPk5vIGRhdGEgYXZhaWxhYmxlIGZvciB0aGlzIGZvbGRlcjwvc3Bhbj5cclxuICAgIDxzcGFuICpuZ0lmPVwiIW5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+Tm8gZGF0YSBhdmFpbGFibGUgZm9yIHRoaXMgZmlsZTwvc3Bhbj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuXHJcbjxuZ3gtc21hcnQtbW9kYWwgaWRlbnRpZmllcj1cInJlbmFtZU1vZGFsXCIgW2Rpc21pc3NhYmxlXT1cImZhbHNlXCIgW2Nsb3NhYmxlXT1cImZhbHNlXCIgKm5nSWY9XCJzZWxlY3RlZE5vZGVcIiAjcmVuYW1lTW9kYWw+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIiB0cmFuc2xhdGU+XHJcbiAgICBSZW5hbWUgZmlsZVxyXG4gIDwvaDI+XHJcbiAgPHAgY2xhc3M9XCJyZW5hbWUtbmFtZVwiIHRyYW5zbGF0ZT5cclxuICAgIE9sZCBuYW1lXHJcbiAgPC9wPlxyXG4gIDxzcGFuIHN0eWxlPVwibWFyZ2luOiA4cHhcIj57e3NlbGVjdGVkTm9kZS5uYW1lfX08L3NwYW4+XHJcbiAgPHAgY2xhc3M9XCJyZW5hbWUtbmFtZVwiIHRyYW5zbGF0ZT5cclxuICAgIE5ldyBuYW1lXHJcbiAgPC9wPlxyXG4gIDxpbnB1dCBwbGFjZWhvbGRlcj1cIk5ldyBuYW1lXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cInJlbmFtZS1pbnB1dFwiIFt2YWx1ZV09XCJzZWxlY3RlZE5vZGUubmFtZVwiICNyZW5hbWVJbnB1dFxyXG4gICAgICAgICAoa2V5dXAuZW50ZXIpPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAncmVuYW1lJywgdmFsdWU6IHJlbmFtZUlucHV0LnZhbHVlfSlcIlxyXG4gICAgICAgICBvbmNsaWNrPVwidGhpcy5zZWxlY3QoKTtcIj5cclxuICA8YnI+XHJcblxyXG4gIDxkaXYgY2xhc3M9XCJyZW5hbWUtYnV0dG9uXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIHRyYW5zbGF0ZVxyXG4gICAgICAgICAgICAoY2xpY2spPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAncmVuYW1lJywgdmFsdWU6IHJlbmFtZUlucHV0LnZhbHVlfSlcIlxyXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwicmVuYW1lSW5wdXQudmFsdWUgPT09IHNlbGVjdGVkTm9kZS5uYW1lIHx8IHJlbmFtZUlucHV0LnZhbHVlLmxlbmd0aCA9PT0gMFwiPlxyXG4gICAgICBSZW5hbWVcclxuICAgIDwvYnV0dG9uPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiAoY2xpY2spPVwicmVuYW1lTW9kYWwuY2xvc2UoKVwiIHRyYW5zbGF0ZT5cclxuICAgICAgQ2FuY2VsXHJcbiAgICA8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxuXHJcbjwvbmd4LXNtYXJ0LW1vZGFsPlxyXG48bmd4LXNtYXJ0LW1vZGFsICpuZ0lmPVwic2VsZWN0ZWROb2RlXCIgaWRlbnRpZmllcj1cImNvbmZpcm1EZWxldGVNb2RhbFwiICNkZWxldGVNb2RhbFxyXG4gICAgICAgICAgICAgICAgIFtkaXNtaXNzYWJsZV09XCJmYWxzZVwiIFtjbG9zYWJsZV09XCJmYWxzZVwiPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+XHJcbiAgICA8c3BhbiB0cmFuc2xhdGU+WW91IGFyZSB0cnlpbmcgdG8gZGVsZXRlIGZvbGxvd2luZyA8L3NwYW4+XHJcbiAgICA8c3BhbiAqbmdJZj1cInNlbGVjdGVkTm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5mb2xkZXI8L3NwYW4+XHJcbiAgICA8c3BhbiAqbmdJZj1cIiFzZWxlY3RlZE5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+ZmlsZTwvc3Bhbj5cclxuICA8L2gyPlxyXG5cclxuICA8ZGl2IHN0eWxlPVwid2lkdGg6IDEwMCU7IG1hcmdpbjogNXB4IGF1dG87IHRleHQtYWxpZ246IGNlbnRlclwiPnt7c2VsZWN0ZWROb2RlLm5hbWV9fTwvZGl2PlxyXG5cclxuICA8ZGl2IGNsYXNzPVwicmVuYW1lLWJ1dHRvblwiPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiAoY2xpY2spPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAncmVtb3ZlJ30pXCI+XHJcbiAgICAgIDxzcGFuIHRyYW5zbGF0ZT5ZZXMsIGRlbGV0ZSB0aGlzIDwvc3Bhbj5cclxuICAgICAgPHNwYW4gKm5nSWY9XCJzZWxlY3RlZE5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+Zm9sZGVyPC9zcGFuPlxyXG4gICAgICA8c3BhbiAqbmdJZj1cIiFzZWxlY3RlZE5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+ZmlsZTwvc3Bhbj5cclxuICAgIDwvYnV0dG9uPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWcgXCIgKGNsaWNrKT1cImRlbGV0ZU1vZGFsLmNsb3NlKClcIiB0cmFuc2xhdGU+XHJcbiAgICAgIENhbmNlbFxyXG4gICAgPC9idXR0b24+XHJcbiAgPC9kaXY+XHJcbjwvbmd4LXNtYXJ0LW1vZGFsPlxyXG48bmd4LXNtYXJ0LW1vZGFsIGlkZW50aWZpZXI9XCJzZWFyY2hNb2RhbFwiICNzZWFyY2hNb2RhbCBbY2xvc2FibGVdPVwidHJ1ZVwiPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgc3R5bGU9XCJtYXJnaW4tYm90dG9tOiAycHhcIiB0cmFuc2xhdGVcclxuICAgICAgKm5nSWY9XCJzZWFyY2hNb2RhbC5oYXNEYXRhKCkgJiYgc2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnJlc3BvbnNlLmxlbmd0aCAhPT0gMFwiPlxyXG4gICAgU2VhcmNoIHJlc3VsdHMgZm9yXHJcbiAgPC9oMj5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiIHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMnB4XCIgdHJhbnNsYXRlXHJcbiAgICAgICpuZ0lmPVwiIXNlYXJjaE1vZGFsLmhhc0RhdGEoKSB8fCBzZWFyY2hNb2RhbC5nZXREYXRhKCkucmVzcG9uc2UubGVuZ3RoID09PSAwXCI+XHJcbiAgICBObyByZXN1bHRzIGZvdW5kIGZvclxyXG4gIDwvaDI+XHJcbiAgPGRpdiBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlclwiICpuZ0lmPVwic2VhcmNoTW9kYWwuaGFzRGF0YSgpXCI+e3tzZWFyY2hNb2RhbC5nZXREYXRhKCkuc2VhcmNoU3RyaW5nfX08L2Rpdj5cclxuXHJcbiAgPGRpdiAqbmdJZj1cInNlYXJjaE1vZGFsLmhhc0RhdGEoKSAmJiBzZWFyY2hNb2RhbC5nZXREYXRhKCkucmVzcG9uc2UubGVuZ3RoICE9PSAwXCI+XHJcbiAgICA8dGFibGUgc3R5bGU9XCJtYXJnaW46IDAgYXV0b1wiPlxyXG4gICAgICA8dHI+XHJcbiAgICAgICAgPHRkIGNsYXNzPVwidGFibGUtaXRlbSB0YWJsZS1oZWFkXCIgdHJhbnNsYXRlPkZpbGUgbmFtZTwvdGQ+XHJcbiAgICAgICAgPHRkIGNsYXNzPVwidGFibGUtaXRlbS1zaG9ydCB0YWJsZS1oZWFkXCIgdHJhbnNsYXRlPlNpemU8L3RkPlxyXG4gICAgICA8L3RyPlxyXG4gICAgICA8dHIgKm5nRm9yPVwibGV0IGl0ZW0gb2Ygc2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnJlc3BvbnNlXCIgKGNsaWNrKT1cInNlYXJjaENsaWNrZWQoaXRlbSlcIj5cclxuICAgICAgICA8dGQgc3R5bGU9XCJjdXJzb3I6IHBvaW50ZXJcIj5cclxuICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJpdGVtLmZpbGVDYXRlZ29yeSA9PT0gJ0QnOyBlbHNlIGZpbGVcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtZm9sZGVyIHNlYXJjaC1vdXRwdXQtaWNvblwiPjwvaT5cclxuICAgICAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgICAgICAgPG5nLXRlbXBsYXRlICNmaWxlPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1maWxlIHNlYXJjaC1vdXRwdXQtaWNvblwiPjwvaT5cclxuICAgICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgICA8c3BhbiBzdHlsZT1cInRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzXCI+e3tpdGVtLm5hbWV9fTwvc3Bhbj5cclxuICAgICAgICA8L3RkPlxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInRhYmxlLWl0ZW0tc2hvcnRcIj57e2l0ZW0uc2l6ZX19PC90ZD5cclxuICAgICAgPC90cj5cclxuICAgIDwvdGFibGU+XHJcbiAgPC9kaXY+XHJcbjwvbmd4LXNtYXJ0LW1vZGFsPlxyXG48bmd4LXNtYXJ0LW1vZGFsIGlkZW50aWZpZXI9XCJ3YWl0TW9kYWxcIiBbY2xvc2FibGVdPVwiZmFsc2VcIiBbZGlzbWlzc2FibGVdPVwiZmFsc2VcIiBbZXNjYXBhYmxlXT1cImZhbHNlXCI+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIiBzdHlsZT1cIm1hcmdpbi10b3A6IDIwcHhcIj5cclxuICAgIHt7J1Byb2Nlc3NpbmcgcmVxdWVzdCcgfCB0cmFuc2xhdGV9fS4uLlxyXG4gIDwvaDI+XHJcblxyXG4gIDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7IGhlaWdodDogNzBweFwiPlxyXG4gICAgPGkgY2xhc3M9XCJmYXMgZmEtc3Bpbm5lciBmYS1zcGluIGZhLTR4XCI+PC9pPlxyXG4gIDwvZGl2PlxyXG48L25neC1zbWFydC1tb2RhbD5cclxuPG5neC1zbWFydC1tb2RhbCBpZGVudGlmaWVyPVwiZXJyb3JNb2RhbFwiIFtjbG9zYWJsZV09XCJ0cnVlXCI+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIiBzdHlsZT1cIm1hcmdpbi10b3A6IDIwcHhcIj5cclxuICAgIHt7J1NvbWV0aGluZyB3ZW50IHdyb25nIHdpdGggeW91ciByZXF1ZXN0JyB8IHRyYW5zbGF0ZX19Li4uXHJcbiAgPC9oMj5cclxuPC9uZ3gtc21hcnQtbW9kYWw+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYC5jb250ZW50e2hlaWdodDoxMDAlO21pbi13aWR0aDo4NTBweH0uaG9sZGVye2Rpc3BsYXk6ZmxleDtoZWlnaHQ6Y2FsYygxMDAlIC0gNzVweCl9LnBhdGh7bWFyZ2luOmF1dG8gMDtkaXNwbGF5OmJsb2NrfS5uYXZpZ2F0aW9ue21hcmdpbjphdXRvIDA7ZGlzcGxheTpmbGV4fS5uYXZpZ2F0aW9uIC5idXR0b257bWFyZ2luOjAgMTBweDtwYWRkaW5nOjA7cG9zaXRpb246cmVsYXRpdmV9LnJpZ2h0e3dpZHRoOjEwMCU7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6YXV0b30uZmlsZS1uYW1le3dpZHRoOjEwMHB4O2hlaWdodDoyNXB4O292ZXJmbG93OmhpZGRlbjt3aGl0ZS1zcGFjZTpub3dyYXA7dGV4dC1vdmVyZmxvdzplbGxpcHNpcztib3gtc2l6aW5nOmJvcmRlci1ib3g7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tb3otdXNlci1zZWxlY3Q6bm9uZTstbXMtdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lfS5maWxlLXByZXZpZXd7bWFyZ2luOmF1dG99LmZpbGUtcHJldmlldyBpe2xpbmUtaGVpZ2h0OjEuNX0uc3Bpbm5lcntwb3NpdGlvbjphYnNvbHV0ZTt0b3A6NTAlO2xlZnQ6NTAlOy13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwtNTAlKTtjdXJzb3I6cHJvZ3Jlc3N9LnJlbmFtZS1idXR0b257bWFyZ2luOjIwcHggYXV0bztkaXNwbGF5OmJsb2NrO3RleHQtYWxpZ246Y2VudGVyfS5tb2RhbC10aXRsZXttYXJnaW4tdG9wOjVweDt0ZXh0LWFsaWduOmNlbnRlcn0uc2VhcmNoLW91dHB1dHttYXJnaW46MTVweCAwfS5zZWFyY2gtb3V0cHV0LWljb257bWFyZ2luOjJweCA1cHh9LnRhYmxlLWl0ZW17d2lkdGg6ODAlfS50YWJsZS1pdGVtLXNob3J0e3dpZHRoOjIwJTt0ZXh0LWFsaWduOnJpZ2h0fWBdLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcclxufSlcclxuZXhwb3J0IGNsYXNzIEZpbGVNYW5hZ2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBASW5wdXQoKSBpY29uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgbW9kYWxUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50TmV3VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgbG9hZGluZ092ZXJsYXlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBzaWRlVmlld1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBASW5wdXQoKSB0cmVlOiBUcmVlTW9kZWw7XHJcbiAgQElucHV0KCkgaXNQb3B1cDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBPdXRwdXQoKSBpdGVtQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgcHJpdmF0ZSBfbGFuZ3VhZ2U6IHN0cmluZyA9ICdlbic7XHJcbiAgQElucHV0KCkgc2V0IGxhbmd1YWdlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuX2xhbmd1YWdlID0gdmFsdWU7XHJcbiAgICB0aGlzLnRyYW5zbGF0ZS51c2UodGhpcy5sYW5ndWFnZSk7XHJcbiAgfVxyXG5cclxuICBnZXQgbGFuZ3VhZ2UoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9sYW5ndWFnZTtcclxuICB9XHJcblxyXG4gIHNlbGVjdGVkTm9kZTogTm9kZUludGVyZmFjZTtcclxuICBzaWRlTWVudUNsb3NlZCA9IHRydWU7XHJcblxyXG4gIGZtT3BlbiA9IGZhbHNlO1xyXG4gIGxvYWRpbmc6IGJvb2xlYW47XHJcbiAgbmV3RGlhbG9nID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+LFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIG5vZGVDbGlja2VkU2VydmljZTogTm9kZUNsaWNrZWRTZXJ2aWNlLFxyXG4gICAgcHVibGljIG5neFNtYXJ0TW9kYWxTZXJ2aWNlOiBOZ3hTbWFydE1vZGFsU2VydmljZSxcclxuICAgIHB1YmxpYyB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2VcclxuICApIHtcclxuICAgIHRyYW5zbGF0ZS5zZXREZWZhdWx0TGFuZygnZW4nKTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgd2luZG93LmNvbnNvbGUgPSB3aW5kb3cuY29uc29sZSB8fCB7fTtcclxuICAgIHdpbmRvdy5jb25zb2xlLmxvZyA9IHdpbmRvdy5jb25zb2xlLmxvZyB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMubm9kZVNlcnZpY2UudHJlZSA9IHRoaXMudHJlZTtcclxuICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnRyZWUgPSB0aGlzLnRyZWU7XHJcbiAgICB0aGlzLm5vZGVTZXJ2aWNlLnN0YXJ0TWFuYWdlckF0KHRoaXMudHJlZS5jdXJyZW50UGF0aCk7XHJcblxyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gc3RhdGUuZmlsZU1hbmFnZXJTdGF0ZS5pc0xvYWRpbmcpKVxyXG4gICAgICAuc3Vic2NyaWJlKChkYXRhOiBib29sZWFuKSA9PiB7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZGF0YTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gc3RhdGUuZmlsZU1hbmFnZXJTdGF0ZS5zZWxlY3RlZE5vZGUpKVxyXG4gICAgICAuc3Vic2NyaWJlKChub2RlOiBOb2RlSW50ZXJmYWNlKSA9PiB7XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmaXhlZCBoaWdobGlnaHRpbmcgZXJyb3Igd2hlbiBjbG9zaW5nIG5vZGUgYnV0IG5vdCBjaGFuZ2luZyBwYXRoXHJcbiAgICAgICAgaWYgKChub2RlLmlzRXhwYW5kZWQgJiYgbm9kZS5wYXRoVG9Ob2RlICE9PSB0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoKSAmJiAhbm9kZS5zdGF5T3Blbikge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoe3R5cGU6ICdzZWxlY3QnLCBub2RlOiBub2RlfSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgb25JdGVtQ2xpY2tlZChldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLml0ZW1DbGlja2VkLmVtaXQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgc2VhcmNoQ2xpY2tlZChkYXRhOiBhbnkpIHtcclxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlJZChkYXRhLmlkKTtcclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3NlYXJjaE1vZGFsJykuY2xvc2UoKTtcclxuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUsIHBheWxvYWQ6IG5vZGV9KTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudChldmVudDogYW55KSB7XHJcbiAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcclxuICAgICAgY2FzZSAnY2xvc2VTaWRlVmlldycgOlxyXG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVDbGlja0hhbmRsZXIoZXZlbnQubm9kZSwgdHJ1ZSk7XHJcblxyXG4gICAgICBjYXNlICdzZWxlY3QnIDpcclxuICAgICAgICB0aGlzLm9uSXRlbUNsaWNrZWQoZXZlbnQpO1xyXG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0U2VsZWN0ZWQoZXZlbnQubm9kZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZUNsaWNrSGFuZGxlcihldmVudC5ub2RlKTtcclxuXHJcbiAgICAgIGNhc2UgJ2Rvd25sb2FkJyA6XHJcbiAgICAgICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2Uuc3RhcnREb3dubG9hZChldmVudC5ub2RlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbkl0ZW1DbGlja2VkKGV2ZW50KTtcclxuXHJcbiAgICAgIGNhc2UgJ3JlbmFtZUNvbmZpcm0nIDpcclxuICAgICAgICByZXR1cm4gdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgncmVuYW1lTW9kYWwnKS5vcGVuKCk7XHJcbiAgICAgIGNhc2UgJ3JlbmFtZScgOlxyXG4gICAgICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3JlbmFtZU1vZGFsJykuY2xvc2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2UucmVuYW1lKHRoaXMuc2VsZWN0ZWROb2RlLmlkLCBldmVudC52YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub25JdGVtQ2xpY2tlZCh7XHJcbiAgICAgICAgICB0eXBlOiBldmVudC50eXBlLFxyXG4gICAgICAgICAgbm9kZTogdGhpcy5zZWxlY3RlZE5vZGUsXHJcbiAgICAgICAgICBuZXdOYW1lOiBldmVudC52YWx1ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgY2FzZSAncmVtb3ZlQXNrJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnY29uZmlybURlbGV0ZU1vZGFsJykub3BlbigpO1xyXG4gICAgICBjYXNlICdyZW1vdmUnOlxyXG4gICAgICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ2NvbmZpcm1EZWxldGVNb2RhbCcpLmNsb3NlKCk7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLmluaXREZWxldGUodGhpcy5zZWxlY3RlZE5vZGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uSXRlbUNsaWNrZWQoe1xyXG4gICAgICAgICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgICAgICAgIG5vZGU6IHRoaXMuc2VsZWN0ZWROb2RlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICBjYXNlICdjcmVhdGVGb2xkZXInIDpcclxuICAgICAgICBjb25zdCBwYXJlbnRJZCA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeVBhdGgodGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCkuaWQ7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLmNyZWF0ZUZvbGRlcihwYXJlbnRJZCwgZXZlbnQucGF5bG9hZCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub25JdGVtQ2xpY2tlZCh7XHJcbiAgICAgICAgICB0eXBlOiBldmVudC50eXBlLFxyXG4gICAgICAgICAgcGFyZW50SWQ6IHBhcmVudElkLFxyXG4gICAgICAgICAgbmV3RGlyTmFtZTogZXZlbnQucGF5bG9hZFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbm9kZUNsaWNrSGFuZGxlcihub2RlOiBOb2RlSW50ZXJmYWNlLCBjbG9zaW5nPzogYm9vbGVhbikge1xyXG4gICAgaWYgKG5vZGUubmFtZSA9PT0gJ3Jvb3QnKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2xvc2luZykge1xyXG4gICAgICBjb25zdCBwYXJlbnROb2RlID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5UGF0aCh0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoKTtcclxuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSwgcGF5bG9hZDogcGFyZW50Tm9kZX0pO1xyXG4gICAgICB0aGlzLnNpZGVNZW51Q2xvc2VkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAvLyB0b2RvIGZpeCB0aGlzIChrdm9saSB0b211IHplIHNhIGtsaWthIG5hIHRlbiBpc3R5IG5vZGUgdGFrIHN0b3JlIGhvIGlnbm9ydWplKVxyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZE5vZGUgPT09IG5vZGUgJiYgdGhpcy5zaWRlTWVudUNsb3NlZClcclxuICAgICAgICB0aGlzLnNpZGVNZW51Q2xvc2VkID0gZmFsc2U7XHJcbiAgICAgIGVsc2UgaWYgKHRoaXMuc2VsZWN0ZWROb2RlID09PSBub2RlICYmICF0aGlzLnNpZGVNZW51Q2xvc2VkKVxyXG4gICAgICAgIHRoaXMuc2lkZU1lbnVDbG9zZWQgPSB0cnVlO1xyXG4gICAgICBlbHNlIGlmICh0aGlzLnNlbGVjdGVkTm9kZSAhPT0gbm9kZSAmJiB0aGlzLnNpZGVNZW51Q2xvc2VkKVxyXG4gICAgICAgIHRoaXMuc2lkZU1lbnVDbG9zZWQgPSBmYWxzZTtcclxuICAgICAgZWxzZSBpZiAodGhpcy5zZWxlY3RlZE5vZGUgIT09IG5vZGUgJiYgIXRoaXMuc2lkZU1lbnVDbG9zZWQpXHJcbiAgICAgICAgdGhpcy5zaWRlTWVudUNsb3NlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2VsZWN0ZWROb2RlID0gbm9kZTtcclxuXHJcbiAgICBpZiAodGhpcy5zaWRlTWVudUNsb3NlZCkge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZS12aWV3JykuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWRlLXZpZXcnKS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gdG9kbyBzdGF5IERSWSFcclxuICBoaWdobGlnaHRTZWxlY3RlZChub2RlOiBOb2RlSW50ZXJmYWNlKSB7XHJcbiAgICBsZXQgcGF0aFRvTm9kZSA9IG5vZGUucGF0aFRvTm9kZTtcclxuXHJcbiAgICBpZiAocGF0aFRvTm9kZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgcGF0aFRvTm9kZSA9ICdyb290JztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0cmVlRWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudEJ5SWQocGF0aFRvTm9kZSwgJ3RyZWVfJyk7XHJcbiAgICBjb25zdCBmY0VsZW1lbnQgPSB0aGlzLmdldEVsZW1lbnRCeUlkKHBhdGhUb05vZGUsICdmY18nKTtcclxuICAgIGlmICghdHJlZUVsZW1lbnQgJiYgIWZjRWxlbWVudCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1tGaWxlIE1hbmFnZXJdIGZhaWxlZCB0byBmaW5kIHJlcXVlc3RlZCBub2RlIGZvciBwYXRoOicsIHBhdGhUb05vZGUpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZW1vdmVDbGFzcygnaGlnaGxpZ2h0ZWQnKTtcclxuICAgIHRoaXMucmVtb3ZlQ2xhc3MoJ2xpZ2h0Jyk7XHJcblxyXG4gICAgaWYgKGZjRWxlbWVudClcclxuICAgICAgdGhpcy5oaWdoaWxnaHRDaGlsZEVsZW1lbnQoZmNFbGVtZW50KTtcclxuICAgIGlmICh0cmVlRWxlbWVudClcclxuICAgICAgdGhpcy5oaWdoaWxnaHRDaGlsZEVsZW1lbnQodHJlZUVsZW1lbnQsIHRydWUpO1xyXG5cclxuICAgIC8vIHBhcmVudCBub2RlIGhpZ2hsaWdodFxyXG4gICAgbGV0IHBhdGhUb1BhcmVudCA9IG5vZGUucGF0aFRvUGFyZW50O1xyXG4gICAgaWYgKHBhdGhUb1BhcmVudCA9PT0gbnVsbCB8fCBub2RlLnBhdGhUb05vZGUgPT09IHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGgpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChwYXRoVG9QYXJlbnQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHBhdGhUb1BhcmVudCA9ICdyb290JztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwYXJlbnRFbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50QnlJZChwYXRoVG9QYXJlbnQsICd0cmVlXycpO1xyXG4gICAgaWYgKCFwYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignW0ZpbGUgTWFuYWdlcl0gZmFpbGVkIHRvIGZpbmQgcmVxdWVzdGVkIHBhcmVudCBub2RlIGZvciBwYXRoOicsIHBhdGhUb1BhcmVudCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmhpZ2hpbGdodENoaWxkRWxlbWVudChwYXJlbnRFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaGlnaGlsZ2h0Q2hpbGRFbGVtZW50KGVsOiBIVE1MRWxlbWVudCwgbGlnaHQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgZWwuY2hpbGRyZW5bMF0gLy8gYXBwbm9kZSBkaXYgd3JhcHBlclxyXG4gICAgICAuY2hpbGRyZW5bMF0gLy8gbmcgdGVtcGxhdGUgZmlyc3QgaXRlbVxyXG4gICAgICAuY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0ZWQnKTtcclxuXHJcbiAgICBpZiAobGlnaHQpXHJcbiAgICAgIGVsLmNoaWxkcmVuWzBdXHJcbiAgICAgICAgLmNoaWxkcmVuWzBdXHJcbiAgICAgICAgLmNsYXNzTGlzdC5hZGQoJ2xpZ2h0Jyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldEVsZW1lbnRCeUlkKGlkOiBzdHJpbmcsIHByZWZpeDogc3RyaW5nID0gJycpOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBmdWxsSWQgPSBwcmVmaXggKyBpZDtcclxuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmdWxsSWQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZW1vdmVDbGFzcyhjbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgQXJyYXkuZnJvbShkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNsYXNzTmFtZSkpXHJcbiAgICAgIC5tYXAoKGVsOiBIVE1MRWxlbWVudCkgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpKTtcclxuICB9XHJcblxyXG4gIGZtU2hvd0hpZGUoKSB7XHJcbiAgICB0aGlzLmZtT3BlbiA9ICF0aGlzLmZtT3BlbjtcclxuICB9XHJcblxyXG4gIGJhY2tkcm9wQ2xpY2tlZCgpIHtcclxuICAgIC8vIHRvZG8gZ2V0IHJpZCBvZiB0aGlzIHVnbHkgd29ya2Fyb3VuZFxyXG4gICAgLy8gdG9kbyBmaXJlIHVzZXJDYW5jZWxlZExvYWRpbmcgZXZlbnRcclxuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IFNFVF9MT0FESU5HX1NUQVRFLCBwYXlsb2FkOiBmYWxzZX0pO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlVXBsb2FkRGlhbG9nKGV2ZW50OiBhbnkpIHtcclxuICAgIHRoaXMubmV3RGlhbG9nID0gZXZlbnQ7XHJcbiAgfVxyXG59XHJcbiJdfQ==