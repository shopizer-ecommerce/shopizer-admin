/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, TemplateRef } from '@angular/core';
import { _ } from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import { timer } from 'rxjs';
var LoadingOverlayComponent = /** @class */ (function () {
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
        timer(2000).subscribe(function () {
            _this.timeoutMessage = _('Troubles with loading? Click anywhere to cancel loading');
        });
    };
    LoadingOverlayComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-loading-overlay',
                    template: "<ng-container\n  [ngTemplateOutletContext]=\"{$implicit: timeoutMessage}\"\n  [ngTemplateOutlet]=\"loadingOverlayTemplate\">\n</ng-container>\n",
                    styles: [""]
                },] },
    ];
    LoadingOverlayComponent.propDecorators = {
        loadingOverlayTemplate: [{ type: Input }]
    };
    return LoadingOverlayComponent;
}());
export { LoadingOverlayComponent };
if (false) {
    /** @type {?} */
    LoadingOverlayComponent.prototype.loadingOverlayTemplate;
    /** @type {?} */
    LoadingOverlayComponent.prototype.timeoutMessage;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGluZy1vdmVybGF5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nNi1maWxlLW1hbi8iLCJzb3VyY2VzIjpbImZpbGUtbWFuYWdlci9jb21wb25lbnRzL2Z1bmN0aW9ucy9sb2FkaW5nLW92ZXJsYXkvbG9hZGluZy1vdmVybGF5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQVUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BFLE9BQU8sRUFBQyxDQUFDLEVBQUMsTUFBTSxtREFBbUQsQ0FBQztBQUNwRSxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sTUFBTSxDQUFDOzs7O0lBZXpCLGlGQUFpRjs7OztJQUNqRiwwQ0FBUTs7O0lBQVI7UUFBQSxpQkFJQztRQUhDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDcEIsS0FBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMseURBQXlELENBQUMsQ0FBQztTQUNwRixDQUFDLENBQUM7S0FDSjs7Z0JBbEJGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixRQUFRLEVBQUUsaUpBSVg7b0JBQ0MsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO2lCQUNiOzs7eUNBRUUsS0FBSzs7a0NBZFI7O1NBYWEsdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtffSBmcm9tICdAYmllc2JqZXJnL25neC10cmFuc2xhdGUtZXh0cmFjdC9kaXN0L3V0aWxzL3V0aWxzJztcclxuaW1wb3J0IHt0aW1lcn0gZnJvbSAncnhqcyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1sb2FkaW5nLW92ZXJsYXknLFxyXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRhaW5lclxuICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogdGltZW91dE1lc3NhZ2V9XCJcbiAgW25nVGVtcGxhdGVPdXRsZXRdPVwibG9hZGluZ092ZXJsYXlUZW1wbGF0ZVwiPlxuPC9uZy1jb250YWluZXI+XG5gLFxyXG4gIHN0eWxlczogW2BgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTG9hZGluZ092ZXJsYXlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIGxvYWRpbmdPdmVybGF5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgdGltZW91dE1lc3NhZ2U6IGFueTtcclxuXHJcbiAgLy8gdG9kbyB1bnN1YnNjcmliZSBmcm9tICdsaXN0JyBldmVudCAtIG5vdyB3ZSBhcmUgb25seSBkaXNtaXNzaW5nIHRoaXMgY29tcG9uZW50XHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aW1lcigyMDAwKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLnRpbWVvdXRNZXNzYWdlID0gXygnVHJvdWJsZXMgd2l0aCBsb2FkaW5nPyBDbGljayBhbnl3aGVyZSB0byBjYW5jZWwgbG9hZGluZycpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==