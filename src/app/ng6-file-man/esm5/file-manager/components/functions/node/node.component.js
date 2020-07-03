/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ACTIONS from '../../../reducers/actions.action';
import { NodeService } from '../../../services/node.service';
import { NodeClickedService } from '../../../services/node-clicked.service';
var NodeComponent = /** @class */ (function () {
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
            this.store.dispatch({ type: ACTIONS.SET_PATH, payload: this.node.pathToNode });
            return;
        }
        this.toggleNodeExpanded();
        if (this.node.isExpanded) {
            this.store.dispatch({ type: ACTIONS.SET_PATH, payload: this.node.pathToNode });
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
        this.store.dispatch({ type: ACTIONS.SET_SELECTED_NODE, payload: this.node });
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
            this.store.dispatch({ type: ACTIONS.SET_PATH, payload: this.node.pathToParent });
        }
        else {
            document.getElementById('tree_' + this.node.pathToNode).classList.remove('deselected');
        }
    };
    NodeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-node',
                    template: "<div #customTemplate (dblclick)=\"method2CallForDblClick($event)\" (click)=\"method1CallForClick($event)\">\n  <ng-content></ng-content>\n</div>\n",
                    styles: [""]
                },] },
    ];
    /** @nocollapse */
    NodeComponent.ctorParameters = function () { return [
        { type: Store },
        { type: NodeService },
        { type: NodeClickedService }
    ]; };
    NodeComponent.propDecorators = {
        node: [{ type: Input }]
    };
    return NodeComponent;
}());
export { NodeComponent };
if (false) {
    /** @type {?} */
    NodeComponent.prototype.node;
    /** @type {?} */
    NodeComponent.prototype.isSingleClick;
    /** @type {?} */
    NodeComponent.prototype.store;
    /** @type {?} */
    NodeComponent.prototype.nodeService;
    /** @type {?} */
    NodeComponent.prototype.nodeClickedService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvbm9kZS9ub2RlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQVMsTUFBTSxlQUFlLENBQUM7QUFFdkQsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUVsQyxPQUFPLEtBQUssT0FBTyxNQUFNLGtDQUFrQyxDQUFDO0FBRTVELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMzRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQzs7SUFjeEUsdUJBQ1UsT0FDQSxhQUNBO1FBRkEsVUFBSyxHQUFMLEtBQUs7UUFDTCxnQkFBVyxHQUFYLFdBQVc7UUFDWCx1QkFBa0IsR0FBbEIsa0JBQWtCOzZCQUxaLElBQUk7S0FPbkI7Ozs7O0lBRU0sMkNBQW1COzs7O2NBQUMsS0FBaUI7O1FBQzFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV2QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixVQUFVLENBQUM7WUFDVCxFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDdkIsS0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQ2pCO1NBQ0YsRUFBRSxHQUFHLENBQUMsQ0FBQzs7Ozs7O0lBSUgsOENBQXNCOzs7O2NBQUMsS0FBVTtRQUN0QyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFdkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDOzs7OztJQUdkLGdDQUFROzs7SUFBUjtLQUNDOzs7O0lBRU8sNEJBQUk7Ozs7UUFDVixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqRCxNQUFNLENBQUM7U0FDUjtRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQzVCO1lBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUMsQ0FBQyxDQUFDO1lBQzdFLE1BQU0sQ0FBQztTQUNSO1FBRUQsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFFMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFDLENBQUMsQ0FBQztTQUM5RTtRQUVELElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDOzs7OztJQUd0QixnQ0FBUTs7OztRQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUM7Ozs7O0lBR3JFLDBDQUFrQjs7OztRQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDOzs7OztJQUd2Qyw0Q0FBb0I7Ozs7UUFDMUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDMUIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRXBGLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUU1QyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFDLElBQUksRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBQyxDQUFDLENBQUM7U0FDaEY7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUN4Rjs7O2dCQWxGSixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLFVBQVU7b0JBQ3BCLFFBQVEsRUFBRSxvSkFHWDtvQkFDQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7aUJBQ2I7Ozs7Z0JBZE8sS0FBSztnQkFJTCxXQUFXO2dCQUNYLGtCQUFrQjs7O3VCQVd2QixLQUFLOzt3QkFsQlI7O1NBaUJhLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7U3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuXHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi4vLi4vLi4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi8uLi8uLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge05vZGVDbGlja2VkU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbm9kZS1jbGlja2VkLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbm9kZScsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2ICNjdXN0b21UZW1wbGF0ZSAoZGJsY2xpY2spPVwibWV0aG9kMkNhbGxGb3JEYmxDbGljaygkZXZlbnQpXCIgKGNsaWNrKT1cIm1ldGhvZDFDYWxsRm9yQ2xpY2soJGV2ZW50KVwiPlxyXG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cclxuPC9kaXY+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYGBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOb2RlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBASW5wdXQoKSBub2RlOiBOb2RlSW50ZXJmYWNlO1xyXG4gIGlzU2luZ2xlQ2xpY2sgPSB0cnVlO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPixcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBub2RlQ2xpY2tlZFNlcnZpY2U6IE5vZGVDbGlja2VkU2VydmljZVxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG1ldGhvZDFDYWxsRm9yQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgdGhpcy5pc1NpbmdsZUNsaWNrID0gdHJ1ZTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5pc1NpbmdsZUNsaWNrKSB7XHJcbiAgICAgICAgdGhpcy5zaG93TWVudSgpO1xyXG4gICAgICB9XHJcbiAgICB9LCAyMDApO1xyXG4gIH1cclxuXHJcbiAgLy8gdG9kbyBldmVudC5wcmV2ZW50RGVmYXVsdCBmb3IgZG91YmxlIGNsaWNrXHJcbiAgcHVibGljIG1ldGhvZDJDYWxsRm9yRGJsQ2xpY2soZXZlbnQ6IGFueSkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB0aGlzLmlzU2luZ2xlQ2xpY2sgPSBmYWxzZTtcclxuICAgIHRoaXMub3BlbigpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9wZW4oKSB7XHJcbiAgICBpZiAoIXRoaXMubm9kZS5pc0ZvbGRlcikge1xyXG4gICAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5zdGFydERvd25sb2FkKHRoaXMubm9kZSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5ub2RlLnN0YXlPcGVuKSB7XHJcbiAgICAgIGlmICh0aGlzLm5vZGUubmFtZSA9PSAncm9vdCcpIHtcclxuICAgICAgICB0aGlzLm5vZGVTZXJ2aWNlLmZvbGRBbGwoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfUEFUSCwgcGF5bG9hZDogdGhpcy5ub2RlLnBhdGhUb05vZGV9KTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudG9nZ2xlTm9kZUV4cGFuZGVkKCk7XHJcblxyXG4gICAgaWYgKHRoaXMubm9kZS5pc0V4cGFuZGVkKSB7XHJcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1BBVEgsIHBheWxvYWQ6IHRoaXMubm9kZS5wYXRoVG9Ob2RlfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXROb2RlU2VsZWN0ZWRTdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzaG93TWVudSgpIHtcclxuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUsIHBheWxvYWQ6IHRoaXMubm9kZX0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0b2dnbGVOb2RlRXhwYW5kZWQoKSB7XHJcbiAgICB0aGlzLm5vZGUuaXNFeHBhbmRlZCA9ICF0aGlzLm5vZGUuaXNFeHBhbmRlZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0Tm9kZVNlbGVjdGVkU3RhdGUoKSB7XHJcbiAgICBpZiAoIXRoaXMubm9kZS5pc0V4cGFuZGVkKSB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmVlXycgKyB0aGlzLm5vZGUucGF0aFRvTm9kZSkuY2xhc3NMaXN0LmFkZCgnZGVzZWxlY3RlZCcpO1xyXG5cclxuICAgICAgdGhpcy5ub2RlU2VydmljZS5mb2xkUmVjdXJzaXZlbHkodGhpcy5ub2RlKTtcclxuXHJcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1BBVEgsIHBheWxvYWQ6IHRoaXMubm9kZS5wYXRoVG9QYXJlbnR9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmVlXycgKyB0aGlzLm5vZGUucGF0aFRvTm9kZSkuY2xhc3NMaXN0LnJlbW92ZSgnZGVzZWxlY3RlZCcpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=