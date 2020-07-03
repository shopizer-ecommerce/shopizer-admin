/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { _ } from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
var NewFolderComponent = /** @class */ (function () {
    function NewFolderComponent() {
        this.buttonClicked = new EventEmitter();
        this.buttonText = _('Close').toString();
        this.inputValue = '';
    }
    /**
     * @return {?}
     */
    NewFolderComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @return {?}
     */
    NewFolderComponent.prototype.onClick = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var el = (/** @type {?} */ (this.uploadFolder.nativeElement));
        // @ts-ignore
        this.buttonClicked.emit(el.value);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NewFolderComponent.prototype.onInputChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.inputValue = event.target.value;
        if (this.inputValue.length > 0) {
            this.buttonText = _('Confirm').toString();
        }
        else {
            this.buttonText = _('Close').toString();
        }
    };
    NewFolderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-new-folder',
                    template: "<p class=\"new-folder-description\" translate>Type new folder name</p>\n<input #uploadFolder placeholder=\"{{'Folder name' | translate}}\" (keyup)=\"onInputChange($event)\"\n       (keyup.enter)=\"onClick()\" onclick=\"this.select();\" type=\"text\" class=\"new-folder-input\"/>\n<button class=\"button new-folder-send\" (click)=\"onClick()\">{{buttonText | translate}}</button>\n",
                    styles: [".new-folder-description{margin:0 auto;padding:0}"]
                },] },
    ];
    /** @nocollapse */
    NewFolderComponent.ctorParameters = function () { return []; };
    NewFolderComponent.propDecorators = {
        uploadFolder: [{ type: ViewChild, args: ['uploadFolder',] }],
        buttonClicked: [{ type: Output }]
    };
    return NewFolderComponent;
}());
export { NewFolderComponent };
if (false) {
    /** @type {?} */
    NewFolderComponent.prototype.uploadFolder;
    /** @type {?} */
    NewFolderComponent.prototype.buttonClicked;
    /** @type {?} */
    NewFolderComponent.prototype.buttonText;
    /** @type {?} */
    NewFolderComponent.prototype.inputValue;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3LWZvbGRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL25ldy1mb2xkZXIvbmV3LWZvbGRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBVSxNQUFNLEVBQUUsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBQyxDQUFDLEVBQUMsTUFBTSxtREFBbUQsQ0FBQzs7SUFrQmxFOzZCQUwwQixJQUFJLFlBQVksRUFBRTswQkFFL0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRTswQkFDckIsRUFBRTtLQUdkOzs7O0lBRUQscUNBQVE7OztJQUFSO0tBQ0M7Ozs7SUFFRCxvQ0FBTzs7O0lBQVA7O1FBQ0UsSUFBTSxFQUFFLEdBQWdCLG1CQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBNEIsRUFBQyxDQUFDOztRQUV6RSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDbkM7Ozs7O0lBRUQsMENBQWE7Ozs7SUFBYixVQUFjLEtBQVU7UUFDdEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNyQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQzNDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUN6QztLQUNGOztnQkFuQ0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxnQkFBZ0I7b0JBQzFCLFFBQVEsRUFBRSw4WEFJWDtvQkFDQyxNQUFNLEVBQUUsQ0FBQyxrREFBa0QsQ0FBQztpQkFDN0Q7Ozs7OytCQUVFLFNBQVMsU0FBQyxjQUFjO2dDQUN4QixNQUFNOzs2QkFkVDs7U0FZYSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkluaXQsIE91dHB1dCwgVmlld0NoaWxkfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7X30gZnJvbSAnQGJpZXNiamVyZy9uZ3gtdHJhbnNsYXRlLWV4dHJhY3QvZGlzdC91dGlscy91dGlscyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1uZXctZm9sZGVyJyxcbiAgdGVtcGxhdGU6IGA8cCBjbGFzcz1cIm5ldy1mb2xkZXItZGVzY3JpcHRpb25cIiB0cmFuc2xhdGU+VHlwZSBuZXcgZm9sZGVyIG5hbWU8L3A+XG48aW5wdXQgI3VwbG9hZEZvbGRlciBwbGFjZWhvbGRlcj1cInt7J0ZvbGRlciBuYW1lJyB8IHRyYW5zbGF0ZX19XCIgKGtleXVwKT1cIm9uSW5wdXRDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgKGtleXVwLmVudGVyKT1cIm9uQ2xpY2soKVwiIG9uY2xpY2s9XCJ0aGlzLnNlbGVjdCgpO1wiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJuZXctZm9sZGVyLWlucHV0XCIvPlxuPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBuZXctZm9sZGVyLXNlbmRcIiAoY2xpY2spPVwib25DbGljaygpXCI+e3tidXR0b25UZXh0IHwgdHJhbnNsYXRlfX08L2J1dHRvbj5cbmAsXG4gIHN0eWxlczogW2AubmV3LWZvbGRlci1kZXNjcmlwdGlvbnttYXJnaW46MCBhdXRvO3BhZGRpbmc6MH1gXVxufSlcbmV4cG9ydCBjbGFzcyBOZXdGb2xkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBAVmlld0NoaWxkKCd1cGxvYWRGb2xkZXInKSB1cGxvYWRGb2xkZXI6IEVsZW1lbnRSZWY7XG4gIEBPdXRwdXQoKSBidXR0b25DbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGJ1dHRvblRleHQgPSBfKCdDbG9zZScpLnRvU3RyaW5nKCk7XG4gIGlucHV0VmFsdWUgPSAnJztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICB9XG5cbiAgb25DbGljaygpIHtcbiAgICBjb25zdCBlbDogSFRNTEVsZW1lbnQgPSAodGhpcy51cGxvYWRGb2xkZXIubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCk7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHRoaXMuYnV0dG9uQ2xpY2tlZC5lbWl0KGVsLnZhbHVlKTtcbiAgfVxuXG4gIG9uSW5wdXRDaGFuZ2UoZXZlbnQ6IGFueSkge1xuICAgIHRoaXMuaW5wdXRWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICBpZiAodGhpcy5pbnB1dFZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuYnV0dG9uVGV4dCA9IF8oJ0NvbmZpcm0nKS50b1N0cmluZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJ1dHRvblRleHQgPSBfKCdDbG9zZScpLnRvU3RyaW5nKCk7XG4gICAgfVxuICB9XG59XG4iXX0=