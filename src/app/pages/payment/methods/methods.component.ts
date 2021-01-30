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
  loadingList = false;
  paymentData: Array<any> = [];
  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private translate: TranslateService,
  ) {
    this.getPaymentMethodsList()
  }

  ngOnInit() {
    // let data = [{ id: 1, paymentType: 'Money Order', image: '../../../../assets/img/moneyorder.gif' }, { id: 2, paymentType: 'PayPal Express Checkout', image: '../../../../assets/img/icon-paypal.png' }, { id: 3, paymentType: 'Beanstream', image: '../../../../assets/img/beanstream.gif' }, { id: 4, paymentType: 'Stripe', image: '../../../../assets/img/stripe.png' }, { id: 5, paymentType: 'Braintree', image: '../../../../assets/img/braintree.jpg' }]
    // this.paymentData = data;

  }
  getPaymentMethodsList() {
    this.loadingList = true;
    this.paymentService.getPaymentModules()
      .subscribe(data => {
        console.log(data);
        this.loadingList = false;
        this.paymentData = data;
      }, error => {
        this.loadingList = false;
      });
  }
  onClickConfigure(value) {
    this.router.navigate(['pages/payment/configure/' + value]);
  }


}
