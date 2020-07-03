/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
var SideViewComponent = /** @class */ (function () {
    function SideViewComponent() {
        this.allowFolderDownload = false;
        this.clickEvent = new EventEmitter();
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
        { type: Component, args: [{
                    selector: 'app-side-view',
                    template: "<div class=\"side-view\" *ngIf=\"node\">\n  <div class=\"side-view-preview\">\n    <i (click)=\"onClick($event, 'closeSideView')\" class=\"fas fa-times side-view-close\"></i>\n\n    <div class=\"side-view-preview-title\">{{node.name}}</div>\n\n    <div class=\"side-view-preview-content\">\n      <ng-container\n        [ngTemplateOutletContext]=\"{$implicit: node}\"\n        [ngTemplateOutlet]=\"sideViewTemplate\">\n      </ng-container>\n    </div>\n\n    <div class=\"side-view-buttons\">\n      <button (click)=\"onClick($event, 'download')\" class=\"button\"\n              [disabled]=\"!allowFolderDownload && node.isFolder\" translate>\n        Download\n      </button>\n      <button (click)=\"onClick($event, 'renameConfirm')\" class=\"button\" translate>Rename</button>\n      <button (click)=\"onClick($event, 'removeAsk')\" class=\"button\" translate>Delete</button>\n    </div>\n  </div>\n</div>\n",
                    styles: [".side-view-close{position:absolute;cursor:pointer;top:0;right:0;padding:15px}.side-view-buttons{width:100%;display:flex;justify-content:center;flex-flow:column}.side-view-buttons .button{margin:5px 0}"],
                    encapsulation: ViewEncapsulation.None
                },] },
    ];
    /** @nocollapse */
    SideViewComponent.ctorParameters = function () { return []; };
    SideViewComponent.propDecorators = {
        sideViewTemplate: [{ type: Input }],
        node: [{ type: Input }],
        allowFolderDownload: [{ type: Input }],
        clickEvent: [{ type: Output }]
    };
    return SideViewComponent;
}());
export { SideViewComponent };
if (false) {
    /** @type {?} */
    SideViewComponent.prototype.sideViewTemplate;
    /** @type {?} */
    SideViewComponent.prototype.node;
    /** @type {?} */
    SideViewComponent.prototype.allowFolderDownload;
    /** @type {?} */
    SideViewComponent.prototype.clickEvent;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZS12aWV3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nNi1maWxlLW1hbi8iLCJzb3VyY2VzIjpbImZpbGUtbWFuYWdlci9jb21wb25lbnRzL3NpZGUtdmlldy9zaWRlLXZpZXcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7SUF3QzNHO21DQUorQixLQUFLOzBCQUViLElBQUksWUFBWSxFQUFFO0tBR3hDOzs7O0lBRUQsb0NBQVE7OztJQUFSO0tBQ0M7Ozs7OztJQUVELG1DQUFPOzs7OztJQUFQLFVBQVEsS0FBVSxFQUFFLElBQVk7UUFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO0tBQ25FOztnQkE3Q0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxlQUFlO29CQUN6QixRQUFRLEVBQUUsbTVCQXVCWDtvQkFDQyxNQUFNLEVBQUUsQ0FBQywwTUFBME0sQ0FBQztvQkFDcE4sYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7aUJBQ3RDOzs7OzttQ0FFRSxLQUFLO3VCQUVMLEtBQUs7c0NBQ0wsS0FBSzs2QkFFTCxNQUFNOzs0QkF0Q1Q7O1NBZ0NhLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVGVtcGxhdGVSZWYsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLXNpZGUtdmlldycsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwic2lkZS12aWV3XCIgKm5nSWY9XCJub2RlXCI+XG4gIDxkaXYgY2xhc3M9XCJzaWRlLXZpZXctcHJldmlld1wiPlxuICAgIDxpIChjbGljayk9XCJvbkNsaWNrKCRldmVudCwgJ2Nsb3NlU2lkZVZpZXcnKVwiIGNsYXNzPVwiZmFzIGZhLXRpbWVzIHNpZGUtdmlldy1jbG9zZVwiPjwvaT5cblxuICAgIDxkaXYgY2xhc3M9XCJzaWRlLXZpZXctcHJldmlldy10aXRsZVwiPnt7bm9kZS5uYW1lfX08L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJzaWRlLXZpZXctcHJldmlldy1jb250ZW50XCI+XG4gICAgICA8bmctY29udGFpbmVyXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2RlfVwiXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInNpZGVWaWV3VGVtcGxhdGVcIj5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cInNpZGUtdmlldy1idXR0b25zXCI+XG4gICAgICA8YnV0dG9uIChjbGljayk9XCJvbkNsaWNrKCRldmVudCwgJ2Rvd25sb2FkJylcIiBjbGFzcz1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIFtkaXNhYmxlZF09XCIhYWxsb3dGb2xkZXJEb3dubG9hZCAmJiBub2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPlxuICAgICAgICBEb3dubG9hZFxuICAgICAgPC9idXR0b24+XG4gICAgICA8YnV0dG9uIChjbGljayk9XCJvbkNsaWNrKCRldmVudCwgJ3JlbmFtZUNvbmZpcm0nKVwiIGNsYXNzPVwiYnV0dG9uXCIgdHJhbnNsYXRlPlJlbmFtZTwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiAoY2xpY2spPVwib25DbGljaygkZXZlbnQsICdyZW1vdmVBc2snKVwiIGNsYXNzPVwiYnV0dG9uXCIgdHJhbnNsYXRlPkRlbGV0ZTwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuYCxcclxuICBzdHlsZXM6IFtgLnNpZGUtdmlldy1jbG9zZXtwb3NpdGlvbjphYnNvbHV0ZTtjdXJzb3I6cG9pbnRlcjt0b3A6MDtyaWdodDowO3BhZGRpbmc6MTVweH0uc2lkZS12aWV3LWJ1dHRvbnN7d2lkdGg6MTAwJTtkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OmNlbnRlcjtmbGV4LWZsb3c6Y29sdW1ufS5zaWRlLXZpZXctYnV0dG9ucyAuYnV0dG9ue21hcmdpbjo1cHggMH1gXSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTaWRlVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgc2lkZVZpZXdUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQElucHV0KCkgbm9kZTogTm9kZUludGVyZmFjZTtcclxuICBASW5wdXQoKSBhbGxvd0ZvbGRlckRvd25sb2FkID0gZmFsc2U7XHJcblxyXG4gIEBPdXRwdXQoKSBjbGlja0V2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbiAgb25DbGljayhldmVudDogYW55LCB0eXBlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuY2xpY2tFdmVudC5lbWl0KHt0eXBlOiB0eXBlLCBldmVudDogZXZlbnQsIG5vZGU6IHRoaXMubm9kZX0pO1xyXG4gIH1cclxuXHJcbn1cclxuIl19