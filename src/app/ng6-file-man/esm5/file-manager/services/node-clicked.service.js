/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { NodeService } from './node.service';
import { HttpClient } from '@angular/common/http';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Store } from '@ngrx/store';
import * as i0 from "@angular/core";
import * as i1 from "ngx-smart-modal";
import * as i2 from "./node.service";
import * as i3 from "@ngrx/store";
import * as i4 from "@angular/common/http";
var NodeClickedService = /** @class */ (function () {
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
        if (successMethod === void 0) { successMethod = function (a) { return _this.actionSuccess(a); }; }
        if (failMethod === void 0) { failMethod = function (a, b) { return _this.actionFailed(a, b); }; }
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
        if (data === void 0) { data = {}; }
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
        if (response === void 0) { response = ''; }
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
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    NodeClickedService.ctorParameters = function () { return [
        { type: NgxSmartModalService },
        { type: NodeService },
        { type: Store },
        { type: HttpClient }
    ]; };
    /** @nocollapse */ NodeClickedService.ngInjectableDef = i0.defineInjectable({ factory: function NodeClickedService_Factory() { return new NodeClickedService(i0.inject(i1.NgxSmartModalService), i0.inject(i2.NodeService), i0.inject(i3.Store), i0.inject(i4.HttpClient)); }, token: NodeClickedService, providedIn: "root" });
    return NodeClickedService;
}());
export { NodeClickedService };
if (false) {
    /** @type {?} */
    NodeClickedService.prototype.tree;
    /** @type {?} */
    NodeClickedService.prototype.ngxSmartModalService;
    /** @type {?} */
    NodeClickedService.prototype.nodeService;
    /** @type {?} */
    NodeClickedService.prototype.store;
    /** @type {?} */
    NodeClickedService.prototype.http;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1jbGlja2VkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvc2VydmljZXMvbm9kZS1jbGlja2VkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTNDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUVoRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUVyRCxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sYUFBYSxDQUFDOzs7Ozs7O0lBUWhDLDRCQUNTLHNCQUNDLGFBQ0EsT0FDQTtRQUhELHlCQUFvQixHQUFwQixvQkFBb0I7UUFDbkIsZ0JBQVcsR0FBWCxXQUFXO1FBQ1gsVUFBSyxHQUFMLEtBQUs7UUFDTCxTQUFJLEdBQUosSUFBSTtLQUViOzs7OztJQUVNLDBDQUFhOzs7O2NBQUMsSUFBbUI7O1FBQ3RDLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsQ0FBQzs7Ozs7O0lBR3hFLHVDQUFVOzs7O2NBQUMsSUFBbUI7O1FBQ25DLElBQUksQ0FBQyxnQkFBZ0IsQ0FDbkIsUUFBUSxFQUNSLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUMsRUFDZixRQUFRLEVBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFDL0IsY0FBTSxP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RixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFckIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Ozs7OztJQUduRCwwQ0FBYTs7OztjQUFDLFFBQXFCO1FBQXJCLHlCQUFBLEVBQUEsYUFBcUI7UUFDekMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7Ozs7Ozs7SUFHbEQseUNBQVk7Ozs7O2NBQUMsSUFBWSxFQUFFLEtBQVU7UUFDM0MsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4RCxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3hELE9BQU8sQ0FBQyxJQUFJLENBQUMsK0JBQStCLEdBQUcsSUFBSSxHQUFHLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQzs7O2dCQTdINUUsVUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7OztnQkFOTyxvQkFBb0I7Z0JBSnBCLFdBQVc7Z0JBTVgsS0FBSztnQkFKTCxVQUFVOzs7NkJBSmxCOztTQWFhLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi9ub2RlLnNlcnZpY2UnO1xuaW1wb3J0IHtUcmVlTW9kZWx9IGZyb20gJy4uL21vZGVscy90cmVlLm1vZGVsJztcbmltcG9ydCB7SHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7Tmd4U21hcnRNb2RhbFNlcnZpY2V9IGZyb20gJ25neC1zbWFydC1tb2RhbCc7XG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xuaW1wb3J0IHtTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOb2RlQ2xpY2tlZFNlcnZpY2Uge1xuICBwdWJsaWMgdHJlZTogVHJlZU1vZGVsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBuZ3hTbWFydE1vZGFsU2VydmljZTogTmd4U21hcnRNb2RhbFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+LFxuICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudFxuICApIHtcbiAgfVxuXG4gIHB1YmxpYyBzdGFydERvd25sb2FkKG5vZGU6IE5vZGVJbnRlcmZhY2UpOiB2b2lkIHtcbiAgICBjb25zdCBwYXJhbWV0ZXJzID0gdGhpcy5wYXJzZVBhcmFtcyh7cGF0aDogbm9kZS5pZH0pO1xuICAgIHRoaXMucmVhY2hTZXJ2ZXIoJ2Rvd25sb2FkJywgdGhpcy50cmVlLmNvbmZpZy5hcGkuZG93bmxvYWRGaWxlICsgcGFyYW1ldGVycyk7XG4gIH1cblxuICBwdWJsaWMgaW5pdERlbGV0ZShub2RlOiBOb2RlSW50ZXJmYWNlKTogdm9pZCB7XG4gICAgdGhpcy5zaWRlRWZmZWN0SGVscGVyKFxuICAgICAgJ0RlbGV0ZScsXG4gICAgICB7cGF0aDogbm9kZS5pZH0sXG4gICAgICAnZGVsZXRlJyxcbiAgICAgIHRoaXMudHJlZS5jb25maWcuYXBpLmRlbGV0ZUZpbGUsXG4gICAgICAoKSA9PiB0aGlzLnN1Y2Nlc3NXaXRoTW9kYWxDbG9zZSgpXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBzZWFyY2hGb3JTdHJpbmcoaW5wdXQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc2lkZUVmZmVjdEhlbHBlcihcbiAgICAgICdTZWFyY2gnLFxuICAgICAge3F1ZXJ5OiBpbnB1dH0sXG4gICAgICAnZ2V0JyxcbiAgICAgIHRoaXMudHJlZS5jb25maWcuYXBpLnNlYXJjaEZpbGVzLFxuICAgICAgKHJlcykgPT4gdGhpcy5zZWFyY2hTdWNjZXNzKGlucHV0LCByZXMpXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBjcmVhdGVGb2xkZXIoY3VycmVudFBhcmVudDogbnVtYmVyLCBuZXdEaXJOYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLnNpZGVFZmZlY3RIZWxwZXIoXG4gICAgICAnQ3JlYXRlIEZvbGRlcicsXG4gICAgICB7ZGlyTmFtZTogbmV3RGlyTmFtZSwgcGFyZW50UGF0aDogY3VycmVudFBhcmVudCA9PT0gMCA/IG51bGwgOiBjdXJyZW50UGFyZW50fSxcbiAgICAgICdwb3N0JyxcbiAgICAgIHRoaXMudHJlZS5jb25maWcuYXBpLmNyZWF0ZUZvbGRlclxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgcmVuYW1lKGlkOiBudW1iZXIsIG5ld05hbWU6IHN0cmluZykge1xuICAgIHRoaXMuc2lkZUVmZmVjdEhlbHBlcihcbiAgICAgICdSZW5hbWUnLFxuICAgICAge3BhdGg6IGlkLCBuZXdOYW1lOiBuZXdOYW1lfSxcbiAgICAgICdwb3N0JyxcbiAgICAgIHRoaXMudHJlZS5jb25maWcuYXBpLnJlbmFtZUZpbGUsXG4gICAgICAoKSA9PiB0aGlzLnN1Y2Nlc3NXaXRoTW9kYWxDbG9zZSgpXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgc2lkZUVmZmVjdEhlbHBlcihuYW1lOiBzdHJpbmcsIHBhcmFtZXRlcnM6IHt9LCBodHRwTWV0aG9kOiBzdHJpbmcsIGFwaVVSTDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc01ldGhvZCA9IChhKSA9PiB0aGlzLmFjdGlvblN1Y2Nlc3MoYSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBmYWlsTWV0aG9kID0gKGEsIGIpID0+IHRoaXMuYWN0aW9uRmFpbGVkKGEsIGIpXG4gICkge1xuICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMucGFyc2VQYXJhbXMocGFyYW1ldGVycyk7XG5cbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCd3YWl0TW9kYWwnKS5vcGVuKCk7XG5cbiAgICB0aGlzLnJlYWNoU2VydmVyKGh0dHBNZXRob2QsIGFwaVVSTCArIHBhcmFtcylcbiAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgIChhKSA9PiBzdWNjZXNzTWV0aG9kKGEpLFxuICAgICAgICAoZXJyKSA9PiBmYWlsTWV0aG9kKG5hbWUsIGVycilcbiAgICAgICk7XG4gIH1cblxuICBwcml2YXRlIHJlYWNoU2VydmVyKG1ldGhvZDogc3RyaW5nLCBhcGlVcmw6IHN0cmluZywgZGF0YTogYW55ID0ge30pOiBPYnNlcnZhYmxlPE9iamVjdD4ge1xuICAgIHN3aXRjaCAobWV0aG9kLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgIGNhc2UgJ2dldCc6XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIGFwaVVybCk7XG4gICAgICBjYXNlICdwb3N0JzpcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0KHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIGFwaVVybCwgZGF0YSk7XG4gICAgICBjYXNlICdkZWxldGUnOlxuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmRlbGV0ZSh0aGlzLnRyZWUuY29uZmlnLmJhc2VVUkwgKyBhcGlVcmwpO1xuICAgICAgY2FzZSAnZG93bmxvYWQnOlxuICAgICAgICB3aW5kb3cub3Blbih0aGlzLnRyZWUuY29uZmlnLmJhc2VVUkwgKyBhcGlVcmwsICdfYmxhbmsnKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLndhcm4oJ1tOb2RlQ2xpY2tlZFNlcnZpY2VdIEluY29ycmVjdCBwYXJhbXMgZm9yIHRoaXMgc2lkZS1lZmZlY3QnKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZVBhcmFtcyhwYXJhbXM6IHt9KTogc3RyaW5nIHtcbiAgICBsZXQgcXVlcnkgPSAnPyc7XG5cbiAgICBPYmplY3Qua2V5cyhwYXJhbXMpLmZpbHRlcihpdGVtID0+IHBhcmFtc1tpdGVtXSAhPT0gbnVsbCkubWFwKGtleSA9PiB7XG4gICAgICBxdWVyeSArPSBrZXkgKyAnPScgKyBwYXJhbXNba2V5XSArICcmJztcbiAgICB9KTtcblxuICAgIHJldHVybiBxdWVyeS5zbGljZSgwLCAtMSk7XG4gIH1cblxuICBwcml2YXRlIHN1Y2Nlc3NXaXRoTW9kYWxDbG9zZSgpIHtcbiAgICB0aGlzLmFjdGlvblN1Y2Nlc3MoKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZS12aWV3JykuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VhcmNoU3VjY2VzcyhpbnB1dDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBjb25zdCBvYmogPSB7XG4gICAgICBzZWFyY2hTdHJpbmc6IGlucHV0LFxuICAgICAgcmVzcG9uc2U6IGRhdGFcbiAgICB9O1xuXG4gICAgdGhpcy5hY3Rpb25TdWNjZXNzKCk7XG5cbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLnNldE1vZGFsRGF0YShvYmosICdzZWFyY2hNb2RhbCcsIHRydWUpO1xuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3NlYXJjaE1vZGFsJykub3BlbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBhY3Rpb25TdWNjZXNzKHJlc3BvbnNlOiBzdHJpbmcgPSAnJykge1xuICAgIHRoaXMubm9kZVNlcnZpY2UucmVmcmVzaEN1cnJlbnRQYXRoKCk7XG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnd2FpdE1vZGFsJykuY2xvc2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgYWN0aW9uRmFpbGVkKG5hbWU6IHN0cmluZywgZXJyb3I6IGFueSkge1xuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3dhaXRNb2RhbCcpLmNsb3NlKCk7XG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnZXJyb3JNb2RhbCcpLm9wZW4oKTtcbiAgICBjb25zb2xlLndhcm4oJ1tOb2RlQ2xpY2tlZFNlcnZpY2VdIEFjdGlvbiBcIicgKyBuYW1lICsgJ1wiIGZhaWxlZCcsIGVycm9yKTtcbiAgfVxufVxuIl19