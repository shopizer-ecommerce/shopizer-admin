/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as ACTIONS from '../../reducers/actions.action';
import { NodeService } from '../../services/node.service';
export class NavBarComponent {
    /**
     * @param {?} store
     * @param {?} nodeService
     */
    constructor(store, nodeService) {
        this.store = store;
        this.nodeService = nodeService;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.store
            .pipe(select(state => state.fileManagerState.path))
            .subscribe((data) => {
            this.nodeService.currentPath = data;
            this.currentPath = data.split('/');
        });
    }
    /**
     * @param {?} path
     * @param {?} index
     * @return {?}
     */
    onClick(path, index) {
        /** @type {?} */
        const newPath = path.slice(0, index + 1).join('/');
        this.store.dispatch({ type: ACTIONS.SET_PATH, payload: newPath });
    }
}
NavBarComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-nav-bar',
                template: `<div>
  >> <span *ngFor="let to of currentPath; let i = index">
  <a class="link" href="#" (click)="onClick(currentPath, i)">
    <div *ngIf="to === '' || to === 'root'; then icon else name"></div>
    <ng-template #icon><i class="fas fa-home"></i></ng-template>
    <ng-template #name>{{to}}</ng-template>
  </a> /
  </span>
</div>
`,
                styles: [``]
            },] },
];
/** @nocollapse */
NavBarComponent.ctorParameters = () => [
    { type: Store },
    { type: NodeService }
];
if (false) {
    /** @type {?} */
    NavBarComponent.prototype.currentPath;
    /** @type {?} */
    NavBarComponent.prototype.store;
    /** @type {?} */
    NavBarComponent.prototype.nodeService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LWJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvY29tcG9uZW50cy9uYXYtYmFyL25hdi1iYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFTLE1BQU0sZUFBZSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzFDLE9BQU8sS0FBSyxPQUFPLE1BQU0sK0JBQStCLENBQUM7QUFFekQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBZ0J4RCxNQUFNOzs7OztJQUdKLFlBQ1UsT0FDQTtRQURBLFVBQUssR0FBTCxLQUFLO1FBQ0wsZ0JBQVcsR0FBWCxXQUFXO0tBRXBCOzs7O0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxLQUFLO2FBQ1AsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNsRCxTQUFTLENBQUMsQ0FBQyxJQUFZLEVBQUUsRUFBRTtZQUMxQixJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDcEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3BDLENBQUMsQ0FBQztLQUNOOzs7Ozs7SUFFRCxPQUFPLENBQUMsSUFBYyxFQUFFLEtBQWE7O1FBQ25DLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztLQUNqRTs7O1lBbkNGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsUUFBUSxFQUFFOzs7Ozs7Ozs7Q0FTWDtnQkFDQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7YUFDYjs7OztZQWxCZSxLQUFLO1lBR2IsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtzZWxlY3QsIFN0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4uLy4uL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uLy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtbmF2LWJhcicsXG4gIHRlbXBsYXRlOiBgPGRpdj5cbiAgPj4gPHNwYW4gKm5nRm9yPVwibGV0IHRvIG9mIGN1cnJlbnRQYXRoOyBsZXQgaSA9IGluZGV4XCI+XG4gIDxhIGNsYXNzPVwibGlua1wiIGhyZWY9XCIjXCIgKGNsaWNrKT1cIm9uQ2xpY2soY3VycmVudFBhdGgsIGkpXCI+XG4gICAgPGRpdiAqbmdJZj1cInRvID09PSAnJyB8fCB0byA9PT0gJ3Jvb3QnOyB0aGVuIGljb24gZWxzZSBuYW1lXCI+PC9kaXY+XG4gICAgPG5nLXRlbXBsYXRlICNpY29uPjxpIGNsYXNzPVwiZmFzIGZhLWhvbWVcIj48L2k+PC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctdGVtcGxhdGUgI25hbWU+e3t0b319PC9uZy10ZW1wbGF0ZT5cbiAgPC9hPiAvXG4gIDwvc3Bhbj5cbjwvZGl2PlxuYCxcbiAgc3R5bGVzOiBbYGBdXG59KVxuZXhwb3J0IGNsYXNzIE5hdkJhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGN1cnJlbnRQYXRoOiBzdHJpbmdbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4sXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2VcbiAgKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnN0b3JlXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gc3RhdGUuZmlsZU1hbmFnZXJTdGF0ZS5wYXRoKSlcbiAgICAgIC5zdWJzY3JpYmUoKGRhdGE6IHN0cmluZykgPT4ge1xuICAgICAgICB0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoID0gZGF0YTtcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IGRhdGEuc3BsaXQoJy8nKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgb25DbGljayhwYXRoOiBzdHJpbmdbXSwgaW5kZXg6IG51bWJlcikge1xuICAgIGNvbnN0IG5ld1BhdGggPSBwYXRoLnNsaWNlKDAsIGluZGV4ICsgMSkuam9pbignLycpO1xuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1BBVEgsIHBheWxvYWQ6IG5ld1BhdGh9KTtcbiAgfVxuXG59XG4iXX0=