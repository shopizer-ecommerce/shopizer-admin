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
var ɵ0 = (createTranslateLoader);
var FileManagerModule = /** @class */ (function () {
    function FileManagerModule() {
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
    return FileManagerModule;
}());
export { FileManagerModule };
export { ɵ0 };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1tYW5hZ2VyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nNi1maWxlLW1hbi8iLCJzb3VyY2VzIjpbImZpbGUtbWFuYWdlci9maWxlLW1hbmFnZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUM5RCxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxzREFBc0QsQ0FBQztBQUM1RixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDL0QsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scURBQXFELENBQUM7QUFDeEYsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDRDQUE0QyxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQy9ELE9BQU8sRUFBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUN2RSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDcEQsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sa0VBQWtFLENBQUM7QUFDekcsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3BELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxnREFBZ0QsQ0FBQztBQUMvRSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSwrREFBK0QsQ0FBQztBQUNqRyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSw0Q0FBNEMsQ0FBQztBQUM3RSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSw4Q0FBOEMsQ0FBQztBQUNqRixPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3JFLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDRCQUE0QixDQUFDOzs7OztBQUUvRCxNQUFNLGdDQUFnQyxJQUFnQjtJQUNwRCxNQUFNLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0NBQ2hFO1NBV21CLENBQUMscUJBQXFCLENBQUM7Ozs7O2dCQVQxQyxRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLGdCQUFnQjt3QkFDaEIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7d0JBQzdCLFlBQVk7d0JBQ1osbUJBQW1CLENBQUMsT0FBTyxFQUFFO3dCQUM3QixlQUFlLENBQUMsT0FBTyxDQUFDOzRCQUN0QixNQUFNLEVBQUM7Z0NBQ0wsT0FBTyxFQUFFLGVBQWU7Z0NBQ3hCLFVBQVUsSUFBeUI7Z0NBQ25DLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQzs2QkFBQzt5QkFDdEIsQ0FBQztxQkFDSDtvQkFDRCxZQUFZLEVBQUU7d0JBQ1osb0JBQW9CO3dCQUNwQixzQkFBc0I7d0JBQ3RCLGFBQWE7d0JBQ2IsYUFBYTt3QkFDYixtQkFBbUI7d0JBQ25CLGlCQUFpQjt3QkFDakIsZUFBZTt3QkFDZix1QkFBdUI7d0JBQ3ZCLFlBQVk7d0JBQ1osZUFBZTt3QkFDZixrQkFBa0I7d0JBQ2xCLGlCQUFpQjt3QkFDakIsbUJBQW1CO3FCQUNwQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1Asb0JBQW9CO3dCQUNwQix1QkFBdUI7d0JBQ3ZCLGlCQUFpQjtxQkFDbEI7aUJBQ0Y7OzRCQTVERDs7U0E2RGEsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHtGaWxlTWFuYWdlckNvbXBvbmVudH0gZnJvbSAnLi9maWxlLW1hbmFnZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtGb2xkZXJDb250ZW50Q29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZm9sZGVyLWNvbnRlbnQvZm9sZGVyLWNvbnRlbnQuY29tcG9uZW50JztcclxuaW1wb3J0IHtUcmVlQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvdHJlZS90cmVlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7Tm9kZUxpc3RlckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL3RyZWUvbm9kZS1saXN0ZXIvbm9kZS1saXN0ZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtOb2RlQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZnVuY3Rpb25zL25vZGUvbm9kZS5jb21wb25lbnQnO1xyXG5pbXBvcnQge01hcFRvSXRlcmFibGVQaXBlfSBmcm9tICcuL3BpcGVzL21hcC10by1pdGVyYWJsZS5waXBlJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwQ2xpZW50TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7U3RvcmVNb2R1bGV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtOYXZCYXJDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9uYXYtYmFyL25hdi1iYXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtyZWR1Y2Vyc30gZnJvbSAnLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQge0xvYWRpbmdPdmVybGF5Q29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZnVuY3Rpb25zL2xvYWRpbmctb3ZlcmxheS9sb2FkaW5nLW92ZXJsYXkuY29tcG9uZW50JztcclxuaW1wb3J0IHtGaWxlU2l6ZVBpcGV9IGZyb20gJy4vcGlwZXMvZmlsZS1zaXplLnBpcGUnO1xyXG5pbXBvcnQge1VwbG9hZENvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bmN0aW9ucy91cGxvYWQvdXBsb2FkLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7TmV3Rm9sZGVyQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZnVuY3Rpb25zL3VwbG9hZC9uZXctZm9sZGVyL25ldy1mb2xkZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtTaWRlVmlld0NvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL3NpZGUtdmlldy9zaWRlLXZpZXcuY29tcG9uZW50JztcclxuaW1wb3J0IHtOYXZpZ2F0aW9uQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7Tmd4U21hcnRNb2RhbE1vZHVsZX0gZnJvbSAnbmd4LXNtYXJ0LW1vZGFsJztcclxuaW1wb3J0IHtUcmFuc2xhdGVMb2FkZXIsIFRyYW5zbGF0ZU1vZHVsZX0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XHJcbmltcG9ydCB7VHJhbnNsYXRlSHR0cExvYWRlcn0gZnJvbSAnQG5neC10cmFuc2xhdGUvaHR0cC1sb2FkZXInO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYW5zbGF0ZUxvYWRlcihodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgcmV0dXJuIG5ldyBUcmFuc2xhdGVIdHRwTG9hZGVyKGh0dHAsICcvYXNzZXRzL2kxOG4vJywgJy5qc29uJyk7XHJcbn1cclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgSHR0cENsaWVudE1vZHVsZSxcclxuICAgIFN0b3JlTW9kdWxlLmZvclJvb3QocmVkdWNlcnMpLFxyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgTmd4U21hcnRNb2RhbE1vZHVsZS5mb3JSb290KCksXHJcbiAgICBUcmFuc2xhdGVNb2R1bGUuZm9yUm9vdCh7XHJcbiAgICAgIGxvYWRlcjp7XHJcbiAgICAgICAgcHJvdmlkZTogVHJhbnNsYXRlTG9hZGVyLFxyXG4gICAgICAgIHVzZUZhY3Rvcnk6IChjcmVhdGVUcmFuc2xhdGVMb2FkZXIpLFxyXG4gICAgICAgIGRlcHM6IFtIdHRwQ2xpZW50XX1cclxuICAgIH0pXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIEZpbGVNYW5hZ2VyQ29tcG9uZW50LFxyXG4gICAgRm9sZGVyQ29udGVudENvbXBvbmVudCxcclxuICAgIE5vZGVDb21wb25lbnQsXHJcbiAgICBUcmVlQ29tcG9uZW50LFxyXG4gICAgTm9kZUxpc3RlckNvbXBvbmVudCxcclxuICAgIE1hcFRvSXRlcmFibGVQaXBlLFxyXG4gICAgTmF2QmFyQ29tcG9uZW50LFxyXG4gICAgTG9hZGluZ092ZXJsYXlDb21wb25lbnQsXHJcbiAgICBGaWxlU2l6ZVBpcGUsXHJcbiAgICBVcGxvYWRDb21wb25lbnQsXHJcbiAgICBOZXdGb2xkZXJDb21wb25lbnQsXHJcbiAgICBTaWRlVmlld0NvbXBvbmVudCxcclxuICAgIE5hdmlnYXRpb25Db21wb25lbnRcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIEZpbGVNYW5hZ2VyQ29tcG9uZW50LFxyXG4gICAgTG9hZGluZ092ZXJsYXlDb21wb25lbnQsXHJcbiAgICBTaWRlVmlld0NvbXBvbmVudFxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEZpbGVNYW5hZ2VyTW9kdWxlIHtcclxuICAvLyBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcclxuICAvLyAgIHJldHVybiB7XHJcbiAgLy8gICAgIG5nTW9kdWxlOiBGaWxlTWFuYWdlck1vZHVsZSxcclxuICAvLyAgICAgcHJvdmlkZXJzOiBbVHJhbnNsYXRlU2VydmljZV1cclxuICAvLyAgIH07XHJcbiAgLy8gfVxyXG59XHJcbiJdfQ==