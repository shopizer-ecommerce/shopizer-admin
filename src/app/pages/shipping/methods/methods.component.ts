import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { error } from '@angular/compiler/src/util';
@Component({
  selector: 'ngx-shipping-methods',
  templateUrl: './methods.component.html',
  styleUrls: ['./methods.component.scss']
})
export class ShippingMethodsComponent implements OnInit {
  @ViewChild('item', { static: false }) accordion;

  loadingList = false;

  shippingData: Array<any> = [];

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.getMethodsList()
  }

  ngOnInit() {
    // let data = [{ id: 1, shippingType: 'Canada Post', image: '../../../../assets/img/canadapost.png' }, { id: 2, shippingType: 'USPS', image: '../../../../assets/img/usps.jpg' }, { id: 3, shippingType: 'UPS', image: '../../../../assets/img/ups.jpg' }, { id: 4, shippingType: 'Fedex', image: '../../../../assets/img/fedex.jpg' }, { id: 5, shippingType: 'Purolator', image: '../../../../assets/img/purolator.png' }]
    // this.shippingData = data;
  }

  getMethodsList() {
    this.loadingList = true;
    this.sharedService.getShippingModules()
      .subscribe(data => {
        console.log(data);
        this.loadingList = false;
        this.shippingData = data;
      }, error => {
        this.loadingList = false;
      });
  }
  onClickConfigure(value) {
    this.router.navigate(['pages/shipping/methods-configure/' + value]);
  }


}
