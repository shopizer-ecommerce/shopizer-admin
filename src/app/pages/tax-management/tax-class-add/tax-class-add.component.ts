import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { SharedService } from '../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TaxService } from '../services/tax.service';

@Component({
  selector: 'ngx-tax-class-add',
  templateUrl: './tax-class-add.component.html',
  styleUrls: ['./tax-class-add.component.scss'],
})
export class TaxClassAddComponent implements OnInit {
  tax = {
    code: '',
    name: ''
  }
  loadingList: boolean = false;
  codeExits: boolean = false;
  isUpdated: boolean = false;
  constructor(
    // private sharedService: SharedService,
    private toastr: ToastrService,
    private router: Router,
    private taxService: TaxService
  ) {

  }
  ngOnInit() {
    // if (localStorage.getItem('packagesID')) {
    //   this.isUpdated = true
    //   this.getPackagesDetails();
    // }
  }
  focusOutFunction() {
    this.taxService.getUniqueTax(this.tax.code)
      .subscribe(data => {
        console.log(data)
        this.codeExits = data.exists;
      }, error => {
        // this.source.load([]);
      });
  }
  // onSelectStore(event) {

  // }
  // getPackagesDetails() {
  //   this.sharedService.getPackagingDetails(localStorage.getItem('packagesID'))
  //     .subscribe(res => {
  //       console.log(res);
  //       this.packages = res;
  //       res.type === 'BOX' ? this.packages.type = true : this.packages.type = false
  //       this.loadingList = false;
  //     }, error => {
  //       this.loadingList = false;
  //     });
  // }
  save() {
    this.loadingList = true;

    let param = {
      code: this.tax.code,
      name: this.tax.name
    }
    //   type: this.packages.type ? "BOX" : "ITEM",
    //   code: this.packages.code,
    //   shippingHeight: this.packages.type ? this.packages.shippingHeight : 0,
    //   shippingLength: this.packages.type ? this.packages.shippingLength : 0,
    //   shippingMaxWeight: 0,
    //   shippingWeight: this.packages.type ? this.packages.shippingWeight : 0,
    //   shippingWidth: this.packages.type ? this.packages.shippingWidth : 0,
    //   treshold: 0,

    // };
    // if (localStorage.getItem('packagesID')) {
    //   this.sharedService.updatePackaging(this.packages.code, param)
    //     .subscribe(res => {
    //       this.loadingList = false;
    //       this.toastr.success("Packages has been updated successfully");
    //       // this.router.navigate(['pages/shipping/packaging']);
    //     }, error => {
    //       this.loadingList = false;
    //       this.codeExits = true

    //     });
    // } else {
    this.taxService.addTaxClasses(param)
      .subscribe(res => {
        this.loadingList = false;
        this.toastr.success("Tax classes has been added successfully");
        this.router.navigate(['pages/tax-management/classes-list']);
      }, error => {
        this.loadingList = false;

      });
    // }
  }
  goBack() {
    this.router.navigate(['pages/tax-management/classes-list']);
  }
}
