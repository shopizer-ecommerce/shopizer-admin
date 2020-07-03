/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ACTIONS from '../../../reducers/actions.action';
import { NodeService } from '../../../services/node.service';
import { NodeClickedService } from '../../../services/node-clicked.service';
export class NodeComponent {
    /**
     * @param {?} store
     * @param {?} nodeService
     * @param {?} nodeClickedService
     */
    constructor(store, nodeService, nodeClickedService) {
        this.store = store;
        this.nodeService = nodeService;
        this.nodeClickedService = nodeClickedService;
        this.isSingleClick = true;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    method1CallForClick(event) {
        event.preventDefault();
        this.isSingleClick = true;
        setTimeout(() => {
            if (this.isSingleClick) {
                this.showMenu();
            }
        }, 200);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    method2CallForDblClick(event) {
        event.preventDefault();
        this.isSingleClick = false;
        this.open();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @return {?}
     */
    open() {
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
    }
    /**
     * @return {?}
     */
    showMenu() {
        this.store.dispatch({ type: ACTIONS.SET_SELECTED_NODE, payload: this.node });
    }
    /**
     * @return {?}
     */
    toggleNodeExpanded() {
        this.node.isExpanded = !this.node.isExpanded;
    }
    /**
     * @return {?}
     */
    setNodeSelectedState() {
        if (!this.node.isExpanded) {
            document.getElementById('tree_' + this.node.pathToNode).classList.add('deselected');
            this.nodeService.foldRecursively(this.node);
            this.store.dispatch({ type: ACTIONS.SET_PATH, payload: this.node.pathToParent });
        }
        else {
            document.getElementById('tree_' + this.node.pathToNode).classList.remove('deselected');
        }
    }
}
NodeComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-node',
                template: `<div #customTemplate (dblclick)="method2CallForDblClick($event)" (click)="method1CallForClick($event)">
  <ng-content></ng-content>
</div>
`,
                styles: [``]
            },] },
];
/** @nocollapse */
NodeComponent.ctorParameters = () => [
    { type: Store },
    { type: NodeService },
    { type: NodeClickedService }
];
NodeComponent.propDecorators = {
    node: [{ type: Input }]
};
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvbm9kZS9ub2RlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQVMsTUFBTSxlQUFlLENBQUM7QUFFdkQsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUVsQyxPQUFPLEtBQUssT0FBTyxNQUFNLGtDQUFrQyxDQUFDO0FBRTVELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMzRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQVUxRSxNQUFNOzs7Ozs7SUFJSixZQUNVLE9BQ0EsYUFDQTtRQUZBLFVBQUssR0FBTCxLQUFLO1FBQ0wsZ0JBQVcsR0FBWCxXQUFXO1FBQ1gsdUJBQWtCLEdBQWxCLGtCQUFrQjs2QkFMWixJQUFJO0tBT25COzs7OztJQUVNLG1CQUFtQixDQUFDLEtBQWlCO1FBQzFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV2QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUNqQjtTQUNGLEVBQUUsR0FBRyxDQUFDLENBQUM7Ozs7OztJQUlILHNCQUFzQixDQUFDLEtBQVU7UUFDdEMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXZCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzNCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7Ozs7SUFHZCxRQUFRO0tBQ1A7Ozs7SUFFTyxJQUFJO1FBQ1YsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDO1NBQ1I7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUM1QjtZQUVELElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFDLENBQUMsQ0FBQztZQUM3RSxNQUFNLENBQUM7U0FDUjtRQUVELElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBRTFCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFDLElBQUksRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBQyxDQUFDLENBQUM7U0FDOUU7UUFFRCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzs7Ozs7SUFHdEIsUUFBUTtRQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUM7Ozs7O0lBR3JFLGtCQUFrQjtRQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDOzs7OztJQUd2QyxvQkFBb0I7UUFDMUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDMUIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRXBGLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUU1QyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFDLElBQUksRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBQyxDQUFDLENBQUM7U0FDaEY7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUN4Rjs7OztZQWxGSixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFFBQVEsRUFBRTs7O0NBR1g7Z0JBQ0MsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO2FBQ2I7Ozs7WUFkTyxLQUFLO1lBSUwsV0FBVztZQUNYLGtCQUFrQjs7O21CQVd2QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge1N0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcblxyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4uLy4uLy4uL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vLi4vLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtOb2RlQ2xpY2tlZFNlcnZpY2V9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL25vZGUtY2xpY2tlZC5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5vZGUnLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiAjY3VzdG9tVGVtcGxhdGUgKGRibGNsaWNrKT1cIm1ldGhvZDJDYWxsRm9yRGJsQ2xpY2soJGV2ZW50KVwiIChjbGljayk9XCJtZXRob2QxQ2FsbEZvckNsaWNrKCRldmVudClcIj5cclxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2BgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTm9kZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgbm9kZTogTm9kZUludGVyZmFjZTtcclxuICBpc1NpbmdsZUNsaWNrID0gdHJ1ZTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4sXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgbm9kZUNsaWNrZWRTZXJ2aWNlOiBOb2RlQ2xpY2tlZFNlcnZpY2VcclxuICApIHtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBtZXRob2QxQ2FsbEZvckNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIHRoaXMuaXNTaW5nbGVDbGljayA9IHRydWU7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgaWYgKHRoaXMuaXNTaW5nbGVDbGljaykge1xyXG4gICAgICAgIHRoaXMuc2hvd01lbnUoKTtcclxuICAgICAgfVxyXG4gICAgfSwgMjAwKTtcclxuICB9XHJcblxyXG4gIC8vIHRvZG8gZXZlbnQucHJldmVudERlZmF1bHQgZm9yIGRvdWJsZSBjbGlja1xyXG4gIHB1YmxpYyBtZXRob2QyQ2FsbEZvckRibENsaWNrKGV2ZW50OiBhbnkpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgdGhpcy5pc1NpbmdsZUNsaWNrID0gZmFsc2U7XHJcbiAgICB0aGlzLm9wZW4oKTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvcGVuKCkge1xyXG4gICAgaWYgKCF0aGlzLm5vZGUuaXNGb2xkZXIpIHtcclxuICAgICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2Uuc3RhcnREb3dubG9hZCh0aGlzLm5vZGUpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMubm9kZS5zdGF5T3Blbikge1xyXG4gICAgICBpZiAodGhpcy5ub2RlLm5hbWUgPT0gJ3Jvb3QnKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlU2VydmljZS5mb2xkQWxsKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1BBVEgsIHBheWxvYWQ6IHRoaXMubm9kZS5wYXRoVG9Ob2RlfSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRvZ2dsZU5vZGVFeHBhbmRlZCgpO1xyXG5cclxuICAgIGlmICh0aGlzLm5vZGUuaXNFeHBhbmRlZCkge1xyXG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiB0aGlzLm5vZGUucGF0aFRvTm9kZX0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0Tm9kZVNlbGVjdGVkU3RhdGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2hvd01lbnUoKSB7XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFLCBwYXlsb2FkOiB0aGlzLm5vZGV9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdG9nZ2xlTm9kZUV4cGFuZGVkKCkge1xyXG4gICAgdGhpcy5ub2RlLmlzRXhwYW5kZWQgPSAhdGhpcy5ub2RlLmlzRXhwYW5kZWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldE5vZGVTZWxlY3RlZFN0YXRlKCkge1xyXG4gICAgaWYgKCF0aGlzLm5vZGUuaXNFeHBhbmRlZCkge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJlZV8nICsgdGhpcy5ub2RlLnBhdGhUb05vZGUpLmNsYXNzTGlzdC5hZGQoJ2Rlc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgIHRoaXMubm9kZVNlcnZpY2UuZm9sZFJlY3Vyc2l2ZWx5KHRoaXMubm9kZSk7XHJcblxyXG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiB0aGlzLm5vZGUucGF0aFRvUGFyZW50fSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJlZV8nICsgdGhpcy5ub2RlLnBhdGhUb05vZGUpLmNsYXNzTGlzdC5yZW1vdmUoJ2Rlc2VsZWN0ZWQnKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19