/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, TemplateRef } from '@angular/core';
import { _ } from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import { timer } from 'rxjs';
export class LoadingOverlayComponent {
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
    { type: Component, args: [{
                selector: 'app-loading-overlay',
                template: `<ng-container
  [ngTemplateOutletContext]="{$implicit: timeoutMessage}"
  [ngTemplateOutlet]="loadingOverlayTemplate">
</ng-container>
`,
                styles: [``]
            },] },
];
LoadingOverlayComponent.propDecorators = {
    loadingOverlayTemplate: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    LoadingOverlayComponent.prototype.loadingOverlayTemplate;
    /** @type {?} */
    LoadingOverlayComponent.prototype.timeoutMessage;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGluZy1vdmVybGF5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nNi1maWxlLW1hbi8iLCJzb3VyY2VzIjpbImZpbGUtbWFuYWdlci9jb21wb25lbnRzL2Z1bmN0aW9ucy9sb2FkaW5nLW92ZXJsYXkvbG9hZGluZy1vdmVybGF5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQVUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BFLE9BQU8sRUFBQyxDQUFDLEVBQUMsTUFBTSxtREFBbUQsQ0FBQztBQUNwRSxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBVzNCLE1BQU07Ozs7SUFLSixRQUFRO1FBQ04sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDekIsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMseURBQXlELENBQUMsQ0FBQztTQUNwRixDQUFDLENBQUM7S0FDSjs7O1lBbEJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUscUJBQXFCO2dCQUMvQixRQUFRLEVBQUU7Ozs7Q0FJWDtnQkFDQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7YUFDYjs7O3FDQUVFLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge199IGZyb20gJ0BiaWVzYmplcmcvbmd4LXRyYW5zbGF0ZS1leHRyYWN0L2Rpc3QvdXRpbHMvdXRpbHMnO1xyXG5pbXBvcnQge3RpbWVyfSBmcm9tICdyeGpzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWxvYWRpbmctb3ZlcmxheScsXHJcbiAgdGVtcGxhdGU6IGA8bmctY29udGFpbmVyXG4gIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiB0aW1lb3V0TWVzc2FnZX1cIlxuICBbbmdUZW1wbGF0ZU91dGxldF09XCJsb2FkaW5nT3ZlcmxheVRlbXBsYXRlXCI+XG48L25nLWNvbnRhaW5lcj5cbmAsXHJcbiAgc3R5bGVzOiBbYGBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMb2FkaW5nT3ZlcmxheUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgbG9hZGluZ092ZXJsYXlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICB0aW1lb3V0TWVzc2FnZTogYW55O1xyXG5cclxuICAvLyB0b2RvIHVuc3Vic2NyaWJlIGZyb20gJ2xpc3QnIGV2ZW50IC0gbm93IHdlIGFyZSBvbmx5IGRpc21pc3NpbmcgdGhpcyBjb21wb25lbnRcclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRpbWVyKDIwMDApLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgIHRoaXMudGltZW91dE1lc3NhZ2UgPSBfKCdUcm91YmxlcyB3aXRoIGxvYWRpbmc/IENsaWNrIGFueXdoZXJlIHRvIGNhbmNlbCBsb2FkaW5nJyk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19