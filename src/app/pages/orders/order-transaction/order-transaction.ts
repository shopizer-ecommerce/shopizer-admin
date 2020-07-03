import { Component, } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import * as moment from 'moment';
@Component({
  selector: 'ngx-order-transaction',
  templateUrl: 'order-transaction.html',
  styleUrls: ['order-transaction.scss'],
})
export class OrderTransactionComponent {
  transactionData: any;
  moment: any = moment;
  constructor(protected ref: NbDialogRef<OrderTransactionComponent>) {
    // console.log(this.historyData)
  }

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
  }
}
