import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { SharedService } from '../services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TaxService } from '../services/tax.service';

@Component({
  selector: 'ngx-tax-class-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class TaxClassAddComponent implements OnInit {
  tax = {
    id: '',
    code: '',
    name: ''
  }
  loadingList: boolean = false;
  codeExits: boolean = false;
  isUpdated: boolean = false;
  taxClassID: any;
  isUpdate: boolean = false;
  constructor(
    // private sharedService: SharedService,
    private toastr: ToastrService,
    private router: Router,
    private taxService: TaxService
  ) {

  }
  ngOnInit() {
    if (localStorage.getItem('classId')) {
      this.taxClassID = localStorage.getItem('classId')
      this.getTaxClassDetail();
      this.isUpdate = true;
    }
  }
  getTaxClassDetail() {
    this.loadingList = true;
    this.taxService.getTaxClassesDetails(this.taxClassID)
      .subscribe(data => {
        this.loadingList = false;
        console.log(data)
        this.tax = data;
      }, error => {
        this.loadingList = false;
      });
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
    this.taxService.addTaxClasses(param)
      .subscribe(res => {
        this.loadingList = false;
        this.toastr.success("Tax classes has been added successfully");
        this.router.navigate(['pages/tax-management/classes-list']);
      }, error => {
        this.loadingList = false;

      });
  }
  update() {
    this.loadingList = true;

    let param = {
      code: this.tax.code,
      name: this.tax.name
    }
    this.taxService.updateTaxClasses(this.tax.id, param)
      .subscribe(res => {
        this.loadingList = false;
        this.toastr.success("Tax classes has been updated successfully");
        this.router.navigate(['pages/tax-management/classes-list']);
      }, error => {
        this.loadingList = false;
        this.toastr.success("Tax classes has been updated fail");
      });
  }
  goBack() {
    this.router.navigate(['pages/tax-management/classes-list']);
  }
}
