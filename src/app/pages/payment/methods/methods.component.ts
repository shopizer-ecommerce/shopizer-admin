import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
// import { DomSanitizer } from '@angular/platform-browser';
import { PaymentService } from '../services/payment.service';
import { Router } from '@angular/router';
// import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import { error } from '@angular/compiler/src/util';
// import { LocalDataSource } from 'ng2-smart-table';
// import { ShowcaseDialogComponent } from '../../shared/components/showcase-dialog/showcase-dialog.component';
// import { NbDialogService } from '@nebular/theme';
// import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'ngx-payment-methods',
  templateUrl: './methods.component.html',
  styleUrls: ['./methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {
  @ViewChild('item', { static: false }) accordion;
  // source: LocalDataSource = new LocalDataSource();
  loadingList = false;
  // settings = {};
  paymentData: Array<any> = [];
  // stores: Array<any> = [];
  // selectedStore: String = '';
  // paginator
  // perPage = 20;
  // currentPage = 1;
  // totalCount;
  // roles;
  // searchValue: string = '';
  // isSuperAdmin: boolean;

  // params = this.loadParams();
  // public input: string = '<input type="checkbox"></input>';
  constructor(
    private paymentService: PaymentService,
    private router: Router,
    // private dialogService: NbDialogService,
    // private mScrollbarService: MalihuScrollbarService,
    private translate: TranslateService,
    // private storageService: StorageService,
    // private storeService: StoreService,
    // private toastr: ToastrService,
    // private _sanitizer: DomSanitizer
  ) {
    // this.isSuperAdmin = this.storageService.getUserRoles().isSuperadmin;
    // this.getStoreList();
    // this.selectedStore = this.storageService.getMerchant()
  }

  ngOnInit() {
    let data = [{ id: 1, paymentType: 'Money Order', image: '../../../../assets/img/moneyorder.gif' }, { id: 2, paymentType: 'PayPal Express Checkout', image: '../../../../assets/img/icon-paypal.png' }, { id: 3, paymentType: 'Beanstream', image: '../../../../assets/img/beanstream.gif' }, { id: 4, paymentType: 'Stripe', image: '../../../../assets/img/stripe.png' }, { id: 6, paymentType: 'Braintree', image: '../../../../assets/img/braintree.jpg' }]
    this.paymentData = data;
    // this.source.load(data);
    // this.setSettings()
  }
  onClickConfigure(value) {
    this.router.navigate(['pages/payment/payment-configure/' + value]);
  }
  // setSettings() {
  //   var me = this;
  //   this.settings = {
  //     // mode: 'external',
  //     hideSubHeader: true,
  //     actions: {
  //       columnTitle: this.translate.instant('ORDER.ACTIONS'),
  //       add: false,
  //       edit: false,
  //       delete: false,
  //       position: 'right',
  //       // custom: [
  //       //   {
  //       //     name: 'edit',
  //       //     title: '<i class="nb-edit"></i>'
  //       //   },
  //       //   {
  //       //     name: 'delete',
  //       //     title: '<i class="nb-trash"></i>'
  //       //   }
  //       // ]
  //     },
  //     pager: {
  //       display: false
  //     },
  //     columns: {
  //       paymentType: {
  //         title: this.translate.instant('PAYMENT.PAYMENT_TYPE'),
  //         type: 'string'
  //       },
  //       image: {
  //         title: 'Image',
  //         type: 'html',
  //         valuePrepareFunction: (data) => {
  //           return `<img src=${data} alt='name'></a>`
  //         }
  //       }
  //     }
  //   };

  // }

}
