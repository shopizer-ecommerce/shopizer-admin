import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NbDialogService } from '@nebular/theme';
import { OrdersService } from '../services/orders.service';
import * as moment from 'moment';
import { OrderInvoiceComponent } from '../order-invoice/order-invoice';
import { OrderHistoryComponent } from '../order-history/order-history';
import { OrderTransactionComponent } from '../order-transaction/order-transaction';

import { Router } from '@angular/router';
import { parsePhoneNumberFromString, format, AsYouType } from 'libphonenumber-js';

@Component({
  selector: 'ngx-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  shippingCountry: Array<any> = []
  shippingStateData: Array<any> = []
  billingStateData: Array<any> = []
  billingCountry: Array<any> = []
  groups: Array<any> = []
  selectedGroups: Array<any> = []
  loadingList = false;
  orderDetailsData: any;
  historyListData: Array<any> = [];
  transactionListData: Array<any> = [];
  statusList: Array<any> = [{ 'name': 'ORDERED', 'id': 'ORDERED' }, { 'name': 'PROCESSED', 'id': 'PROCESSED' }, { 'name': 'DELIVERED', 'id': 'DELIVERED' }, { 'name': 'REFUNDED', 'id': 'REFUNDED' }, { 'name': 'CANCELED', 'id': 'CANCELED' }]
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  info = {
    userName: '',
    language: '',
    emailAddress: '',
    datePurchased: ''
  }
  statusFields = {
    comments: '',
    status: ''
  }
  shipping = {
    phone: '',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    city: '',
    zone: '',
    tempZone: '',
    country: '',
    tempCountry: '',
    postalCode: '',

  }
  billing = {
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    city: '',
    zone: '',
    tempZone: '',
    country: '',
    tempCountry: '',
    postalCode: '',
    phone: ''
  }
  transactionType: string = ''
  orderID: any;
  defaultCountry: any;
  buttonText: any = 'Update Order'
  languages: Array<any> = [{ 'code': 'en', 'name': 'English' }, { 'code': 'fr', 'name': 'French' }]
  constructor(private ordersService: OrdersService, private toastr: ToastrService,
    private dialogService: NbDialogService, private router: Router) {
    // console.log(this.router.getCurrentNavigation());
    this.getCountry();


  }
  getOrderDetails() {
    this.loadingList = true;
    this.ordersService.getOrderDetails(this.orderID)
      .subscribe(data => {
        this.loadingList = false;
        // console.log(data);
        this.orderDetailsData = data;
        this.onBillingChange(data.billing.country, 0)


        this.info.emailAddress = data.customer.emailAddress;
        this.info.datePurchased = data.datePurchased;

        this.billing = data.billing;
        if (data.delivery) {
          this.onShippingChange(data.delivery.country, 0)

          this.shipping = data.delivery;
        }

      }, error => {
        this.loadingList = false;
      });
  }
  ngOnInit() {
    if (localStorage.getItem('orderID')) {
      this.orderID = localStorage.getItem('orderID')
      this.getOrderDetails();
    }
    this.getHistory();
    this.getNextTransaction();
  }
  getNextTransaction() {
    this.ordersService.getNextTransaction(this.orderID)
      .subscribe(data => {
        // console.log(data);
        this.transactionType = data.transactionType;
      }, error => {

      });
  }
  getHistory() {
    this.ordersService.getHistory(this.orderID)
      .subscribe(data => {
        // console.log(data);
        this.historyListData = data;
      }, error => {

      });
    this.geTransactions()
  }
  geTransactions() {
    this.ordersService.getTransactions(this.orderID)
      .subscribe(data => {
        // console.log(data);
        this.transactionListData = data;
      }, error => {

      });
  }
  getCountry() {
    this.ordersService.getCountry()
      .subscribe(data => {

        this.shippingCountry = data;
        this.billingCountry = data;
      }, error => {

      });
  }
  onBillingChange(value, flag) {
    this.ordersService.getBillingZone(value)
      .subscribe(data => {
        if (data.length > 0) {

          this.billingStateData = data;
          if (flag == 1) {
            this.billing.zone = data[0].code;

          }
        } else {
          this.billingStateData = data;
          this.billing.zone = '';

        }
      }, error => {

      });
  }
  onChangeStateBilling(value) {

  }
  onShippingChange(value, flag) {

    this.ordersService.getShippingZone(value)
      .subscribe(data => {
        if (data.length > 0) {


          this.shippingStateData = data;
          if (flag == 1) {
            this.shipping.zone = data[0].code

          }
        } else {
          this.shippingStateData = data;
          this.shipping.zone = '';

        }
      }, error => {

      });
  }
  onChangeStateShipping(value) {

  }
  updateHistory() {
    this.loadingList = true;
    let param = {
      comments: this.statusFields.comments,
      date: moment().format('yyyy-MM-DD'),
      status: this.statusFields.status
    }
    this.ordersService.addHistory(this.orderID, param)
      .subscribe(data => {
        this.loadingList = false;
        this.toastr.success("History Status has been submitted successfully");
        this.statusFields = {
          comments: '',
          status: ''
        }

      }, error => {
        this.loadingList = false;
        this.toastr.success("History Status has been submitted fail");

      });
  }
  updateOrder() {
    this.loadingList = true;
    let param = {
      "emailAddress": this.info.emailAddress,
      "billing": {
        "postalCode": this.billing.postalCode,
        "firstName": this.billing.firstName,
        "lastName": this.billing.lastName,
        "company": "",
        "phone": this.billing.phone,
        "address": this.billing.address,
        "city": this.billing.city,
        "billingAddress": false,
        "zone": this.billing.zone,
        "country": this.billing.country
      },
      "delivery": {
        "postalCode": this.shipping.postalCode,
        "firstName": this.shipping.firstName,
        "lastName": this.shipping.lastName,
        "company": "",
        "phone": this.shipping.phone,
        "address": this.shipping.address,
        "city": this.shipping.city,
        "billingAddress": false,
        "zone": this.shipping.zone,
        "country": this.shipping.country
      }
    }
    this.ordersService.updateOrder(this.orderID, param)
      .subscribe(data => {
        this.loadingList = false;
        this.toastr.success("Order has been updated successfully");
        // this.shippingStateData = data;
      }, error => {
        this.loadingList = false;
        this.toastr.success("Order has been updated fail");
      });
  }
  onPhoneChange() {
    this.billing.phone = new AsYouType('US').input(this.billing.phone);
  }
  onShippingPhoneChange() {
    this.shipping.phone = new AsYouType('US').input(this.shipping.phone);
  }
  goToback() {
    this.router.navigate(['pages/orders/order-list']);
  }
  onClickRefund() {
    this.loadingList = true;
    this.ordersService.refundOrder(this.orderID)
      .subscribe(data => {
        console.log(data)
        this.loadingList = false;
        this.toastr.success("Order has been refunded successfully");
        // this.shippingStateData = data;
      }, error => {
        this.loadingList = false;
        this.toastr.error("Order has been refunded fail");
      });
  }
  onClickCapture() {
    this.loadingList = true;
    this.ordersService.captureOrder(this.orderID)
      .subscribe(data => {
        console.log()
        this.loadingList = false;
        this.toastr.success("Order has been captured successfully");
        // this.shippingStateData = data;
      }, error => {
        this.loadingList = false;
        this.toastr.error("Order has been captured fail");
      });
  }
  showDialog(value) {
    // console.log(value)
    if (value == 1) {
      this.dialogService.open(OrderTransactionComponent, {
        context: {
          transactionData: this.transactionListData,
        },
      });
    } else if (value == 2) {
      this.dialogService.open(OrderInvoiceComponent, {
        context: {
          orderData: this.orderDetailsData,
        },
      });
    } else if (value == 3) {
      this.dialogService.open(OrderHistoryComponent, {
        context: {
          historyData: this.historyListData
        },
      });
    }
  }
}
