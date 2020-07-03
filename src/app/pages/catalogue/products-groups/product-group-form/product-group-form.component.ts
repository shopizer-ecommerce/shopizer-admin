import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProductGroupsService } from '../services/product-groups.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-product-group-form',
  templateUrl: './product-group-form.component.html',
  styleUrls: ['./product-group-form.component.scss']
})
export class ProductGroupFormComponent implements OnInit {
  form: FormGroup;
  codePattern = '^[a-zA-Z0-9]+$';
  isCodeUnique = true;

  constructor(
    private fb: FormBuilder,
    private productGroupsService: ProductGroupsService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.createForm();
  }

  get code() {
    return this.form.get('code');
  }

  private createForm() {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(this.codePattern)]],
      active: [true]
    });
  }

  checkCode(event) {
    // const code = event.target.value.trim();
    // this.productGroupsService.checkGroupCode(code)
    //   .subscribe(res => {
    //     this.isCodeUnique = !(res.exists && (this.option.code !== code));
    //   });
  }

  save() {
    this.productGroupsService.createProductGroup(this.form.value).subscribe(res => {
      this.router.navigate(['pages/catalogue/products-groups/groups-list']);
    });
  }

}
