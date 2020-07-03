import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../services/store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-store-detail-info',
  templateUrl: './store-detail-info.component.html',
  styleUrls: ['./store-detail-info.component.scss']
})
export class StoreDetailInfoComponent implements OnInit {
  store;
  loadingInfo = false;
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
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.loadingInfo = true;
    const code = this.activatedRoute.snapshot.paramMap.get('code');
    this.storeService.getStore(code)
      .subscribe(res => {
        this.store = res;
        this.loadingInfo = false;
      });
  }

  route(link) {
    this.router.navigate(['pages/store-management/' + link + "/", this.store.code]);
  }

}
