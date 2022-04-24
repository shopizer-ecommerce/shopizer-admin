import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbSpinnerModule, NbTreeGridComponent, NbTreeGridModule } from '@nebular/theme';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FiveHundredComponent } from './components/five-hundred/five-hundred.component';
import { TranslateModule } from '@ngx-translate/core';
import { RightSidemenuComponent } from './components/right-sidemenu/right-sidemenu.component';
import { ImageUploadingComponent } from './components/image-uploading/image-uploading.component';
import { ShowcaseDialogComponent } from './components/showcase-dialog/showcase-dialog.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { PickListModule } from 'primeng/picklist';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TreeTableModule } from 'primeng/treetable';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { ValidateNumberDirective } from './validation/validate-number.directive';
import { PasswordPromptComponent } from './components/password-prompt/password-prompt';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { DragDropModule } from "@angular/cdk/drag-drop";


@NgModule({
  declarations: [
    RightSidemenuComponent,
    NotFoundComponent,
    FiveHundredComponent,
    ImageUploadingComponent,
    ShowcaseDialogComponent,
    PasswordPromptComponent,
    PaginatorComponent,
    BackButtonComponent,
    ValidateNumberDirective,

  ],
  imports: [
    CommonModule,
    RouterModule,
    NbTreeGridModule,
    Ng2SmartTableModule,
    ThemeModule,
    NbSpinnerModule,
    TranslateModule,
    TreeTableModule,
    FilePickerModule,
    DragDropModule
  ],
  exports: [
    Ng2SmartTableModule,
    ThemeModule,
    NbSpinnerModule,
    TranslateModule,
    TreeTableModule,
    RightSidemenuComponent,
    NotFoundComponent,
    FiveHundredComponent,
    ImageUploadingComponent,
    ShowcaseDialogComponent,
    PaginatorComponent,
    BackButtonComponent,
    NbTreeGridModule,
    NbTreeGridComponent,
    PickListModule,
    DropdownModule,
    AutoCompleteModule,
    MultiSelectModule,
    ValidateNumberDirective
    // EqualValidator
  ],
  providers: [CurrencyPipe],
  entryComponents: [ShowcaseDialogComponent],
})
export class SharedModule {
}
