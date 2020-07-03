/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FineUploader } from 'fine-uploader';
import { NodeService } from '../../../services/node.service';
var UploadComponent = /** @class */ (function () {
    function UploadComponent(http, nodeService) {
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
    UploadComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
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
         */
        function () {
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
        { type: Component, args: [{
                    selector: 'app-upload',
                    template: "<div class=\"backdrop\" (click)=\"newClickedAction()\"></div>\n<div class=\"upload-background\">\n  <div class=\"buttons\">\n    <button class=\"button\" [disabled]=\"newFolder\" (click)=\"createNewFolder()\" translate>Create new folder</button>\n  </div>\n\n  <div *ngIf=\"newFolder\">\n    <div class=\"buttons\">\n      <app-new-folder (buttonClicked)=\"createNewFolder($event)\"></app-new-folder>\n    </div>\n  </div>\n\n  <div id=\"fine-uploader\">\n  </div>\n\n\n  <div class=\"buttons\">\n    <button class=\"button big\" [disabled]=\"this.counter < 1\" (click)=\"uploadFiles()\" translate>\n      Upload\n    </button>\n    <button class=\"button big\" (click)=\"newClickedAction()\" translate>\n      Close\n    </button>\n  </div>\n\n</div>\n\n<div id=\"fine-uploader-template\" style=\"display: none;\">\n  <div class=\"qq-uploader-selector qq-uploader\" qq-drop-area-text=\"Drop files here\">\n    <div class=\"qq-upload-drop-area-selector qq-upload-drop-area\" qq-hide-dropzone>\n      <span class=\"qq-upload-drop-area-text-selector\"></span>\n    </div>\n\n    <div class=\"upload-top-bar\">\n      <div class=\"qq-upload-button-selector qq-upload-button\">\n        <div translate>Upload a file</div>\n      </div>\n\n      <div class=\"qq-total-progress-bar-container-selector qq-total-progress-bar-container\">\n        <div role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\"\n             class=\"qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar\"></div>\n      </div>\n    </div>\n\n    <span class=\"qq-drop-processing-selector qq-drop-processing\">\n            <span translate>Processing dropped files</span>...\n            <span class=\"qq-drop-processing-spinner-selector qq-drop-processing-spinner\"></span>\n    </span>\n\n    <ul class=\"qq-upload-list-selector qq-upload-list\" aria-live=\"polite\" aria-relevant=\"additions removals\">\n      <li>\n        <div class=\"qq-progress-bar-container-selector\">\n          <div role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\"\n               class=\"qq-progress-bar-selector qq-progress-bar\"></div>\n        </div>\n        <span class=\"qq-upload-spinner-selector qq-upload-spinner\"></span>\n        <img class=\"qq-thumbnail-selector\" qq-max-size=\"100\" qq-server-scale>\n        <span class=\"qq-upload-file-selector qq-upload-file\"></span>\n        <span class=\"qq-edit-filename-icon-selector qq-edit-filename-icon\" aria-label=\"Edit filename\"></span>\n        <input class=\"qq-edit-filename-selector qq-edit-filename\" tabindex=\"0\" type=\"text\">\n        <span class=\"qq-upload-size-selector qq-upload-size\"></span>\n        <button type=\"button\" class=\"qq-btn qq-upload-cancel-selector qq-upload-cancel\" translate>Cancel</button>\n        <button type=\"button\" class=\"qq-btn qq-upload-retry-selector qq-upload-retry\" translate>Retry</button>\n        <button type=\"button\" class=\"qq-btn qq-upload-delete-selector qq-upload-delete\" translate>Delete</button>\n        <span role=\"status\" class=\"qq-upload-status-text-selector qq-upload-status-text\"></span>\n      </li>\n    </ul>\n\n    <dialog class=\"qq-alert-dialog-selector\">\n      <div class=\"qq-dialog-message-selector\"></div>\n      <div class=\"qq-dialog-buttons\">\n        <button type=\"button\" class=\"qq-cancel-button-selector\" translate>Close</button>\n      </div>\n    </dialog>\n\n    <dialog class=\"qq-confirm-dialog-selector\">\n      <div class=\"qq-dialog-message-selector\"></div>\n      <div class=\"qq-dialog-buttons\">\n        <button type=\"button\" class=\"qq-cancel-button-selector\" translate>No</button>\n        <button type=\"button\" class=\"qq-ok-button-selector\" translate>Yes</button>\n      </div>\n    </dialog>\n\n    <dialog class=\"qq-prompt-dialog-selector\">\n      <div class=\"qq-dialog-message-selector\"></div>\n      <input type=\"text\">\n      <div class=\"qq-dialog-buttons\">\n        <button type=\"button\" class=\"qq-cancel-button-selector\" translate>Cancel</button>\n        <button type=\"button\" class=\"qq-ok-button-selector\" translate>Ok</button>\n      </div>\n    </dialog>\n  </div>\n</div>\n",
                    styles: [".upload-content{text-align:center;max-height:25vh;overflow:auto;margin:10px auto}.fa-times:before{content:\"\\f00d\"}.buttons{background:#fff;padding:5px;margin:10px 0}", ".qq-upload-button div{line-height:25px}.qq-upload-button-focus{outline:0}.qq-uploader{position:relative;min-height:200px;max-height:490px;overflow-y:hidden;width:inherit;border-radius:6px;background-color:#fdfdfd;border:1px dashed #ccc;padding:20px}.qq-uploader:before{content:attr(qq-drop-area-text) \" \";position:absolute;font-size:200%;left:0;width:100%;text-align:center;top:45%;opacity:.25}.qq-upload-drop-area,.qq-upload-extra-drop-area{position:absolute;top:0;left:0;width:100%;height:100%;min-height:30px;z-index:2;background:#f9f9f9;border-radius:4px;border:1px dashed #ccc;text-align:center}.qq-upload-drop-area span{display:block;position:absolute;top:50%;width:100%;margin-top:-8px;font-size:16px}.qq-upload-extra-drop-area{position:relative;margin-top:50px;font-size:16px;padding-top:30px;height:20px;min-height:40px}.qq-upload-drop-area-active{background:#fdfdfd;border-radius:4px;border:1px dashed #ccc}.qq-upload-list{margin:0;padding:0;list-style:none;max-height:450px;overflow-y:auto;clear:both}.qq-upload-list li{margin:0;padding:9px;line-height:15px;font-size:16px;color:#424242;background-color:#f6f6f6;border-top:1px solid #fff;border-bottom:1px solid #ddd}.qq-upload-list li:first-child{border-top:none}.qq-upload-list li:last-child{border-bottom:none}.qq-upload-cancel,.qq-upload-continue,.qq-upload-delete,.qq-upload-failed-text,.qq-upload-file,.qq-upload-pause,.qq-upload-retry,.qq-upload-size,.qq-upload-spinner{margin-right:12px;display:inline}.qq-upload-file{vertical-align:middle;display:inline-block;width:300px;text-overflow:ellipsis;white-space:nowrap;overflow-x:hidden;height:18px}.qq-upload-spinner{display:inline-block;background:url(loading.gif);width:15px;height:15px;vertical-align:text-bottom}.qq-drop-processing{display:block}.qq-drop-processing-spinner{display:inline-block;background:url(processing.gif);width:24px;height:24px;vertical-align:text-bottom}.qq-upload-cancel,.qq-upload-continue,.qq-upload-delete,.qq-upload-pause,.qq-upload-retry,.qq-upload-size{font-size:12px;font-weight:400;cursor:pointer;vertical-align:middle}.qq-upload-status-text{font-size:14px;font-weight:700;display:block}.qq-upload-failed-text{display:none;font-style:italic;font-weight:700}.qq-upload-failed-icon{display:none;width:15px;height:15px;vertical-align:text-bottom}.qq-upload-fail .qq-upload-failed-text,.qq-upload-retrying .qq-upload-failed-text{display:inline}.qq-upload-list li.qq-upload-success{background-color:#ebf6e0;color:#424242;border-bottom:1px solid #d3ded1;border-top:1px solid #f7fff5}.qq-upload-list li.qq-upload-fail{background-color:#f5d7d7;color:#424242;border-bottom:1px solid #decaca;border-top:1px solid #fce6e6}.qq-total-progress-bar{height:25px;border-radius:9px}INPUT.qq-edit-filename{position:absolute;opacity:0;z-index:-1}.qq-upload-file.qq-editable{cursor:pointer;margin-right:4px}.qq-edit-filename-icon.qq-editable{display:inline-block;cursor:pointer}INPUT.qq-edit-filename.qq-editing{position:static;height:28px;padding:0 8px;margin-right:10px;margin-bottom:-5px;border:1px solid #ccc;border-radius:2px;font-size:16px;opacity:1}.qq-edit-filename-icon{display:none;background:url(edit.gif);width:15px;height:15px;vertical-align:text-bottom;margin-right:16px}.qq-hide{display:none}.qq-thumbnail-selector{vertical-align:middle;margin-right:12px}.qq-uploader DIALOG{display:none}.qq-uploader DIALOG[open]{display:block}.qq-uploader DIALOG .qq-dialog-buttons{text-align:center;padding-top:10px}.qq-uploader DIALOG .qq-dialog-buttons BUTTON{margin-left:5px;margin-right:5px}.qq-uploader DIALOG .qq-dialog-message-selector{padding-bottom:10px}.qq-uploader DIALOG::-webkit-backdrop{background-color:rgba(0,0,0,.7)}.qq-uploader DIALOG::backdrop{background-color:rgba(0,0,0,.7)}"],
                    encapsulation: ViewEncapsulation.None
                },] },
    ];
    /** @nocollapse */
    UploadComponent.ctorParameters = function () { return [
        { type: HttpClient },
        { type: NodeService }
    ]; };
    UploadComponent.propDecorators = {
        openDialog: [{ type: Input }],
        closeDialog: [{ type: Output }],
        createDir: [{ type: Output }]
    };
    return UploadComponent;
}());
export { UploadComponent };
if (false) {
    /** @type {?} */
    UploadComponent.prototype.openDialog;
    /** @type {?} */
    UploadComponent.prototype.closeDialog;
    /** @type {?} */
    UploadComponent.prototype.createDir;
    /** @type {?} */
    UploadComponent.prototype.uploader;
    /** @type {?} */
    UploadComponent.prototype.newFolder;
    /** @type {?} */
    UploadComponent.prototype.counter;
    /** @type {?} */
    UploadComponent.prototype.http;
    /** @type {?} */
    UploadComponent.prototype.nodeService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nNi1maWxlLW1hbi8iLCJzb3VyY2VzIjpbImZpbGUtbWFuYWdlci9jb21wb25lbnRzL2Z1bmN0aW9ucy91cGxvYWQvdXBsb2FkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFnQixTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDL0csT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdDQUFnQyxDQUFDOztJQStHekQseUJBQW9CLElBQWdCLEVBQ2hCO1FBREEsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixnQkFBVyxHQUFYLFdBQVc7MkJBUlAsSUFBSSxZQUFZLEVBQUU7eUJBQ3BCLElBQUksWUFBWSxFQUFFO3lCQUc1QixLQUFLO3VCQUNQLENBQUM7S0FJVjs7OztJQUVELHlDQUFlOzs7SUFBZjtRQUFBLGlCQWdDQztRQS9CQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDO1lBQy9CLEtBQUssRUFBRSxLQUFLO1lBQ1osVUFBVSxFQUFFLEtBQUs7WUFDakIsY0FBYyxFQUFFLENBQUM7O1lBQ2pCLE9BQU8sRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQztZQUNqRCxRQUFRLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyx3QkFBd0IsQ0FBQztZQUMzRCxPQUFPLEVBQUU7Z0JBQ1AsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVOztnQkFFNUYsWUFBWSxFQUFFLEtBQUs7Z0JBQ25CLE1BQU0sRUFBRTtvQkFDTixVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWM7aUJBQ2hDO2FBQ0Y7WUFDRCxLQUFLLEVBQUU7Z0JBQ0wsVUFBVSxFQUFFLEtBQUs7YUFDbEI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsV0FBVyxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsT0FBTyxFQUFFLEVBQWQsQ0FBYztnQkFDakMsUUFBUSxFQUFFO29CQUNSLEtBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7aUJBQzFEO2dCQUNELGFBQWEsRUFBRSxVQUFDLElBQVMsRUFBRSxJQUFTO29CQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BCLEtBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO3dCQUNqQixLQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixFQUFFLENBQUM7cUJBQ3ZDO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQ0Q7S0FDRjs7OztJQUVELGtDQUFROzs7SUFBUjtLQUNDO0lBRUQsc0JBQUksMkNBQWM7Ozs7UUFBbEI7O1lBQ0UsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDcEYsTUFBTSxDQUFDLFVBQVUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1NBQzNDOzs7T0FBQTs7OztJQUVELHFDQUFXOzs7SUFBWDtRQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztLQUNuQzs7Ozs7SUFFRCx5Q0FBZTs7OztJQUFmLFVBQWdCLEtBQWM7UUFDNUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztTQUN2QjtRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7YUFDekI7U0FDRjtLQUNGOzs7O0lBRUQsMENBQWdCOzs7SUFBaEI7UUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDekI7O2dCQTlLRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLFFBQVEsRUFBRSwybklBNkZYO29CQUNDLE1BQU0sRUFBRSxDQUFDLDBLQUF3SyxFQUFFLGtwSEFBZ3BILENBQUM7b0JBQ3AwSCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtpQkFDdEM7Ozs7Z0JBdEdPLFVBQVU7Z0JBRVYsV0FBVzs7OzZCQXNHaEIsS0FBSzs4QkFFTCxNQUFNOzRCQUNOLE1BQU07OzBCQTVHVDs7U0F3R2EsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0h0dHBDbGllbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtGaW5lVXBsb2FkZXJ9IGZyb20gJ2ZpbmUtdXBsb2FkZXInO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtdXBsb2FkJyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJiYWNrZHJvcFwiIChjbGljayk9XCJuZXdDbGlja2VkQWN0aW9uKClcIj48L2Rpdj5cbjxkaXYgY2xhc3M9XCJ1cGxvYWQtYmFja2dyb3VuZFwiPlxuICA8ZGl2IGNsYXNzPVwiYnV0dG9uc1wiPlxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b25cIiBbZGlzYWJsZWRdPVwibmV3Rm9sZGVyXCIgKGNsaWNrKT1cImNyZWF0ZU5ld0ZvbGRlcigpXCIgdHJhbnNsYXRlPkNyZWF0ZSBuZXcgZm9sZGVyPC9idXR0b24+XG4gIDwvZGl2PlxuXG4gIDxkaXYgKm5nSWY9XCJuZXdGb2xkZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uc1wiPlxuICAgICAgPGFwcC1uZXctZm9sZGVyIChidXR0b25DbGlja2VkKT1cImNyZWF0ZU5ld0ZvbGRlcigkZXZlbnQpXCI+PC9hcHAtbmV3LWZvbGRlcj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5cbiAgPGRpdiBpZD1cImZpbmUtdXBsb2FkZXJcIj5cbiAgPC9kaXY+XG5cblxuICA8ZGl2IGNsYXNzPVwiYnV0dG9uc1wiPlxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgW2Rpc2FibGVkXT1cInRoaXMuY291bnRlciA8IDFcIiAoY2xpY2spPVwidXBsb2FkRmlsZXMoKVwiIHRyYW5zbGF0ZT5cbiAgICAgIFVwbG9hZFxuICAgIDwvYnV0dG9uPlxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgKGNsaWNrKT1cIm5ld0NsaWNrZWRBY3Rpb24oKVwiIHRyYW5zbGF0ZT5cbiAgICAgIENsb3NlXG4gICAgPC9idXR0b24+XG4gIDwvZGl2PlxuXG48L2Rpdj5cblxuPGRpdiBpZD1cImZpbmUtdXBsb2FkZXItdGVtcGxhdGVcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+XG4gIDxkaXYgY2xhc3M9XCJxcS11cGxvYWRlci1zZWxlY3RvciBxcS11cGxvYWRlclwiIHFxLWRyb3AtYXJlYS10ZXh0PVwiRHJvcCBmaWxlcyBoZXJlXCI+XG4gICAgPGRpdiBjbGFzcz1cInFxLXVwbG9hZC1kcm9wLWFyZWEtc2VsZWN0b3IgcXEtdXBsb2FkLWRyb3AtYXJlYVwiIHFxLWhpZGUtZHJvcHpvbmU+XG4gICAgICA8c3BhbiBjbGFzcz1cInFxLXVwbG9hZC1kcm9wLWFyZWEtdGV4dC1zZWxlY3RvclwiPjwvc3Bhbj5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJ1cGxvYWQtdG9wLWJhclwiPlxuICAgICAgPGRpdiBjbGFzcz1cInFxLXVwbG9hZC1idXR0b24tc2VsZWN0b3IgcXEtdXBsb2FkLWJ1dHRvblwiPlxuICAgICAgICA8ZGl2IHRyYW5zbGF0ZT5VcGxvYWQgYSBmaWxlPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzcz1cInFxLXRvdGFsLXByb2dyZXNzLWJhci1jb250YWluZXItc2VsZWN0b3IgcXEtdG90YWwtcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lclwiPlxuICAgICAgICA8ZGl2IHJvbGU9XCJwcm9ncmVzc2JhclwiIGFyaWEtdmFsdWVub3c9XCIwXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCJcbiAgICAgICAgICAgICBjbGFzcz1cInFxLXRvdGFsLXByb2dyZXNzLWJhci1zZWxlY3RvciBxcS1wcm9ncmVzcy1iYXIgcXEtdG90YWwtcHJvZ3Jlc3MtYmFyXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDxzcGFuIGNsYXNzPVwicXEtZHJvcC1wcm9jZXNzaW5nLXNlbGVjdG9yIHFxLWRyb3AtcHJvY2Vzc2luZ1wiPlxuICAgICAgICAgICAgPHNwYW4gdHJhbnNsYXRlPlByb2Nlc3NpbmcgZHJvcHBlZCBmaWxlczwvc3Bhbj4uLi5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicXEtZHJvcC1wcm9jZXNzaW5nLXNwaW5uZXItc2VsZWN0b3IgcXEtZHJvcC1wcm9jZXNzaW5nLXNwaW5uZXJcIj48L3NwYW4+XG4gICAgPC9zcGFuPlxuXG4gICAgPHVsIGNsYXNzPVwicXEtdXBsb2FkLWxpc3Qtc2VsZWN0b3IgcXEtdXBsb2FkLWxpc3RcIiBhcmlhLWxpdmU9XCJwb2xpdGVcIiBhcmlhLXJlbGV2YW50PVwiYWRkaXRpb25zIHJlbW92YWxzXCI+XG4gICAgICA8bGk+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJxcS1wcm9ncmVzcy1iYXItY29udGFpbmVyLXNlbGVjdG9yXCI+XG4gICAgICAgICAgPGRpdiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMFwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiXG4gICAgICAgICAgICAgICBjbGFzcz1cInFxLXByb2dyZXNzLWJhci1zZWxlY3RvciBxcS1wcm9ncmVzcy1iYXJcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwicXEtdXBsb2FkLXNwaW5uZXItc2VsZWN0b3IgcXEtdXBsb2FkLXNwaW5uZXJcIj48L3NwYW4+XG4gICAgICAgIDxpbWcgY2xhc3M9XCJxcS10aHVtYm5haWwtc2VsZWN0b3JcIiBxcS1tYXgtc2l6ZT1cIjEwMFwiIHFxLXNlcnZlci1zY2FsZT5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJxcS11cGxvYWQtZmlsZS1zZWxlY3RvciBxcS11cGxvYWQtZmlsZVwiPjwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJxcS1lZGl0LWZpbGVuYW1lLWljb24tc2VsZWN0b3IgcXEtZWRpdC1maWxlbmFtZS1pY29uXCIgYXJpYS1sYWJlbD1cIkVkaXQgZmlsZW5hbWVcIj48L3NwYW4+XG4gICAgICAgIDxpbnB1dCBjbGFzcz1cInFxLWVkaXQtZmlsZW5hbWUtc2VsZWN0b3IgcXEtZWRpdC1maWxlbmFtZVwiIHRhYmluZGV4PVwiMFwiIHR5cGU9XCJ0ZXh0XCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwicXEtdXBsb2FkLXNpemUtc2VsZWN0b3IgcXEtdXBsb2FkLXNpemVcIj48L3NwYW4+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtYnRuIHFxLXVwbG9hZC1jYW5jZWwtc2VsZWN0b3IgcXEtdXBsb2FkLWNhbmNlbFwiIHRyYW5zbGF0ZT5DYW5jZWw8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1idG4gcXEtdXBsb2FkLXJldHJ5LXNlbGVjdG9yIHFxLXVwbG9hZC1yZXRyeVwiIHRyYW5zbGF0ZT5SZXRyeTwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWJ0biBxcS11cGxvYWQtZGVsZXRlLXNlbGVjdG9yIHFxLXVwbG9hZC1kZWxldGVcIiB0cmFuc2xhdGU+RGVsZXRlPC9idXR0b24+XG4gICAgICAgIDxzcGFuIHJvbGU9XCJzdGF0dXNcIiBjbGFzcz1cInFxLXVwbG9hZC1zdGF0dXMtdGV4dC1zZWxlY3RvciBxcS11cGxvYWQtc3RhdHVzLXRleHRcIj48L3NwYW4+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG5cbiAgICA8ZGlhbG9nIGNsYXNzPVwicXEtYWxlcnQtZGlhbG9nLXNlbGVjdG9yXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLW1lc3NhZ2Utc2VsZWN0b3JcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJxcS1kaWFsb2ctYnV0dG9uc1wiPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWNhbmNlbC1idXR0b24tc2VsZWN0b3JcIiB0cmFuc2xhdGU+Q2xvc2U8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGlhbG9nPlxuXG4gICAgPGRpYWxvZyBjbGFzcz1cInFxLWNvbmZpcm0tZGlhbG9nLXNlbGVjdG9yXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLW1lc3NhZ2Utc2VsZWN0b3JcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJxcS1kaWFsb2ctYnV0dG9uc1wiPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWNhbmNlbC1idXR0b24tc2VsZWN0b3JcIiB0cmFuc2xhdGU+Tm88L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1vay1idXR0b24tc2VsZWN0b3JcIiB0cmFuc2xhdGU+WWVzPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2RpYWxvZz5cblxuICAgIDxkaWFsb2cgY2xhc3M9XCJxcS1wcm9tcHQtZGlhbG9nLXNlbGVjdG9yXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLW1lc3NhZ2Utc2VsZWN0b3JcIj48L2Rpdj5cbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiPlxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1idXR0b25zXCI+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtY2FuY2VsLWJ1dHRvbi1zZWxlY3RvclwiIHRyYW5zbGF0ZT5DYW5jZWw8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1vay1idXR0b24tc2VsZWN0b3JcIiB0cmFuc2xhdGU+T2s8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGlhbG9nPlxuICA8L2Rpdj5cbjwvZGl2PlxuYCxcclxuICBzdHlsZXM6IFtgLnVwbG9hZC1jb250ZW50e3RleHQtYWxpZ246Y2VudGVyO21heC1oZWlnaHQ6MjV2aDtvdmVyZmxvdzphdXRvO21hcmdpbjoxMHB4IGF1dG99LmZhLXRpbWVzOmJlZm9yZXtjb250ZW50OlwiXFxcXGYwMGRcIn0uYnV0dG9uc3tiYWNrZ3JvdW5kOiNmZmY7cGFkZGluZzo1cHg7bWFyZ2luOjEwcHggMH1gLCBgLnFxLXVwbG9hZC1idXR0b24gZGl2e2xpbmUtaGVpZ2h0OjI1cHh9LnFxLXVwbG9hZC1idXR0b24tZm9jdXN7b3V0bGluZTowfS5xcS11cGxvYWRlcntwb3NpdGlvbjpyZWxhdGl2ZTttaW4taGVpZ2h0OjIwMHB4O21heC1oZWlnaHQ6NDkwcHg7b3ZlcmZsb3cteTpoaWRkZW47d2lkdGg6aW5oZXJpdDtib3JkZXItcmFkaXVzOjZweDtiYWNrZ3JvdW5kLWNvbG9yOiNmZGZkZmQ7Ym9yZGVyOjFweCBkYXNoZWQgI2NjYztwYWRkaW5nOjIwcHh9LnFxLXVwbG9hZGVyOmJlZm9yZXtjb250ZW50OmF0dHIocXEtZHJvcC1hcmVhLXRleHQpIFwiIFwiO3Bvc2l0aW9uOmFic29sdXRlO2ZvbnQtc2l6ZToyMDAlO2xlZnQ6MDt3aWR0aDoxMDAlO3RleHQtYWxpZ246Y2VudGVyO3RvcDo0NSU7b3BhY2l0eTouMjV9LnFxLXVwbG9hZC1kcm9wLWFyZWEsLnFxLXVwbG9hZC1leHRyYS1kcm9wLWFyZWF7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7bGVmdDowO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7bWluLWhlaWdodDozMHB4O3otaW5kZXg6MjtiYWNrZ3JvdW5kOiNmOWY5Zjk7Ym9yZGVyLXJhZGl1czo0cHg7Ym9yZGVyOjFweCBkYXNoZWQgI2NjYzt0ZXh0LWFsaWduOmNlbnRlcn0ucXEtdXBsb2FkLWRyb3AtYXJlYSBzcGFue2Rpc3BsYXk6YmxvY2s7cG9zaXRpb246YWJzb2x1dGU7dG9wOjUwJTt3aWR0aDoxMDAlO21hcmdpbi10b3A6LThweDtmb250LXNpemU6MTZweH0ucXEtdXBsb2FkLWV4dHJhLWRyb3AtYXJlYXtwb3NpdGlvbjpyZWxhdGl2ZTttYXJnaW4tdG9wOjUwcHg7Zm9udC1zaXplOjE2cHg7cGFkZGluZy10b3A6MzBweDtoZWlnaHQ6MjBweDttaW4taGVpZ2h0OjQwcHh9LnFxLXVwbG9hZC1kcm9wLWFyZWEtYWN0aXZle2JhY2tncm91bmQ6I2ZkZmRmZDtib3JkZXItcmFkaXVzOjRweDtib3JkZXI6MXB4IGRhc2hlZCAjY2NjfS5xcS11cGxvYWQtbGlzdHttYXJnaW46MDtwYWRkaW5nOjA7bGlzdC1zdHlsZTpub25lO21heC1oZWlnaHQ6NDUwcHg7b3ZlcmZsb3cteTphdXRvO2NsZWFyOmJvdGh9LnFxLXVwbG9hZC1saXN0IGxpe21hcmdpbjowO3BhZGRpbmc6OXB4O2xpbmUtaGVpZ2h0OjE1cHg7Zm9udC1zaXplOjE2cHg7Y29sb3I6IzQyNDI0MjtiYWNrZ3JvdW5kLWNvbG9yOiNmNmY2ZjY7Ym9yZGVyLXRvcDoxcHggc29saWQgI2ZmZjtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZGRkfS5xcS11cGxvYWQtbGlzdCBsaTpmaXJzdC1jaGlsZHtib3JkZXItdG9wOm5vbmV9LnFxLXVwbG9hZC1saXN0IGxpOmxhc3QtY2hpbGR7Ym9yZGVyLWJvdHRvbTpub25lfS5xcS11cGxvYWQtY2FuY2VsLC5xcS11cGxvYWQtY29udGludWUsLnFxLXVwbG9hZC1kZWxldGUsLnFxLXVwbG9hZC1mYWlsZWQtdGV4dCwucXEtdXBsb2FkLWZpbGUsLnFxLXVwbG9hZC1wYXVzZSwucXEtdXBsb2FkLXJldHJ5LC5xcS11cGxvYWQtc2l6ZSwucXEtdXBsb2FkLXNwaW5uZXJ7bWFyZ2luLXJpZ2h0OjEycHg7ZGlzcGxheTppbmxpbmV9LnFxLXVwbG9hZC1maWxle3ZlcnRpY2FsLWFsaWduOm1pZGRsZTtkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDozMDBweDt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzO3doaXRlLXNwYWNlOm5vd3JhcDtvdmVyZmxvdy14OmhpZGRlbjtoZWlnaHQ6MThweH0ucXEtdXBsb2FkLXNwaW5uZXJ7ZGlzcGxheTppbmxpbmUtYmxvY2s7YmFja2dyb3VuZDp1cmwobG9hZGluZy5naWYpO3dpZHRoOjE1cHg7aGVpZ2h0OjE1cHg7dmVydGljYWwtYWxpZ246dGV4dC1ib3R0b219LnFxLWRyb3AtcHJvY2Vzc2luZ3tkaXNwbGF5OmJsb2NrfS5xcS1kcm9wLXByb2Nlc3Npbmctc3Bpbm5lcntkaXNwbGF5OmlubGluZS1ibG9jaztiYWNrZ3JvdW5kOnVybChwcm9jZXNzaW5nLmdpZik7d2lkdGg6MjRweDtoZWlnaHQ6MjRweDt2ZXJ0aWNhbC1hbGlnbjp0ZXh0LWJvdHRvbX0ucXEtdXBsb2FkLWNhbmNlbCwucXEtdXBsb2FkLWNvbnRpbnVlLC5xcS11cGxvYWQtZGVsZXRlLC5xcS11cGxvYWQtcGF1c2UsLnFxLXVwbG9hZC1yZXRyeSwucXEtdXBsb2FkLXNpemV7Zm9udC1zaXplOjEycHg7Zm9udC13ZWlnaHQ6NDAwO2N1cnNvcjpwb2ludGVyO3ZlcnRpY2FsLWFsaWduOm1pZGRsZX0ucXEtdXBsb2FkLXN0YXR1cy10ZXh0e2ZvbnQtc2l6ZToxNHB4O2ZvbnQtd2VpZ2h0OjcwMDtkaXNwbGF5OmJsb2NrfS5xcS11cGxvYWQtZmFpbGVkLXRleHR7ZGlzcGxheTpub25lO2ZvbnQtc3R5bGU6aXRhbGljO2ZvbnQtd2VpZ2h0OjcwMH0ucXEtdXBsb2FkLWZhaWxlZC1pY29ue2Rpc3BsYXk6bm9uZTt3aWR0aDoxNXB4O2hlaWdodDoxNXB4O3ZlcnRpY2FsLWFsaWduOnRleHQtYm90dG9tfS5xcS11cGxvYWQtZmFpbCAucXEtdXBsb2FkLWZhaWxlZC10ZXh0LC5xcS11cGxvYWQtcmV0cnlpbmcgLnFxLXVwbG9hZC1mYWlsZWQtdGV4dHtkaXNwbGF5OmlubGluZX0ucXEtdXBsb2FkLWxpc3QgbGkucXEtdXBsb2FkLXN1Y2Nlc3N7YmFja2dyb3VuZC1jb2xvcjojZWJmNmUwO2NvbG9yOiM0MjQyNDI7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2QzZGVkMTtib3JkZXItdG9wOjFweCBzb2xpZCAjZjdmZmY1fS5xcS11cGxvYWQtbGlzdCBsaS5xcS11cGxvYWQtZmFpbHtiYWNrZ3JvdW5kLWNvbG9yOiNmNWQ3ZDc7Y29sb3I6IzQyNDI0Mjtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZGVjYWNhO2JvcmRlci10b3A6MXB4IHNvbGlkICNmY2U2ZTZ9LnFxLXRvdGFsLXByb2dyZXNzLWJhcntoZWlnaHQ6MjVweDtib3JkZXItcmFkaXVzOjlweH1JTlBVVC5xcS1lZGl0LWZpbGVuYW1le3Bvc2l0aW9uOmFic29sdXRlO29wYWNpdHk6MDt6LWluZGV4Oi0xfS5xcS11cGxvYWQtZmlsZS5xcS1lZGl0YWJsZXtjdXJzb3I6cG9pbnRlcjttYXJnaW4tcmlnaHQ6NHB4fS5xcS1lZGl0LWZpbGVuYW1lLWljb24ucXEtZWRpdGFibGV7ZGlzcGxheTppbmxpbmUtYmxvY2s7Y3Vyc29yOnBvaW50ZXJ9SU5QVVQucXEtZWRpdC1maWxlbmFtZS5xcS1lZGl0aW5ne3Bvc2l0aW9uOnN0YXRpYztoZWlnaHQ6MjhweDtwYWRkaW5nOjAgOHB4O21hcmdpbi1yaWdodDoxMHB4O21hcmdpbi1ib3R0b206LTVweDtib3JkZXI6MXB4IHNvbGlkICNjY2M7Ym9yZGVyLXJhZGl1czoycHg7Zm9udC1zaXplOjE2cHg7b3BhY2l0eToxfS5xcS1lZGl0LWZpbGVuYW1lLWljb257ZGlzcGxheTpub25lO2JhY2tncm91bmQ6dXJsKGVkaXQuZ2lmKTt3aWR0aDoxNXB4O2hlaWdodDoxNXB4O3ZlcnRpY2FsLWFsaWduOnRleHQtYm90dG9tO21hcmdpbi1yaWdodDoxNnB4fS5xcS1oaWRle2Rpc3BsYXk6bm9uZX0ucXEtdGh1bWJuYWlsLXNlbGVjdG9ye3ZlcnRpY2FsLWFsaWduOm1pZGRsZTttYXJnaW4tcmlnaHQ6MTJweH0ucXEtdXBsb2FkZXIgRElBTE9He2Rpc3BsYXk6bm9uZX0ucXEtdXBsb2FkZXIgRElBTE9HW29wZW5de2Rpc3BsYXk6YmxvY2t9LnFxLXVwbG9hZGVyIERJQUxPRyAucXEtZGlhbG9nLWJ1dHRvbnN7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZy10b3A6MTBweH0ucXEtdXBsb2FkZXIgRElBTE9HIC5xcS1kaWFsb2ctYnV0dG9ucyBCVVRUT057bWFyZ2luLWxlZnQ6NXB4O21hcmdpbi1yaWdodDo1cHh9LnFxLXVwbG9hZGVyIERJQUxPRyAucXEtZGlhbG9nLW1lc3NhZ2Utc2VsZWN0b3J7cGFkZGluZy1ib3R0b206MTBweH0ucXEtdXBsb2FkZXIgRElBTE9HOjotd2Via2l0LWJhY2tkcm9we2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuNyl9LnFxLXVwbG9hZGVyIERJQUxPRzo6YmFja2Ryb3B7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDAsMCwwLC43KX1gXSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBVcGxvYWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xyXG4gIEBJbnB1dCgpIG9wZW5EaWFsb2c7XHJcblxyXG4gIEBPdXRwdXQoKSBjbG9zZURpYWxvZyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgY3JlYXRlRGlyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICB1cGxvYWRlcjogRmluZVVwbG9hZGVyO1xyXG4gIG5ld0ZvbGRlciA9IGZhbHNlO1xyXG4gIGNvdW50ZXIgPSAwO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UpIHtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIHRoaXMudXBsb2FkZXIgPSBuZXcgRmluZVVwbG9hZGVyKHtcclxuICAgICAgZGVidWc6IGZhbHNlLFxyXG4gICAgICBhdXRvVXBsb2FkOiBmYWxzZSxcclxuICAgICAgbWF4Q29ubmVjdGlvbnM6IDEsIC8vIHRvZG8gY29uZmlndXJhYmxlXHJcbiAgICAgIGVsZW1lbnQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5lLXVwbG9hZGVyJyksXHJcbiAgICAgIHRlbXBsYXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZS11cGxvYWRlci10ZW1wbGF0ZScpLFxyXG4gICAgICByZXF1ZXN0OiB7XHJcbiAgICAgICAgZW5kcG9pbnQ6IHRoaXMubm9kZVNlcnZpY2UudHJlZS5jb25maWcuYmFzZVVSTCArIHRoaXMubm9kZVNlcnZpY2UudHJlZS5jb25maWcuYXBpLnVwbG9hZEZpbGUsXHJcbiAgICAgICAgLy8gZm9yY2VNdWx0aXBhcnQ6IGZhbHNlLFxyXG4gICAgICAgIHBhcmFtc0luQm9keTogZmFsc2UsXHJcbiAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICBwYXJlbnRQYXRoOiB0aGlzLmdldEN1cnJlbnRQYXRoXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICByZXRyeToge1xyXG4gICAgICAgIGVuYWJsZUF1dG86IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIGNhbGxiYWNrczoge1xyXG4gICAgICAgIG9uU3VibWl0dGVkOiAoKSA9PiB0aGlzLmNvdW50ZXIrKyxcclxuICAgICAgICBvbkNhbmNlbDogKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jb3VudGVyIDwgMCA/IGNvbnNvbGUud2Fybignd3RmPycpIDogdGhpcy5jb3VudGVyLS07XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbkFsbENvbXBsZXRlOiAoc3VjYzogYW55LCBmYWlsOiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmIChzdWNjLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb3VudGVyID0gMDtcclxuICAgICAgICAgICAgdGhpcy5ub2RlU2VydmljZS5yZWZyZXNoQ3VycmVudFBhdGgoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICA7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcblxyXG4gIGdldCBnZXRDdXJyZW50UGF0aCgpIHtcclxuICAgIGNvbnN0IHBhcmVudFBhdGggPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlQYXRoKHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGgpLmlkO1xyXG4gICAgcmV0dXJuIHBhcmVudFBhdGggPT09IDAgPyAnJyA6IHBhcmVudFBhdGg7XHJcbiAgfVxyXG5cclxuICB1cGxvYWRGaWxlcygpIHtcclxuICAgIHRoaXMudXBsb2FkZXIudXBsb2FkU3RvcmVkRmlsZXMoKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZU5ld0ZvbGRlcihpbnB1dD86IHN0cmluZykge1xyXG4gICAgaWYgKCF0aGlzLm5ld0ZvbGRlcikge1xyXG4gICAgICB0aGlzLm5ld0ZvbGRlciA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm5ld0ZvbGRlciA9IGZhbHNlO1xyXG4gICAgICBpZiAoaW5wdXQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRGlyLmVtaXQoaW5wdXQpO1xyXG4gICAgICAgIHRoaXMubmV3Q2xpY2tlZEFjdGlvbigpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZXdDbGlja2VkQWN0aW9uKCkge1xyXG4gICAgdGhpcy51cGxvYWRlci5jYW5jZWxBbGwoKTtcclxuICAgIHRoaXMuY2xvc2VEaWFsb2cuZW1pdCgpO1xyXG4gIH1cclxufVxyXG4iXX0=