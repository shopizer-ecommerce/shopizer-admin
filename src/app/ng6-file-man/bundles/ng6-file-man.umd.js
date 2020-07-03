(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('@angular/common/http'), require('@ngrx/store'), require('ngx-smart-modal'), require('@ngx-translate/core'), require('rxjs/operators'), require('tslib'), require('@biesbjerg/ngx-translate-extract/dist/utils/utils'), require('fine-uploader'), require('@angular/common'), require('@ngx-translate/http-loader')) :
    typeof define === 'function' && define.amd ? define('ng6-file-man', ['exports', '@angular/core', 'rxjs', '@angular/common/http', '@ngrx/store', 'ngx-smart-modal', '@ngx-translate/core', 'rxjs/operators', 'tslib', '@biesbjerg/ngx-translate-extract/dist/utils/utils', 'fine-uploader', '@angular/common', '@ngx-translate/http-loader'], factory) :
    (factory((global['ng6-file-man'] = {}),global.ng.core,global.rxjs,global.ng.common.http,null,null,null,global.rxjs.operators,global.tslib,null,null,global.ng.common,null));
}(this, (function (exports,i0,rxjs,i4,i3,i1,core,operators,tslib_1,utils,fineUploader,common,httpLoader) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var SET_PATH = 'SET_PATH';
    /** @type {?} */
    var SET_LOADING_STATE = 'SET_LOADING_STATE';
    /** @type {?} */
    var SET_SELECTED_NODE = 'SET_SELECTED_NODE';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NodeService = (function () {
        function NodeService(http, store) {
            var _this = this;
            this.http = http;
            this.store = store;
            this.getNodesFromServer = function (path) {
                /** @type {?} */
                var folderId = _this.findNodeByPath(path).id;
                folderId = folderId === 0 ? '' : folderId;
                return _this.http.get(_this.tree.config.baseURL + _this.tree.config.api.listFile, { params: new i4.HttpParams().set('parentPath', folderId) });
            };
        }
        /**
         * @param {?} path
         * @return {?}
         */
        NodeService.prototype.startManagerAt = /**
         * @param {?} path
         * @return {?}
         */
            function (path) {
                this.store.dispatch({ type: SET_PATH, payload: path });
            };
        /**
         * @return {?}
         */
        NodeService.prototype.refreshCurrentPath = /**
         * @return {?}
         */
            function () {
                this.findNodeByPath(this.currentPath).children = {};
                this.getNodes(this.currentPath);
            };
        /**
         * @param {?} path
         * @return {?}
         */
        NodeService.prototype.getNodes = /**
         * @param {?} path
         * @return {?}
         */
            function (path) {
                var _this = this;
                this.parseNodes(path).subscribe(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        /** @type {?} */
                        var parentPath = _this.getParentPath(data[i].pathToNode);
                        _this.findNodeByPath(parentPath).children[data[i].name] = data[i];
                    }
                });
            };
        /**
         * @param {?} path
         * @return {?}
         */
        NodeService.prototype.getParentPath = /**
         * @param {?} path
         * @return {?}
         */
            function (path) {
                /** @type {?} */
                var parentPath = path.split('/');
                parentPath = parentPath.slice(0, parentPath.length - 1);
                return parentPath.join('/');
            };
        /**
         * @param {?} path
         * @return {?}
         */
        NodeService.prototype.parseNodes = /**
         * @param {?} path
         * @return {?}
         */
            function (path) {
                var _this = this;
                return new rxjs.Observable(function (observer) {
                    _this.getNodesFromServer(path).subscribe(function (data) {
                        observer.next(data.map(function (node) { return _this.createNode(path, node); }));
                        _this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
                    });
                });
            };
        /**
         * @param {?} path
         * @param {?} node
         * @return {?}
         */
        NodeService.prototype.createNode = /**
         * @param {?} path
         * @param {?} node
         * @return {?}
         */
            function (path, node) {
                if (node.path[0] !== '/') {
                    console.warn('[Node Service] Server should return initial path with "/"');
                    node.path = '/' + node.path;
                }
                /** @type {?} */
                var ids = node.path.split('/');
                if (ids.length > 2 && ids[ids.length - 1] === '') {
                    ids.splice(-1, 1);
                    node.path = ids.join('/');
                }
                /** @type {?} */
                var cachedNode = this.findNodeByPath(node.path);
                return /** @type {?} */ ({
                    id: node.id,
                    isFolder: node.dir,
                    isExpanded: cachedNode ? cachedNode.isExpanded : false,
                    pathToNode: node.path,
                    pathToParent: this.getParentPath(node.path),
                    name: node.name || node.id,
                    children: cachedNode ? cachedNode.children : {}
                });
            };
        /**
         * @param {?} nodePath
         * @return {?}
         */
        NodeService.prototype.findNodeByPath = /**
         * @param {?} nodePath
         * @return {?}
         */
            function (nodePath) {
                /** @type {?} */
                var ids = nodePath.split('/');
                ids.splice(0, 1);
                return ids.length === 0 ? this.tree.nodes : ids.reduce(function (value, index) { return value['children'][index]; }, this.tree.nodes);
            };
        /**
         * @param {?} id
         * @return {?}
         */
        NodeService.prototype.findNodeById = /**
         * @param {?} id
         * @return {?}
         */
            function (id) {
                /** @type {?} */
                var result = this.findNodeByIdHelper(id);
                if (result === null) {
                    console.warn('[Node Service] Cannot find node by id. Id not existing or not fetched. Returning root.');
                    return this.tree.nodes;
                }
                return result;
            };
        /**
         * @param {?} id
         * @param {?=} node
         * @return {?}
         */
        NodeService.prototype.findNodeByIdHelper = /**
         * @param {?} id
         * @param {?=} node
         * @return {?}
         */
            function (id, node) {
                if (node === void 0) {
                    node = this.tree.nodes;
                }
                if (node.id === id)
                    return node;
                /** @type {?} */
                var keys = Object.keys(node.children);
                for (var i = 0; i < keys.length; i++) {
                    if (typeof node.children[keys[i]] == 'object') {
                        /** @type {?} */
                        var obj = this.findNodeByIdHelper(id, node.children[keys[i]]);
                        if (obj != null)
                            return obj;
                    }
                }
                return null;
            };
        /**
         * @param {?} node
         * @return {?}
         */
        NodeService.prototype.foldRecursively = /**
         * @param {?} node
         * @return {?}
         */
            function (node) {
                var _this = this;
                /** @type {?} */
                var children = node.children;
                Object.keys(children).map(function (child) {
                    if (!children.hasOwnProperty(child) || !children[child].isExpanded) {
                        return null;
                    }
                    _this.foldRecursively(children[child]);
                    //todo put this getElById into one func (curr inside node.component.ts + fm.component.ts) - this won't be maintainable
                    document.getElementById('tree_' + children[child].pathToNode).classList.add('deselected');
                    children[child].isExpanded = false;
                });
            };
        /**
         * @return {?}
         */
        NodeService.prototype.foldAll = /**
         * @return {?}
         */
            function () {
                this.foldRecursively(this.tree.nodes);
            };
        Object.defineProperty(NodeService.prototype, "currentPath", {
            get: /**
             * @return {?}
             */ function () {
                return this._path;
            },
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
                this._path = value;
            },
            enumerable: true,
            configurable: true
        });
        NodeService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        /** @nocollapse */
        NodeService.ctorParameters = function () {
            return [
                { type: i4.HttpClient },
                { type: i3.Store }
            ];
        };
        /** @nocollapse */ NodeService.ngInjectableDef = i0.defineInjectable({ factory: function NodeService_Factory() { return new NodeService(i0.inject(i4.HttpClient), i0.inject(i3.Store)); }, token: NodeService, providedIn: "root" });
        return NodeService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NodeClickedService = (function () {
        function NodeClickedService(ngxSmartModalService, nodeService, store, http) {
            this.ngxSmartModalService = ngxSmartModalService;
            this.nodeService = nodeService;
            this.store = store;
            this.http = http;
        }
        /**
         * @param {?} node
         * @return {?}
         */
        NodeClickedService.prototype.startDownload = /**
         * @param {?} node
         * @return {?}
         */
            function (node) {
                /** @type {?} */
                var parameters = this.parseParams({ path: node.id });
                this.reachServer('download', this.tree.config.api.downloadFile + parameters);
            };
        /**
         * @param {?} node
         * @return {?}
         */
        NodeClickedService.prototype.initDelete = /**
         * @param {?} node
         * @return {?}
         */
            function (node) {
                var _this = this;
                this.sideEffectHelper('Delete', { path: node.id }, 'delete', this.tree.config.api.deleteFile, function () { return _this.successWithModalClose(); });
            };
        /**
         * @param {?} input
         * @return {?}
         */
        NodeClickedService.prototype.searchForString = /**
         * @param {?} input
         * @return {?}
         */
            function (input) {
                var _this = this;
                this.sideEffectHelper('Search', { query: input }, 'get', this.tree.config.api.searchFiles, function (res) { return _this.searchSuccess(input, res); });
            };
        /**
         * @param {?} currentParent
         * @param {?} newDirName
         * @return {?}
         */
        NodeClickedService.prototype.createFolder = /**
         * @param {?} currentParent
         * @param {?} newDirName
         * @return {?}
         */
            function (currentParent, newDirName) {
                this.sideEffectHelper('Create Folder', { dirName: newDirName, parentPath: currentParent === 0 ? null : currentParent }, 'post', this.tree.config.api.createFolder);
            };
        /**
         * @param {?} id
         * @param {?} newName
         * @return {?}
         */
        NodeClickedService.prototype.rename = /**
         * @param {?} id
         * @param {?} newName
         * @return {?}
         */
            function (id, newName) {
                var _this = this;
                this.sideEffectHelper('Rename', { path: id, newName: newName }, 'post', this.tree.config.api.renameFile, function () { return _this.successWithModalClose(); });
            };
        /**
         * @param {?} name
         * @param {?} parameters
         * @param {?} httpMethod
         * @param {?} apiURL
         * @param {?=} successMethod
         * @param {?=} failMethod
         * @return {?}
         */
        NodeClickedService.prototype.sideEffectHelper = /**
         * @param {?} name
         * @param {?} parameters
         * @param {?} httpMethod
         * @param {?} apiURL
         * @param {?=} successMethod
         * @param {?=} failMethod
         * @return {?}
         */
            function (name, parameters, httpMethod, apiURL, successMethod, failMethod) {
                var _this = this;
                if (successMethod === void 0) {
                    successMethod = function (a) { return _this.actionSuccess(a); };
                }
                if (failMethod === void 0) {
                    failMethod = function (a, b) { return _this.actionFailed(a, b); };
                }
                /** @type {?} */
                var params = this.parseParams(parameters);
                this.ngxSmartModalService.getModal('waitModal').open();
                this.reachServer(httpMethod, apiURL + params)
                    .subscribe(function (a) { return successMethod(a); }, function (err) { return failMethod(name, err); });
            };
        /**
         * @param {?} method
         * @param {?} apiUrl
         * @param {?=} data
         * @return {?}
         */
        NodeClickedService.prototype.reachServer = /**
         * @param {?} method
         * @param {?} apiUrl
         * @param {?=} data
         * @return {?}
         */
            function (method, apiUrl, data) {
                if (data === void 0) {
                    data = {};
                }
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
            };
        /**
         * @param {?} params
         * @return {?}
         */
        NodeClickedService.prototype.parseParams = /**
         * @param {?} params
         * @return {?}
         */
            function (params) {
                /** @type {?} */
                var query = '?';
                Object.keys(params).filter(function (item) { return params[item] !== null; }).map(function (key) {
                    query += key + '=' + params[key] + '&';
                });
                return query.slice(0, -1);
            };
        /**
         * @return {?}
         */
        NodeClickedService.prototype.successWithModalClose = /**
         * @return {?}
         */
            function () {
                this.actionSuccess();
                document.getElementById('side-view').classList.remove('selected');
            };
        /**
         * @param {?} input
         * @param {?} data
         * @return {?}
         */
        NodeClickedService.prototype.searchSuccess = /**
         * @param {?} input
         * @param {?} data
         * @return {?}
         */
            function (input, data) {
                /** @type {?} */
                var obj = {
                    searchString: input,
                    response: data
                };
                this.actionSuccess();
                this.ngxSmartModalService.setModalData(obj, 'searchModal', true);
                this.ngxSmartModalService.getModal('searchModal').open();
            };
        /**
         * @param {?=} response
         * @return {?}
         */
        NodeClickedService.prototype.actionSuccess = /**
         * @param {?=} response
         * @return {?}
         */
            function (response) {
                if (response === void 0) {
                    response = '';
                }
                this.nodeService.refreshCurrentPath();
                this.ngxSmartModalService.getModal('waitModal').close();
            };
        /**
         * @param {?} name
         * @param {?} error
         * @return {?}
         */
        NodeClickedService.prototype.actionFailed = /**
         * @param {?} name
         * @param {?} error
         * @return {?}
         */
            function (name, error) {
                this.ngxSmartModalService.getModal('waitModal').close();
                this.ngxSmartModalService.getModal('errorModal').open();
                console.warn('[NodeClickedService] Action "' + name + '" failed', error);
            };
        NodeClickedService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] },
        ];
        /** @nocollapse */
        NodeClickedService.ctorParameters = function () {
            return [
                { type: i1.NgxSmartModalService },
                { type: NodeService },
                { type: i3.Store },
                { type: i4.HttpClient }
            ];
        };
        /** @nocollapse */ NodeClickedService.ngInjectableDef = i0.defineInjectable({ factory: function NodeClickedService_Factory() { return new NodeClickedService(i0.inject(i1.NgxSmartModalService), i0.inject(NodeService), i0.inject(i3.Store), i0.inject(i4.HttpClient)); }, token: NodeClickedService, providedIn: "root" });
        return NodeClickedService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var FileManagerComponent = (function () {
        function FileManagerComponent(store, nodeService, nodeClickedService, ngxSmartModalService, translate) {
            this.store = store;
            this.nodeService = nodeService;
            this.nodeClickedService = nodeClickedService;
            this.ngxSmartModalService = ngxSmartModalService;
            this.translate = translate;
            this.isPopup = false;
            this.itemClicked = new i0.EventEmitter();
            this._language = 'en';
            this.sideMenuClosed = true;
            this.fmOpen = false;
            this.newDialog = false;
            translate.setDefaultLang('en');
        }
        Object.defineProperty(FileManagerComponent.prototype, "language", {
            get: /**
             * @return {?}
             */ function () {
                return this._language;
            },
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
                this._language = value;
                this.translate.use(this.language);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        FileManagerComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                // @ts-ignore
                window.console = window.console || {};
                window.console.log = window.console.log || function () {
                };
                this.nodeService.tree = this.tree;
                this.nodeClickedService.tree = this.tree;
                this.nodeService.startManagerAt(this.tree.currentPath);
                this.store
                    .pipe(i3.select(function (state) { return state.fileManagerState.isLoading; }))
                    .subscribe(function (data) {
                    _this.loading = data;
                });
                this.store
                    .pipe(i3.select(function (state) { return state.fileManagerState.selectedNode; }))
                    .subscribe(function (node) {
                    if (!node) {
                        return;
                    }
                    // fixed highlighting error when closing node but not changing path
                    if ((node.isExpanded && node.pathToNode !== _this.nodeService.currentPath) && !node.stayOpen) {
                        return;
                    }
                    _this.handleFileManagerClickEvent({ type: 'select', node: node });
                });
            };
        /**
         * @param {?} event
         * @return {?}
         */
        FileManagerComponent.prototype.onItemClicked = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.itemClicked.emit(event);
            };
        /**
         * @param {?} data
         * @return {?}
         */
        FileManagerComponent.prototype.searchClicked = /**
         * @param {?} data
         * @return {?}
         */
            function (data) {
                /** @type {?} */
                var node = this.nodeService.findNodeById(data.id);
                this.ngxSmartModalService.getModal('searchModal').close();
                this.store.dispatch({ type: SET_SELECTED_NODE, payload: node });
            };
        /**
         * @param {?} event
         * @return {?}
         */
        FileManagerComponent.prototype.handleFileManagerClickEvent = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
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
                        var parentId = this.nodeService.findNodeByPath(this.nodeService.currentPath).id;
                        this.nodeClickedService.createFolder(parentId, event.payload);
                        return this.onItemClicked({
                            type: event.type,
                            parentId: parentId,
                            newDirName: event.payload
                        });
                }
            };
        /**
         * @param {?} node
         * @param {?=} closing
         * @return {?}
         */
        FileManagerComponent.prototype.nodeClickHandler = /**
         * @param {?} node
         * @param {?=} closing
         * @return {?}
         */
            function (node, closing) {
                if (node.name === 'root') {
                    return;
                }
                if (closing) {
                    /** @type {?} */
                    var parentNode = this.nodeService.findNodeByPath(this.nodeService.currentPath);
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
            };
        // todo stay DRY!
        /**
         * @param {?} node
         * @return {?}
         */
        FileManagerComponent.prototype.highlightSelected = /**
         * @param {?} node
         * @return {?}
         */
            function (node) {
                /** @type {?} */
                var pathToNode = node.pathToNode;
                if (pathToNode.length === 0) {
                    pathToNode = 'root';
                }
                /** @type {?} */
                var treeElement = this.getElementById(pathToNode, 'tree_');
                /** @type {?} */
                var fcElement = this.getElementById(pathToNode, 'fc_');
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
                var pathToParent = node.pathToParent;
                if (pathToParent === null || node.pathToNode === this.nodeService.currentPath) {
                    return;
                }
                if (pathToParent.length === 0) {
                    pathToParent = 'root';
                }
                /** @type {?} */
                var parentElement = this.getElementById(pathToParent, 'tree_');
                if (!parentElement) {
                    console.warn('[File Manager] failed to find requested parent node for path:', pathToParent);
                    return;
                }
                this.highilghtChildElement(parentElement);
            };
        /**
         * @param {?} el
         * @param {?=} light
         * @return {?}
         */
        FileManagerComponent.prototype.highilghtChildElement = /**
         * @param {?} el
         * @param {?=} light
         * @return {?}
         */
            function (el, light) {
                if (light === void 0) {
                    light = false;
                }
                el.children[0] // appnode div wrapper
                    .children[0] // ng template first item
                    .classList.add('highlighted');
                if (light)
                    el.children[0]
                        .children[0]
                        .classList.add('light');
            };
        /**
         * @param {?} id
         * @param {?=} prefix
         * @return {?}
         */
        FileManagerComponent.prototype.getElementById = /**
         * @param {?} id
         * @param {?=} prefix
         * @return {?}
         */
            function (id, prefix) {
                if (prefix === void 0) {
                    prefix = '';
                }
                /** @type {?} */
                var fullId = prefix + id;
                return document.getElementById(fullId);
            };
        /**
         * @param {?} className
         * @return {?}
         */
        FileManagerComponent.prototype.removeClass = /**
         * @param {?} className
         * @return {?}
         */
            function (className) {
                Array.from(document.getElementsByClassName(className))
                    .map(function (el) { return el.classList.remove(className); });
            };
        /**
         * @return {?}
         */
        FileManagerComponent.prototype.fmShowHide = /**
         * @return {?}
         */
            function () {
                this.fmOpen = !this.fmOpen;
            };
        /**
         * @return {?}
         */
        FileManagerComponent.prototype.backdropClicked = /**
         * @return {?}
         */
            function () {
                // todo get rid of this ugly workaround
                // todo fire userCanceledLoading event
                this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
            };
        /**
         * @param {?} event
         * @return {?}
         */
        FileManagerComponent.prototype.handleUploadDialog = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.newDialog = event;
            };
        FileManagerComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'fm-file-manager',
                        template: "<ng-container *ngIf=\"isPopup; then itIsPopup else showContent\"></ng-container>\n\n<ng-template #itIsPopup>\n  <div *ngIf=\"!fmOpen\">\n    <button class=\"button big\" (click)=\"fmShowHide()\" translate=\"\">Open file manager</button>\n  </div>\n  <div class=\"file-manager-backdrop\" *ngIf=\"fmOpen\">\n    <div class=\"fmModalInside\">\n      <div *ngIf=\"fmOpen; then showContent\"></div>\n    </div>\n  </div>\n</ng-template>\n\n<ng-template #showContent>\n  <div class=\"content\">\n    <div class=\"file-manager-navbar\">\n      <div class=\"path\">\n        <app-nav-bar></app-nav-bar>\n      </div>\n\n      <div class=\"navigation\">\n        <app-navigation>\n          <div class=\"button close\" (click)=\"fmShowHide()\" *ngIf=\"isPopup\">\n            <i class=\"fas fa-2x fa-times\"></i>\n          </div>\n        </app-navigation>\n      </div>\n    </div>\n\n    <div class=\"holder\">\n      <div class=\"file-manager-left\">\n        <app-tree [treeModel]=\"tree\">\n          <ng-template let-nodes>\n            <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes}\"\n                          [ngTemplateOutlet]=\"iconTemplate ? iconTemplate : defaultIconTemplate\">\n            </ng-container>\n          </ng-template>\n        </app-tree>\n      </div>\n\n      <div class=\"right\">\n        <app-folder-content\n          [treeModel]=\"tree\"\n          (openUploadDialog)=\"handleUploadDialog($event)\"\n          [folderContentTemplate]=\"folderContentTemplate ? folderContentTemplate : defaultFolderContentTemplate\"\n          [folderContentNewTemplate]=\"folderContentNewTemplate ? folderContentNewTemplate : defaultFolderContentNewTemplate\"\n          [folderContentBackTemplate]=\"folderContentBackTemplate ? folderContentBackTemplate : defaultFolderContentBackTemplate\">\n        </app-folder-content>\n      </div>\n\n      <app-side-view id=\"side-view\"\n                     [node]=\"selectedNode\"\n                     [sideViewTemplate]=\"sideViewTemplate ? sideViewTemplate : defaultSideViewTemplate\"\n                     [allowFolderDownload]=\"tree.config.options.allowFolderDownload\"\n                     (clickEvent)=\"handleFileManagerClickEvent($event)\">\n      </app-side-view>\n    </div>\n  </div>\n\n  <app-upload *ngIf=\"newDialog\"\n              [openDialog]=\"newDialog\"\n              (closeDialog)=\"handleUploadDialog(false)\"\n              (createDir)=\"handleFileManagerClickEvent({type: 'createFolder', payload: $event})\">\n  </app-upload>\n\n  <app-loading-overlay\n    *ngIf=\"loading\"\n    [loadingOverlayTemplate]=\"loadingOverlayTemplate ? loadingOverlayTemplate : defaultLoadingOverlayTemplate\">\n  </app-loading-overlay>\n</ng-template>\n\n<ng-template let-node #defaultIconTemplate>\n  <div class=\"file-manager-node\" style=\"display: inline-block; padding: 3px\">\n    <div *ngIf=\"node.isFolder; then itIsFolder else showFile\"></div>\n\n    <ng-template #itIsFolder>\n      <div *ngIf=\"node.isExpanded; then isFolderExpanded else isFolderClosed\"></div>\n    </ng-template>\n\n    <ng-template #showFile><i class=\"fas fa-file child\"></i></ng-template>\n    <ng-template #isFolderExpanded><i class=\"fas fa-folder-open child\"></i></ng-template>\n    <ng-template #isFolderClosed><i class=\"fas fa-folder child\"></i></ng-template>\n\n    <span>{{node.name}}</span>\n  </div>\n</ng-template>\n<ng-template let-node #defaultFolderContentTemplate>\n  <div class=\"file-manager-item\">\n    <div class=\"file-preview\">\n      <div *ngIf=\"node.isFolder; then itIsFolder else showFile\"></div>\n      <ng-template #itIsFolder><i class=\"fas fa-3x fa-folder child\"></i></ng-template>\n      <ng-template #showFile><i class=\"fas fa-3x fa-file child\"></i></ng-template>\n    </div>\n    <div class=\"file-name\">\n      {{node.name}}\n    </div>\n  </div>\n</ng-template>\n<ng-template #defaultFolderContentNewTemplate>\n  <div class=\"file-manager-item\">\n    <div class=\"file-preview\" style=\"width: 100%; height:100%\">\n      <i class=\"fas fa-3x fa-plus child\" style=\"line-height: 2\"></i>\n    </div>\n  </div>\n</ng-template>\n<ng-template let-node #defaultFolderContentBackTemplate>\n  <div class=\"file-manager-item\">\n    <div class=\"file-preview\" style=\"width: 100%; height:100%\">\n      <i class=\"fas fa-2x fa-ellipsis-h\" style=\"line-height: 5\"></i>\n    </div>\n  </div>\n</ng-template>\n<ng-template let-timeoutMessage #defaultLoadingOverlayTemplate>\n  <div class=\"file-manager-backdrop loading\" (click)=\"backdropClicked()\">\n    <div class=\"file-manager-error\" *ngIf=\"timeoutMessage\">{{timeoutMessage | translate}}</div>\n  </div>\n  <div class=\"spinner\">\n    <i class=\"fas fa-5x fa-spin fa-sync-alt\"></i>\n  </div>\n</ng-template>\n<ng-template let-node #defaultSideViewTemplate>\n  <div style=\"position: absolute; bottom: 0; width: 100%; margin: 5px auto\">\n    <span *ngIf=\"node.isFolder\" translate>No data available for this folder</span>\n    <span *ngIf=\"!node.isFolder\" translate>No data available for this file</span>\n  </div>\n</ng-template>\n\n<ngx-smart-modal identifier=\"renameModal\" [dismissable]=\"false\" [closable]=\"false\" *ngIf=\"selectedNode\" #renameModal>\n  <h2 class=\"modal-title\" translate>\n    Rename file\n  </h2>\n  <p class=\"rename-name\" translate>\n    Old name\n  </p>\n  <span style=\"margin: 8px\">{{selectedNode.name}}</span>\n  <p class=\"rename-name\" translate>\n    New name\n  </p>\n  <input placeholder=\"New name\" type=\"text\" class=\"rename-input\" [value]=\"selectedNode.name\" #renameInput\n         (keyup.enter)=\"handleFileManagerClickEvent({type: 'rename', value: renameInput.value})\"\n         onclick=\"this.select();\">\n  <br>\n\n  <div class=\"rename-button\">\n    <button class=\"button big\" translate\n            (click)=\"handleFileManagerClickEvent({type: 'rename', value: renameInput.value})\"\n            [disabled]=\"renameInput.value === selectedNode.name || renameInput.value.length === 0\">\n      Rename\n    </button>\n    <button class=\"button big\" (click)=\"renameModal.close()\" translate>\n      Cancel\n    </button>\n  </div>\n\n</ngx-smart-modal>\n<ngx-smart-modal *ngIf=\"selectedNode\" identifier=\"confirmDeleteModal\" #deleteModal\n                 [dismissable]=\"false\" [closable]=\"false\">\n  <h2 class=\"modal-title\">\n    <span translate>You are trying to delete following </span>\n    <span *ngIf=\"selectedNode.isFolder\" translate>folder</span>\n    <span *ngIf=\"!selectedNode.isFolder\" translate>file</span>\n  </h2>\n\n  <div style=\"width: 100%; margin: 5px auto; text-align: center\">{{selectedNode.name}}</div>\n\n  <div class=\"rename-button\">\n    <button class=\"button big\" (click)=\"handleFileManagerClickEvent({type: 'remove'})\">\n      <span translate>Yes, delete this </span>\n      <span *ngIf=\"selectedNode.isFolder\" translate>folder</span>\n      <span *ngIf=\"!selectedNode.isFolder\" translate>file</span>\n    </button>\n    <button class=\"button big \" (click)=\"deleteModal.close()\" translate>\n      Cancel\n    </button>\n  </div>\n</ngx-smart-modal>\n<ngx-smart-modal identifier=\"searchModal\" #searchModal [closable]=\"true\">\n  <h2 class=\"modal-title\" style=\"margin-bottom: 2px\" translate\n      *ngIf=\"searchModal.hasData() && searchModal.getData().response.length !== 0\">\n    Search results for\n  </h2>\n  <h2 class=\"modal-title\" style=\"margin-bottom: 2px\" translate\n      *ngIf=\"!searchModal.hasData() || searchModal.getData().response.length === 0\">\n    No results found for\n  </h2>\n  <div style=\"text-align: center\" *ngIf=\"searchModal.hasData()\">{{searchModal.getData().searchString}}</div>\n\n  <div *ngIf=\"searchModal.hasData() && searchModal.getData().response.length !== 0\">\n    <table style=\"margin: 0 auto\">\n      <tr>\n        <td class=\"table-item table-head\" translate>File name</td>\n        <td class=\"table-item-short table-head\" translate>Size</td>\n      </tr>\n      <tr *ngFor=\"let item of searchModal.getData().response\" (click)=\"searchClicked(item)\">\n        <td style=\"cursor: pointer\">\n          <ng-container *ngIf=\"item.fileCategory === 'D'; else file\">\n            <i class=\"fas fa-folder search-output-icon\"></i>\n          </ng-container>\n          <ng-template #file>\n            <i class=\"fas fa-file search-output-icon\"></i>\n          </ng-template>\n          <span style=\"text-overflow: ellipsis\">{{item.name}}</span>\n        </td>\n        <td class=\"table-item-short\">{{item.size}}</td>\n      </tr>\n    </table>\n  </div>\n</ngx-smart-modal>\n<ngx-smart-modal identifier=\"waitModal\" [closable]=\"false\" [dismissable]=\"false\" [escapable]=\"false\">\n  <h2 class=\"modal-title\" style=\"margin-top: 20px\">\n    {{'Processing request' | translate}}...\n  </h2>\n\n  <div style=\"text-align: center; height: 70px\">\n    <i class=\"fas fa-spinner fa-spin fa-4x\"></i>\n  </div>\n</ngx-smart-modal>\n<ngx-smart-modal identifier=\"errorModal\" [closable]=\"true\">\n  <h2 class=\"modal-title\" style=\"margin-top: 20px\">\n    {{'Something went wrong with your request' | translate}}...\n  </h2>\n</ngx-smart-modal>\n",
                        styles: [".content{height:100%;min-width:850px}.holder{display:flex;height:calc(100% - 75px)}.path{margin:auto 0;display:block}.navigation{margin:auto 0;display:flex}.navigation .button{margin:0 10px;padding:0;position:relative}.right{width:100%;position:relative;overflow:auto}.file-name{width:100px;height:25px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.file-preview{margin:auto}.file-preview i{line-height:1.5}.spinner{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);cursor:progress}.rename-button{margin:20px auto;display:block;text-align:center}.modal-title{margin-top:5px;text-align:center}.search-output{margin:15px 0}.search-output-icon{margin:2px 5px}.table-item{width:80%}.table-item-short{width:20%;text-align:right}"],
                        encapsulation: i0.ViewEncapsulation.None
                    },] },
        ];
        /** @nocollapse */
        FileManagerComponent.ctorParameters = function () {
            return [
                { type: i3.Store },
                { type: NodeService },
                { type: NodeClickedService },
                { type: i1.NgxSmartModalService },
                { type: core.TranslateService }
            ];
        };
        FileManagerComponent.propDecorators = {
            iconTemplate: [{ type: i0.Input }],
            modalTemplate: [{ type: i0.Input }],
            folderContentTemplate: [{ type: i0.Input }],
            folderContentBackTemplate: [{ type: i0.Input }],
            folderContentNewTemplate: [{ type: i0.Input }],
            loadingOverlayTemplate: [{ type: i0.Input }],
            sideViewTemplate: [{ type: i0.Input }],
            tree: [{ type: i0.Input }],
            isPopup: [{ type: i0.Input }],
            itemClicked: [{ type: i0.Output }],
            language: [{ type: i0.Input }]
        };
        return FileManagerComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var FolderContentComponent = (function () {
        function FolderContentComponent(nodeService, store) {
            this.nodeService = nodeService;
            this.store = store;
            this.openUploadDialog = new i0.EventEmitter();
            this.obj = Object;
        }
        /**
         * @return {?}
         */
        FolderContentComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.store
                    .pipe(i3.select(function (state) { return state.fileManagerState.path; }))
                    .subscribe(function (path) {
                    _this.nodes = _this.nodeService.findNodeByPath(path);
                });
            };
        /**
         * @return {?}
         */
        FolderContentComponent.prototype.newClickedAction = /**
         * @return {?}
         */
            function () {
                this.openUploadDialog.emit(true);
            };
        FolderContentComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-folder-content',
                        template: "<div class=\"item-holder\">\n  <ng-container *ngIf=\"nodes.id !== 0\">\n    <app-node [node]=nodes id=\"{{nodes.pathToNode}}\">\n      <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes}\"\n                    [ngTemplateOutlet]=\"folderContentBackTemplate\">\n      </ng-container>\n    </app-node>\n  </ng-container>\n\n  <ng-container *ngFor=\"let node of obj.keys(nodes.children)\">\n    <app-node [node]=\"nodes.children[node]\"\n              id=\"fc_{{nodes.children[node].pathToNode}}\">\n      <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes.children[node]}\"\n                    [ngTemplateOutlet]=\"folderContentTemplate\">\n      </ng-container>\n    </app-node>\n  </ng-container>\n\n  <div class=\"new\" (click)=\"newClickedAction()\">\n    <ng-container [ngTemplateOutlet]=\"folderContentNewTemplate\"></ng-container>\n  </div>\n</div>\n",
                        styles: [".item-holder{box-sizing:border-box;display:flex;flex-flow:wrap}.item-holder .new{display:inline}"]
                    },] },
        ];
        /** @nocollapse */
        FolderContentComponent.ctorParameters = function () {
            return [
                { type: NodeService },
                { type: i3.Store }
            ];
        };
        FolderContentComponent.propDecorators = {
            folderContentTemplate: [{ type: i0.Input }],
            folderContentBackTemplate: [{ type: i0.Input }],
            folderContentNewTemplate: [{ type: i0.Input }],
            treeModel: [{ type: i0.Input }],
            openUploadDialog: [{ type: i0.Output }]
        };
        return FolderContentComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var TreeComponent = (function () {
        function TreeComponent(nodeService, store) {
            this.nodeService = nodeService;
            this.store = store;
            this.currentTreeLevel = '';
        }
        /**
         * @return {?}
         */
        TreeComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.nodes = this.treeModel.nodes;
                //todo move this store to proper place
                this.store
                    .pipe(i3.select(function (state) { return state.fileManagerState.path; }))
                    .subscribe(function (path) {
                    _this.nodeService.getNodes(path);
                    _this.currentTreeLevel = _this.treeModel.currentPath;
                    return _this.treeModel.currentPath = path;
                });
            };
        /**
         * @return {?}
         */
        TreeComponent.prototype.ngAfterViewInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.store
                    .pipe(i3.select(function (state) { return state.fileManagerState.path; }))
                    .pipe(operators.first())
                    .subscribe(function (path) {
                    /** @type {?} */
                    var nodes = _this.nodeService.findNodeByPath(path);
                    _this.store.dispatch({ type: SET_SELECTED_NODE, payload: nodes });
                });
            };
        TreeComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-tree',
                        template: "<app-node-lister [showFiles]=\"treeModel.config.options.showFilesInsideTree\"\n                 [nodes]=\"{children: nodes}\">\n  <ng-template let-nodes>\n    <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes}\" [ngTemplateOutlet]=\"templateRef\"></ng-container>\n  </ng-template>\n</app-node-lister>\n",
                        styles: [""]
                    },] },
        ];
        /** @nocollapse */
        TreeComponent.ctorParameters = function () {
            return [
                { type: NodeService },
                { type: i3.Store }
            ];
        };
        TreeComponent.propDecorators = {
            templateRef: [{ type: i0.ContentChild, args: [i0.TemplateRef,] }],
            treeModel: [{ type: i0.Input }]
        };
        return TreeComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NodeListerComponent = (function () {
        function NodeListerComponent() {
            this.obj = Object;
        }
        /**
         * @return {?}
         */
        NodeListerComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
            };
        NodeListerComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-node-lister',
                        template: "<ul class=\"node-lister-flist\">\n  <!--In order to avoid having to create that extra div, we can instead use ng-container directive-->\n  <ng-container *ngFor=\"let node of obj.keys(nodes)\">\n    <li class=\"node-lister-list-item\" *ngIf=\"nodes[node].isFolder || showFiles\">\n\n      <app-node class=\"node-lister-app-node\" [node]=\"nodes[node]\" id=\"tree_{{nodes[node].id === 0 ? 'root' : nodes[node].pathToNode}}\">\n        <ng-container [ngTemplateOutletContext]=\"{$implicit: (nodes[node])}\"\n                      [ngTemplateOutlet]=\"templateRef\">\n        </ng-container>\n      </app-node>\n\n      <app-node-lister class=\"node-lister\" *ngIf=\"obj.keys(nodes[node].children).length > 0\"\n                       [showFiles]=\"showFiles\" [nodes]=\"nodes[node].children\">\n        <ng-template let-nodes>\n          <ng-container [ngTemplateOutletContext]=\"{$implicit: (nodes)}\"\n                        [ngTemplateOutlet]=\"templateRef\">\n          </ng-container>\n        </ng-template>\n      </app-node-lister>\n    </li>\n  </ng-container>\n</ul>\n",
                        styles: [".node-lister-flist{margin:0 0 0 1em;padding:0;list-style:none;white-space:nowrap}.node-lister-list-item{list-style:none;line-height:1.2em;font-size:1em;display:inline}.node-lister-list-item .node-lister-app-node.deselected+.node-lister ul{display:none}"]
                    },] },
        ];
        /** @nocollapse */
        NodeListerComponent.ctorParameters = function () { return []; };
        NodeListerComponent.propDecorators = {
            templateRef: [{ type: i0.ContentChild, args: [i0.TemplateRef,] }],
            nodes: [{ type: i0.Input }],
            showFiles: [{ type: i0.Input }]
        };
        return NodeListerComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NodeComponent = (function () {
        function NodeComponent(store, nodeService, nodeClickedService) {
            this.store = store;
            this.nodeService = nodeService;
            this.nodeClickedService = nodeClickedService;
            this.isSingleClick = true;
        }
        /**
         * @param {?} event
         * @return {?}
         */
        NodeComponent.prototype.method1CallForClick = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                var _this = this;
                event.preventDefault();
                this.isSingleClick = true;
                setTimeout(function () {
                    if (_this.isSingleClick) {
                        _this.showMenu();
                    }
                }, 200);
            };
        /**
         * @param {?} event
         * @return {?}
         */
        NodeComponent.prototype.method2CallForDblClick = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                event.preventDefault();
                this.isSingleClick = false;
                this.open();
            };
        /**
         * @return {?}
         */
        NodeComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
            };
        /**
         * @return {?}
         */
        NodeComponent.prototype.open = /**
         * @return {?}
         */
            function () {
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
            };
        /**
         * @return {?}
         */
        NodeComponent.prototype.showMenu = /**
         * @return {?}
         */
            function () {
                this.store.dispatch({ type: SET_SELECTED_NODE, payload: this.node });
            };
        /**
         * @return {?}
         */
        NodeComponent.prototype.toggleNodeExpanded = /**
         * @return {?}
         */
            function () {
                this.node.isExpanded = !this.node.isExpanded;
            };
        /**
         * @return {?}
         */
        NodeComponent.prototype.setNodeSelectedState = /**
         * @return {?}
         */
            function () {
                if (!this.node.isExpanded) {
                    document.getElementById('tree_' + this.node.pathToNode).classList.add('deselected');
                    this.nodeService.foldRecursively(this.node);
                    this.store.dispatch({ type: SET_PATH, payload: this.node.pathToParent });
                }
                else {
                    document.getElementById('tree_' + this.node.pathToNode).classList.remove('deselected');
                }
            };
        NodeComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-node',
                        template: "<div #customTemplate (dblclick)=\"method2CallForDblClick($event)\" (click)=\"method1CallForClick($event)\">\n  <ng-content></ng-content>\n</div>\n",
                        styles: [""]
                    },] },
        ];
        /** @nocollapse */
        NodeComponent.ctorParameters = function () {
            return [
                { type: i3.Store },
                { type: NodeService },
                { type: NodeClickedService }
            ];
        };
        NodeComponent.propDecorators = {
            node: [{ type: i0.Input }]
        };
        return NodeComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var MapToIterablePipe = (function () {
        function MapToIterablePipe() {
        }
        /**
         * @param {?} dict
         * @return {?}
         */
        MapToIterablePipe.prototype.transform = /**
         * @param {?} dict
         * @return {?}
         */
            function (dict) {
                /** @type {?} */
                var a = [];
                for (var key in dict) {
                    if (dict.hasOwnProperty(key)) {
                        a.push({ key: key, val: dict[key] });
                    }
                }
                return a;
            };
        MapToIterablePipe.decorators = [
            { type: i0.Pipe, args: [{
                        name: 'mapToIterablePipe'
                    },] },
        ];
        return MapToIterablePipe;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NavBarComponent = (function () {
        function NavBarComponent(store, nodeService) {
            this.store = store;
            this.nodeService = nodeService;
        }
        /**
         * @return {?}
         */
        NavBarComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.store
                    .pipe(i3.select(function (state) { return state.fileManagerState.path; }))
                    .subscribe(function (data) {
                    _this.nodeService.currentPath = data;
                    _this.currentPath = data.split('/');
                });
            };
        /**
         * @param {?} path
         * @param {?} index
         * @return {?}
         */
        NavBarComponent.prototype.onClick = /**
         * @param {?} path
         * @param {?} index
         * @return {?}
         */
            function (path, index) {
                /** @type {?} */
                var newPath = path.slice(0, index + 1).join('/');
                this.store.dispatch({ type: SET_PATH, payload: newPath });
            };
        NavBarComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-nav-bar',
                        template: "<div>\n  >> <span *ngFor=\"let to of currentPath; let i = index\">\n  <a class=\"link\" href=\"#\" (click)=\"onClick(currentPath, i)\">\n    <div *ngIf=\"to === '' || to === 'root'; then icon else name\"></div>\n    <ng-template #icon><i class=\"fas fa-home\"></i></ng-template>\n    <ng-template #name>{{to}}</ng-template>\n  </a> /\n  </span>\n</div>\n",
                        styles: [""]
                    },] },
        ];
        /** @nocollapse */
        NavBarComponent.ctorParameters = function () {
            return [
                { type: i3.Store },
                { type: NodeService }
            ];
        };
        return NavBarComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var initialState = {
        path: '',
        isLoading: true,
        selectedNode: null
    };
    /**
     * @param {?=} state
     * @param {?=} action
     * @return {?}
     */
    function stateReducer(state, action) {
        if (state === void 0) {
            state = initialState;
        }
        // console.log('Previous state: ', state);
        // console.log('ACTION type: ', action.type);
        // console.log('ACTION payload: ', action.payload);
        switch (action.type) {
            case SET_PATH:
                if (state.path === action.payload) {
                    return state;
                }
                return tslib_1.__assign({}, state, { path: action.payload, isLoading: true });
            case SET_LOADING_STATE:
                return tslib_1.__assign({}, state, { isLoading: action.payload });
            case SET_SELECTED_NODE:
                return tslib_1.__assign({}, state, { selectedNode: action.payload });
            default:
                return initialState;
        }
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var reducers = {
        fileManagerState: stateReducer
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var LoadingOverlayComponent = (function () {
        function LoadingOverlayComponent() {
        }
        // todo unsubscribe from 'list' event - now we are only dismissing this component
        /**
         * @return {?}
         */
        LoadingOverlayComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                rxjs.timer(2000).subscribe(function () {
                    _this.timeoutMessage = utils._('Troubles with loading? Click anywhere to cancel loading');
                });
            };
        LoadingOverlayComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-loading-overlay',
                        template: "<ng-container\n  [ngTemplateOutletContext]=\"{$implicit: timeoutMessage}\"\n  [ngTemplateOutlet]=\"loadingOverlayTemplate\">\n</ng-container>\n",
                        styles: [""]
                    },] },
        ];
        LoadingOverlayComponent.propDecorators = {
            loadingOverlayTemplate: [{ type: i0.Input }]
        };
        return LoadingOverlayComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var FileSizePipe = (function () {
        function FileSizePipe() {
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
        FileSizePipe.prototype.transform = /**
         * @param {?=} bytes
         * @param {?=} precision
         * @return {?}
         */
            function (bytes, precision) {
                if (bytes === void 0) {
                    bytes = 0;
                }
                if (precision === void 0) {
                    precision = 2;
                }
                if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes))
                    return '?';
                /** @type {?} */
                var unit = 0;
                while (bytes >= 1024) {
                    bytes /= 1024;
                    unit++;
                }
                return bytes.toFixed(+precision) + ' ' + this.units[unit];
            };
        FileSizePipe.decorators = [
            { type: i0.Pipe, args: [{ name: 'fileSize' },] },
        ];
        return FileSizePipe;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var UploadComponent = (function () {
        function UploadComponent(http, nodeService) {
            this.http = http;
            this.nodeService = nodeService;
            this.closeDialog = new i0.EventEmitter();
            this.createDir = new i0.EventEmitter();
            this.newFolder = false;
            this.counter = 0;
        }
        /**
         * @return {?}
         */
        UploadComponent.prototype.ngAfterViewInit = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.uploader = new fineUploader.FineUploader({
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
                        onSubmitted: function () { return _this.counter++; },
                        onCancel: function () {
                            _this.counter < 0 ? console.warn('wtf?') : _this.counter--;
                        },
                        onAllComplete: function (succ, fail) {
                            if (succ.length > 0) {
                                _this.counter = 0;
                                _this.nodeService.refreshCurrentPath();
                            }
                        }
                    }
                });
            };
        /**
         * @return {?}
         */
        UploadComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
            };
        Object.defineProperty(UploadComponent.prototype, "getCurrentPath", {
            get: /**
             * @return {?}
             */ function () {
                /** @type {?} */
                var parentPath = this.nodeService.findNodeByPath(this.nodeService.currentPath).id;
                return parentPath === 0 ? '' : parentPath;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        UploadComponent.prototype.uploadFiles = /**
         * @return {?}
         */
            function () {
                this.uploader.uploadStoredFiles();
            };
        /**
         * @param {?=} input
         * @return {?}
         */
        UploadComponent.prototype.createNewFolder = /**
         * @param {?=} input
         * @return {?}
         */
            function (input) {
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
            };
        /**
         * @return {?}
         */
        UploadComponent.prototype.newClickedAction = /**
         * @return {?}
         */
            function () {
                this.uploader.cancelAll();
                this.closeDialog.emit();
            };
        UploadComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-upload',
                        template: "<div class=\"backdrop\" (click)=\"newClickedAction()\"></div>\n<div class=\"upload-background\">\n  <div class=\"buttons\">\n    <button class=\"button\" [disabled]=\"newFolder\" (click)=\"createNewFolder()\" translate>Create new folder</button>\n  </div>\n\n  <div *ngIf=\"newFolder\">\n    <div class=\"buttons\">\n      <app-new-folder (buttonClicked)=\"createNewFolder($event)\"></app-new-folder>\n    </div>\n  </div>\n\n  <div id=\"fine-uploader\">\n  </div>\n\n\n  <div class=\"buttons\">\n    <button class=\"button big\" [disabled]=\"this.counter < 1\" (click)=\"uploadFiles()\" translate>\n      Upload\n    </button>\n    <button class=\"button big\" (click)=\"newClickedAction()\" translate>\n      Close\n    </button>\n  </div>\n\n</div>\n\n<div id=\"fine-uploader-template\" style=\"display: none;\">\n  <div class=\"qq-uploader-selector qq-uploader\" qq-drop-area-text=\"Drop files here\">\n    <div class=\"qq-upload-drop-area-selector qq-upload-drop-area\" qq-hide-dropzone>\n      <span class=\"qq-upload-drop-area-text-selector\"></span>\n    </div>\n\n    <div class=\"upload-top-bar\">\n      <div class=\"qq-upload-button-selector qq-upload-button\">\n        <div translate>Upload a file</div>\n      </div>\n\n      <div class=\"qq-total-progress-bar-container-selector qq-total-progress-bar-container\">\n        <div role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\"\n             class=\"qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar\"></div>\n      </div>\n    </div>\n\n    <span class=\"qq-drop-processing-selector qq-drop-processing\">\n            <span translate>Processing dropped files</span>...\n            <span class=\"qq-drop-processing-spinner-selector qq-drop-processing-spinner\"></span>\n    </span>\n\n    <ul class=\"qq-upload-list-selector qq-upload-list\" aria-live=\"polite\" aria-relevant=\"additions removals\">\n      <li>\n        <div class=\"qq-progress-bar-container-selector\">\n          <div role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\"\n               class=\"qq-progress-bar-selector qq-progress-bar\"></div>\n        </div>\n        <span class=\"qq-upload-spinner-selector qq-upload-spinner\"></span>\n        <img class=\"qq-thumbnail-selector\" qq-max-size=\"100\" qq-server-scale>\n        <span class=\"qq-upload-file-selector qq-upload-file\"></span>\n        <span class=\"qq-edit-filename-icon-selector qq-edit-filename-icon\" aria-label=\"Edit filename\"></span>\n        <input class=\"qq-edit-filename-selector qq-edit-filename\" tabindex=\"0\" type=\"text\">\n        <span class=\"qq-upload-size-selector qq-upload-size\"></span>\n        <button type=\"button\" class=\"qq-btn qq-upload-cancel-selector qq-upload-cancel\" translate>Cancel</button>\n        <button type=\"button\" class=\"qq-btn qq-upload-retry-selector qq-upload-retry\" translate>Retry</button>\n        <button type=\"button\" class=\"qq-btn qq-upload-delete-selector qq-upload-delete\" translate>Delete</button>\n        <span role=\"status\" class=\"qq-upload-status-text-selector qq-upload-status-text\"></span>\n      </li>\n    </ul>\n\n    <dialog class=\"qq-alert-dialog-selector\">\n      <div class=\"qq-dialog-message-selector\"></div>\n      <div class=\"qq-dialog-buttons\">\n        <button type=\"button\" class=\"qq-cancel-button-selector\" translate>Close</button>\n      </div>\n    </dialog>\n\n    <dialog class=\"qq-confirm-dialog-selector\">\n      <div class=\"qq-dialog-message-selector\"></div>\n      <div class=\"qq-dialog-buttons\">\n        <button type=\"button\" class=\"qq-cancel-button-selector\" translate>No</button>\n        <button type=\"button\" class=\"qq-ok-button-selector\" translate>Yes</button>\n      </div>\n    </dialog>\n\n    <dialog class=\"qq-prompt-dialog-selector\">\n      <div class=\"qq-dialog-message-selector\"></div>\n      <input type=\"text\">\n      <div class=\"qq-dialog-buttons\">\n        <button type=\"button\" class=\"qq-cancel-button-selector\" translate>Cancel</button>\n        <button type=\"button\" class=\"qq-ok-button-selector\" translate>Ok</button>\n      </div>\n    </dialog>\n  </div>\n</div>\n",
                        styles: [".upload-content{text-align:center;max-height:25vh;overflow:auto;margin:10px auto}.fa-times:before{content:\"\\f00d\"}.buttons{background:#fff;padding:5px;margin:10px 0}", ".qq-upload-button div{line-height:25px}.qq-upload-button-focus{outline:0}.qq-uploader{position:relative;min-height:200px;max-height:490px;overflow-y:hidden;width:inherit;border-radius:6px;background-color:#fdfdfd;border:1px dashed #ccc;padding:20px}.qq-uploader:before{content:attr(qq-drop-area-text) \" \";position:absolute;font-size:200%;left:0;width:100%;text-align:center;top:45%;opacity:.25}.qq-upload-drop-area,.qq-upload-extra-drop-area{position:absolute;top:0;left:0;width:100%;height:100%;min-height:30px;z-index:2;background:#f9f9f9;border-radius:4px;border:1px dashed #ccc;text-align:center}.qq-upload-drop-area span{display:block;position:absolute;top:50%;width:100%;margin-top:-8px;font-size:16px}.qq-upload-extra-drop-area{position:relative;margin-top:50px;font-size:16px;padding-top:30px;height:20px;min-height:40px}.qq-upload-drop-area-active{background:#fdfdfd;border-radius:4px;border:1px dashed #ccc}.qq-upload-list{margin:0;padding:0;list-style:none;max-height:450px;overflow-y:auto;clear:both}.qq-upload-list li{margin:0;padding:9px;line-height:15px;font-size:16px;color:#424242;background-color:#f6f6f6;border-top:1px solid #fff;border-bottom:1px solid #ddd}.qq-upload-list li:first-child{border-top:none}.qq-upload-list li:last-child{border-bottom:none}.qq-upload-cancel,.qq-upload-continue,.qq-upload-delete,.qq-upload-failed-text,.qq-upload-file,.qq-upload-pause,.qq-upload-retry,.qq-upload-size,.qq-upload-spinner{margin-right:12px;display:inline}.qq-upload-file{vertical-align:middle;display:inline-block;width:300px;text-overflow:ellipsis;white-space:nowrap;overflow-x:hidden;height:18px}.qq-upload-spinner{display:inline-block;background:url(loading.gif);width:15px;height:15px;vertical-align:text-bottom}.qq-drop-processing{display:block}.qq-drop-processing-spinner{display:inline-block;background:url(processing.gif);width:24px;height:24px;vertical-align:text-bottom}.qq-upload-cancel,.qq-upload-continue,.qq-upload-delete,.qq-upload-pause,.qq-upload-retry,.qq-upload-size{font-size:12px;font-weight:400;cursor:pointer;vertical-align:middle}.qq-upload-status-text{font-size:14px;font-weight:700;display:block}.qq-upload-failed-text{display:none;font-style:italic;font-weight:700}.qq-upload-failed-icon{display:none;width:15px;height:15px;vertical-align:text-bottom}.qq-upload-fail .qq-upload-failed-text,.qq-upload-retrying .qq-upload-failed-text{display:inline}.qq-upload-list li.qq-upload-success{background-color:#ebf6e0;color:#424242;border-bottom:1px solid #d3ded1;border-top:1px solid #f7fff5}.qq-upload-list li.qq-upload-fail{background-color:#f5d7d7;color:#424242;border-bottom:1px solid #decaca;border-top:1px solid #fce6e6}.qq-total-progress-bar{height:25px;border-radius:9px}INPUT.qq-edit-filename{position:absolute;opacity:0;z-index:-1}.qq-upload-file.qq-editable{cursor:pointer;margin-right:4px}.qq-edit-filename-icon.qq-editable{display:inline-block;cursor:pointer}INPUT.qq-edit-filename.qq-editing{position:static;height:28px;padding:0 8px;margin-right:10px;margin-bottom:-5px;border:1px solid #ccc;border-radius:2px;font-size:16px;opacity:1}.qq-edit-filename-icon{display:none;background:url(edit.gif);width:15px;height:15px;vertical-align:text-bottom;margin-right:16px}.qq-hide{display:none}.qq-thumbnail-selector{vertical-align:middle;margin-right:12px}.qq-uploader DIALOG{display:none}.qq-uploader DIALOG[open]{display:block}.qq-uploader DIALOG .qq-dialog-buttons{text-align:center;padding-top:10px}.qq-uploader DIALOG .qq-dialog-buttons BUTTON{margin-left:5px;margin-right:5px}.qq-uploader DIALOG .qq-dialog-message-selector{padding-bottom:10px}.qq-uploader DIALOG::-webkit-backdrop{background-color:rgba(0,0,0,.7)}.qq-uploader DIALOG::backdrop{background-color:rgba(0,0,0,.7)}"],
                        encapsulation: i0.ViewEncapsulation.None
                    },] },
        ];
        /** @nocollapse */
        UploadComponent.ctorParameters = function () {
            return [
                { type: i4.HttpClient },
                { type: NodeService }
            ];
        };
        UploadComponent.propDecorators = {
            openDialog: [{ type: i0.Input }],
            closeDialog: [{ type: i0.Output }],
            createDir: [{ type: i0.Output }]
        };
        return UploadComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NewFolderComponent = (function () {
        function NewFolderComponent() {
            this.buttonClicked = new i0.EventEmitter();
            this.buttonText = utils._('Close').toString();
            this.inputValue = '';
        }
        /**
         * @return {?}
         */
        NewFolderComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
            };
        /**
         * @return {?}
         */
        NewFolderComponent.prototype.onClick = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var el = ((this.uploadFolder.nativeElement));
                // @ts-ignore
                this.buttonClicked.emit(el.value);
            };
        /**
         * @param {?} event
         * @return {?}
         */
        NewFolderComponent.prototype.onInputChange = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.inputValue = event.target.value;
                if (this.inputValue.length > 0) {
                    this.buttonText = utils._('Confirm').toString();
                }
                else {
                    this.buttonText = utils._('Close').toString();
                }
            };
        NewFolderComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-new-folder',
                        template: "<p class=\"new-folder-description\" translate>Type new folder name</p>\n<input #uploadFolder placeholder=\"{{'Folder name' | translate}}\" (keyup)=\"onInputChange($event)\"\n       (keyup.enter)=\"onClick()\" onclick=\"this.select();\" type=\"text\" class=\"new-folder-input\"/>\n<button class=\"button new-folder-send\" (click)=\"onClick()\">{{buttonText | translate}}</button>\n",
                        styles: [".new-folder-description{margin:0 auto;padding:0}"]
                    },] },
        ];
        /** @nocollapse */
        NewFolderComponent.ctorParameters = function () { return []; };
        NewFolderComponent.propDecorators = {
            uploadFolder: [{ type: i0.ViewChild, args: ['uploadFolder',] }],
            buttonClicked: [{ type: i0.Output }]
        };
        return NewFolderComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var SideViewComponent = (function () {
        function SideViewComponent() {
            this.allowFolderDownload = false;
            this.clickEvent = new i0.EventEmitter();
        }
        /**
         * @return {?}
         */
        SideViewComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
            };
        /**
         * @param {?} event
         * @param {?} type
         * @return {?}
         */
        SideViewComponent.prototype.onClick = /**
         * @param {?} event
         * @param {?} type
         * @return {?}
         */
            function (event, type) {
                this.clickEvent.emit({ type: type, event: event, node: this.node });
            };
        SideViewComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-side-view',
                        template: "<div class=\"side-view\" *ngIf=\"node\">\n  <div class=\"side-view-preview\">\n    <i (click)=\"onClick($event, 'closeSideView')\" class=\"fas fa-times side-view-close\"></i>\n\n    <div class=\"side-view-preview-title\">{{node.name}}</div>\n\n    <div class=\"side-view-preview-content\">\n      <ng-container\n        [ngTemplateOutletContext]=\"{$implicit: node}\"\n        [ngTemplateOutlet]=\"sideViewTemplate\">\n      </ng-container>\n    </div>\n\n    <div class=\"side-view-buttons\">\n      <button (click)=\"onClick($event, 'download')\" class=\"button\"\n              [disabled]=\"!allowFolderDownload && node.isFolder\" translate>\n        Download\n      </button>\n      <button (click)=\"onClick($event, 'renameConfirm')\" class=\"button\" translate>Rename</button>\n      <button (click)=\"onClick($event, 'removeAsk')\" class=\"button\" translate>Delete</button>\n    </div>\n  </div>\n</div>\n",
                        styles: [".side-view-close{position:absolute;cursor:pointer;top:0;right:0;padding:15px}.side-view-buttons{width:100%;display:flex;justify-content:center;flex-flow:column}.side-view-buttons .button{margin:5px 0}"],
                        encapsulation: i0.ViewEncapsulation.None
                    },] },
        ];
        /** @nocollapse */
        SideViewComponent.ctorParameters = function () { return []; };
        SideViewComponent.propDecorators = {
            sideViewTemplate: [{ type: i0.Input }],
            node: [{ type: i0.Input }],
            allowFolderDownload: [{ type: i0.Input }],
            clickEvent: [{ type: i0.Output }]
        };
        return SideViewComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NavigationComponent = (function () {
        function NavigationComponent(nodeClickedService) {
            this.nodeClickedService = nodeClickedService;
        }
        /**
         * @return {?}
         */
        NavigationComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
            };
        /**
         * @param {?} input
         * @return {?}
         */
        NavigationComponent.prototype.onClick = /**
         * @param {?} input
         * @return {?}
         */
            function (input) {
                this.nodeClickedService.searchForString(input);
            };
        NavigationComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'app-navigation',
                        template: "<div class=\"navigation-component\">\n  <input #input class=\"navigation-search\" onclick=\"this.select();\" (keyup.enter)=\"onClick(input.value)\"\n         placeholder=\"{{'Search' | translate}}\">\n\n  <button [disabled]=\"input.value.length === 0\" class=\"navigation-search-icon\" (click)=\"onClick(input.value)\">\n    <i class=\"fas fa-search\"></i>\n  </button>\n\n  <div>\n    <ng-content></ng-content>\n  </div>\n</div>\n\n\n",
                        styles: [".navigation-component{display:flex}"],
                        encapsulation: i0.ViewEncapsulation.None
                    },] },
        ];
        /** @nocollapse */
        NavigationComponent.ctorParameters = function () {
            return [
                { type: NodeClickedService }
            ];
        };
        return NavigationComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * @param {?} http
     * @return {?}
     */
    function createTranslateLoader(http) {
        return new httpLoader.TranslateHttpLoader(http, '/assets/i18n/', '.json');
    }
    var ɵ0 = (createTranslateLoader);
    var FileManagerModule = (function () {
        function FileManagerModule() {
        }
        FileManagerModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [
                            i4.HttpClientModule,
                            i3.StoreModule.forRoot(reducers),
                            common.CommonModule,
                            i1.NgxSmartModalModule.forRoot(),
                            core.TranslateModule.forRoot({
                                loader: {
                                    provide: core.TranslateLoader,
                                    useFactory: ɵ0,
                                    deps: [i4.HttpClient]
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
                    },] },
        ];
        return FileManagerModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var TreeModel = (function () {
        function TreeModel(config) {
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
        Object.defineProperty(TreeModel.prototype, "currentPath", {
            get: /**
             * @return {?}
             */ function () {
                return this._currentPath;
            },
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
                this._currentPath = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TreeModel.prototype, "nodes", {
            get: /**
             * @return {?}
             */ function () {
                return this._nodes;
            },
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
                this._nodes = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TreeModel.prototype, "selectedNodeId", {
            get: /**
             * @return {?}
             */ function () {
                return this._selectedNodeId;
            },
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
                this._selectedNodeId = value;
            },
            enumerable: true,
            configurable: true
        });
        return TreeModel;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.FileManagerComponent = FileManagerComponent;
    exports.createTranslateLoader = createTranslateLoader;
    exports.FileManagerModule = FileManagerModule;
    exports.TreeModel = TreeModel;
    exports.NodeService = NodeService;
    exports.ɵe = FolderContentComponent;
    exports.ɵk = LoadingOverlayComponent;
    exports.ɵf = NodeComponent;
    exports.ɵn = NewFolderComponent;
    exports.ɵm = UploadComponent;
    exports.ɵj = NavBarComponent;
    exports.ɵp = NavigationComponent;
    exports.ɵo = SideViewComponent;
    exports.ɵh = NodeListerComponent;
    exports.ɵg = TreeComponent;
    exports.ɵl = FileSizePipe;
    exports.ɵi = MapToIterablePipe;
    exports.ɵb = reducers;
    exports.ɵd = stateReducer;
    exports.ɵc = NodeClickedService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmc2LWZpbGUtbWFuLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbi50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvc2VydmljZXMvbm9kZS1jbGlja2VkLnNlcnZpY2UudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvZmlsZS1tYW5hZ2VyLmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL2ZvbGRlci1jb250ZW50L2ZvbGRlci1jb250ZW50LmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL3RyZWUvdHJlZS5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy90cmVlL25vZGUtbGlzdGVyL25vZGUtbGlzdGVyLmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL2Z1bmN0aW9ucy9ub2RlL25vZGUuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3BpcGVzL21hcC10by1pdGVyYWJsZS5waXBlLnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvbmF2LWJhci9uYXYtYmFyLmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9yZWR1Y2Vycy9zdGF0ZVJlZHVjZXIudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvZnVuY3Rpb25zL2xvYWRpbmctb3ZlcmxheS9sb2FkaW5nLW92ZXJsYXkuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3BpcGVzL2ZpbGUtc2l6ZS5waXBlLnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvZnVuY3Rpb25zL3VwbG9hZC91cGxvYWQuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvZnVuY3Rpb25zL3VwbG9hZC9uZXctZm9sZGVyL25ldy1mb2xkZXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvc2lkZS12aWV3L3NpZGUtdmlldy5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24uY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2ZpbGUtbWFuYWdlci5tb2R1bGUudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvbW9kZWxzL3RyZWUubW9kZWwudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBY3Rpb25JbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvYWN0aW9uLmludGVyZmFjZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcblxyXG5leHBvcnQgY29uc3QgU0VUX1BBVEggPSAnU0VUX1BBVEgnO1xyXG5leHBvcnQgY29uc3QgU0VUX0xPQURJTkdfU1RBVEUgPSAnU0VUX0xPQURJTkdfU1RBVEUnO1xyXG5leHBvcnQgY29uc3QgU0VUX1NFTEVDVEVEX05PREUgPSAnU0VUX1NFTEVDVEVEX05PREUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNldFBhdGggaW1wbGVtZW50cyBBY3Rpb25JbnRlcmZhY2Uge1xyXG4gIHJlYWRvbmx5IHR5cGUgPSBTRVRfUEFUSDtcclxuICBwYXlsb2FkOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTZXRMb2FkaW5nU3RhdGUgaW1wbGVtZW50cyBBY3Rpb25JbnRlcmZhY2Uge1xyXG4gIHJlYWRvbmx5IHR5cGUgPSBTRVRfTE9BRElOR19TVEFURTtcclxuICBwYXlsb2FkOiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2V0U2VsZWN0ZWROb2RlIGltcGxlbWVudHMgQWN0aW9uSW50ZXJmYWNlIHtcclxuICByZWFkb25seSB0eXBlID0gU0VUX1NFTEVDVEVEX05PREU7XHJcbiAgcGF5bG9hZDogTm9kZUludGVyZmFjZTtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQWN0aW9ucyA9IFNldFBhdGggfCBTZXRMb2FkaW5nU3RhdGUgfCBTZXRTZWxlY3RlZE5vZGU7XHJcbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cFBhcmFtc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4uL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTm9kZVNlcnZpY2Uge1xyXG4gIHB1YmxpYyB0cmVlOiBUcmVlTW9kZWw7XHJcbiAgcHJpdmF0ZSBfcGF0aDogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPikge1xyXG4gIH1cclxuXHJcbiAgLy8gdG9kbyBhc2sgc2VydmVyIHRvIGdldCBwYXJlbnQgc3RydWN0dXJlXHJcbiAgcHVibGljIHN0YXJ0TWFuYWdlckF0KHBhdGg6IHN0cmluZykge1xyXG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfUEFUSCwgcGF5bG9hZDogcGF0aH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlZnJlc2hDdXJyZW50UGF0aCgpIHtcclxuICAgIHRoaXMuZmluZE5vZGVCeVBhdGgodGhpcy5jdXJyZW50UGF0aCkuY2hpbGRyZW4gPSB7fTtcclxuICAgIHRoaXMuZ2V0Tm9kZXModGhpcy5jdXJyZW50UGF0aCk7XHJcbiAgfVxyXG5cclxuICBnZXROb2RlcyhwYXRoOiBzdHJpbmcpIHtcclxuICAgIHRoaXMucGFyc2VOb2RlcyhwYXRoKS5zdWJzY3JpYmUoKGRhdGE6IEFycmF5PE5vZGVJbnRlcmZhY2U+KSA9PiB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHBhcmVudFBhdGggPSB0aGlzLmdldFBhcmVudFBhdGgoZGF0YVtpXS5wYXRoVG9Ob2RlKTtcclxuICAgICAgICB0aGlzLmZpbmROb2RlQnlQYXRoKHBhcmVudFBhdGgpLmNoaWxkcmVuW2RhdGFbaV0ubmFtZV0gPSBkYXRhW2ldO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0UGFyZW50UGF0aChwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgbGV0IHBhcmVudFBhdGggPSBwYXRoLnNwbGl0KCcvJyk7XHJcbiAgICBwYXJlbnRQYXRoID0gcGFyZW50UGF0aC5zbGljZSgwLCBwYXJlbnRQYXRoLmxlbmd0aCAtIDEpO1xyXG4gICAgcmV0dXJuIHBhcmVudFBhdGguam9pbignLycpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYXJzZU5vZGVzKHBhdGg6IHN0cmluZyk6IE9ic2VydmFibGU8Tm9kZUludGVyZmFjZVtdPiB7XHJcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xyXG4gICAgICB0aGlzLmdldE5vZGVzRnJvbVNlcnZlcihwYXRoKS5zdWJzY3JpYmUoKGRhdGE6IEFycmF5PGFueT4pID0+IHtcclxuICAgICAgICBvYnNlcnZlci5uZXh0KGRhdGEubWFwKG5vZGUgPT4gdGhpcy5jcmVhdGVOb2RlKHBhdGgsIG5vZGUpKSk7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfTE9BRElOR19TVEFURSwgcGF5bG9hZDogZmFsc2V9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlTm9kZShwYXRoLCBub2RlKTogTm9kZUludGVyZmFjZSB7XHJcbiAgICBpZiAobm9kZS5wYXRoWzBdICE9PSAnLycpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbTm9kZSBTZXJ2aWNlXSBTZXJ2ZXIgc2hvdWxkIHJldHVybiBpbml0aWFsIHBhdGggd2l0aCBcIi9cIicpO1xyXG4gICAgICBub2RlLnBhdGggPSAnLycgKyBub2RlLnBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaWRzID0gbm9kZS5wYXRoLnNwbGl0KCcvJyk7XHJcbiAgICBpZiAoaWRzLmxlbmd0aCA+IDIgJiYgaWRzW2lkcy5sZW5ndGggLSAxXSA9PT0gJycpIHtcclxuICAgICAgaWRzLnNwbGljZSgtMSwgMSk7XHJcbiAgICAgIG5vZGUucGF0aCA9IGlkcy5qb2luKCcvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2FjaGVkTm9kZSA9IHRoaXMuZmluZE5vZGVCeVBhdGgobm9kZS5wYXRoKTtcclxuXHJcbiAgICByZXR1cm4gPE5vZGVJbnRlcmZhY2U+e1xyXG4gICAgICBpZDogbm9kZS5pZCxcclxuICAgICAgaXNGb2xkZXI6IG5vZGUuZGlyLFxyXG4gICAgICBpc0V4cGFuZGVkOiBjYWNoZWROb2RlID8gY2FjaGVkTm9kZS5pc0V4cGFuZGVkIDogZmFsc2UsXHJcbiAgICAgIHBhdGhUb05vZGU6IG5vZGUucGF0aCxcclxuICAgICAgcGF0aFRvUGFyZW50OiB0aGlzLmdldFBhcmVudFBhdGgobm9kZS5wYXRoKSxcclxuICAgICAgbmFtZTogbm9kZS5uYW1lIHx8IG5vZGUuaWQsXHJcbiAgICAgIGNoaWxkcmVuOiBjYWNoZWROb2RlID8gY2FjaGVkTm9kZS5jaGlsZHJlbiA6IHt9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXROb2Rlc0Zyb21TZXJ2ZXIgPSAocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICBsZXQgZm9sZGVySWQ6IGFueSA9IHRoaXMuZmluZE5vZGVCeVBhdGgocGF0aCkuaWQ7XHJcbiAgICBmb2xkZXJJZCA9IGZvbGRlcklkID09PSAwID8gJycgOiBmb2xkZXJJZDtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChcclxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgdGhpcy50cmVlLmNvbmZpZy5hcGkubGlzdEZpbGUsXHJcbiAgICAgIHtwYXJhbXM6IG5ldyBIdHRwUGFyYW1zKCkuc2V0KCdwYXJlbnRQYXRoJywgZm9sZGVySWQpfVxyXG4gICAgKTtcclxuICB9O1xyXG5cclxuICBwdWJsaWMgZmluZE5vZGVCeVBhdGgobm9kZVBhdGg6IHN0cmluZyk6IE5vZGVJbnRlcmZhY2Uge1xyXG4gICAgY29uc3QgaWRzID0gbm9kZVBhdGguc3BsaXQoJy8nKTtcclxuICAgIGlkcy5zcGxpY2UoMCwgMSk7XHJcblxyXG4gICAgcmV0dXJuIGlkcy5sZW5ndGggPT09IDAgPyB0aGlzLnRyZWUubm9kZXMgOiBpZHMucmVkdWNlKCh2YWx1ZSwgaW5kZXgpID0+IHZhbHVlWydjaGlsZHJlbiddW2luZGV4XSwgdGhpcy50cmVlLm5vZGVzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmaW5kTm9kZUJ5SWQoaWQ6IG51bWJlcik6IE5vZGVJbnRlcmZhY2Uge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5maW5kTm9kZUJ5SWRIZWxwZXIoaWQpO1xyXG5cclxuICAgIGlmIChyZXN1bHQgPT09IG51bGwpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbTm9kZSBTZXJ2aWNlXSBDYW5ub3QgZmluZCBub2RlIGJ5IGlkLiBJZCBub3QgZXhpc3Rpbmcgb3Igbm90IGZldGNoZWQuIFJldHVybmluZyByb290LicpO1xyXG4gICAgICByZXR1cm4gdGhpcy50cmVlLm5vZGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZmluZE5vZGVCeUlkSGVscGVyKGlkOiBudW1iZXIsIG5vZGU6IE5vZGVJbnRlcmZhY2UgPSB0aGlzLnRyZWUubm9kZXMpOiBOb2RlSW50ZXJmYWNlIHtcclxuICAgIGlmIChub2RlLmlkID09PSBpZClcclxuICAgICAgcmV0dXJuIG5vZGU7XHJcblxyXG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG5vZGUuY2hpbGRyZW4pO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodHlwZW9mIG5vZGUuY2hpbGRyZW5ba2V5c1tpXV0gPT0gJ29iamVjdCcpIHtcclxuICAgICAgICBjb25zdCBvYmogPSB0aGlzLmZpbmROb2RlQnlJZEhlbHBlcihpZCwgbm9kZS5jaGlsZHJlbltrZXlzW2ldXSk7XHJcbiAgICAgICAgaWYgKG9iaiAhPSBudWxsKVxyXG4gICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGZvbGRSZWN1cnNpdmVseShub2RlOiBOb2RlSW50ZXJmYWNlKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnZm9sZGluZyAnLCBub2RlKTtcclxuICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcclxuXHJcbiAgICBPYmplY3Qua2V5cyhjaGlsZHJlbikubWFwKChjaGlsZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGlmICghY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoY2hpbGQpIHx8ICFjaGlsZHJlbltjaGlsZF0uaXNFeHBhbmRlZCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmZvbGRSZWN1cnNpdmVseShjaGlsZHJlbltjaGlsZF0pO1xyXG4gICAgICAvL3RvZG8gcHV0IHRoaXMgZ2V0RWxCeUlkIGludG8gb25lIGZ1bmMgKGN1cnIgaW5zaWRlIG5vZGUuY29tcG9uZW50LnRzICsgZm0uY29tcG9uZW50LnRzKSAtIHRoaXMgd29uJ3QgYmUgbWFpbnRhaW5hYmxlXHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmVlXycgKyBjaGlsZHJlbltjaGlsZF0ucGF0aFRvTm9kZSkuY2xhc3NMaXN0LmFkZCgnZGVzZWxlY3RlZCcpO1xyXG4gICAgICBjaGlsZHJlbltjaGlsZF0uaXNFeHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZm9sZEFsbCgpIHtcclxuICAgIHRoaXMuZm9sZFJlY3Vyc2l2ZWx5KHRoaXMudHJlZS5ub2Rlcyk7XHJcbiAgfVxyXG5cclxuICBnZXQgY3VycmVudFBhdGgoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9wYXRoO1xyXG4gIH1cclxuXHJcbiAgc2V0IGN1cnJlbnRQYXRoKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuX3BhdGggPSB2YWx1ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuL25vZGUuc2VydmljZSc7XG5pbXBvcnQge1RyZWVNb2RlbH0gZnJvbSAnLi4vbW9kZWxzL3RyZWUubW9kZWwnO1xuaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtOZ3hTbWFydE1vZGFsU2VydmljZX0gZnJvbSAnbmd4LXNtYXJ0LW1vZGFsJztcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XG5pbXBvcnQge1N0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5vZGVDbGlja2VkU2VydmljZSB7XG4gIHB1YmxpYyB0cmVlOiBUcmVlTW9kZWw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIG5neFNtYXJ0TW9kYWxTZXJ2aWNlOiBOZ3hTbWFydE1vZGFsU2VydmljZSxcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4sXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50XG4gICkge1xuICB9XG5cbiAgcHVibGljIHN0YXJ0RG93bmxvYWQobm9kZTogTm9kZUludGVyZmFjZSk6IHZvaWQge1xuICAgIGNvbnN0IHBhcmFtZXRlcnMgPSB0aGlzLnBhcnNlUGFyYW1zKHtwYXRoOiBub2RlLmlkfSk7XG4gICAgdGhpcy5yZWFjaFNlcnZlcignZG93bmxvYWQnLCB0aGlzLnRyZWUuY29uZmlnLmFwaS5kb3dubG9hZEZpbGUgKyBwYXJhbWV0ZXJzKTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0RGVsZXRlKG5vZGU6IE5vZGVJbnRlcmZhY2UpOiB2b2lkIHtcbiAgICB0aGlzLnNpZGVFZmZlY3RIZWxwZXIoXG4gICAgICAnRGVsZXRlJyxcbiAgICAgIHtwYXRoOiBub2RlLmlkfSxcbiAgICAgICdkZWxldGUnLFxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkuZGVsZXRlRmlsZSxcbiAgICAgICgpID0+IHRoaXMuc3VjY2Vzc1dpdGhNb2RhbENsb3NlKClcbiAgICApO1xuICB9XG5cbiAgcHVibGljIHNlYXJjaEZvclN0cmluZyhpbnB1dDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zaWRlRWZmZWN0SGVscGVyKFxuICAgICAgJ1NlYXJjaCcsXG4gICAgICB7cXVlcnk6IGlucHV0fSxcbiAgICAgICdnZXQnLFxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkuc2VhcmNoRmlsZXMsXG4gICAgICAocmVzKSA9PiB0aGlzLnNlYXJjaFN1Y2Nlc3MoaW5wdXQsIHJlcylcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZUZvbGRlcihjdXJyZW50UGFyZW50OiBudW1iZXIsIG5ld0Rpck5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuc2lkZUVmZmVjdEhlbHBlcihcbiAgICAgICdDcmVhdGUgRm9sZGVyJyxcbiAgICAgIHtkaXJOYW1lOiBuZXdEaXJOYW1lLCBwYXJlbnRQYXRoOiBjdXJyZW50UGFyZW50ID09PSAwID8gbnVsbCA6IGN1cnJlbnRQYXJlbnR9LFxuICAgICAgJ3Bvc3QnLFxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkuY3JlYXRlRm9sZGVyXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyByZW5hbWUoaWQ6IG51bWJlciwgbmV3TmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zaWRlRWZmZWN0SGVscGVyKFxuICAgICAgJ1JlbmFtZScsXG4gICAgICB7cGF0aDogaWQsIG5ld05hbWU6IG5ld05hbWV9LFxuICAgICAgJ3Bvc3QnLFxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkucmVuYW1lRmlsZSxcbiAgICAgICgpID0+IHRoaXMuc3VjY2Vzc1dpdGhNb2RhbENsb3NlKClcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBzaWRlRWZmZWN0SGVscGVyKG5hbWU6IHN0cmluZywgcGFyYW1ldGVyczoge30sIGh0dHBNZXRob2Q6IHN0cmluZywgYXBpVVJMOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWV0aG9kID0gKGEpID0+IHRoaXMuYWN0aW9uU3VjY2VzcyhhKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWxNZXRob2QgPSAoYSwgYikgPT4gdGhpcy5hY3Rpb25GYWlsZWQoYSwgYilcbiAgKSB7XG4gICAgY29uc3QgcGFyYW1zID0gdGhpcy5wYXJzZVBhcmFtcyhwYXJhbWV0ZXJzKTtcblxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3dhaXRNb2RhbCcpLm9wZW4oKTtcblxuICAgIHRoaXMucmVhY2hTZXJ2ZXIoaHR0cE1ldGhvZCwgYXBpVVJMICsgcGFyYW1zKVxuICAgICAgLnN1YnNjcmliZShcbiAgICAgICAgKGEpID0+IHN1Y2Nlc3NNZXRob2QoYSksXG4gICAgICAgIChlcnIpID0+IGZhaWxNZXRob2QobmFtZSwgZXJyKVxuICAgICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVhY2hTZXJ2ZXIobWV0aG9kOiBzdHJpbmcsIGFwaVVybDogc3RyaW5nLCBkYXRhOiBhbnkgPSB7fSk6IE9ic2VydmFibGU8T2JqZWN0PiB7XG4gICAgc3dpdGNoIChtZXRob2QudG9Mb3dlckNhc2UoKSkge1xuICAgICAgY2FzZSAnZ2V0JzpcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQodGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgYXBpVXJsKTtcbiAgICAgIGNhc2UgJ3Bvc3QnOlxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgYXBpVXJsLCBkYXRhKTtcbiAgICAgIGNhc2UgJ2RlbGV0ZSc6XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIGFwaVVybCk7XG4gICAgICBjYXNlICdkb3dubG9hZCc6XG4gICAgICAgIHdpbmRvdy5vcGVuKHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIGFwaVVybCwgJ19ibGFuaycpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnNvbGUud2FybignW05vZGVDbGlja2VkU2VydmljZV0gSW5jb3JyZWN0IHBhcmFtcyBmb3IgdGhpcyBzaWRlLWVmZmVjdCcpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlUGFyYW1zKHBhcmFtczoge30pOiBzdHJpbmcge1xuICAgIGxldCBxdWVyeSA9ICc/JztcblxuICAgIE9iamVjdC5rZXlzKHBhcmFtcykuZmlsdGVyKGl0ZW0gPT4gcGFyYW1zW2l0ZW1dICE9PSBudWxsKS5tYXAoa2V5ID0+IHtcbiAgICAgIHF1ZXJ5ICs9IGtleSArICc9JyArIHBhcmFtc1trZXldICsgJyYnO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHF1ZXJ5LnNsaWNlKDAsIC0xKTtcbiAgfVxuXG4gIHByaXZhdGUgc3VjY2Vzc1dpdGhNb2RhbENsb3NlKCkge1xuICAgIHRoaXMuYWN0aW9uU3VjY2VzcygpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWRlLXZpZXcnKS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZWFyY2hTdWNjZXNzKGlucHV0OiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIGNvbnN0IG9iaiA9IHtcbiAgICAgIHNlYXJjaFN0cmluZzogaW5wdXQsXG4gICAgICByZXNwb25zZTogZGF0YVxuICAgIH07XG5cbiAgICB0aGlzLmFjdGlvblN1Y2Nlc3MoKTtcblxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2Uuc2V0TW9kYWxEYXRhKG9iaiwgJ3NlYXJjaE1vZGFsJywgdHJ1ZSk7XG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnc2VhcmNoTW9kYWwnKS5vcGVuKCk7XG4gIH1cblxuICBwcml2YXRlIGFjdGlvblN1Y2Nlc3MocmVzcG9uc2U6IHN0cmluZyA9ICcnKSB7XG4gICAgdGhpcy5ub2RlU2VydmljZS5yZWZyZXNoQ3VycmVudFBhdGgoKTtcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCd3YWl0TW9kYWwnKS5jbG9zZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhY3Rpb25GYWlsZWQobmFtZTogc3RyaW5nLCBlcnJvcjogYW55KSB7XG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnd2FpdE1vZGFsJykuY2xvc2UoKTtcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdlcnJvck1vZGFsJykub3BlbigpO1xuICAgIGNvbnNvbGUud2FybignW05vZGVDbGlja2VkU2VydmljZV0gQWN0aW9uIFwiJyArIG5hbWUgKyAnXCIgZmFpbGVkJywgZXJyb3IpO1xuICB9XG59XG4iLCJpbXBvcnQge0NvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFRlbXBsYXRlUmVmLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7c2VsZWN0LCBTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge1RyZWVNb2RlbH0gZnJvbSAnLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge1NFVF9MT0FESU5HX1NUQVRFfSBmcm9tICcuL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQge05neFNtYXJ0TW9kYWxTZXJ2aWNlfSBmcm9tICduZ3gtc21hcnQtbW9kYWwnO1xyXG5pbXBvcnQge05vZGVDbGlja2VkU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlcy9ub2RlLWNsaWNrZWQuc2VydmljZSc7XHJcbmltcG9ydCB7VHJhbnNsYXRlU2VydmljZX0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2ZtLWZpbGUtbWFuYWdlcicsXHJcbiAgdGVtcGxhdGU6IGA8bmctY29udGFpbmVyICpuZ0lmPVwiaXNQb3B1cDsgdGhlbiBpdElzUG9wdXAgZWxzZSBzaG93Q29udGVudFwiPjwvbmctY29udGFpbmVyPlxyXG5cclxuPG5nLXRlbXBsYXRlICNpdElzUG9wdXA+XHJcbiAgPGRpdiAqbmdJZj1cIiFmbU9wZW5cIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgKGNsaWNrKT1cImZtU2hvd0hpZGUoKVwiIHRyYW5zbGF0ZT1cIlwiPk9wZW4gZmlsZSBtYW5hZ2VyPC9idXR0b24+XHJcbiAgPC9kaXY+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1iYWNrZHJvcFwiICpuZ0lmPVwiZm1PcGVuXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZm1Nb2RhbEluc2lkZVwiPlxyXG4gICAgICA8ZGl2ICpuZ0lmPVwiZm1PcGVuOyB0aGVuIHNob3dDb250ZW50XCI+PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuXHJcbjxuZy10ZW1wbGF0ZSAjc2hvd0NvbnRlbnQ+XHJcbiAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItbmF2YmFyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJwYXRoXCI+XHJcbiAgICAgICAgPGFwcC1uYXYtYmFyPjwvYXBwLW5hdi1iYXI+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzcz1cIm5hdmlnYXRpb25cIj5cclxuICAgICAgICA8YXBwLW5hdmlnYXRpb24+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uIGNsb3NlXCIgKGNsaWNrKT1cImZtU2hvd0hpZGUoKVwiICpuZ0lmPVwiaXNQb3B1cFwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS0yeCBmYS10aW1lc1wiPjwvaT5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvYXBwLW5hdmlnYXRpb24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cImhvbGRlclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWxlZnRcIj5cclxuICAgICAgICA8YXBwLXRyZWUgW3RyZWVNb2RlbF09XCJ0cmVlXCI+XHJcbiAgICAgICAgICA8bmctdGVtcGxhdGUgbGV0LW5vZGVzPlxyXG4gICAgICAgICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2Rlc31cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImljb25UZW1wbGF0ZSA/IGljb25UZW1wbGF0ZSA6IGRlZmF1bHRJY29uVGVtcGxhdGVcIj5cclxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgIDwvYXBwLXRyZWU+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzcz1cInJpZ2h0XCI+XHJcbiAgICAgICAgPGFwcC1mb2xkZXItY29udGVudFxyXG4gICAgICAgICAgW3RyZWVNb2RlbF09XCJ0cmVlXCJcclxuICAgICAgICAgIChvcGVuVXBsb2FkRGlhbG9nKT1cImhhbmRsZVVwbG9hZERpYWxvZygkZXZlbnQpXCJcclxuICAgICAgICAgIFtmb2xkZXJDb250ZW50VGVtcGxhdGVdPVwiZm9sZGVyQ29udGVudFRlbXBsYXRlID8gZm9sZGVyQ29udGVudFRlbXBsYXRlIDogZGVmYXVsdEZvbGRlckNvbnRlbnRUZW1wbGF0ZVwiXHJcbiAgICAgICAgICBbZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlXT1cImZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZSA/IGZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZSA6IGRlZmF1bHRGb2xkZXJDb250ZW50TmV3VGVtcGxhdGVcIlxyXG4gICAgICAgICAgW2ZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGVdPVwiZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZSA/IGZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGUgOiBkZWZhdWx0Rm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZVwiPlxyXG4gICAgICAgIDwvYXBwLWZvbGRlci1jb250ZW50PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxhcHAtc2lkZS12aWV3IGlkPVwic2lkZS12aWV3XCJcclxuICAgICAgICAgICAgICAgICAgICAgW25vZGVdPVwic2VsZWN0ZWROb2RlXCJcclxuICAgICAgICAgICAgICAgICAgICAgW3NpZGVWaWV3VGVtcGxhdGVdPVwic2lkZVZpZXdUZW1wbGF0ZSA/IHNpZGVWaWV3VGVtcGxhdGUgOiBkZWZhdWx0U2lkZVZpZXdUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgIFthbGxvd0ZvbGRlckRvd25sb2FkXT1cInRyZWUuY29uZmlnLm9wdGlvbnMuYWxsb3dGb2xkZXJEb3dubG9hZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgIChjbGlja0V2ZW50KT1cImhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudCgkZXZlbnQpXCI+XHJcbiAgICAgIDwvYXBwLXNpZGUtdmlldz5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG5cclxuICA8YXBwLXVwbG9hZCAqbmdJZj1cIm5ld0RpYWxvZ1wiXHJcbiAgICAgICAgICAgICAgW29wZW5EaWFsb2ddPVwibmV3RGlhbG9nXCJcclxuICAgICAgICAgICAgICAoY2xvc2VEaWFsb2cpPVwiaGFuZGxlVXBsb2FkRGlhbG9nKGZhbHNlKVwiXHJcbiAgICAgICAgICAgICAgKGNyZWF0ZURpcik9XCJoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoe3R5cGU6ICdjcmVhdGVGb2xkZXInLCBwYXlsb2FkOiAkZXZlbnR9KVwiPlxyXG4gIDwvYXBwLXVwbG9hZD5cclxuXHJcbiAgPGFwcC1sb2FkaW5nLW92ZXJsYXlcclxuICAgICpuZ0lmPVwibG9hZGluZ1wiXHJcbiAgICBbbG9hZGluZ092ZXJsYXlUZW1wbGF0ZV09XCJsb2FkaW5nT3ZlcmxheVRlbXBsYXRlID8gbG9hZGluZ092ZXJsYXlUZW1wbGF0ZSA6IGRlZmF1bHRMb2FkaW5nT3ZlcmxheVRlbXBsYXRlXCI+XHJcbiAgPC9hcHAtbG9hZGluZy1vdmVybGF5PlxyXG48L25nLXRlbXBsYXRlPlxyXG5cclxuPG5nLXRlbXBsYXRlIGxldC1ub2RlICNkZWZhdWx0SWNvblRlbXBsYXRlPlxyXG4gIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItbm9kZVwiIHN0eWxlPVwiZGlzcGxheTogaW5saW5lLWJsb2NrOyBwYWRkaW5nOiAzcHhcIj5cclxuICAgIDxkaXYgKm5nSWY9XCJub2RlLmlzRm9sZGVyOyB0aGVuIGl0SXNGb2xkZXIgZWxzZSBzaG93RmlsZVwiPjwvZGl2PlxyXG5cclxuICAgIDxuZy10ZW1wbGF0ZSAjaXRJc0ZvbGRlcj5cclxuICAgICAgPGRpdiAqbmdJZj1cIm5vZGUuaXNFeHBhbmRlZDsgdGhlbiBpc0ZvbGRlckV4cGFuZGVkIGVsc2UgaXNGb2xkZXJDbG9zZWRcIj48L2Rpdj5cclxuICAgIDwvbmctdGVtcGxhdGU+XHJcblxyXG4gICAgPG5nLXRlbXBsYXRlICNzaG93RmlsZT48aSBjbGFzcz1cImZhcyBmYS1maWxlIGNoaWxkXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcbiAgICA8bmctdGVtcGxhdGUgI2lzRm9sZGVyRXhwYW5kZWQ+PGkgY2xhc3M9XCJmYXMgZmEtZm9sZGVyLW9wZW4gY2hpbGRcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuICAgIDxuZy10ZW1wbGF0ZSAjaXNGb2xkZXJDbG9zZWQ+PGkgY2xhc3M9XCJmYXMgZmEtZm9sZGVyIGNoaWxkXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcblxyXG4gICAgPHNwYW4+e3tub2RlLm5hbWV9fTwvc3Bhbj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuPG5nLXRlbXBsYXRlIGxldC1ub2RlICNkZWZhdWx0Rm9sZGVyQ29udGVudFRlbXBsYXRlPlxyXG4gIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItaXRlbVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtcHJldmlld1wiPlxyXG4gICAgICA8ZGl2ICpuZ0lmPVwibm9kZS5pc0ZvbGRlcjsgdGhlbiBpdElzRm9sZGVyIGVsc2Ugc2hvd0ZpbGVcIj48L2Rpdj5cclxuICAgICAgPG5nLXRlbXBsYXRlICNpdElzRm9sZGVyPjxpIGNsYXNzPVwiZmFzIGZhLTN4IGZhLWZvbGRlciBjaGlsZFwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG4gICAgICA8bmctdGVtcGxhdGUgI3Nob3dGaWxlPjxpIGNsYXNzPVwiZmFzIGZhLTN4IGZhLWZpbGUgY2hpbGRcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtbmFtZVwiPlxyXG4gICAgICB7e25vZGUubmFtZX19XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuPG5nLXRlbXBsYXRlICNkZWZhdWx0Rm9sZGVyQ29udGVudE5ld1RlbXBsYXRlPlxyXG4gIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItaXRlbVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtcHJldmlld1wiIHN0eWxlPVwid2lkdGg6IDEwMCU7IGhlaWdodDoxMDAlXCI+XHJcbiAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLTN4IGZhLXBsdXMgY2hpbGRcIiBzdHlsZT1cImxpbmUtaGVpZ2h0OiAyXCI+PC9pPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcbjxuZy10ZW1wbGF0ZSBsZXQtbm9kZSAjZGVmYXVsdEZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1pdGVtXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1wcmV2aWV3XCIgc3R5bGU9XCJ3aWR0aDogMTAwJTsgaGVpZ2h0OjEwMCVcIj5cclxuICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtMnggZmEtZWxsaXBzaXMtaFwiIHN0eWxlPVwibGluZS1oZWlnaHQ6IDVcIj48L2k+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuPG5nLXRlbXBsYXRlIGxldC10aW1lb3V0TWVzc2FnZSAjZGVmYXVsdExvYWRpbmdPdmVybGF5VGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1iYWNrZHJvcCBsb2FkaW5nXCIgKGNsaWNrKT1cImJhY2tkcm9wQ2xpY2tlZCgpXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWVycm9yXCIgKm5nSWY9XCJ0aW1lb3V0TWVzc2FnZVwiPnt7dGltZW91dE1lc3NhZ2UgfCB0cmFuc2xhdGV9fTwvZGl2PlxyXG4gIDwvZGl2PlxyXG4gIDxkaXYgY2xhc3M9XCJzcGlubmVyXCI+XHJcbiAgICA8aSBjbGFzcz1cImZhcyBmYS01eCBmYS1zcGluIGZhLXN5bmMtYWx0XCI+PC9pPlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgbGV0LW5vZGUgI2RlZmF1bHRTaWRlVmlld1RlbXBsYXRlPlxyXG4gIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IGJvdHRvbTogMDsgd2lkdGg6IDEwMCU7IG1hcmdpbjogNXB4IGF1dG9cIj5cclxuICAgIDxzcGFuICpuZ0lmPVwibm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5ObyBkYXRhIGF2YWlsYWJsZSBmb3IgdGhpcyBmb2xkZXI8L3NwYW4+XHJcbiAgICA8c3BhbiAqbmdJZj1cIiFub2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPk5vIGRhdGEgYXZhaWxhYmxlIGZvciB0aGlzIGZpbGU8L3NwYW4+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcblxyXG48bmd4LXNtYXJ0LW1vZGFsIGlkZW50aWZpZXI9XCJyZW5hbWVNb2RhbFwiIFtkaXNtaXNzYWJsZV09XCJmYWxzZVwiIFtjbG9zYWJsZV09XCJmYWxzZVwiICpuZ0lmPVwic2VsZWN0ZWROb2RlXCIgI3JlbmFtZU1vZGFsPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgdHJhbnNsYXRlPlxyXG4gICAgUmVuYW1lIGZpbGVcclxuICA8L2gyPlxyXG4gIDxwIGNsYXNzPVwicmVuYW1lLW5hbWVcIiB0cmFuc2xhdGU+XHJcbiAgICBPbGQgbmFtZVxyXG4gIDwvcD5cclxuICA8c3BhbiBzdHlsZT1cIm1hcmdpbjogOHB4XCI+e3tzZWxlY3RlZE5vZGUubmFtZX19PC9zcGFuPlxyXG4gIDxwIGNsYXNzPVwicmVuYW1lLW5hbWVcIiB0cmFuc2xhdGU+XHJcbiAgICBOZXcgbmFtZVxyXG4gIDwvcD5cclxuICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJOZXcgbmFtZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJyZW5hbWUtaW5wdXRcIiBbdmFsdWVdPVwic2VsZWN0ZWROb2RlLm5hbWVcIiAjcmVuYW1lSW5wdXRcclxuICAgICAgICAgKGtleXVwLmVudGVyKT1cImhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudCh7dHlwZTogJ3JlbmFtZScsIHZhbHVlOiByZW5hbWVJbnB1dC52YWx1ZX0pXCJcclxuICAgICAgICAgb25jbGljaz1cInRoaXMuc2VsZWN0KCk7XCI+XHJcbiAgPGJyPlxyXG5cclxuICA8ZGl2IGNsYXNzPVwicmVuYW1lLWJ1dHRvblwiPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiB0cmFuc2xhdGVcclxuICAgICAgICAgICAgKGNsaWNrKT1cImhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudCh7dHlwZTogJ3JlbmFtZScsIHZhbHVlOiByZW5hbWVJbnB1dC52YWx1ZX0pXCJcclxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cInJlbmFtZUlucHV0LnZhbHVlID09PSBzZWxlY3RlZE5vZGUubmFtZSB8fCByZW5hbWVJbnB1dC52YWx1ZS5sZW5ndGggPT09IDBcIj5cclxuICAgICAgUmVuYW1lXHJcbiAgICA8L2J1dHRvbj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgKGNsaWNrKT1cInJlbmFtZU1vZGFsLmNsb3NlKClcIiB0cmFuc2xhdGU+XHJcbiAgICAgIENhbmNlbFxyXG4gICAgPC9idXR0b24+XHJcbiAgPC9kaXY+XHJcblxyXG48L25neC1zbWFydC1tb2RhbD5cclxuPG5neC1zbWFydC1tb2RhbCAqbmdJZj1cInNlbGVjdGVkTm9kZVwiIGlkZW50aWZpZXI9XCJjb25maXJtRGVsZXRlTW9kYWxcIiAjZGVsZXRlTW9kYWxcclxuICAgICAgICAgICAgICAgICBbZGlzbWlzc2FibGVdPVwiZmFsc2VcIiBbY2xvc2FibGVdPVwiZmFsc2VcIj5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiPlxyXG4gICAgPHNwYW4gdHJhbnNsYXRlPllvdSBhcmUgdHJ5aW5nIHRvIGRlbGV0ZSBmb2xsb3dpbmcgPC9zcGFuPlxyXG4gICAgPHNwYW4gKm5nSWY9XCJzZWxlY3RlZE5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+Zm9sZGVyPC9zcGFuPlxyXG4gICAgPHNwYW4gKm5nSWY9XCIhc2VsZWN0ZWROb2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPmZpbGU8L3NwYW4+XHJcbiAgPC9oMj5cclxuXHJcbiAgPGRpdiBzdHlsZT1cIndpZHRoOiAxMDAlOyBtYXJnaW46IDVweCBhdXRvOyB0ZXh0LWFsaWduOiBjZW50ZXJcIj57e3NlbGVjdGVkTm9kZS5uYW1lfX08L2Rpdj5cclxuXHJcbiAgPGRpdiBjbGFzcz1cInJlbmFtZS1idXR0b25cIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgKGNsaWNrKT1cImhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudCh7dHlwZTogJ3JlbW92ZSd9KVwiPlxyXG4gICAgICA8c3BhbiB0cmFuc2xhdGU+WWVzLCBkZWxldGUgdGhpcyA8L3NwYW4+XHJcbiAgICAgIDxzcGFuICpuZ0lmPVwic2VsZWN0ZWROb2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPmZvbGRlcjwvc3Bhbj5cclxuICAgICAgPHNwYW4gKm5nSWY9XCIhc2VsZWN0ZWROb2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPmZpbGU8L3NwYW4+XHJcbiAgICA8L2J1dHRvbj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnIFwiIChjbGljayk9XCJkZWxldGVNb2RhbC5jbG9zZSgpXCIgdHJhbnNsYXRlPlxyXG4gICAgICBDYW5jZWxcclxuICAgIDwvYnV0dG9uPlxyXG4gIDwvZGl2PlxyXG48L25neC1zbWFydC1tb2RhbD5cclxuPG5neC1zbWFydC1tb2RhbCBpZGVudGlmaWVyPVwic2VhcmNoTW9kYWxcIiAjc2VhcmNoTW9kYWwgW2Nsb3NhYmxlXT1cInRydWVcIj5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiIHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMnB4XCIgdHJhbnNsYXRlXHJcbiAgICAgICpuZ0lmPVwic2VhcmNoTW9kYWwuaGFzRGF0YSgpICYmIHNlYXJjaE1vZGFsLmdldERhdGEoKS5yZXNwb25zZS5sZW5ndGggIT09IDBcIj5cclxuICAgIFNlYXJjaCByZXN1bHRzIGZvclxyXG4gIDwvaDI+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIiBzdHlsZT1cIm1hcmdpbi1ib3R0b206IDJweFwiIHRyYW5zbGF0ZVxyXG4gICAgICAqbmdJZj1cIiFzZWFyY2hNb2RhbC5oYXNEYXRhKCkgfHwgc2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnJlc3BvbnNlLmxlbmd0aCA9PT0gMFwiPlxyXG4gICAgTm8gcmVzdWx0cyBmb3VuZCBmb3JcclxuICA8L2gyPlxyXG4gIDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXJcIiAqbmdJZj1cInNlYXJjaE1vZGFsLmhhc0RhdGEoKVwiPnt7c2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnNlYXJjaFN0cmluZ319PC9kaXY+XHJcblxyXG4gIDxkaXYgKm5nSWY9XCJzZWFyY2hNb2RhbC5oYXNEYXRhKCkgJiYgc2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnJlc3BvbnNlLmxlbmd0aCAhPT0gMFwiPlxyXG4gICAgPHRhYmxlIHN0eWxlPVwibWFyZ2luOiAwIGF1dG9cIj5cclxuICAgICAgPHRyPlxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInRhYmxlLWl0ZW0gdGFibGUtaGVhZFwiIHRyYW5zbGF0ZT5GaWxlIG5hbWU8L3RkPlxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInRhYmxlLWl0ZW0tc2hvcnQgdGFibGUtaGVhZFwiIHRyYW5zbGF0ZT5TaXplPC90ZD5cclxuICAgICAgPC90cj5cclxuICAgICAgPHRyICpuZ0Zvcj1cImxldCBpdGVtIG9mIHNlYXJjaE1vZGFsLmdldERhdGEoKS5yZXNwb25zZVwiIChjbGljayk9XCJzZWFyY2hDbGlja2VkKGl0ZW0pXCI+XHJcbiAgICAgICAgPHRkIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyXCI+XHJcbiAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiaXRlbS5maWxlQ2F0ZWdvcnkgPT09ICdEJzsgZWxzZSBmaWxlXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWZvbGRlciBzZWFyY2gtb3V0cHV0LWljb25cIj48L2k+XHJcbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZmlsZT5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtZmlsZSBzZWFyY2gtb3V0cHV0LWljb25cIj48L2k+XHJcbiAgICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgICAgPHNwYW4gc3R5bGU9XCJ0ZXh0LW92ZXJmbG93OiBlbGxpcHNpc1wiPnt7aXRlbS5uYW1lfX08L3NwYW4+XHJcbiAgICAgICAgPC90ZD5cclxuICAgICAgICA8dGQgY2xhc3M9XCJ0YWJsZS1pdGVtLXNob3J0XCI+e3tpdGVtLnNpemV9fTwvdGQ+XHJcbiAgICAgIDwvdHI+XHJcbiAgICA8L3RhYmxlPlxyXG4gIDwvZGl2PlxyXG48L25neC1zbWFydC1tb2RhbD5cclxuPG5neC1zbWFydC1tb2RhbCBpZGVudGlmaWVyPVwid2FpdE1vZGFsXCIgW2Nsb3NhYmxlXT1cImZhbHNlXCIgW2Rpc21pc3NhYmxlXT1cImZhbHNlXCIgW2VzY2FwYWJsZV09XCJmYWxzZVwiPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgc3R5bGU9XCJtYXJnaW4tdG9wOiAyMHB4XCI+XHJcbiAgICB7eydQcm9jZXNzaW5nIHJlcXVlc3QnIHwgdHJhbnNsYXRlfX0uLi5cclxuICA8L2gyPlxyXG5cclxuICA8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyOyBoZWlnaHQ6IDcwcHhcIj5cclxuICAgIDxpIGNsYXNzPVwiZmFzIGZhLXNwaW5uZXIgZmEtc3BpbiBmYS00eFwiPjwvaT5cclxuICA8L2Rpdj5cclxuPC9uZ3gtc21hcnQtbW9kYWw+XHJcbjxuZ3gtc21hcnQtbW9kYWwgaWRlbnRpZmllcj1cImVycm9yTW9kYWxcIiBbY2xvc2FibGVdPVwidHJ1ZVwiPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgc3R5bGU9XCJtYXJnaW4tdG9wOiAyMHB4XCI+XHJcbiAgICB7eydTb21ldGhpbmcgd2VudCB3cm9uZyB3aXRoIHlvdXIgcmVxdWVzdCcgfCB0cmFuc2xhdGV9fS4uLlxyXG4gIDwvaDI+XHJcbjwvbmd4LXNtYXJ0LW1vZGFsPlxyXG5gLFxyXG4gIHN0eWxlczogW2AuY29udGVudHtoZWlnaHQ6MTAwJTttaW4td2lkdGg6ODUwcHh9LmhvbGRlcntkaXNwbGF5OmZsZXg7aGVpZ2h0OmNhbGMoMTAwJSAtIDc1cHgpfS5wYXRoe21hcmdpbjphdXRvIDA7ZGlzcGxheTpibG9ja30ubmF2aWdhdGlvbnttYXJnaW46YXV0byAwO2Rpc3BsYXk6ZmxleH0ubmF2aWdhdGlvbiAuYnV0dG9ue21hcmdpbjowIDEwcHg7cGFkZGluZzowO3Bvc2l0aW9uOnJlbGF0aXZlfS5yaWdodHt3aWR0aDoxMDAlO3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmF1dG99LmZpbGUtbmFtZXt3aWR0aDoxMDBweDtoZWlnaHQ6MjVweDtvdmVyZmxvdzpoaWRkZW47d2hpdGUtc3BhY2U6bm93cmFwO3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7Ym94LXNpemluZzpib3JkZXItYm94Oy13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZX0uZmlsZS1wcmV2aWV3e21hcmdpbjphdXRvfS5maWxlLXByZXZpZXcgaXtsaW5lLWhlaWdodDoxLjV9LnNwaW5uZXJ7cG9zaXRpb246YWJzb2x1dGU7dG9wOjUwJTtsZWZ0OjUwJTstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwtNTAlKTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSk7Y3Vyc29yOnByb2dyZXNzfS5yZW5hbWUtYnV0dG9ue21hcmdpbjoyMHB4IGF1dG87ZGlzcGxheTpibG9jazt0ZXh0LWFsaWduOmNlbnRlcn0ubW9kYWwtdGl0bGV7bWFyZ2luLXRvcDo1cHg7dGV4dC1hbGlnbjpjZW50ZXJ9LnNlYXJjaC1vdXRwdXR7bWFyZ2luOjE1cHggMH0uc2VhcmNoLW91dHB1dC1pY29ue21hcmdpbjoycHggNXB4fS50YWJsZS1pdGVte3dpZHRoOjgwJX0udGFibGUtaXRlbS1zaG9ydHt3aWR0aDoyMCU7dGV4dC1hbGlnbjpyaWdodH1gXSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGaWxlTWFuYWdlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgaWNvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIG1vZGFsVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGxvYWRpbmdPdmVybGF5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgc2lkZVZpZXdUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQElucHV0KCkgdHJlZTogVHJlZU1vZGVsO1xyXG4gIEBJbnB1dCgpIGlzUG9wdXA6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBAT3V0cHV0KCkgaXRlbUNsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIHByaXZhdGUgX2xhbmd1YWdlOiBzdHJpbmcgPSAnZW4nO1xyXG4gIEBJbnB1dCgpIHNldCBsYW5ndWFnZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLl9sYW5ndWFnZSA9IHZhbHVlO1xyXG4gICAgdGhpcy50cmFuc2xhdGUudXNlKHRoaXMubGFuZ3VhZ2UpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGxhbmd1YWdlKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fbGFuZ3VhZ2U7XHJcbiAgfVxyXG5cclxuICBzZWxlY3RlZE5vZGU6IE5vZGVJbnRlcmZhY2U7XHJcbiAgc2lkZU1lbnVDbG9zZWQgPSB0cnVlO1xyXG5cclxuICBmbU9wZW4gPSBmYWxzZTtcclxuICBsb2FkaW5nOiBib29sZWFuO1xyXG4gIG5ld0RpYWxvZyA9IGZhbHNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPixcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBub2RlQ2xpY2tlZFNlcnZpY2U6IE5vZGVDbGlja2VkU2VydmljZSxcclxuICAgIHB1YmxpYyBuZ3hTbWFydE1vZGFsU2VydmljZTogTmd4U21hcnRNb2RhbFNlcnZpY2UsXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgICB0cmFuc2xhdGUuc2V0RGVmYXVsdExhbmcoJ2VuJyk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHdpbmRvdy5jb25zb2xlID0gd2luZG93LmNvbnNvbGUgfHwge307XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2cgPSB3aW5kb3cuY29uc29sZS5sb2cgfHwgZnVuY3Rpb24gKCkge1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm5vZGVTZXJ2aWNlLnRyZWUgPSB0aGlzLnRyZWU7XHJcbiAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS50cmVlID0gdGhpcy50cmVlO1xyXG4gICAgdGhpcy5ub2RlU2VydmljZS5zdGFydE1hbmFnZXJBdCh0aGlzLnRyZWUuY3VycmVudFBhdGgpO1xyXG5cclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUuaXNMb2FkaW5nKSlcclxuICAgICAgLnN1YnNjcmliZSgoZGF0YTogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgIHRoaXMubG9hZGluZyA9IGRhdGE7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUuc2VsZWN0ZWROb2RlKSlcclxuICAgICAgLnN1YnNjcmliZSgobm9kZTogTm9kZUludGVyZmFjZSkgPT4ge1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZml4ZWQgaGlnaGxpZ2h0aW5nIGVycm9yIHdoZW4gY2xvc2luZyBub2RlIGJ1dCBub3QgY2hhbmdpbmcgcGF0aFxyXG4gICAgICAgIGlmICgobm9kZS5pc0V4cGFuZGVkICYmIG5vZGUucGF0aFRvTm9kZSAhPT0gdGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCkgJiYgIW5vZGUuc3RheU9wZW4pIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAnc2VsZWN0Jywgbm9kZTogbm9kZX0pO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uSXRlbUNsaWNrZWQoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5pdGVtQ2xpY2tlZC5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIHNlYXJjaENsaWNrZWQoZGF0YTogYW55KSB7XHJcbiAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5SWQoZGF0YS5pZCk7XHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdzZWFyY2hNb2RhbCcpLmNsb3NlKCk7XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFLCBwYXlsb2FkOiBub2RlfSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoZXZlbnQ6IGFueSkge1xyXG4gICAgc3dpdGNoIChldmVudC50eXBlKSB7XHJcbiAgICAgIGNhc2UgJ2Nsb3NlU2lkZVZpZXcnIDpcclxuICAgICAgICByZXR1cm4gdGhpcy5ub2RlQ2xpY2tIYW5kbGVyKGV2ZW50Lm5vZGUsIHRydWUpO1xyXG5cclxuICAgICAgY2FzZSAnc2VsZWN0JyA6XHJcbiAgICAgICAgdGhpcy5vbkl0ZW1DbGlja2VkKGV2ZW50KTtcclxuICAgICAgICB0aGlzLmhpZ2hsaWdodFNlbGVjdGVkKGV2ZW50Lm5vZGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVDbGlja0hhbmRsZXIoZXZlbnQubm9kZSk7XHJcblxyXG4gICAgICBjYXNlICdkb3dubG9hZCcgOlxyXG4gICAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnN0YXJ0RG93bmxvYWQoZXZlbnQubm9kZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub25JdGVtQ2xpY2tlZChldmVudCk7XHJcblxyXG4gICAgICBjYXNlICdyZW5hbWVDb25maXJtJyA6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3JlbmFtZU1vZGFsJykub3BlbigpO1xyXG4gICAgICBjYXNlICdyZW5hbWUnIDpcclxuICAgICAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdyZW5hbWVNb2RhbCcpLmNsb3NlKCk7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnJlbmFtZSh0aGlzLnNlbGVjdGVkTm9kZS5pZCwgZXZlbnQudmFsdWUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uSXRlbUNsaWNrZWQoe1xyXG4gICAgICAgICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgICAgICAgIG5vZGU6IHRoaXMuc2VsZWN0ZWROb2RlLFxyXG4gICAgICAgICAgbmV3TmFtZTogZXZlbnQudmFsdWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIGNhc2UgJ3JlbW92ZUFzayc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ2NvbmZpcm1EZWxldGVNb2RhbCcpLm9wZW4oKTtcclxuICAgICAgY2FzZSAncmVtb3ZlJzpcclxuICAgICAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdjb25maXJtRGVsZXRlTW9kYWwnKS5jbG9zZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5pbml0RGVsZXRlKHRoaXMuc2VsZWN0ZWROb2RlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbkl0ZW1DbGlja2VkKHtcclxuICAgICAgICAgIHR5cGU6IGV2ZW50LnR5cGUsXHJcbiAgICAgICAgICBub2RlOiB0aGlzLnNlbGVjdGVkTm9kZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgY2FzZSAnY3JlYXRlRm9sZGVyJyA6XHJcbiAgICAgICAgY29uc3QgcGFyZW50SWQgPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlQYXRoKHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGgpLmlkO1xyXG5cclxuICAgICAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5jcmVhdGVGb2xkZXIocGFyZW50SWQsIGV2ZW50LnBheWxvYWQpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uSXRlbUNsaWNrZWQoe1xyXG4gICAgICAgICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgICAgICAgIHBhcmVudElkOiBwYXJlbnRJZCxcclxuICAgICAgICAgIG5ld0Rpck5hbWU6IGV2ZW50LnBheWxvYWRcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5vZGVDbGlja0hhbmRsZXIobm9kZTogTm9kZUludGVyZmFjZSwgY2xvc2luZz86IGJvb2xlYW4pIHtcclxuICAgIGlmIChub2RlLm5hbWUgPT09ICdyb290Jykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNsb3NpbmcpIHtcclxuICAgICAgY29uc3QgcGFyZW50Tm9kZSA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeVBhdGgodGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCk7XHJcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUsIHBheWxvYWQ6IHBhcmVudE5vZGV9KTtcclxuICAgICAgdGhpcy5zaWRlTWVudUNsb3NlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgLy8gdG9kbyBmaXggdGhpcyAoa3ZvbGkgdG9tdSB6ZSBzYSBrbGlrYSBuYSB0ZW4gaXN0eSBub2RlIHRhayBzdG9yZSBobyBpZ25vcnVqZSlcclxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWROb2RlID09PSBub2RlICYmIHRoaXMuc2lkZU1lbnVDbG9zZWQpXHJcbiAgICAgICAgdGhpcy5zaWRlTWVudUNsb3NlZCA9IGZhbHNlO1xyXG4gICAgICBlbHNlIGlmICh0aGlzLnNlbGVjdGVkTm9kZSA9PT0gbm9kZSAmJiAhdGhpcy5zaWRlTWVudUNsb3NlZClcclxuICAgICAgICB0aGlzLnNpZGVNZW51Q2xvc2VkID0gdHJ1ZTtcclxuICAgICAgZWxzZSBpZiAodGhpcy5zZWxlY3RlZE5vZGUgIT09IG5vZGUgJiYgdGhpcy5zaWRlTWVudUNsb3NlZClcclxuICAgICAgICB0aGlzLnNpZGVNZW51Q2xvc2VkID0gZmFsc2U7XHJcbiAgICAgIGVsc2UgaWYgKHRoaXMuc2VsZWN0ZWROb2RlICE9PSBub2RlICYmICF0aGlzLnNpZGVNZW51Q2xvc2VkKVxyXG4gICAgICAgIHRoaXMuc2lkZU1lbnVDbG9zZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNlbGVjdGVkTm9kZSA9IG5vZGU7XHJcblxyXG4gICAgaWYgKHRoaXMuc2lkZU1lbnVDbG9zZWQpIHtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGUtdmlldycpLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZS12aWV3JykuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIHRvZG8gc3RheSBEUlkhXHJcbiAgaGlnaGxpZ2h0U2VsZWN0ZWQobm9kZTogTm9kZUludGVyZmFjZSkge1xyXG4gICAgbGV0IHBhdGhUb05vZGUgPSBub2RlLnBhdGhUb05vZGU7XHJcblxyXG4gICAgaWYgKHBhdGhUb05vZGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHBhdGhUb05vZGUgPSAncm9vdCc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdHJlZUVsZW1lbnQgPSB0aGlzLmdldEVsZW1lbnRCeUlkKHBhdGhUb05vZGUsICd0cmVlXycpO1xyXG4gICAgY29uc3QgZmNFbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50QnlJZChwYXRoVG9Ob2RlLCAnZmNfJyk7XHJcbiAgICBpZiAoIXRyZWVFbGVtZW50ICYmICFmY0VsZW1lbnQpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbRmlsZSBNYW5hZ2VyXSBmYWlsZWQgdG8gZmluZCByZXF1ZXN0ZWQgbm9kZSBmb3IgcGF0aDonLCBwYXRoVG9Ob2RlKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVtb3ZlQ2xhc3MoJ2hpZ2hsaWdodGVkJyk7XHJcbiAgICB0aGlzLnJlbW92ZUNsYXNzKCdsaWdodCcpO1xyXG5cclxuICAgIGlmIChmY0VsZW1lbnQpXHJcbiAgICAgIHRoaXMuaGlnaGlsZ2h0Q2hpbGRFbGVtZW50KGZjRWxlbWVudCk7XHJcbiAgICBpZiAodHJlZUVsZW1lbnQpXHJcbiAgICAgIHRoaXMuaGlnaGlsZ2h0Q2hpbGRFbGVtZW50KHRyZWVFbGVtZW50LCB0cnVlKTtcclxuXHJcbiAgICAvLyBwYXJlbnQgbm9kZSBoaWdobGlnaHRcclxuICAgIGxldCBwYXRoVG9QYXJlbnQgPSBub2RlLnBhdGhUb1BhcmVudDtcclxuICAgIGlmIChwYXRoVG9QYXJlbnQgPT09IG51bGwgfHwgbm9kZS5wYXRoVG9Ob2RlID09PSB0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocGF0aFRvUGFyZW50Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBwYXRoVG9QYXJlbnQgPSAncm9vdCc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGFyZW50RWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudEJ5SWQocGF0aFRvUGFyZW50LCAndHJlZV8nKTtcclxuICAgIGlmICghcGFyZW50RWxlbWVudCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1tGaWxlIE1hbmFnZXJdIGZhaWxlZCB0byBmaW5kIHJlcXVlc3RlZCBwYXJlbnQgbm9kZSBmb3IgcGF0aDonLCBwYXRoVG9QYXJlbnQpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5oaWdoaWxnaHRDaGlsZEVsZW1lbnQocGFyZW50RWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGhpZ2hpbGdodENoaWxkRWxlbWVudChlbDogSFRNTEVsZW1lbnQsIGxpZ2h0OiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgIGVsLmNoaWxkcmVuWzBdIC8vIGFwcG5vZGUgZGl2IHdyYXBwZXJcclxuICAgICAgLmNoaWxkcmVuWzBdIC8vIG5nIHRlbXBsYXRlIGZpcnN0IGl0ZW1cclxuICAgICAgLmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodGVkJyk7XHJcblxyXG4gICAgaWYgKGxpZ2h0KVxyXG4gICAgICBlbC5jaGlsZHJlblswXVxyXG4gICAgICAgIC5jaGlsZHJlblswXVxyXG4gICAgICAgIC5jbGFzc0xpc3QuYWRkKCdsaWdodCcpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRFbGVtZW50QnlJZChpZDogc3RyaW5nLCBwcmVmaXg6IHN0cmluZyA9ICcnKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZnVsbElkID0gcHJlZml4ICsgaWQ7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZnVsbElkKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVtb3ZlQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgIEFycmF5LmZyb20oZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWUpKVxyXG4gICAgICAubWFwKChlbDogSFRNTEVsZW1lbnQpID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKSk7XHJcbiAgfVxyXG5cclxuICBmbVNob3dIaWRlKCkge1xyXG4gICAgdGhpcy5mbU9wZW4gPSAhdGhpcy5mbU9wZW47XHJcbiAgfVxyXG5cclxuICBiYWNrZHJvcENsaWNrZWQoKSB7XHJcbiAgICAvLyB0b2RvIGdldCByaWQgb2YgdGhpcyB1Z2x5IHdvcmthcm91bmRcclxuICAgIC8vIHRvZG8gZmlyZSB1c2VyQ2FuY2VsZWRMb2FkaW5nIGV2ZW50XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBTRVRfTE9BRElOR19TVEFURSwgcGF5bG9hZDogZmFsc2V9KTtcclxuICB9XHJcblxyXG4gIGhhbmRsZVVwbG9hZERpYWxvZyhldmVudDogYW55KSB7XHJcbiAgICB0aGlzLm5ld0RpYWxvZyA9IGV2ZW50O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtzZWxlY3QsIFN0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uLy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1mb2xkZXItY29udGVudCcsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwiaXRlbS1ob2xkZXJcIj5cclxuICA8bmctY29udGFpbmVyICpuZ0lmPVwibm9kZXMuaWQgIT09IDBcIj5cclxuICAgIDxhcHAtbm9kZSBbbm9kZV09bm9kZXMgaWQ9XCJ7e25vZGVzLnBhdGhUb05vZGV9fVwiPlxyXG4gICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2Rlc31cIlxyXG4gICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGVcIj5cclxuICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICA8L2FwcC1ub2RlPlxyXG4gIDwvbmctY29udGFpbmVyPlxyXG5cclxuICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBub2RlIG9mIG9iai5rZXlzKG5vZGVzLmNoaWxkcmVuKVwiPlxyXG4gICAgPGFwcC1ub2RlIFtub2RlXT1cIm5vZGVzLmNoaWxkcmVuW25vZGVdXCJcclxuICAgICAgICAgICAgICBpZD1cImZjX3t7bm9kZXMuY2hpbGRyZW5bbm9kZV0ucGF0aFRvTm9kZX19XCI+XHJcbiAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGVzLmNoaWxkcmVuW25vZGVdfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiZm9sZGVyQ29udGVudFRlbXBsYXRlXCI+XHJcbiAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgPC9hcHAtbm9kZT5cclxuICA8L25nLWNvbnRhaW5lcj5cclxuXHJcbiAgPGRpdiBjbGFzcz1cIm5ld1wiIChjbGljayk9XCJuZXdDbGlja2VkQWN0aW9uKClcIj5cclxuICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwiZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2AuaXRlbS1ob2xkZXJ7Ym94LXNpemluZzpib3JkZXItYm94O2Rpc3BsYXk6ZmxleDtmbGV4LWZsb3c6d3JhcH0uaXRlbS1ob2xkZXIgLm5ld3tkaXNwbGF5OmlubGluZX1gXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRm9sZGVyQ29udGVudENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBASW5wdXQoKSB0cmVlTW9kZWw6IFRyZWVNb2RlbDtcclxuXHJcbiAgQE91dHB1dCgpIG9wZW5VcGxvYWREaWFsb2cgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIG5vZGVzOiBOb2RlSW50ZXJmYWNlO1xyXG4gIG9iaiA9IE9iamVjdDtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPlxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLnBhdGgpKVxyXG4gICAgICAuc3Vic2NyaWJlKChwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgICB0aGlzLm5vZGVzID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5UGF0aChwYXRoKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZXdDbGlja2VkQWN0aW9uKCkge1xyXG4gICAgdGhpcy5vcGVuVXBsb2FkRGlhbG9nLmVtaXQodHJ1ZSk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7QWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsIElucHV0LCBPbkluaXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtUcmVlTW9kZWx9IGZyb20gJy4uLy4uL21vZGVscy90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtzZWxlY3QsIFN0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uLy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi4vLi4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQge2ZpcnN0fSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC10cmVlJyxcclxuICB0ZW1wbGF0ZTogYDxhcHAtbm9kZS1saXN0ZXIgW3Nob3dGaWxlc109XCJ0cmVlTW9kZWwuY29uZmlnLm9wdGlvbnMuc2hvd0ZpbGVzSW5zaWRlVHJlZVwiXHJcbiAgICAgICAgICAgICAgICAgW25vZGVzXT1cIntjaGlsZHJlbjogbm9kZXN9XCI+XHJcbiAgPG5nLXRlbXBsYXRlIGxldC1ub2Rlcz5cclxuICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGVzfVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRlbXBsYXRlUmVmXCI+PC9uZy1jb250YWluZXI+XHJcbiAgPC9uZy10ZW1wbGF0ZT5cclxuPC9hcHAtbm9kZS1saXN0ZXI+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYGBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUcmVlQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25Jbml0IHtcclxuICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmKSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQElucHV0KCkgdHJlZU1vZGVsOiBUcmVlTW9kZWw7XHJcblxyXG4gIG5vZGVzOiBOb2RlSW50ZXJmYWNlO1xyXG4gIGN1cnJlbnRUcmVlTGV2ZWwgPSAnJztcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPlxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLm5vZGVzID0gdGhpcy50cmVlTW9kZWwubm9kZXM7XHJcblxyXG4gICAgLy90b2RvIG1vdmUgdGhpcyBzdG9yZSB0byBwcm9wZXIgcGxhY2VcclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUucGF0aCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHRoaXMubm9kZVNlcnZpY2UuZ2V0Tm9kZXMocGF0aCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFRyZWVMZXZlbCA9IHRoaXMudHJlZU1vZGVsLmN1cnJlbnRQYXRoO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy50cmVlTW9kZWwuY3VycmVudFBhdGggPSBwYXRoO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUucGF0aCkpXHJcbiAgICAgIC5waXBlKGZpcnN0KCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5UGF0aChwYXRoKTtcclxuICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFLCBwYXlsb2FkOiBub2Rlc30pO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgSW5wdXQsIE9uSW5pdCwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLW5vZGUtbGlzdGVyJyxcbiAgdGVtcGxhdGU6IGA8dWwgY2xhc3M9XCJub2RlLWxpc3Rlci1mbGlzdFwiPlxyXG4gIDwhLS1JbiBvcmRlciB0byBhdm9pZCBoYXZpbmcgdG8gY3JlYXRlIHRoYXQgZXh0cmEgZGl2LCB3ZSBjYW4gaW5zdGVhZCB1c2UgbmctY29udGFpbmVyIGRpcmVjdGl2ZS0tPlxyXG4gIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IG5vZGUgb2Ygb2JqLmtleXMobm9kZXMpXCI+XHJcbiAgICA8bGkgY2xhc3M9XCJub2RlLWxpc3Rlci1saXN0LWl0ZW1cIiAqbmdJZj1cIm5vZGVzW25vZGVdLmlzRm9sZGVyIHx8IHNob3dGaWxlc1wiPlxyXG5cclxuICAgICAgPGFwcC1ub2RlIGNsYXNzPVwibm9kZS1saXN0ZXItYXBwLW5vZGVcIiBbbm9kZV09XCJub2Rlc1tub2RlXVwiIGlkPVwidHJlZV97e25vZGVzW25vZGVdLmlkID09PSAwID8gJ3Jvb3QnIDogbm9kZXNbbm9kZV0ucGF0aFRvTm9kZX19XCI+XHJcbiAgICAgICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogKG5vZGVzW25vZGVdKX1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwidGVtcGxhdGVSZWZcIj5cclxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgICAgPC9hcHAtbm9kZT5cclxuXHJcbiAgICAgIDxhcHAtbm9kZS1saXN0ZXIgY2xhc3M9XCJub2RlLWxpc3RlclwiICpuZ0lmPVwib2JqLmtleXMobm9kZXNbbm9kZV0uY2hpbGRyZW4pLmxlbmd0aCA+IDBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgIFtzaG93RmlsZXNdPVwic2hvd0ZpbGVzXCIgW25vZGVzXT1cIm5vZGVzW25vZGVdLmNoaWxkcmVuXCI+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlIGxldC1ub2Rlcz5cclxuICAgICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IChub2Rlcyl9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwidGVtcGxhdGVSZWZcIj5cclxuICAgICAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgIDwvYXBwLW5vZGUtbGlzdGVyPlxyXG4gICAgPC9saT5cclxuICA8L25nLWNvbnRhaW5lcj5cclxuPC91bD5cclxuYCxcbiAgc3R5bGVzOiBbYC5ub2RlLWxpc3Rlci1mbGlzdHttYXJnaW46MCAwIDAgMWVtO3BhZGRpbmc6MDtsaXN0LXN0eWxlOm5vbmU7d2hpdGUtc3BhY2U6bm93cmFwfS5ub2RlLWxpc3Rlci1saXN0LWl0ZW17bGlzdC1zdHlsZTpub25lO2xpbmUtaGVpZ2h0OjEuMmVtO2ZvbnQtc2l6ZToxZW07ZGlzcGxheTppbmxpbmV9Lm5vZGUtbGlzdGVyLWxpc3QtaXRlbSAubm9kZS1saXN0ZXItYXBwLW5vZGUuZGVzZWxlY3RlZCsubm9kZS1saXN0ZXIgdWx7ZGlzcGxheTpub25lfWBdXG59KVxuZXhwb3J0IGNsYXNzIE5vZGVMaXN0ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmKSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PjtcbiAgQElucHV0KCkgbm9kZXM6IE5vZGVJbnRlcmZhY2U7XG4gIEBJbnB1dCgpIHNob3dGaWxlczogYm9vbGVhbjtcblxuICBvYmogPSBPYmplY3Q7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge1N0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcblxyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4uLy4uLy4uL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vLi4vLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtOb2RlQ2xpY2tlZFNlcnZpY2V9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL25vZGUtY2xpY2tlZC5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5vZGUnLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiAjY3VzdG9tVGVtcGxhdGUgKGRibGNsaWNrKT1cIm1ldGhvZDJDYWxsRm9yRGJsQ2xpY2soJGV2ZW50KVwiIChjbGljayk9XCJtZXRob2QxQ2FsbEZvckNsaWNrKCRldmVudClcIj5cclxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2BgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTm9kZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgbm9kZTogTm9kZUludGVyZmFjZTtcclxuICBpc1NpbmdsZUNsaWNrID0gdHJ1ZTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4sXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgbm9kZUNsaWNrZWRTZXJ2aWNlOiBOb2RlQ2xpY2tlZFNlcnZpY2VcclxuICApIHtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBtZXRob2QxQ2FsbEZvckNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIHRoaXMuaXNTaW5nbGVDbGljayA9IHRydWU7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgaWYgKHRoaXMuaXNTaW5nbGVDbGljaykge1xyXG4gICAgICAgIHRoaXMuc2hvd01lbnUoKTtcclxuICAgICAgfVxyXG4gICAgfSwgMjAwKTtcclxuICB9XHJcblxyXG4gIC8vIHRvZG8gZXZlbnQucHJldmVudERlZmF1bHQgZm9yIGRvdWJsZSBjbGlja1xyXG4gIHB1YmxpYyBtZXRob2QyQ2FsbEZvckRibENsaWNrKGV2ZW50OiBhbnkpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgdGhpcy5pc1NpbmdsZUNsaWNrID0gZmFsc2U7XHJcbiAgICB0aGlzLm9wZW4oKTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvcGVuKCkge1xyXG4gICAgaWYgKCF0aGlzLm5vZGUuaXNGb2xkZXIpIHtcclxuICAgICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2Uuc3RhcnREb3dubG9hZCh0aGlzLm5vZGUpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMubm9kZS5zdGF5T3Blbikge1xyXG4gICAgICBpZiAodGhpcy5ub2RlLm5hbWUgPT0gJ3Jvb3QnKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlU2VydmljZS5mb2xkQWxsKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1BBVEgsIHBheWxvYWQ6IHRoaXMubm9kZS5wYXRoVG9Ob2RlfSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRvZ2dsZU5vZGVFeHBhbmRlZCgpO1xyXG5cclxuICAgIGlmICh0aGlzLm5vZGUuaXNFeHBhbmRlZCkge1xyXG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiB0aGlzLm5vZGUucGF0aFRvTm9kZX0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0Tm9kZVNlbGVjdGVkU3RhdGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2hvd01lbnUoKSB7XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFLCBwYXlsb2FkOiB0aGlzLm5vZGV9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdG9nZ2xlTm9kZUV4cGFuZGVkKCkge1xyXG4gICAgdGhpcy5ub2RlLmlzRXhwYW5kZWQgPSAhdGhpcy5ub2RlLmlzRXhwYW5kZWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldE5vZGVTZWxlY3RlZFN0YXRlKCkge1xyXG4gICAgaWYgKCF0aGlzLm5vZGUuaXNFeHBhbmRlZCkge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJlZV8nICsgdGhpcy5ub2RlLnBhdGhUb05vZGUpLmNsYXNzTGlzdC5hZGQoJ2Rlc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgIHRoaXMubm9kZVNlcnZpY2UuZm9sZFJlY3Vyc2l2ZWx5KHRoaXMubm9kZSk7XHJcblxyXG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiB0aGlzLm5vZGUucGF0aFRvUGFyZW50fSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJlZV8nICsgdGhpcy5ub2RlLnBhdGhUb05vZGUpLmNsYXNzTGlzdC5yZW1vdmUoJ2Rlc2VsZWN0ZWQnKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtQaXBlLCBQaXBlVHJhbnNmb3JtfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQFBpcGUoe1xuICBuYW1lOiAnbWFwVG9JdGVyYWJsZVBpcGUnXG59KVxuZXhwb3J0IGNsYXNzIE1hcFRvSXRlcmFibGVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIHRyYW5zZm9ybShkaWN0OiBPYmplY3QpIHtcbiAgICBjb25zdCBhID0gW107XG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGljdCkge1xuICAgICAgaWYgKGRpY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBhLnB1c2goe2tleToga2V5LCB2YWw6IGRpY3Rba2V5XX0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhO1xuICB9XG59XG4iLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7c2VsZWN0LCBTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuLi8uLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi8uLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLW5hdi1iYXInLFxuICB0ZW1wbGF0ZTogYDxkaXY+XG4gID4+IDxzcGFuICpuZ0Zvcj1cImxldCB0byBvZiBjdXJyZW50UGF0aDsgbGV0IGkgPSBpbmRleFwiPlxuICA8YSBjbGFzcz1cImxpbmtcIiBocmVmPVwiI1wiIChjbGljayk9XCJvbkNsaWNrKGN1cnJlbnRQYXRoLCBpKVwiPlxuICAgIDxkaXYgKm5nSWY9XCJ0byA9PT0gJycgfHwgdG8gPT09ICdyb290JzsgdGhlbiBpY29uIGVsc2UgbmFtZVwiPjwvZGl2PlxuICAgIDxuZy10ZW1wbGF0ZSAjaWNvbj48aSBjbGFzcz1cImZhcyBmYS1ob21lXCI+PC9pPjwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlICNuYW1lPnt7dG99fTwvbmctdGVtcGxhdGU+XG4gIDwvYT4gL1xuICA8L3NwYW4+XG48L2Rpdj5cbmAsXG4gIHN0eWxlczogW2BgXVxufSlcbmV4cG9ydCBjbGFzcyBOYXZCYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBjdXJyZW50UGF0aDogc3RyaW5nW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+LFxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlXG4gICkge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5zdG9yZVxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUucGF0aCkpXG4gICAgICAuc3Vic2NyaWJlKChkYXRhOiBzdHJpbmcpID0+IHtcbiAgICAgICAgdGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCA9IGRhdGE7XG4gICAgICAgIHRoaXMuY3VycmVudFBhdGggPSBkYXRhLnNwbGl0KCcvJyk7XG4gICAgICB9KTtcbiAgfVxuXG4gIG9uQ2xpY2socGF0aDogc3RyaW5nW10sIGluZGV4OiBudW1iZXIpIHtcbiAgICBjb25zdCBuZXdQYXRoID0gcGF0aC5zbGljZSgwLCBpbmRleCArIDEpLmpvaW4oJy8nKTtcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiBuZXdQYXRofSk7XG4gIH1cblxufVxuIiwiaW1wb3J0IHtTdGF0ZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9zdGF0ZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4vYWN0aW9ucy5hY3Rpb24nO1xyXG5cclxuY29uc3QgaW5pdGlhbFN0YXRlOiBTdGF0ZUludGVyZmFjZSA9IHtcclxuICBwYXRoOiAnJyxcclxuICBpc0xvYWRpbmc6IHRydWUsXHJcbiAgc2VsZWN0ZWROb2RlOiBudWxsXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RhdGVSZWR1Y2VyKHN0YXRlOiBTdGF0ZUludGVyZmFjZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uOiBBQ1RJT05TLkFjdGlvbnMpOiBTdGF0ZUludGVyZmFjZSB7XHJcbiAgLy8gY29uc29sZS5sb2coJ1ByZXZpb3VzIHN0YXRlOiAnLCBzdGF0ZSk7XHJcbiAgLy8gY29uc29sZS5sb2coJ0FDVElPTiB0eXBlOiAnLCBhY3Rpb24udHlwZSk7XHJcbiAgLy8gY29uc29sZS5sb2coJ0FDVElPTiBwYXlsb2FkOiAnLCBhY3Rpb24ucGF5bG9hZCk7XHJcblxyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgQUNUSU9OUy5TRVRfUEFUSCA6XHJcbiAgICAgIGlmIChzdGF0ZS5wYXRoID09PSBhY3Rpb24ucGF5bG9hZCkge1xyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gey4uLnN0YXRlLCBwYXRoOiBhY3Rpb24ucGF5bG9hZCwgaXNMb2FkaW5nOiB0cnVlfTtcclxuICAgIGNhc2UgQUNUSU9OUy5TRVRfTE9BRElOR19TVEFURSA6XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUsIGlzTG9hZGluZzogYWN0aW9uLnBheWxvYWR9O1xyXG4gICAgY2FzZSBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFIDpcclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgc2VsZWN0ZWROb2RlOiBhY3Rpb24ucGF5bG9hZH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gaW5pdGlhbFN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge3N0YXRlUmVkdWNlcn0gZnJvbSAnLi9zdGF0ZVJlZHVjZXInO1xuaW1wb3J0IHtBY3Rpb25SZWR1Y2VyTWFwfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQge1N0YXRlSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL3N0YXRlLmludGVyZmFjZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXBwU3RvcmUge1xuICBmaWxlTWFuYWdlclN0YXRlOiBTdGF0ZUludGVyZmFjZTtcbn1cblxuZXhwb3J0IGNvbnN0IHJlZHVjZXJzOiBBY3Rpb25SZWR1Y2VyTWFwPEFwcFN0b3JlPiA9IHtcbiAgZmlsZU1hbmFnZXJTdGF0ZTogc3RhdGVSZWR1Y2VyXG59O1xuIiwiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtffSBmcm9tICdAYmllc2JqZXJnL25neC10cmFuc2xhdGUtZXh0cmFjdC9kaXN0L3V0aWxzL3V0aWxzJztcclxuaW1wb3J0IHt0aW1lcn0gZnJvbSAncnhqcyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1sb2FkaW5nLW92ZXJsYXknLFxyXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRhaW5lclxuICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogdGltZW91dE1lc3NhZ2V9XCJcbiAgW25nVGVtcGxhdGVPdXRsZXRdPVwibG9hZGluZ092ZXJsYXlUZW1wbGF0ZVwiPlxuPC9uZy1jb250YWluZXI+XG5gLFxyXG4gIHN0eWxlczogW2BgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTG9hZGluZ092ZXJsYXlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIGxvYWRpbmdPdmVybGF5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgdGltZW91dE1lc3NhZ2U6IGFueTtcclxuXHJcbiAgLy8gdG9kbyB1bnN1YnNjcmliZSBmcm9tICdsaXN0JyBldmVudCAtIG5vdyB3ZSBhcmUgb25seSBkaXNtaXNzaW5nIHRoaXMgY29tcG9uZW50XHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aW1lcigyMDAwKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLnRpbWVvdXRNZXNzYWdlID0gXygnVHJvdWJsZXMgd2l0aCBsb2FkaW5nPyBDbGljayBhbnl3aGVyZSB0byBjYW5jZWwgbG9hZGluZycpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLypcbiAqIENvbnZlcnQgYnl0ZXMgaW50byBsYXJnZXN0IHBvc3NpYmxlIHVuaXQuXG4gKiBUYWtlcyBhbiBwcmVjaXNpb24gYXJndW1lbnQgdGhhdCBkZWZhdWx0cyB0byAyLlxuICogVXNhZ2U6XG4gKiAgIGJ5dGVzIHwgZmlsZVNpemU6cHJlY2lzaW9uXG4gKiBFeGFtcGxlOlxuICogICB7eyAxMDI0IHwgIGZpbGVTaXplfX1cbiAqICAgZm9ybWF0cyB0bzogMSBLQlxuKi9cbkBQaXBlKHtuYW1lOiAnZmlsZVNpemUnfSlcbmV4cG9ydCBjbGFzcyBGaWxlU2l6ZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICBwcml2YXRlIHVuaXRzID0gW1xuICAgICdieXRlcycsXG4gICAgJ0tCJyxcbiAgICAnTUInLFxuICAgICdHQicsXG4gICAgJ1RCJyxcbiAgICAnUEInXG4gIF07XG5cbiAgdHJhbnNmb3JtKGJ5dGVzOiBudW1iZXIgPSAwLCBwcmVjaXNpb246IG51bWJlciA9IDIgKSA6IHN0cmluZyB7XG4gICAgaWYgKCBpc05hTiggcGFyc2VGbG9hdCggU3RyaW5nKGJ5dGVzKSApKSB8fCAhIGlzRmluaXRlKCBieXRlcyApICkgcmV0dXJuICc/JztcblxuICAgIGxldCB1bml0ID0gMDtcblxuICAgIHdoaWxlICggYnl0ZXMgPj0gMTAyNCApIHtcbiAgICAgIGJ5dGVzIC89IDEwMjQ7XG4gICAgICB1bml0ICsrO1xuICAgIH1cblxuICAgIHJldHVybiBieXRlcy50b0ZpeGVkKCArIHByZWNpc2lvbiApICsgJyAnICsgdGhpcy51bml0c1sgdW5pdCBdO1xuICB9XG59XG4iLCJpbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7RmluZVVwbG9hZGVyfSBmcm9tICdmaW5lLXVwbG9hZGVyJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLXVwbG9hZCcsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwiYmFja2Ryb3BcIiAoY2xpY2spPVwibmV3Q2xpY2tlZEFjdGlvbigpXCI+PC9kaXY+XG48ZGl2IGNsYXNzPVwidXBsb2FkLWJhY2tncm91bmRcIj5cbiAgPGRpdiBjbGFzcz1cImJ1dHRvbnNcIj5cbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uXCIgW2Rpc2FibGVkXT1cIm5ld0ZvbGRlclwiIChjbGljayk9XCJjcmVhdGVOZXdGb2xkZXIoKVwiIHRyYW5zbGF0ZT5DcmVhdGUgbmV3IGZvbGRlcjwvYnV0dG9uPlxuICA8L2Rpdj5cblxuICA8ZGl2ICpuZ0lmPVwibmV3Rm9sZGVyXCI+XG4gICAgPGRpdiBjbGFzcz1cImJ1dHRvbnNcIj5cbiAgICAgIDxhcHAtbmV3LWZvbGRlciAoYnV0dG9uQ2xpY2tlZCk9XCJjcmVhdGVOZXdGb2xkZXIoJGV2ZW50KVwiPjwvYXBwLW5ldy1mb2xkZXI+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuXG4gIDxkaXYgaWQ9XCJmaW5lLXVwbG9hZGVyXCI+XG4gIDwvZGl2PlxuXG5cbiAgPGRpdiBjbGFzcz1cImJ1dHRvbnNcIj5cbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIFtkaXNhYmxlZF09XCJ0aGlzLmNvdW50ZXIgPCAxXCIgKGNsaWNrKT1cInVwbG9hZEZpbGVzKClcIiB0cmFuc2xhdGU+XG4gICAgICBVcGxvYWRcbiAgICA8L2J1dHRvbj5cbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIChjbGljayk9XCJuZXdDbGlja2VkQWN0aW9uKClcIiB0cmFuc2xhdGU+XG4gICAgICBDbG9zZVxuICAgIDwvYnV0dG9uPlxuICA8L2Rpdj5cblxuPC9kaXY+XG5cbjxkaXYgaWQ9XCJmaW5lLXVwbG9hZGVyLXRlbXBsYXRlXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPlxuICA8ZGl2IGNsYXNzPVwicXEtdXBsb2FkZXItc2VsZWN0b3IgcXEtdXBsb2FkZXJcIiBxcS1kcm9wLWFyZWEtdGV4dD1cIkRyb3AgZmlsZXMgaGVyZVwiPlxuICAgIDxkaXYgY2xhc3M9XCJxcS11cGxvYWQtZHJvcC1hcmVhLXNlbGVjdG9yIHFxLXVwbG9hZC1kcm9wLWFyZWFcIiBxcS1oaWRlLWRyb3B6b25lPlxuICAgICAgPHNwYW4gY2xhc3M9XCJxcS11cGxvYWQtZHJvcC1hcmVhLXRleHQtc2VsZWN0b3JcIj48L3NwYW4+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwidXBsb2FkLXRvcC1iYXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJxcS11cGxvYWQtYnV0dG9uLXNlbGVjdG9yIHFxLXVwbG9hZC1idXR0b25cIj5cbiAgICAgICAgPGRpdiB0cmFuc2xhdGU+VXBsb2FkIGEgZmlsZTwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgY2xhc3M9XCJxcS10b3RhbC1wcm9ncmVzcy1iYXItY29udGFpbmVyLXNlbGVjdG9yIHFxLXRvdGFsLXByb2dyZXNzLWJhci1jb250YWluZXJcIj5cbiAgICAgICAgPGRpdiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMFwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiXG4gICAgICAgICAgICAgY2xhc3M9XCJxcS10b3RhbC1wcm9ncmVzcy1iYXItc2VsZWN0b3IgcXEtcHJvZ3Jlc3MtYmFyIHFxLXRvdGFsLXByb2dyZXNzLWJhclwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8c3BhbiBjbGFzcz1cInFxLWRyb3AtcHJvY2Vzc2luZy1zZWxlY3RvciBxcS1kcm9wLXByb2Nlc3NpbmdcIj5cbiAgICAgICAgICAgIDxzcGFuIHRyYW5zbGF0ZT5Qcm9jZXNzaW5nIGRyb3BwZWQgZmlsZXM8L3NwYW4+Li4uXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInFxLWRyb3AtcHJvY2Vzc2luZy1zcGlubmVyLXNlbGVjdG9yIHFxLWRyb3AtcHJvY2Vzc2luZy1zcGlubmVyXCI+PC9zcGFuPlxuICAgIDwvc3Bhbj5cblxuICAgIDx1bCBjbGFzcz1cInFxLXVwbG9hZC1saXN0LXNlbGVjdG9yIHFxLXVwbG9hZC1saXN0XCIgYXJpYS1saXZlPVwicG9saXRlXCIgYXJpYS1yZWxldmFudD1cImFkZGl0aW9ucyByZW1vdmFsc1wiPlxuICAgICAgPGxpPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicXEtcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lci1zZWxlY3RvclwiPlxuICAgICAgICAgIDxkaXYgcm9sZT1cInByb2dyZXNzYmFyXCIgYXJpYS12YWx1ZW5vdz1cIjBcIiBhcmlhLXZhbHVlbWluPVwiMFwiIGFyaWEtdmFsdWVtYXg9XCIxMDBcIlxuICAgICAgICAgICAgICAgY2xhc3M9XCJxcS1wcm9ncmVzcy1iYXItc2VsZWN0b3IgcXEtcHJvZ3Jlc3MtYmFyXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8c3BhbiBjbGFzcz1cInFxLXVwbG9hZC1zcGlubmVyLXNlbGVjdG9yIHFxLXVwbG9hZC1zcGlubmVyXCI+PC9zcGFuPlxuICAgICAgICA8aW1nIGNsYXNzPVwicXEtdGh1bWJuYWlsLXNlbGVjdG9yXCIgcXEtbWF4LXNpemU9XCIxMDBcIiBxcS1zZXJ2ZXItc2NhbGU+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwicXEtdXBsb2FkLWZpbGUtc2VsZWN0b3IgcXEtdXBsb2FkLWZpbGVcIj48L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwicXEtZWRpdC1maWxlbmFtZS1pY29uLXNlbGVjdG9yIHFxLWVkaXQtZmlsZW5hbWUtaWNvblwiIGFyaWEtbGFiZWw9XCJFZGl0IGZpbGVuYW1lXCI+PC9zcGFuPlxuICAgICAgICA8aW5wdXQgY2xhc3M9XCJxcS1lZGl0LWZpbGVuYW1lLXNlbGVjdG9yIHFxLWVkaXQtZmlsZW5hbWVcIiB0YWJpbmRleD1cIjBcIiB0eXBlPVwidGV4dFwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cInFxLXVwbG9hZC1zaXplLXNlbGVjdG9yIHFxLXVwbG9hZC1zaXplXCI+PC9zcGFuPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWJ0biBxcS11cGxvYWQtY2FuY2VsLXNlbGVjdG9yIHFxLXVwbG9hZC1jYW5jZWxcIiB0cmFuc2xhdGU+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtYnRuIHFxLXVwbG9hZC1yZXRyeS1zZWxlY3RvciBxcS11cGxvYWQtcmV0cnlcIiB0cmFuc2xhdGU+UmV0cnk8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1idG4gcXEtdXBsb2FkLWRlbGV0ZS1zZWxlY3RvciBxcS11cGxvYWQtZGVsZXRlXCIgdHJhbnNsYXRlPkRlbGV0ZTwvYnV0dG9uPlxuICAgICAgICA8c3BhbiByb2xlPVwic3RhdHVzXCIgY2xhc3M9XCJxcS11cGxvYWQtc3RhdHVzLXRleHQtc2VsZWN0b3IgcXEtdXBsb2FkLXN0YXR1cy10ZXh0XCI+PC9zcGFuPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuXG4gICAgPGRpYWxvZyBjbGFzcz1cInFxLWFsZXJ0LWRpYWxvZy1zZWxlY3RvclwiPlxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLWJ1dHRvbnNcIj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1jYW5jZWwtYnV0dG9uLXNlbGVjdG9yXCIgdHJhbnNsYXRlPkNsb3NlPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2RpYWxvZz5cblxuICAgIDxkaWFsb2cgY2xhc3M9XCJxcS1jb25maXJtLWRpYWxvZy1zZWxlY3RvclwiPlxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLWJ1dHRvbnNcIj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1jYW5jZWwtYnV0dG9uLXNlbGVjdG9yXCIgdHJhbnNsYXRlPk5vPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtb2stYnV0dG9uLXNlbGVjdG9yXCIgdHJhbnNsYXRlPlllczwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaWFsb2c+XG5cbiAgICA8ZGlhbG9nIGNsYXNzPVwicXEtcHJvbXB0LWRpYWxvZy1zZWxlY3RvclwiPlxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXCI+PC9kaXY+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJxcS1kaWFsb2ctYnV0dG9uc1wiPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWNhbmNlbC1idXR0b24tc2VsZWN0b3JcIiB0cmFuc2xhdGU+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtb2stYnV0dG9uLXNlbGVjdG9yXCIgdHJhbnNsYXRlPk9rPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2RpYWxvZz5cbiAgPC9kaXY+XG48L2Rpdj5cbmAsXHJcbiAgc3R5bGVzOiBbYC51cGxvYWQtY29udGVudHt0ZXh0LWFsaWduOmNlbnRlcjttYXgtaGVpZ2h0OjI1dmg7b3ZlcmZsb3c6YXV0bzttYXJnaW46MTBweCBhdXRvfS5mYS10aW1lczpiZWZvcmV7Y29udGVudDpcIlxcXFxmMDBkXCJ9LmJ1dHRvbnN7YmFja2dyb3VuZDojZmZmO3BhZGRpbmc6NXB4O21hcmdpbjoxMHB4IDB9YCwgYC5xcS11cGxvYWQtYnV0dG9uIGRpdntsaW5lLWhlaWdodDoyNXB4fS5xcS11cGxvYWQtYnV0dG9uLWZvY3Vze291dGxpbmU6MH0ucXEtdXBsb2FkZXJ7cG9zaXRpb246cmVsYXRpdmU7bWluLWhlaWdodDoyMDBweDttYXgtaGVpZ2h0OjQ5MHB4O292ZXJmbG93LXk6aGlkZGVuO3dpZHRoOmluaGVyaXQ7Ym9yZGVyLXJhZGl1czo2cHg7YmFja2dyb3VuZC1jb2xvcjojZmRmZGZkO2JvcmRlcjoxcHggZGFzaGVkICNjY2M7cGFkZGluZzoyMHB4fS5xcS11cGxvYWRlcjpiZWZvcmV7Y29udGVudDphdHRyKHFxLWRyb3AtYXJlYS10ZXh0KSBcIiBcIjtwb3NpdGlvbjphYnNvbHV0ZTtmb250LXNpemU6MjAwJTtsZWZ0OjA7d2lkdGg6MTAwJTt0ZXh0LWFsaWduOmNlbnRlcjt0b3A6NDUlO29wYWNpdHk6LjI1fS5xcS11cGxvYWQtZHJvcC1hcmVhLC5xcS11cGxvYWQtZXh0cmEtZHJvcC1hcmVhe3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO2xlZnQ6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO21pbi1oZWlnaHQ6MzBweDt6LWluZGV4OjI7YmFja2dyb3VuZDojZjlmOWY5O2JvcmRlci1yYWRpdXM6NHB4O2JvcmRlcjoxcHggZGFzaGVkICNjY2M7dGV4dC1hbGlnbjpjZW50ZXJ9LnFxLXVwbG9hZC1kcm9wLWFyZWEgc3BhbntkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7d2lkdGg6MTAwJTttYXJnaW4tdG9wOi04cHg7Zm9udC1zaXplOjE2cHh9LnFxLXVwbG9hZC1leHRyYS1kcm9wLWFyZWF7cG9zaXRpb246cmVsYXRpdmU7bWFyZ2luLXRvcDo1MHB4O2ZvbnQtc2l6ZToxNnB4O3BhZGRpbmctdG9wOjMwcHg7aGVpZ2h0OjIwcHg7bWluLWhlaWdodDo0MHB4fS5xcS11cGxvYWQtZHJvcC1hcmVhLWFjdGl2ZXtiYWNrZ3JvdW5kOiNmZGZkZmQ7Ym9yZGVyLXJhZGl1czo0cHg7Ym9yZGVyOjFweCBkYXNoZWQgI2NjY30ucXEtdXBsb2FkLWxpc3R7bWFyZ2luOjA7cGFkZGluZzowO2xpc3Qtc3R5bGU6bm9uZTttYXgtaGVpZ2h0OjQ1MHB4O292ZXJmbG93LXk6YXV0bztjbGVhcjpib3RofS5xcS11cGxvYWQtbGlzdCBsaXttYXJnaW46MDtwYWRkaW5nOjlweDtsaW5lLWhlaWdodDoxNXB4O2ZvbnQtc2l6ZToxNnB4O2NvbG9yOiM0MjQyNDI7YmFja2dyb3VuZC1jb2xvcjojZjZmNmY2O2JvcmRlci10b3A6MXB4IHNvbGlkICNmZmY7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2RkZH0ucXEtdXBsb2FkLWxpc3QgbGk6Zmlyc3QtY2hpbGR7Ym9yZGVyLXRvcDpub25lfS5xcS11cGxvYWQtbGlzdCBsaTpsYXN0LWNoaWxke2JvcmRlci1ib3R0b206bm9uZX0ucXEtdXBsb2FkLWNhbmNlbCwucXEtdXBsb2FkLWNvbnRpbnVlLC5xcS11cGxvYWQtZGVsZXRlLC5xcS11cGxvYWQtZmFpbGVkLXRleHQsLnFxLXVwbG9hZC1maWxlLC5xcS11cGxvYWQtcGF1c2UsLnFxLXVwbG9hZC1yZXRyeSwucXEtdXBsb2FkLXNpemUsLnFxLXVwbG9hZC1zcGlubmVye21hcmdpbi1yaWdodDoxMnB4O2Rpc3BsYXk6aW5saW5lfS5xcS11cGxvYWQtZmlsZXt2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7ZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MzAwcHg7dGV4dC1vdmVyZmxvdzplbGxpcHNpczt3aGl0ZS1zcGFjZTpub3dyYXA7b3ZlcmZsb3cteDpoaWRkZW47aGVpZ2h0OjE4cHh9LnFxLXVwbG9hZC1zcGlubmVye2Rpc3BsYXk6aW5saW5lLWJsb2NrO2JhY2tncm91bmQ6dXJsKGxvYWRpbmcuZ2lmKTt3aWR0aDoxNXB4O2hlaWdodDoxNXB4O3ZlcnRpY2FsLWFsaWduOnRleHQtYm90dG9tfS5xcS1kcm9wLXByb2Nlc3Npbmd7ZGlzcGxheTpibG9ja30ucXEtZHJvcC1wcm9jZXNzaW5nLXNwaW5uZXJ7ZGlzcGxheTppbmxpbmUtYmxvY2s7YmFja2dyb3VuZDp1cmwocHJvY2Vzc2luZy5naWYpO3dpZHRoOjI0cHg7aGVpZ2h0OjI0cHg7dmVydGljYWwtYWxpZ246dGV4dC1ib3R0b219LnFxLXVwbG9hZC1jYW5jZWwsLnFxLXVwbG9hZC1jb250aW51ZSwucXEtdXBsb2FkLWRlbGV0ZSwucXEtdXBsb2FkLXBhdXNlLC5xcS11cGxvYWQtcmV0cnksLnFxLXVwbG9hZC1zaXple2ZvbnQtc2l6ZToxMnB4O2ZvbnQtd2VpZ2h0OjQwMDtjdXJzb3I6cG9pbnRlcjt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9LnFxLXVwbG9hZC1zdGF0dXMtdGV4dHtmb250LXNpemU6MTRweDtmb250LXdlaWdodDo3MDA7ZGlzcGxheTpibG9ja30ucXEtdXBsb2FkLWZhaWxlZC10ZXh0e2Rpc3BsYXk6bm9uZTtmb250LXN0eWxlOml0YWxpYztmb250LXdlaWdodDo3MDB9LnFxLXVwbG9hZC1mYWlsZWQtaWNvbntkaXNwbGF5Om5vbmU7d2lkdGg6MTVweDtoZWlnaHQ6MTVweDt2ZXJ0aWNhbC1hbGlnbjp0ZXh0LWJvdHRvbX0ucXEtdXBsb2FkLWZhaWwgLnFxLXVwbG9hZC1mYWlsZWQtdGV4dCwucXEtdXBsb2FkLXJldHJ5aW5nIC5xcS11cGxvYWQtZmFpbGVkLXRleHR7ZGlzcGxheTppbmxpbmV9LnFxLXVwbG9hZC1saXN0IGxpLnFxLXVwbG9hZC1zdWNjZXNze2JhY2tncm91bmQtY29sb3I6I2ViZjZlMDtjb2xvcjojNDI0MjQyO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkM2RlZDE7Ym9yZGVyLXRvcDoxcHggc29saWQgI2Y3ZmZmNX0ucXEtdXBsb2FkLWxpc3QgbGkucXEtdXBsb2FkLWZhaWx7YmFja2dyb3VuZC1jb2xvcjojZjVkN2Q3O2NvbG9yOiM0MjQyNDI7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2RlY2FjYTtib3JkZXItdG9wOjFweCBzb2xpZCAjZmNlNmU2fS5xcS10b3RhbC1wcm9ncmVzcy1iYXJ7aGVpZ2h0OjI1cHg7Ym9yZGVyLXJhZGl1czo5cHh9SU5QVVQucXEtZWRpdC1maWxlbmFtZXtwb3NpdGlvbjphYnNvbHV0ZTtvcGFjaXR5OjA7ei1pbmRleDotMX0ucXEtdXBsb2FkLWZpbGUucXEtZWRpdGFibGV7Y3Vyc29yOnBvaW50ZXI7bWFyZ2luLXJpZ2h0OjRweH0ucXEtZWRpdC1maWxlbmFtZS1pY29uLnFxLWVkaXRhYmxle2Rpc3BsYXk6aW5saW5lLWJsb2NrO2N1cnNvcjpwb2ludGVyfUlOUFVULnFxLWVkaXQtZmlsZW5hbWUucXEtZWRpdGluZ3twb3NpdGlvbjpzdGF0aWM7aGVpZ2h0OjI4cHg7cGFkZGluZzowIDhweDttYXJnaW4tcmlnaHQ6MTBweDttYXJnaW4tYm90dG9tOi01cHg7Ym9yZGVyOjFweCBzb2xpZCAjY2NjO2JvcmRlci1yYWRpdXM6MnB4O2ZvbnQtc2l6ZToxNnB4O29wYWNpdHk6MX0ucXEtZWRpdC1maWxlbmFtZS1pY29ue2Rpc3BsYXk6bm9uZTtiYWNrZ3JvdW5kOnVybChlZGl0LmdpZik7d2lkdGg6MTVweDtoZWlnaHQ6MTVweDt2ZXJ0aWNhbC1hbGlnbjp0ZXh0LWJvdHRvbTttYXJnaW4tcmlnaHQ6MTZweH0ucXEtaGlkZXtkaXNwbGF5Om5vbmV9LnFxLXRodW1ibmFpbC1zZWxlY3Rvcnt2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7bWFyZ2luLXJpZ2h0OjEycHh9LnFxLXVwbG9hZGVyIERJQUxPR3tkaXNwbGF5Om5vbmV9LnFxLXVwbG9hZGVyIERJQUxPR1tvcGVuXXtkaXNwbGF5OmJsb2NrfS5xcS11cGxvYWRlciBESUFMT0cgLnFxLWRpYWxvZy1idXR0b25ze3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmctdG9wOjEwcHh9LnFxLXVwbG9hZGVyIERJQUxPRyAucXEtZGlhbG9nLWJ1dHRvbnMgQlVUVE9Oe21hcmdpbi1sZWZ0OjVweDttYXJnaW4tcmlnaHQ6NXB4fS5xcS11cGxvYWRlciBESUFMT0cgLnFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9ye3BhZGRpbmctYm90dG9tOjEwcHh9LnFxLXVwbG9hZGVyIERJQUxPRzo6LXdlYmtpdC1iYWNrZHJvcHtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsLjcpfS5xcS11cGxvYWRlciBESUFMT0c6OmJhY2tkcm9we2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuNyl9YF0sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVXBsb2FkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcclxuICBASW5wdXQoKSBvcGVuRGlhbG9nO1xyXG5cclxuICBAT3V0cHV0KCkgY2xvc2VEaWFsb2cgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGNyZWF0ZURpciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgdXBsb2FkZXI6IEZpbmVVcGxvYWRlcjtcclxuICBuZXdGb2xkZXIgPSBmYWxzZTtcclxuICBjb3VudGVyID0gMDtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlKSB7XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICB0aGlzLnVwbG9hZGVyID0gbmV3IEZpbmVVcGxvYWRlcih7XHJcbiAgICAgIGRlYnVnOiBmYWxzZSxcclxuICAgICAgYXV0b1VwbG9hZDogZmFsc2UsXHJcbiAgICAgIG1heENvbm5lY3Rpb25zOiAxLCAvLyB0b2RvIGNvbmZpZ3VyYWJsZVxyXG4gICAgICBlbGVtZW50OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZS11cGxvYWRlcicpLFxyXG4gICAgICB0ZW1wbGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmUtdXBsb2FkZXItdGVtcGxhdGUnKSxcclxuICAgICAgcmVxdWVzdDoge1xyXG4gICAgICAgIGVuZHBvaW50OiB0aGlzLm5vZGVTZXJ2aWNlLnRyZWUuY29uZmlnLmJhc2VVUkwgKyB0aGlzLm5vZGVTZXJ2aWNlLnRyZWUuY29uZmlnLmFwaS51cGxvYWRGaWxlLFxyXG4gICAgICAgIC8vIGZvcmNlTXVsdGlwYXJ0OiBmYWxzZSxcclxuICAgICAgICBwYXJhbXNJbkJvZHk6IGZhbHNlLFxyXG4gICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgcGFyZW50UGF0aDogdGhpcy5nZXRDdXJyZW50UGF0aFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcmV0cnk6IHtcclxuICAgICAgICBlbmFibGVBdXRvOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBjYWxsYmFja3M6IHtcclxuICAgICAgICBvblN1Ym1pdHRlZDogKCkgPT4gdGhpcy5jb3VudGVyKyssXHJcbiAgICAgICAgb25DYW5jZWw6ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuY291bnRlciA8IDAgPyBjb25zb2xlLndhcm4oJ3d0Zj8nKSA6IHRoaXMuY291bnRlci0tO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25BbGxDb21wbGV0ZTogKHN1Y2M6IGFueSwgZmFpbDogYW55KSA9PiB7XHJcbiAgICAgICAgICBpZiAoc3VjYy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY291bnRlciA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZVNlcnZpY2UucmVmcmVzaEN1cnJlbnRQYXRoKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICBnZXQgZ2V0Q3VycmVudFBhdGgoKSB7XHJcbiAgICBjb25zdCBwYXJlbnRQYXRoID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5UGF0aCh0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoKS5pZDtcclxuICAgIHJldHVybiBwYXJlbnRQYXRoID09PSAwID8gJycgOiBwYXJlbnRQYXRoO1xyXG4gIH1cclxuXHJcbiAgdXBsb2FkRmlsZXMoKSB7XHJcbiAgICB0aGlzLnVwbG9hZGVyLnVwbG9hZFN0b3JlZEZpbGVzKCk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVOZXdGb2xkZXIoaW5wdXQ/OiBzdHJpbmcpIHtcclxuICAgIGlmICghdGhpcy5uZXdGb2xkZXIpIHtcclxuICAgICAgdGhpcy5uZXdGb2xkZXIgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5uZXdGb2xkZXIgPSBmYWxzZTtcclxuICAgICAgaWYgKGlucHV0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZURpci5lbWl0KGlucHV0KTtcclxuICAgICAgICB0aGlzLm5ld0NsaWNrZWRBY3Rpb24oKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmV3Q2xpY2tlZEFjdGlvbigpIHtcclxuICAgIHRoaXMudXBsb2FkZXIuY2FuY2VsQWxsKCk7XHJcbiAgICB0aGlzLmNsb3NlRGlhbG9nLmVtaXQoKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25Jbml0LCBPdXRwdXQsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge199IGZyb20gJ0BiaWVzYmplcmcvbmd4LXRyYW5zbGF0ZS1leHRyYWN0L2Rpc3QvdXRpbHMvdXRpbHMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtbmV3LWZvbGRlcicsXG4gIHRlbXBsYXRlOiBgPHAgY2xhc3M9XCJuZXctZm9sZGVyLWRlc2NyaXB0aW9uXCIgdHJhbnNsYXRlPlR5cGUgbmV3IGZvbGRlciBuYW1lPC9wPlxuPGlucHV0ICN1cGxvYWRGb2xkZXIgcGxhY2Vob2xkZXI9XCJ7eydGb2xkZXIgbmFtZScgfCB0cmFuc2xhdGV9fVwiIChrZXl1cCk9XCJvbklucHV0Q2hhbmdlKCRldmVudClcIlxuICAgICAgIChrZXl1cC5lbnRlcik9XCJvbkNsaWNrKClcIiBvbmNsaWNrPVwidGhpcy5zZWxlY3QoKTtcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwibmV3LWZvbGRlci1pbnB1dFwiLz5cbjxidXR0b24gY2xhc3M9XCJidXR0b24gbmV3LWZvbGRlci1zZW5kXCIgKGNsaWNrKT1cIm9uQ2xpY2soKVwiPnt7YnV0dG9uVGV4dCB8IHRyYW5zbGF0ZX19PC9idXR0b24+XG5gLFxuICBzdHlsZXM6IFtgLm5ldy1mb2xkZXItZGVzY3JpcHRpb257bWFyZ2luOjAgYXV0bztwYWRkaW5nOjB9YF1cbn0pXG5leHBvcnQgY2xhc3MgTmV3Rm9sZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQFZpZXdDaGlsZCgndXBsb2FkRm9sZGVyJykgdXBsb2FkRm9sZGVyOiBFbGVtZW50UmVmO1xuICBAT3V0cHV0KCkgYnV0dG9uQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBidXR0b25UZXh0ID0gXygnQ2xvc2UnKS50b1N0cmluZygpO1xuICBpbnB1dFZhbHVlID0gJyc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgfVxuXG4gIG9uQ2xpY2soKSB7XG4gICAgY29uc3QgZWw6IEhUTUxFbGVtZW50ID0gKHRoaXMudXBsb2FkRm9sZGVyLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLmJ1dHRvbkNsaWNrZWQuZW1pdChlbC52YWx1ZSk7XG4gIH1cblxuICBvbklucHV0Q2hhbmdlKGV2ZW50OiBhbnkpIHtcbiAgICB0aGlzLmlucHV0VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgaWYgKHRoaXMuaW5wdXRWYWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmJ1dHRvblRleHQgPSBfKCdDb25maXJtJykudG9TdHJpbmcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5idXR0b25UZXh0ID0gXygnQ2xvc2UnKS50b1N0cmluZygpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBUZW1wbGF0ZVJlZiwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtc2lkZS12aWV3JyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJzaWRlLXZpZXdcIiAqbmdJZj1cIm5vZGVcIj5cbiAgPGRpdiBjbGFzcz1cInNpZGUtdmlldy1wcmV2aWV3XCI+XG4gICAgPGkgKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50LCAnY2xvc2VTaWRlVmlldycpXCIgY2xhc3M9XCJmYXMgZmEtdGltZXMgc2lkZS12aWV3LWNsb3NlXCI+PC9pPlxuXG4gICAgPGRpdiBjbGFzcz1cInNpZGUtdmlldy1wcmV2aWV3LXRpdGxlXCI+e3tub2RlLm5hbWV9fTwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cInNpZGUtdmlldy1wcmV2aWV3LWNvbnRlbnRcIj5cbiAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGV9XCJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwic2lkZVZpZXdUZW1wbGF0ZVwiPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwic2lkZS12aWV3LWJ1dHRvbnNcIj5cbiAgICAgIDxidXR0b24gKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50LCAnZG93bmxvYWQnKVwiIGNsYXNzPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cIiFhbGxvd0ZvbGRlckRvd25sb2FkICYmIG5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+XG4gICAgICAgIERvd25sb2FkXG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50LCAncmVuYW1lQ29uZmlybScpXCIgY2xhc3M9XCJidXR0b25cIiB0cmFuc2xhdGU+UmVuYW1lPC9idXR0b24+XG4gICAgICA8YnV0dG9uIChjbGljayk9XCJvbkNsaWNrKCRldmVudCwgJ3JlbW92ZUFzaycpXCIgY2xhc3M9XCJidXR0b25cIiB0cmFuc2xhdGU+RGVsZXRlPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG5gLFxyXG4gIHN0eWxlczogW2Auc2lkZS12aWV3LWNsb3Nle3Bvc2l0aW9uOmFic29sdXRlO2N1cnNvcjpwb2ludGVyO3RvcDowO3JpZ2h0OjA7cGFkZGluZzoxNXB4fS5zaWRlLXZpZXctYnV0dG9uc3t3aWR0aDoxMDAlO2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2ZsZXgtZmxvdzpjb2x1bW59LnNpZGUtdmlldy1idXR0b25zIC5idXR0b257bWFyZ2luOjVweCAwfWBdLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcclxufSlcclxuZXhwb3J0IGNsYXNzIFNpZGVWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBASW5wdXQoKSBzaWRlVmlld1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBASW5wdXQoKSBub2RlOiBOb2RlSW50ZXJmYWNlO1xyXG4gIEBJbnB1dCgpIGFsbG93Rm9sZGVyRG93bmxvYWQgPSBmYWxzZTtcclxuXHJcbiAgQE91dHB1dCgpIGNsaWNrRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKGV2ZW50OiBhbnksIHR5cGU6IHN0cmluZykge1xyXG4gICAgdGhpcy5jbGlja0V2ZW50LmVtaXQoe3R5cGU6IHR5cGUsIGV2ZW50OiBldmVudCwgbm9kZTogdGhpcy5ub2RlfSk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUNsaWNrZWRTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9ub2RlLWNsaWNrZWQuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1uYXZpZ2F0aW9uJyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJuYXZpZ2F0aW9uLWNvbXBvbmVudFwiPlxyXG4gIDxpbnB1dCAjaW5wdXQgY2xhc3M9XCJuYXZpZ2F0aW9uLXNlYXJjaFwiIG9uY2xpY2s9XCJ0aGlzLnNlbGVjdCgpO1wiIChrZXl1cC5lbnRlcik9XCJvbkNsaWNrKGlucHV0LnZhbHVlKVwiXHJcbiAgICAgICAgIHBsYWNlaG9sZGVyPVwie3snU2VhcmNoJyB8IHRyYW5zbGF0ZX19XCI+XHJcblxyXG4gIDxidXR0b24gW2Rpc2FibGVkXT1cImlucHV0LnZhbHVlLmxlbmd0aCA9PT0gMFwiIGNsYXNzPVwibmF2aWdhdGlvbi1zZWFyY2gtaWNvblwiIChjbGljayk9XCJvbkNsaWNrKGlucHV0LnZhbHVlKVwiPlxyXG4gICAgPGkgY2xhc3M9XCJmYXMgZmEtc2VhcmNoXCI+PC9pPlxyXG4gIDwvYnV0dG9uPlxyXG5cclxuICA8ZGl2PlxyXG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxyXG4gIDwvZGl2PlxyXG48L2Rpdj5cclxuXHJcblxyXG5gLFxyXG4gIHN0eWxlczogW2AubmF2aWdhdGlvbi1jb21wb25lbnR7ZGlzcGxheTpmbGV4fWBdLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcclxufSlcclxuZXhwb3J0IGNsYXNzIE5hdmlnYXRpb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgbm9kZUNsaWNrZWRTZXJ2aWNlOiBOb2RlQ2xpY2tlZFNlcnZpY2VcclxuICApIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbiAgb25DbGljayhpbnB1dDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5zZWFyY2hGb3JTdHJpbmcoaW5wdXQpO1xyXG4gIH1cclxufVxyXG4iLCIvLyBpbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQge0ZpbGVNYW5hZ2VyQ29tcG9uZW50fSBmcm9tICcuL2ZpbGUtbWFuYWdlci5jb21wb25lbnQnO1xyXG5pbXBvcnQge0ZvbGRlckNvbnRlbnRDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mb2xkZXItY29udGVudC9mb2xkZXItY29udGVudC5jb21wb25lbnQnO1xyXG5pbXBvcnQge1RyZWVDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy90cmVlL3RyZWUuY29tcG9uZW50JztcclxuaW1wb3J0IHtOb2RlTGlzdGVyQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvdHJlZS9ub2RlLWxpc3Rlci9ub2RlLWxpc3Rlci5jb21wb25lbnQnO1xyXG5pbXBvcnQge05vZGVDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mdW5jdGlvbnMvbm9kZS9ub2RlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7TWFwVG9JdGVyYWJsZVBpcGV9IGZyb20gJy4vcGlwZXMvbWFwLXRvLWl0ZXJhYmxlLnBpcGUnO1xyXG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBDbGllbnRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtTdG9yZU1vZHVsZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge05hdkJhckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL25hdi1iYXIvbmF2LWJhci5jb21wb25lbnQnO1xyXG5pbXBvcnQge3JlZHVjZXJzfSBmcm9tICcuL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCB7TG9hZGluZ092ZXJsYXlDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mdW5jdGlvbnMvbG9hZGluZy1vdmVybGF5L2xvYWRpbmctb3ZlcmxheS5jb21wb25lbnQnO1xyXG5pbXBvcnQge0ZpbGVTaXplUGlwZX0gZnJvbSAnLi9waXBlcy9maWxlLXNpemUucGlwZSc7XHJcbmltcG9ydCB7VXBsb2FkQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZnVuY3Rpb25zL3VwbG9hZC91cGxvYWQuY29tcG9uZW50JztcclxuaW1wb3J0IHtOZXdGb2xkZXJDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL25ldy1mb2xkZXIvbmV3LWZvbGRlci5jb21wb25lbnQnO1xyXG5pbXBvcnQge1NpZGVWaWV3Q29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvc2lkZS12aWV3L3NpZGUtdmlldy5jb21wb25lbnQnO1xyXG5pbXBvcnQge05hdmlnYXRpb25Db21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24uY29tcG9uZW50JztcclxuaW1wb3J0IHtOZ3hTbWFydE1vZGFsTW9kdWxlfSBmcm9tICduZ3gtc21hcnQtbW9kYWwnO1xyXG5pbXBvcnQge1RyYW5zbGF0ZUxvYWRlciwgVHJhbnNsYXRlTW9kdWxlfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcclxuaW1wb3J0IHtUcmFuc2xhdGVIdHRwTG9hZGVyfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9odHRwLWxvYWRlcic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJhbnNsYXRlTG9hZGVyKGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICByZXR1cm4gbmV3IFRyYW5zbGF0ZUh0dHBMb2FkZXIoaHR0cCwgJy9hc3NldHMvaTE4bi8nLCAnLmpzb24nKTtcclxufVxyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBIdHRwQ2xpZW50TW9kdWxlLFxyXG4gICAgU3RvcmVNb2R1bGUuZm9yUm9vdChyZWR1Y2VycyksXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBOZ3hTbWFydE1vZGFsTW9kdWxlLmZvclJvb3QoKSxcclxuICAgIFRyYW5zbGF0ZU1vZHVsZS5mb3JSb290KHtcclxuICAgICAgbG9hZGVyOntcclxuICAgICAgICBwcm92aWRlOiBUcmFuc2xhdGVMb2FkZXIsXHJcbiAgICAgICAgdXNlRmFjdG9yeTogKGNyZWF0ZVRyYW5zbGF0ZUxvYWRlciksXHJcbiAgICAgICAgZGVwczogW0h0dHBDbGllbnRdfVxyXG4gICAgfSlcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgRmlsZU1hbmFnZXJDb21wb25lbnQsXHJcbiAgICBGb2xkZXJDb250ZW50Q29tcG9uZW50LFxyXG4gICAgTm9kZUNvbXBvbmVudCxcclxuICAgIFRyZWVDb21wb25lbnQsXHJcbiAgICBOb2RlTGlzdGVyQ29tcG9uZW50LFxyXG4gICAgTWFwVG9JdGVyYWJsZVBpcGUsXHJcbiAgICBOYXZCYXJDb21wb25lbnQsXHJcbiAgICBMb2FkaW5nT3ZlcmxheUNvbXBvbmVudCxcclxuICAgIEZpbGVTaXplUGlwZSxcclxuICAgIFVwbG9hZENvbXBvbmVudCxcclxuICAgIE5ld0ZvbGRlckNvbXBvbmVudCxcclxuICAgIFNpZGVWaWV3Q29tcG9uZW50LFxyXG4gICAgTmF2aWdhdGlvbkNvbXBvbmVudFxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgRmlsZU1hbmFnZXJDb21wb25lbnQsXHJcbiAgICBMb2FkaW5nT3ZlcmxheUNvbXBvbmVudCxcclxuICAgIFNpZGVWaWV3Q29tcG9uZW50XHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRmlsZU1hbmFnZXJNb2R1bGUge1xyXG4gIC8vIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gIC8vICAgcmV0dXJuIHtcclxuICAvLyAgICAgbmdNb2R1bGU6IEZpbGVNYW5hZ2VyTW9kdWxlLFxyXG4gIC8vICAgICBwcm92aWRlcnM6IFtUcmFuc2xhdGVTZXJ2aWNlXVxyXG4gIC8vICAgfTtcclxuICAvLyB9XHJcbn1cclxuIiwiaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtDb25maWdJbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvY29uZmlnLmludGVyZmFjZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgVHJlZU1vZGVsIHtcclxuICBwcml2YXRlIF9jdXJyZW50UGF0aDogc3RyaW5nO1xyXG4gIHByaXZhdGUgX25vZGVzOiBOb2RlSW50ZXJmYWNlO1xyXG4gIHByaXZhdGUgX3NlbGVjdGVkTm9kZUlkOiBzdHJpbmc7XHJcbiAgcHVibGljIGNvbmZpZzogQ29uZmlnSW50ZXJmYWNlO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihjb25maWc6IENvbmZpZ0ludGVyZmFjZSkge1xyXG4gICAgLy8gdGhpcy5fY3VycmVudFBhdGggPSBjb25maWcuc3RhcnRpbmdGb2xkZXI7IC8vIHRvZG8gaW1wbGVtZW50IChjb25maWcuaW50ZXJmY2UudHMpXHJcbiAgICB0aGlzLl9jdXJyZW50UGF0aCA9ICcnO1xyXG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XHJcblxyXG4gICAgdGhpcy5ub2RlcyA9IDxOb2RlSW50ZXJmYWNlPntcclxuICAgICAgaWQ6IDAsXHJcbiAgICAgIHBhdGhUb05vZGU6ICcnLFxyXG4gICAgICBwYXRoVG9QYXJlbnQ6IG51bGwsXHJcbiAgICAgIGlzRm9sZGVyOiB0cnVlLFxyXG4gICAgICBpc0V4cGFuZGVkOiB0cnVlLFxyXG4gICAgICBzdGF5T3BlbjogdHJ1ZSxcclxuICAgICAgbmFtZTogJ3Jvb3QnLFxyXG4gICAgICBjaGlsZHJlbjoge31cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBnZXQgY3VycmVudFBhdGgoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9jdXJyZW50UGF0aDtcclxuICB9XHJcblxyXG4gIHNldCBjdXJyZW50UGF0aCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLl9jdXJyZW50UGF0aCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IG5vZGVzKCk6IE5vZGVJbnRlcmZhY2Uge1xyXG4gICAgcmV0dXJuIHRoaXMuX25vZGVzO1xyXG4gIH1cclxuXHJcbiAgc2V0IG5vZGVzKHZhbHVlOiBOb2RlSW50ZXJmYWNlKSB7XHJcbiAgICB0aGlzLl9ub2RlcyA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHNlbGVjdGVkTm9kZUlkKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWROb2RlSWQ7XHJcbiAgfVxyXG5cclxuICBzZXQgc2VsZWN0ZWROb2RlSWQodmFsdWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5fc2VsZWN0ZWROb2RlSWQgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIC8vIHRvZG8gaW1wbGVtZW50IChjb25maWcuaW50ZXJmY2UudHMpXHJcbiAgLy8gZ2V0IGlzQ2FjaGUoKTogYm9vbGVhbiB7XHJcbiAgLy8gICByZXR1cm4gdGhpcy5jb25maWcub2ZmbGluZU1vZGU7XHJcbiAgLy8gfVxyXG4gIC8vXHJcbiAgLy8gc2V0IGlzQ2FjaGUodmFsdWU6IGJvb2xlYW4pIHtcclxuICAvLyAgIHRoaXMuY29uZmlnLm9mZmxpbmVNb2RlID0gdmFsdWU7XHJcbiAgLy8gfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJIdHRwUGFyYW1zIiwiQUNUSU9OUy5TRVRfUEFUSCIsIk9ic2VydmFibGUiLCJBQ1RJT05TLlNFVF9MT0FESU5HX1NUQVRFIiwiSW5qZWN0YWJsZSIsIkh0dHBDbGllbnQiLCJTdG9yZSIsIk5neFNtYXJ0TW9kYWxTZXJ2aWNlIiwiRXZlbnRFbWl0dGVyIiwic2VsZWN0IiwiQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSIsIkNvbXBvbmVudCIsIlZpZXdFbmNhcHN1bGF0aW9uIiwiVHJhbnNsYXRlU2VydmljZSIsIklucHV0IiwiT3V0cHV0IiwiZmlyc3QiLCJDb250ZW50Q2hpbGQiLCJUZW1wbGF0ZVJlZiIsIlBpcGUiLCJ0aW1lciIsIl8iLCJGaW5lVXBsb2FkZXIiLCJWaWV3Q2hpbGQiLCJUcmFuc2xhdGVIdHRwTG9hZGVyIiwiTmdNb2R1bGUiLCJIdHRwQ2xpZW50TW9kdWxlIiwiU3RvcmVNb2R1bGUiLCJDb21tb25Nb2R1bGUiLCJOZ3hTbWFydE1vZGFsTW9kdWxlIiwiVHJhbnNsYXRlTW9kdWxlIiwiVHJhbnNsYXRlTG9hZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUdBLFFBQWEsUUFBUSxHQUFHLFVBQVUsQ0FBQzs7QUFDbkMsUUFBYSxpQkFBaUIsR0FBRyxtQkFBbUIsQ0FBQzs7QUFDckQsUUFBYSxpQkFBaUIsR0FBRyxtQkFBbUIsQ0FB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