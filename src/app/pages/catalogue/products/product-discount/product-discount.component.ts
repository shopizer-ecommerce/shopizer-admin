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

  constructor(private dfb: FormBuilder) { }

  ngOnInit(): void {
    // this.createForm()
    this.discountForm = this.dfb.group({
      discountedPrice: [Validators.pattern(validators.number)],
      percentageOff: [Validators.pattern(validators.number)],
      rebatePrice: [Validators.required, Validators.pattern(validators.number)],
      timeBound: [false],
      startDate: [new Date()],
      endDate: [new Date()],
    })
  }



}
