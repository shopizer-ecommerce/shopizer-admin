import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validators } from '../../../shared/validation/validators';

@Component({
  selector: 'ngx-product-discount',
  templateUrl: './product-discount.component.html',
  styleUrls: ['./product-discount.component.scss']
})
export class ProductDiscountComponent implements OnInit {
  discountForm: FormGroup;
  discountValue = null

  constructor(private dfb: FormBuilder) { }

  ngOnInit(): void {
    this.discountForm = this.dfb.group({
      discountedPrice: [Validators.pattern(validators.number)],
      percentageOff: [Validators.pattern(validators.number)],
      rebatePrice: [Validators.required, Validators.pattern(validators.number)],
      timeBound: [false],
      startDate: [new Date()],
      endDate: [new Date()],
      discountedRadio: [null],
    })
  }
  save() { }

  onselectDiscountValue(data) {
    this.discountValue = data
  }

  discountSelected(e) {
    if (e == 1) {
      this.discountForm.controls['discountedPrice'].setValidators([Validators.required]);
      // this.discountForm.controls['discountedPrice'].setValue([Validators.pattern(validators.)]);
    }
    else if (e == 2) {
      this.discountForm.controls['percentageOff'].setValidators([Validators.required]);
    }
    if (e == 3) {
      this.discountForm.controls['rebatePrice'].setValidators([Validators.required]);
    }
    else {
      this.discountForm.controls['discountedRadio'].updateValueAndValidity()
      this.discountForm.controls['discountedPrice'].clearValidators();
      this.discountForm.controls['percentageOff'].clearValidators();
      this.discountForm.controls['rebatePrice'].clearValidators();
    }
  }
}
