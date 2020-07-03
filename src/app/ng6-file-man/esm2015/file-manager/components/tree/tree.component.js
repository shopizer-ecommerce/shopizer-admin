/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { TreeModel } from '../../models/tree.model';
import { NodeService } from '../../services/node.service';
import { select, Store } from '@ngrx/store';
import * as ACTIONS from '../../reducers/actions.action';
import { first } from 'rxjs/operators';
export class TreeComponent {
    /**
     * @param {?} nodeService
     * @param {?} store
     */
    constructor(nodeService, store) {
        this.nodeService = nodeService;
        this.store = store;
        this.currentTreeLevel = '';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.nodes = this.treeModel.nodes;
        //todo move this store to proper place
        this.store
            .pipe(select(state => state.fileManagerState.path))
            .subscribe((path) => {
            this.nodeService.getNodes(path);
            this.currentTreeLevel = this.treeModel.currentPath;
            return this.treeModel.currentPath = path;
        });
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.store
            .pipe(select(state => state.fileManagerState.path))
            .pipe(first())
            .subscribe((path) => {
            /** @type {?} */
            const nodes = this.nodeService.findNodeByPath(path);
            this.store.dispatch({ type: ACTIONS.SET_SELECTED_NODE, payload: nodes });
        });
    }
}
TreeComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-tree',
                template: `<app-node-lister [showFiles]="treeModel.config.options.showFilesInsideTree"
                 [nodes]="{children: nodes}">
  <ng-template let-nodes>
    <ng-container [ngTemplateOutletContext]="{$implicit: nodes}" [ngTemplateOutlet]="templateRef"></ng-container>
  </ng-template>
</app-node-lister>
`,
                styles: [``]
            },] },
];
/** @nocollapse */
TreeComponent.ctorParameters = () => [
    { type: NodeService },
    { type: Store }
];
TreeComponent.propDecorators = {
    templateRef: [{ type: ContentChild, args: [TemplateRef,] }],
    treeModel: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    TreeComponent.prototype.templateRef;
    /** @type {?} */
    TreeComponent.prototype.treeModel;
    /** @type {?} */
    TreeComponent.prototype.nodes;
    /** @type {?} */
    TreeComponent.prototype.currentTreeLevel;
    /** @type {?} */
    TreeComponent.prototype.nodeService;
    /** @type {?} */
    TreeComponent.prototype.store;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvY29tcG9uZW50cy90cmVlL3RyZWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVqRyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ3hELE9BQU8sRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRTFDLE9BQU8sS0FBSyxPQUFPLE1BQU0sK0JBQStCLENBQUM7QUFDekQsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBYXJDLE1BQU07Ozs7O0lBUUosWUFDVSxhQUNBO1FBREEsZ0JBQVcsR0FBWCxXQUFXO1FBQ1gsVUFBSyxHQUFMLEtBQUs7Z0NBSkksRUFBRTtLQU1wQjs7OztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDOztRQUdsQyxJQUFJLENBQUMsS0FBSzthQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbEQsU0FBUyxDQUFDLENBQUMsSUFBWSxFQUFFLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFaEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1lBRW5ELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7U0FDMUMsQ0FBQyxDQUFDO0tBQ047Ozs7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLEtBQUs7YUFDUCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xELElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNiLFNBQVMsQ0FBQyxDQUFDLElBQVksRUFBRSxFQUFFOztZQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFDLElBQUksRUFBRSxPQUFPLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7U0FDeEUsQ0FBQyxDQUFDO0tBQ047OztZQWhERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFFBQVEsRUFBRTs7Ozs7O0NBTVg7Z0JBQ0MsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO2FBQ2I7Ozs7WUFoQk8sV0FBVztZQUNILEtBQUs7OzswQkFpQmxCLFlBQVksU0FBQyxXQUFXO3dCQUV4QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgSW5wdXQsIE9uSW5pdCwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge1RyZWVNb2RlbH0gZnJvbSAnLi4vLi4vbW9kZWxzL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge3NlbGVjdCwgU3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuLi8uLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XHJcbmltcG9ydCB7Zmlyc3R9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLXRyZWUnLFxyXG4gIHRlbXBsYXRlOiBgPGFwcC1ub2RlLWxpc3RlciBbc2hvd0ZpbGVzXT1cInRyZWVNb2RlbC5jb25maWcub3B0aW9ucy5zaG93RmlsZXNJbnNpZGVUcmVlXCJcclxuICAgICAgICAgICAgICAgICBbbm9kZXNdPVwie2NoaWxkcmVuOiBub2Rlc31cIj5cclxuICA8bmctdGVtcGxhdGUgbGV0LW5vZGVzPlxyXG4gICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogbm9kZXN9XCIgW25nVGVtcGxhdGVPdXRsZXRdPVwidGVtcGxhdGVSZWZcIj48L25nLWNvbnRhaW5lcj5cclxuICA8L25nLXRlbXBsYXRlPlxyXG48L2FwcC1ub2RlLWxpc3Rlcj5cclxuYCxcclxuICBzdHlsZXM6IFtgYF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFRyZWVDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkluaXQge1xyXG4gIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYpIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBASW5wdXQoKSB0cmVlTW9kZWw6IFRyZWVNb2RlbDtcclxuXHJcbiAgbm9kZXM6IE5vZGVJbnRlcmZhY2U7XHJcbiAgY3VycmVudFRyZWVMZXZlbCA9ICcnO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+XHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMubm9kZXMgPSB0aGlzLnRyZWVNb2RlbC5ub2RlcztcclxuXHJcbiAgICAvL3RvZG8gbW92ZSB0aGlzIHN0b3JlIHRvIHByb3BlciBwbGFjZVxyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gc3RhdGUuZmlsZU1hbmFnZXJTdGF0ZS5wYXRoKSlcclxuICAgICAgLnN1YnNjcmliZSgocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ub2RlU2VydmljZS5nZXROb2RlcyhwYXRoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50VHJlZUxldmVsID0gdGhpcy50cmVlTW9kZWwuY3VycmVudFBhdGg7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnRyZWVNb2RlbC5jdXJyZW50UGF0aCA9IHBhdGg7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gc3RhdGUuZmlsZU1hbmFnZXJTdGF0ZS5wYXRoKSlcclxuICAgICAgLnBpcGUoZmlyc3QoKSlcclxuICAgICAgLnN1YnNjcmliZSgocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgbm9kZXMgPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlQYXRoKHBhdGgpO1xyXG4gICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUsIHBheWxvYWQ6IG5vZGVzfSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=