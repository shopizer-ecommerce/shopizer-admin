/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { NodeClickedService } from '../../services/node-clicked.service';
var NavigationComponent = /** @class */ (function () {
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
        { type: Component, args: [{
                    selector: 'app-navigation',
                    template: "<div class=\"navigation-component\">\n  <input #input class=\"navigation-search\" onclick=\"this.select();\" (keyup.enter)=\"onClick(input.value)\"\n         placeholder=\"{{'Search' | translate}}\">\n\n  <button [disabled]=\"input.value.length === 0\" class=\"navigation-search-icon\" (click)=\"onClick(input.value)\">\n    <i class=\"fas fa-search\"></i>\n  </button>\n\n  <div>\n    <ng-content></ng-content>\n  </div>\n</div>\n\n\n",
                    styles: [".navigation-component{display:flex}"],
                    encapsulation: ViewEncapsulation.None
                },] },
    ];
    /** @nocollapse */
    NavigationComponent.ctorParameters = function () { return [
        { type: NodeClickedService }
    ]; };
    return NavigationComponent;
}());
export { NavigationComponent };
if (false) {
    /** @type {?} */
    NavigationComponent.prototype.nodeClickedService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFVLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ25FLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHFDQUFxQyxDQUFDOztJQXdCckUsNkJBQ1U7UUFBQSx1QkFBa0IsR0FBbEIsa0JBQWtCO0tBRTNCOzs7O0lBRUQsc0NBQVE7OztJQUFSO0tBQ0M7Ozs7O0lBRUQscUNBQU87Ozs7SUFBUCxVQUFRLEtBQWE7UUFDbkIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNoRDs7Z0JBaENGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixRQUFRLEVBQUUscWJBY1g7b0JBQ0MsTUFBTSxFQUFFLENBQUMscUNBQXFDLENBQUM7b0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2lCQUN0Qzs7OztnQkFyQk8sa0JBQWtCOzs4QkFEMUI7O1NBdUJhLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlQ2xpY2tlZFNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vZGUtY2xpY2tlZC5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5hdmlnYXRpb24nLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cIm5hdmlnYXRpb24tY29tcG9uZW50XCI+XHJcbiAgPGlucHV0ICNpbnB1dCBjbGFzcz1cIm5hdmlnYXRpb24tc2VhcmNoXCIgb25jbGljaz1cInRoaXMuc2VsZWN0KCk7XCIgKGtleXVwLmVudGVyKT1cIm9uQ2xpY2soaW5wdXQudmFsdWUpXCJcclxuICAgICAgICAgcGxhY2Vob2xkZXI9XCJ7eydTZWFyY2gnIHwgdHJhbnNsYXRlfX1cIj5cclxuXHJcbiAgPGJ1dHRvbiBbZGlzYWJsZWRdPVwiaW5wdXQudmFsdWUubGVuZ3RoID09PSAwXCIgY2xhc3M9XCJuYXZpZ2F0aW9uLXNlYXJjaC1pY29uXCIgKGNsaWNrKT1cIm9uQ2xpY2soaW5wdXQudmFsdWUpXCI+XHJcbiAgICA8aSBjbGFzcz1cImZhcyBmYS1zZWFyY2hcIj48L2k+XHJcbiAgPC9idXR0b24+XHJcblxyXG4gIDxkaXY+XHJcbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG5cclxuXHJcbmAsXHJcbiAgc3R5bGVzOiBbYC5uYXZpZ2F0aW9uLWNvbXBvbmVudHtkaXNwbGF5OmZsZXh9YF0sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmF2aWdhdGlvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBub2RlQ2xpY2tlZFNlcnZpY2U6IE5vZGVDbGlja2VkU2VydmljZVxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKGlucHV0OiBzdHJpbmcpIHtcclxuICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnNlYXJjaEZvclN0cmluZyhpbnB1dCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==