import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-order-invoice',
  templateUrl: 'order-invoice.html',
  styleUrls: ['order-invoice.scss'],
})
export class OrderInvoiceComponent {
  orderData: any;
  constructor(protected ref: NbDialogRef<OrderInvoiceComponent>) { }

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
  }
  print() {
    // var printContents = document.getElementById('print-section').innerHTML;
    // var popupWin = window.open('', '_blank', 'width=300,height=300');
    // popupWin.document.open();
    // popupWin.document.write(printContents);
    // popupWin.document.close();
    // let printContents = document.getElementById('print-section').innerHTML;
    // let originalContents = document.body.innerHTML;

    // document.body.innerHTML = printContents;

    window.print();

    // document.body.innerHTML = originalContents;
  }
}
