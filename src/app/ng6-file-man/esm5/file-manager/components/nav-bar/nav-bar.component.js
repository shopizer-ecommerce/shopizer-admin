/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as ACTIONS from '../../reducers/actions.action';
import { NodeService } from '../../services/node.service';
var NavBarComponent = /** @class */ (function () {
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
            .pipe(select(function (state) { return state.fileManagerState.path; }))
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
        this.store.dispatch({ type: ACTIONS.SET_PATH, payload: newPath });
    };
    NavBarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-nav-bar',
                    template: "<div>\n  >> <span *ngFor=\"let to of currentPath; let i = index\">\n  <a class=\"link\" href=\"#\" (click)=\"onClick(currentPath, i)\">\n    <div *ngIf=\"to === '' || to === 'root'; then icon else name\"></div>\n    <ng-template #icon><i class=\"fas fa-home\"></i></ng-template>\n    <ng-template #name>{{to}}</ng-template>\n  </a> /\n  </span>\n</div>\n",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    NavBarComponent.ctorParameters = function () { return [
        { type: Store },
        { type: NodeService }
    ]; };
    return NavBarComponent;
}());
export { NavBarComponent };
if (false) {
    /** @type {?} */
    NavBarComponent.prototype.currentPath;
    /** @type {?} */
    NavBarComponent.prototype.store;
    /** @type {?} */
    NavBarComponent.prototype.nodeService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LWJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvY29tcG9uZW50cy9uYXYtYmFyL25hdi1iYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFTLE1BQU0sZUFBZSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzFDLE9BQU8sS0FBSyxPQUFPLE1BQU0sK0JBQStCLENBQUM7QUFFekQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDZCQUE2QixDQUFDOztJQW1CdEQseUJBQ1UsT0FDQTtRQURBLFVBQUssR0FBTCxLQUFLO1FBQ0wsZ0JBQVcsR0FBWCxXQUFXO0tBRXBCOzs7O0lBRUQsa0NBQVE7OztJQUFSO1FBQUEsaUJBT0M7UUFOQyxJQUFJLENBQUMsS0FBSzthQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUEzQixDQUEyQixDQUFDLENBQUM7YUFDbEQsU0FBUyxDQUFDLFVBQUMsSUFBWTtZQUN0QixLQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDcEMsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3BDLENBQUMsQ0FBQztLQUNOOzs7Ozs7SUFFRCxpQ0FBTzs7Ozs7SUFBUCxVQUFRLElBQWMsRUFBRSxLQUFhOztRQUNuQyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7S0FDakU7O2dCQW5DRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLFFBQVEsRUFBRSxvV0FTWDtvQkFDQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7aUJBQ2I7Ozs7Z0JBbEJlLEtBQUs7Z0JBR2IsV0FBVzs7MEJBSm5COztTQW9CYSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge3NlbGVjdCwgU3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi4vLi4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1uYXYtYmFyJyxcbiAgdGVtcGxhdGU6IGA8ZGl2PlxuICA+PiA8c3BhbiAqbmdGb3I9XCJsZXQgdG8gb2YgY3VycmVudFBhdGg7IGxldCBpID0gaW5kZXhcIj5cbiAgPGEgY2xhc3M9XCJsaW5rXCIgaHJlZj1cIiNcIiAoY2xpY2spPVwib25DbGljayhjdXJyZW50UGF0aCwgaSlcIj5cbiAgICA8ZGl2ICpuZ0lmPVwidG8gPT09ICcnIHx8IHRvID09PSAncm9vdCc7IHRoZW4gaWNvbiBlbHNlIG5hbWVcIj48L2Rpdj5cbiAgICA8bmctdGVtcGxhdGUgI2ljb24+PGkgY2xhc3M9XCJmYXMgZmEtaG9tZVwiPjwvaT48L25nLXRlbXBsYXRlPlxuICAgIDxuZy10ZW1wbGF0ZSAjbmFtZT57e3RvfX08L25nLXRlbXBsYXRlPlxuICA8L2E+IC9cbiAgPC9zcGFuPlxuPC9kaXY+XG5gLFxuICBzdHlsZXM6IFtgYF1cbn0pXG5leHBvcnQgY2xhc3MgTmF2QmFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgY3VycmVudFBhdGg6IHN0cmluZ1tdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPixcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZVxuICApIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuc3RvcmVcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLnBhdGgpKVxuICAgICAgLnN1YnNjcmliZSgoZGF0YTogc3RyaW5nKSA9PiB7XG4gICAgICAgIHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGggPSBkYXRhO1xuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gZGF0YS5zcGxpdCgnLycpO1xuICAgICAgfSk7XG4gIH1cblxuICBvbkNsaWNrKHBhdGg6IHN0cmluZ1tdLCBpbmRleDogbnVtYmVyKSB7XG4gICAgY29uc3QgbmV3UGF0aCA9IHBhdGguc2xpY2UoMCwgaW5kZXggKyAxKS5qb2luKCcvJyk7XG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfUEFUSCwgcGF5bG9hZDogbmV3UGF0aH0pO1xuICB9XG5cbn1cbiJdfQ==