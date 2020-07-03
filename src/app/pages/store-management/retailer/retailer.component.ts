import { Component, OnInit } from '@angular/core';

import { StoreService } from '../services/store.service';

@Component({
  selector: 'ngx-retailer',
  templateUrl: './retailer.component.html',
  styleUrls: ['./retailer.component.scss']
})
export class RetailerComponent implements OnInit {
  store: any = {};
  loading = false;

  constructor(
    private storeService: StoreService,
  ) {
  }

  ngOnInit() {
    this.loading = true;
    const code = localStorage.getItem('merchant');
    this.storeService.getStore(code)
      .subscribe(res => {
        this.store = res;
        this.loading = false;
      });
  }
}
