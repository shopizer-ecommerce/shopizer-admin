import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferlistboxComponent } from './transferlistbox.component';
import { FilterlistboxComponent } from './filterlistbox/filterlistbox.component';
import { KeywordsearchPipe } from './pipes/keywordsearch.pipe';
import { SharedModule } from '../../shared/shared.module';

@NgModule({

  declarations: [TransferlistboxComponent, FilterlistboxComponent, KeywordsearchPipe],
  exports: [TransferlistboxComponent],
  imports: [CommonModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransferBoxModule { }