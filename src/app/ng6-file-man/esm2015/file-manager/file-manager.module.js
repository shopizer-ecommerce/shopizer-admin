/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerComponent } from './file-manager.component';
import { FolderContentComponent } from './components/folder-content/folder-content.component';
import { TreeComponent } from './components/tree/tree.component';
import { NodeListerComponent } from './components/tree/node-lister/node-lister.component';
import { NodeComponent } from './components/functions/node/node.component';
import { MapToIterablePipe } from './pipes/map-to-iterable.pipe';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { reducers } from './reducers/reducer.factory';
import { LoadingOverlayComponent } from './components/functions/loading-overlay/loading-overlay.component';
import { FileSizePipe } from './pipes/file-size.pipe';
import { UploadComponent } from './components/functions/upload/upload.component';
import { NewFolderComponent } from './components/functions/upload/new-folder/new-folder.component';
import { SideViewComponent } from './components/side-view/side-view.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
/**
 * @param {?} http
 * @return {?}
 */
export function createTranslateLoader(http) {
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}
const ɵ0 = (createTranslateLoader);
export class FileManagerModule {
}
FileManagerModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    HttpClientModule,
                    StoreModule.forRoot(reducers),
                    CommonModule,
                    NgxSmartModalModule.forRoot(),
                    TranslateModule.forRoot({
                        loader: {
                            provide: TranslateLoader,
                            useFactory: ɵ0,
                            deps: [HttpClient]
                        }
                    })
                ],
                declarations: [
                    FileManagerComponent,
                    FolderContentComponent,
                    NodeComponent,
                    TreeComponent,
                    NodeListerComponent,
                    MapToIterablePipe,
                    NavBarComponent,
                    LoadingOverlayComponent,
                    FileSizePipe,
                    UploadComponent,
                    NewFolderComponent,
                    SideViewComponent,
                    NavigationComponent
                ],
                exports: [
                    FileManagerComponent,
                    LoadingOverlayComponent,
                    SideViewComponent
                ]
            },] },
];
export { ɵ0 };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1tYW5hZ2VyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nNi1maWxlLW1hbi8iLCJzb3VyY2VzIjpbImZpbGUtbWFuYWdlci9maWxlLW1hbmFnZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUM5RCxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxzREFBc0QsQ0FBQztBQUM1RixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDL0QsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scURBQXFELENBQUM7QUFDeEYsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDRDQUE0QyxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQy9ELE9BQU8sRUFBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUN2RSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDcEQsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sa0VBQWtFLENBQUM7QUFDekcsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3BELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxnREFBZ0QsQ0FBQztBQUMvRSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSwrREFBK0QsQ0FBQztBQUNqRyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSw0Q0FBNEMsQ0FBQztBQUM3RSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQztBQUNqRixPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3JFLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDRCQUE0QixDQUFDOzs7OztBQUUvRCxNQUFNLGdDQUFnQyxJQUFnQjtJQUNwRCxNQUFNLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0NBQ2hFO1dBV21CLENBQUMscUJBQXFCLENBQUM7QUF5QjNDLE1BQU07OztZQWxDTCxRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLGdCQUFnQjtvQkFDaEIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7b0JBQzdCLFlBQVk7b0JBQ1osbUJBQW1CLENBQUMsT0FBTyxFQUFFO29CQUM3QixlQUFlLENBQUMsT0FBTyxDQUFDO3dCQUN0QixNQUFNLEVBQUM7NEJBQ0wsT0FBTyxFQUFFLGVBQWU7NEJBQ3hCLFVBQVUsSUFBeUI7NEJBQ25DLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQzt5QkFBQztxQkFDdEIsQ0FBQztpQkFDSDtnQkFDRCxZQUFZLEVBQUU7b0JBQ1osb0JBQW9CO29CQUNwQixzQkFBc0I7b0JBQ3RCLGFBQWE7b0JBQ2IsYUFBYTtvQkFDYixtQkFBbUI7b0JBQ25CLGlCQUFpQjtvQkFDakIsZUFBZTtvQkFDZix1QkFBdUI7b0JBQ3ZCLFlBQVk7b0JBQ1osZUFBZTtvQkFDZixrQkFBa0I7b0JBQ2xCLGlCQUFpQjtvQkFDakIsbUJBQW1CO2lCQUNwQjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1Asb0JBQW9CO29CQUNwQix1QkFBdUI7b0JBQ3ZCLGlCQUFpQjtpQkFDbEI7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7RmlsZU1hbmFnZXJDb21wb25lbnR9IGZyb20gJy4vZmlsZS1tYW5hZ2VyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7Rm9sZGVyQ29udGVudENvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2ZvbGRlci1jb250ZW50L2ZvbGRlci1jb250ZW50LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7VHJlZUNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL3RyZWUvdHJlZS5jb21wb25lbnQnO1xyXG5pbXBvcnQge05vZGVMaXN0ZXJDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy90cmVlL25vZGUtbGlzdGVyL25vZGUtbGlzdGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7Tm9kZUNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bmN0aW9ucy9ub2RlL25vZGUuY29tcG9uZW50JztcclxuaW1wb3J0IHtNYXBUb0l0ZXJhYmxlUGlwZX0gZnJvbSAnLi9waXBlcy9tYXAtdG8taXRlcmFibGUucGlwZSc7XHJcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cENsaWVudE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge1N0b3JlTW9kdWxlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7TmF2QmFyQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvbmF2LWJhci9uYXYtYmFyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7cmVkdWNlcnN9IGZyb20gJy4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtMb2FkaW5nT3ZlcmxheUNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bmN0aW9ucy9sb2FkaW5nLW92ZXJsYXkvbG9hZGluZy1vdmVybGF5LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7RmlsZVNpemVQaXBlfSBmcm9tICcuL3BpcGVzL2ZpbGUtc2l6ZS5waXBlJztcclxuaW1wb3J0IHtVcGxvYWRDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL3VwbG9hZC5jb21wb25lbnQnO1xyXG5pbXBvcnQge05ld0ZvbGRlckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bmN0aW9ucy91cGxvYWQvbmV3LWZvbGRlci9uZXctZm9sZGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7U2lkZVZpZXdDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9zaWRlLXZpZXcvc2lkZS12aWV3LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7TmF2aWdhdGlvbkNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5jb21wb25lbnQnO1xyXG5pbXBvcnQge05neFNtYXJ0TW9kYWxNb2R1bGV9IGZyb20gJ25neC1zbWFydC1tb2RhbCc7XHJcbmltcG9ydCB7VHJhbnNsYXRlTG9hZGVyLCBUcmFuc2xhdGVNb2R1bGV9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xyXG5pbXBvcnQge1RyYW5zbGF0ZUh0dHBMb2FkZXJ9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2h0dHAtbG9hZGVyJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcmFuc2xhdGVMb2FkZXIoaHR0cDogSHR0cENsaWVudCkge1xyXG4gIHJldHVybiBuZXcgVHJhbnNsYXRlSHR0cExvYWRlcihodHRwLCAnL2Fzc2V0cy9pMThuLycsICcuanNvbicpO1xyXG59XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIEh0dHBDbGllbnRNb2R1bGUsXHJcbiAgICBTdG9yZU1vZHVsZS5mb3JSb290KHJlZHVjZXJzKSxcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICAgIE5neFNtYXJ0TW9kYWxNb2R1bGUuZm9yUm9vdCgpLFxyXG4gICAgVHJhbnNsYXRlTW9kdWxlLmZvclJvb3Qoe1xyXG4gICAgICBsb2FkZXI6e1xyXG4gICAgICAgIHByb3ZpZGU6IFRyYW5zbGF0ZUxvYWRlcixcclxuICAgICAgICB1c2VGYWN0b3J5OiAoY3JlYXRlVHJhbnNsYXRlTG9hZGVyKSxcclxuICAgICAgICBkZXBzOiBbSHR0cENsaWVudF19XHJcbiAgICB9KVxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBGaWxlTWFuYWdlckNvbXBvbmVudCxcclxuICAgIEZvbGRlckNvbnRlbnRDb21wb25lbnQsXHJcbiAgICBOb2RlQ29tcG9uZW50LFxyXG4gICAgVHJlZUNvbXBvbmVudCxcclxuICAgIE5vZGVMaXN0ZXJDb21wb25lbnQsXHJcbiAgICBNYXBUb0l0ZXJhYmxlUGlwZSxcclxuICAgIE5hdkJhckNvbXBvbmVudCxcclxuICAgIExvYWRpbmdPdmVybGF5Q29tcG9uZW50LFxyXG4gICAgRmlsZVNpemVQaXBlLFxyXG4gICAgVXBsb2FkQ29tcG9uZW50LFxyXG4gICAgTmV3Rm9sZGVyQ29tcG9uZW50LFxyXG4gICAgU2lkZVZpZXdDb21wb25lbnQsXHJcbiAgICBOYXZpZ2F0aW9uQ29tcG9uZW50XHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBGaWxlTWFuYWdlckNvbXBvbmVudCxcclxuICAgIExvYWRpbmdPdmVybGF5Q29tcG9uZW50LFxyXG4gICAgU2lkZVZpZXdDb21wb25lbnRcclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGaWxlTWFuYWdlck1vZHVsZSB7XHJcbiAgLy8gc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XHJcbiAgLy8gICByZXR1cm4ge1xyXG4gIC8vICAgICBuZ01vZHVsZTogRmlsZU1hbmFnZXJNb2R1bGUsXHJcbiAgLy8gICAgIHByb3ZpZGVyczogW1RyYW5zbGF0ZVNlcnZpY2VdXHJcbiAgLy8gICB9O1xyXG4gIC8vIH1cclxufVxyXG4iXX0=