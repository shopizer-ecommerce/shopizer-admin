import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BrandService } from '../services/brand.service';

@Component({
  selector: 'ngx-brand-details',
  templateUrl: './brand-details.component.html',
  styleUrls: ['./brand-details.component.scss']
})
export class BrandDetailsComponent implements OnInit {
  brand: any = {};
  loadingInfo = false;

  constructor(
    private brandService: BrandService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.loadingInfo = true;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.brandService.getBrandById(id)
      .subscribe(brand => {
        this.brand = brand;
        this.loadingInfo = false;
      });
  }

}
