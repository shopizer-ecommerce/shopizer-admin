import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'ngx-store-details',
  templateUrl: './store-details.component.html',
  styleUrls: ['./store-details.component.scss']
})
export class StoreDetailsComponent implements OnInit {
  store: any;
  loading = false;
  selectedItem = '2';
  sidemenuLinks = [
    {
      id: '0',
      title: 'Store branding',
      key: 'COMPONENTS.STORE_BRANDING',
      link: 'store-branding'
    },
    {
      id: '1',
      title: 'Store home page',
      key: 'COMPONENTS.STORE_LANDING',
      link: 'store-landing'
    },
    {
      id: '2',
      title: 'Store details',
      key: 'COMPONENTS.STORE_DETAILS',
      link: 'store'
    }
  ];

  constructor(
    private storeService: StoreService,
    private router: Router,
  ) {
    this.loading = true;
    const code = localStorage.getItem('merchant');
    this.storeService.getStore(code)
      .subscribe(res => {
        this.store = res;
        this.loading = false;
      });
  }

  ngOnInit() {
  }

  route(link) {
    this.router.navigate(['pages/store-management/' + link + "/", this.store.code]);
  }

}
