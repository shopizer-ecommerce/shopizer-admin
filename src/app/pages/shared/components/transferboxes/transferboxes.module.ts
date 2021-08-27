import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferBoxesComponent } from './transferboxes.component';
import { FilterlistboxComponent } from './filterlistbox/filterlistbox.component';
import { KeywordsearchPipe } from './pipes/keywordsearch.pipe';
//import { SharedModule } from '../../shared/shared.module';


/**
 * Generic transfer data from one box to another
 */

@NgModule({

  declarations: [TransferBoxesComponent, FilterlistboxComponent, KeywordsearchPipe],
  exports: [TransferBoxesComponent],
  //imports: [CommonModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransferBoxesModule { }