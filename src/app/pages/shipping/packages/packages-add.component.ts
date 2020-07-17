import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'ngx-packages-add',
  templateUrl: './packages-add.component.html',
  styleUrls: ['./packages-add.component.scss'],
})
export class PackagesAddComponent implements OnInit {
  packages = {
    code: '',
    shippingHeight: '',
    shippingLength: '',
    shippingMaxWeight: '',
    shippingWeight: '',
    shippingWidth: '',
    treshold: '',
    type: false
  }
  loadingList: boolean = false;
  codeExits: boolean = false;
  constructor(
    private sharedService: SharedService,
    private toastr: ToastrService,
    private router: Router
  ) {

  }
  ngOnInit() {
    if (localStorage.getItem('packagesID')) {
      this.packages.code = localStorage.getItem('packagesID')
      this.getPackagesDetails();
    }
  }
  getPackagesDetails() {
    this.sharedService.getPackagingDetails(this.packages.code)
      .subscribe(res => {
        console.log(res);
        this.loadingList = false;
      }, error => {
        this.loadingList = false;
      });
  }
  save() {
    this.loadingList = true;

    let param = {
      type: this.packages.type ? "BOX" : "ITEM",
      code: this.packages.code,
      shippingHeight: this.packages.shippingHeight,
      shippingLength: this.packages.shippingLength,
      shippingMaxWeight: 0,
      shippingWeight: this.packages.shippingWeight,
      shippingWidth: this.packages.shippingWidth,
      treshold: 0,

    };
    if (localStorage.getItem('packagesID')) {
      this.sharedService.updatePackaging(this.packages.code, param)
        .subscribe(res => {
          this.loadingList = false;
          this.toastr.success("Packages has been updated successfully");
          // this.router.navigate(['pages/shipping/packaging']);
        }, error => {
          this.loadingList = false;
          this.codeExits = true

        });
    } else {
      this.sharedService.addPackaging(param)
        .subscribe(res => {
          this.loadingList = false;
          this.toastr.success("Packages has been added successfully");
          this.router.navigate(['pages/shipping/packaging']);
        }, error => {
          this.loadingList = false;
          this.codeExits = true

        });
    }
  }
  goBack() {
    this.router.navigate(['pages/shipping/packaging']);
  }
}
