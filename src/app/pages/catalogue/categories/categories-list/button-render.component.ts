import { Component, Input } from '@angular/core';

import { CategoryService } from '../services/category.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  template: `
    <input type="checkbox" [checked]="value" (click)="clicked()"/>
  `,
})
export class ButtonRenderComponent {
  @Input() value: string | number;
  @Input() rowData: any;

  constructor(
    private categoryService: CategoryService,
    private translate: TranslateService,
    private toastr: ToastrService,
  ) {
  }

  clicked() {
    this.rowData.visible = !this.value;
    this.categoryService.updateCategoryVisibility(this.rowData)
      .subscribe(res => {
        this.toastr.success(this.translate.instant('CATEGORY.CATEGORY_VISIBILITY'));
      });
  }

}
