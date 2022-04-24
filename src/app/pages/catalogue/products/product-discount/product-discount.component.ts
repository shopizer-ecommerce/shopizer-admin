import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { validators } from '../../../shared/validation/validators';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';


@Component({
  selector: 'ngx-product-discount',
  templateUrl: './product-discount.component.html',
  styleUrls: ['./product-discount.component.scss']
})
export class ProductDiscountComponent implements OnInit {
  discountForm: FormGroup;
  id : any;
  loading: false;

  constructor(
    private dfb: FormBuilder,
    private location: Location,   
    private productService: ProductService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    
    this.id = this.productService.getProductIdRoute(this.router,this.location);

    //scroll down to discount tab
    let el = document.getElementById('tabs');
    el.scrollIntoView();

    //get product price

    this.discountForm = this.dfb.group({
      discountedPrice: [Validators.pattern(validators.number)],
      percentageOff: [Validators.pattern(validators.number)],
      rebatePrice: [Validators.required, Validators.pattern(validators.number)],
      timeBound: [false],
      startDate: [new Date()],
      endDate: [new Date()],
      discountedRadio: [null],
      percentageOffRadio: [null],
      rebateRadio: [null]
    })
  }

  save() { 


  }

  discountSelected(e) {
    if (e == 1) {
      this.discountForm.controls['discountedPrice'].setValidators([Validators.required]);
      // this.discountForm.controls['discountedPrice'].setValue([Validators.pattern(validators.)]);
    }
    else {
      this.discountForm.controls['discountedRadio'].updateValueAndValidity()
      this.discountForm.controls['discountedPrice'].clearValidators();
    }
  }
  percentageSelected(e) {
    if (e == 2) {
      this.discountForm.controls['percentageOff'].setValidators([Validators.required]);
    }
    else {
      this.discountForm.controls['percentageOffRadio'].updateValueAndValidity()
      this.discountForm.controls['percentageOff'].clearValidators();
    }
  }
  rebateSelected(e) {
    if (e == 3) {
      this.discountForm.controls['rebatePrice'].setValidators([Validators.required]);
    }
    else {
      this.discountForm.controls['rebateRadio'].updateValueAndValidity()
      this.discountForm.controls['rebatePrice'].clearValidators();
    }
  }
}
