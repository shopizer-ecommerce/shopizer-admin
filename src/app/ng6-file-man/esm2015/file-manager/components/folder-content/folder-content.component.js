/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TreeModel } from '../../models/tree.model';
import { NodeService } from '../../services/node.service';
export class FolderContentComponent {
    /**
     * @param {?} nodeService
     * @param {?} store
     */
    constructor(nodeService, store) {
        this.nodeService = nodeService;
        this.store = store;
        this.openUploadDialog = new EventEmitter();
        this.obj = Object;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.store
            .pipe(select(state => state.fileManagerState.path))
            .subscribe((path) => {
            this.nodes = this.nodeService.findNodeByPath(path);
        });
    }
    /**
     * @return {?}
     */
    newClickedAction() {
        this.openUploadDialog.emit(true);
    }
}
FolderContentComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-folder-content',
                template: `<div class="item-holder">
  <ng-container *ngIf="nodes.id !== 0">
    <app-node [node]=nodes id="{{nodes.pathToNode}}">
      <ng-container [ngTemplateOutletContext]="{$implicit: nodes}"
                    [ngTemplateOutlet]="folderContentBackTemplate">
      </ng-container>
    </app-node>
  </ng-container>

  <ng-container *ngFor="let node of obj.keys(nodes.children)">
    <app-node [node]="nodes.children[node]"
              id="fc_{{nodes.children[node].pathToNode}}">
      <ng-container [ngTemplateOutletContext]="{$implicit: nodes.children[node]}"
                    [ngTemplateOutlet]="folderContentTemplate">
      </ng-container>
    </app-node>
  </ng-container>

  <div class="new" (click)="newClickedAction()">
    <ng-container [ngTemplateOutlet]="folderContentNewTemplate"></ng-container>
  </div>
</div>
`,
                styles: [`.item-holder{box-sizing:border-box;display:flex;flex-flow:wrap}.item-holder .new{display:inline}`]
            },] },
];
/** @nocollapse */
FolderContentComponent.ctorParameters = () => [
    { type: NodeService },
    { type: Store }
];
FolderContentComponent.propDecorators = {
    folderContentTemplate: [{ type: Input }],
    folderContentBackTemplate: [{ type: Input }],
    folderContentNewTemplate: [{ type: Input }],
    treeModel: [{ type: Input }],
    openUploadDialog: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    FolderContentComponent.prototype.folderContentTemplate;
    /** @type {?} */
    FolderContentComponent.prototype.folderContentBackTemplate;
    /** @type {?} */
    FolderContentComponent.prototype.folderContentNewTemplate;
    /** @type {?} */
    FolderContentComponent.prototype.treeModel;
    /** @type {?} */
    FolderContentComponent.prototype.openUploadDialog;
    /** @type {?} */
    FolderContentComponent.prototype.nodes;
    /** @type {?} */
    FolderContentComponent.prototype.obj;
    /** @type {?} */
    FolderContentComponent.prototype.nodeService;
    /** @type {?} */
    FolderContentComponent.prototype.store;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9sZGVyLWNvbnRlbnQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmc2LWZpbGUtbWFuLyIsInNvdXJjZXMiOlsiZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvZm9sZGVyLWNvbnRlbnQvZm9sZGVyLWNvbnRlbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMxRixPQUFPLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMxQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBK0J4RCxNQUFNOzs7OztJQVlKLFlBQ1UsYUFDQTtRQURBLGdCQUFXLEdBQVgsV0FBVztRQUNYLFVBQUssR0FBTCxLQUFLO2dDQVBjLElBQUksWUFBWSxFQUFFO21CQUd6QyxNQUFNO0tBTVg7Ozs7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLEtBQUs7YUFDUCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xELFNBQVMsQ0FBQyxDQUFDLElBQVksRUFBRSxFQUFFO1lBQzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEQsQ0FBQyxDQUFDO0tBQ047Ozs7SUFFRCxnQkFBZ0I7UUFDZCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2xDOzs7WUF2REYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXNCWDtnQkFDQyxNQUFNLEVBQUUsQ0FBQyxrR0FBa0csQ0FBQzthQUM3Rzs7OztZQTlCTyxXQUFXO1lBRkgsS0FBSzs7O29DQWtDbEIsS0FBSzt3Q0FDTCxLQUFLO3VDQUNMLEtBQUs7d0JBRUwsS0FBSzsrQkFFTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBUZW1wbGF0ZVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7c2VsZWN0LCBTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge1RyZWVNb2RlbH0gZnJvbSAnLi4vLi4vbW9kZWxzL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi8uLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtZm9sZGVyLWNvbnRlbnQnLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cIml0ZW0taG9sZGVyXCI+XHJcbiAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIm5vZGVzLmlkICE9PSAwXCI+XHJcbiAgICA8YXBwLW5vZGUgW25vZGVdPW5vZGVzIGlkPVwie3tub2Rlcy5wYXRoVG9Ob2RlfX1cIj5cclxuICAgICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogbm9kZXN9XCJcclxuICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlXCI+XHJcbiAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgPC9hcHAtbm9kZT5cclxuICA8L25nLWNvbnRhaW5lcj5cclxuXHJcbiAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgbm9kZSBvZiBvYmoua2V5cyhub2Rlcy5jaGlsZHJlbilcIj5cclxuICAgIDxhcHAtbm9kZSBbbm9kZV09XCJub2Rlcy5jaGlsZHJlbltub2RlXVwiXHJcbiAgICAgICAgICAgICAgaWQ9XCJmY197e25vZGVzLmNoaWxkcmVuW25vZGVdLnBhdGhUb05vZGV9fVwiPlxyXG4gICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2Rlcy5jaGlsZHJlbltub2RlXX1cIlxyXG4gICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImZvbGRlckNvbnRlbnRUZW1wbGF0ZVwiPlxyXG4gICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgIDwvYXBwLW5vZGU+XHJcbiAgPC9uZy1jb250YWluZXI+XHJcblxyXG4gIDxkaXYgY2xhc3M9XCJuZXdcIiAoY2xpY2spPVwibmV3Q2xpY2tlZEFjdGlvbigpXCI+XHJcbiAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxyXG4gIDwvZGl2PlxyXG48L2Rpdj5cclxuYCxcclxuICBzdHlsZXM6IFtgLml0ZW0taG9sZGVye2JveC1zaXppbmc6Ym9yZGVyLWJveDtkaXNwbGF5OmZsZXg7ZmxleC1mbG93OndyYXB9Lml0ZW0taG9sZGVyIC5uZXd7ZGlzcGxheTppbmxpbmV9YF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEZvbGRlckNvbnRlbnRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQElucHV0KCkgdHJlZU1vZGVsOiBUcmVlTW9kZWw7XHJcblxyXG4gIEBPdXRwdXQoKSBvcGVuVXBsb2FkRGlhbG9nID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBub2RlczogTm9kZUludGVyZmFjZTtcclxuICBvYmogPSBPYmplY3Q7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT5cclxuICApIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gc3RhdGUuZmlsZU1hbmFnZXJTdGF0ZS5wYXRoKSlcclxuICAgICAgLnN1YnNjcmliZSgocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ub2RlcyA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeVBhdGgocGF0aCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmV3Q2xpY2tlZEFjdGlvbigpIHtcclxuICAgIHRoaXMub3BlblVwbG9hZERpYWxvZy5lbWl0KHRydWUpO1xyXG4gIH1cclxufVxyXG4iXX0=