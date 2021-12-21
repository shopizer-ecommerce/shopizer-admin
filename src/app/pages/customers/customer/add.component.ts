import { Component, OnInit } from '@angular/core';
import { CustomersService } from '../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../shared/components/showcase-dialog/showcase-dialog.component';
import { PasswordPromptComponent } from '../../shared/components/password-prompt/password-prompt';
import { ConfigService } from '../../shared/services/config.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'ngx-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  shippingCountry: Array<any> = []
  shippingStateData: Array<any> = []
  billingStateData: Array<any> = []
  billingCountry: Array<any> = []
  groups: Array<any> = []
  selectedGroups: Array<any> = []
  loading = false;
  languages = [];
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  info = {
    userName: '',
    language: '',
    emailAddress: ''
  }
  shipping = {
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    city: '',
    zone: '',
    country: '',
    postalCode: '',

  }
  billing = {
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    city: '',
    zone: '',
    country: '',
    postalCode: '',
    phone: ''
  }
  customerID: any;
  defaultCountry: any;
  title: any = 'Create Customer'
  buttonText: any = 'Save'
  constructor(
    private customersService: CustomersService,
    private configService: ConfigService,
    private toastr: ToastrService,
    public router: Router,
    private dialogService: NbDialogService
  ) {

      this.getCountry();
      this.getLanguages();
      this.getGroups();

  }

  getCustomerDetails() {
    this.loading = true;
    this.customersService.getCustomerDetails(this.customerID)
      .subscribe(data => {

        this.loading = false;
        this.onBillingChange(data.billing.country, 0)


        this.info.emailAddress = data.emailAddress;
        this.info.language = data.language;
        this.info.userName = data.userName;
        this.billing = data.billing;
        if (data.delivery) {
          this.onShippingChange(data.delivery.country, 0)
          this.shipping = data.delivery;
        }

      }, error => {
        this.loading = false;
      });
  }

  ngOnInit() {

    if (localStorage.getItem('customerid')) {
      this.customerID = localStorage.getItem('customerid')
      this.getCustomerDetails();
      this.title = "Update Customer"
      this.buttonText = "Update"
    }
  }

  getCountry() {
    this.loading=true;
    this.customersService.getCountry()
      .subscribe(data => {
        this.shippingCountry = data;
        this.billingCountry = data;
        this.loading=false;
      }, error => {
        this.loading=false;
      });
  }

  getLanguages() {
    this.loading=true;
    this.configService.getListOfSupportedLanguages(localStorage.getItem('merchant'))
    .subscribe(langs => {
      this.languages = [...langs];
      this.loading=false;
    });

  }

  getGroups() {
    this.loading=true;
    this.customersService.getGroup()
      .subscribe(data => {
        this.groups = data;

        this.loading=false;
      }, error => {
        this.loading=false;
      });
  }


  //this.groups.forEach((element,index)=>{
    //if(element.type=='ADMIN') {
    //  this.groups.splice(index,1);
    //} 
  //});



  onBillingChange(value, flag) {
    console.log(flag)
    this.customersService.getBillingZone(value)
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
  onShippingChange(value, flag) {
    this.customersService.getShippingZone(value)
      .subscribe(data => {
        if (data.length > 0) {
          this.shippingStateData = data;
          if (flag == 1) {
            this.shipping.zone = data[0].code;
          }
        } else {
          this.shippingStateData = data;
          this.shipping.zone = '';
        }
      }, error => {

      });
  }
  addRole(group) {
    const index = this.selectedGroups.findIndex(el => el.id === group.id);
    // if exist
    if (index === -1) {
      this.selectedGroups.push({ 'name': group.name })
    } else {
      this.selectedGroups.splice(index, 1); // remove
    }
  }
  onAddCustomer() {
    if (this.buttonText == 'Save') {
      this.loading = true;
      let param = {
        "billing": {
          "company": this.billing.company,
          "address": this.billing.address,
          "city": this.billing.city,
          "postalCode": this.billing.postalCode,
          "stateProvince": this.billing.zone,
          "country": this.billing.country,
          "zone": this.billing.zone,
          "firstName": this.billing.firstName,
          "lastName": this.billing.lastName,
          "phone": this.billing.phone
        },
        "delivery": {
          "company": this.shipping.company,
          "address": this.shipping.address,
          "city": this.shipping.city,
          "postalCode": this.shipping.postalCode,
          "stateProvince": this.shipping.zone,
          "country": this.shipping.country,
          "zone": this.shipping.zone,
          "firstName": this.shipping.firstName,
          "lastName": this.shipping.lastName
        },
        "emailAddress": this.info.emailAddress,
        "groups": this.selectedGroups,
        "language": this.info.language,
        "userName": this.info.userName,

      }
      this.customersService.addCustomers(param)
        .subscribe(data => {
          // console.log(data);
          this.loading = false;
          this.toastr.success('Customer has been added successfully');
          this.goToback()
        }, error => {
          this.loading = false;
        });
    } else {
      this.loading = true;
      let param = {
        "id": this.customerID,
        "billing": {
          "company": this.billing.company,
          "address": this.billing.address,
          "city": this.billing.city,
          "postalCode": this.billing.postalCode,
          // "stateProvince": this.billing.stateProvince,
          "country": this.billing.country,
          "zone": this.billing.zone,
          "firstName": this.billing.firstName,
          "lastName": this.billing.lastName,
          "phone": this.billing.phone
        },
        "delivery": {
          "company": this.shipping.company,
          "address": this.shipping.address,
          "city": this.shipping.city,
          "postalCode": this.shipping.postalCode,
          // "stateProvince": this.shipping.stateProvince,
          "country": this.shipping.country,
          "zone": this.shipping.zone,
          "firstName": this.shipping.firstName,
          "lastName": this.shipping.lastName
        },
        "emailAddress": this.info.emailAddress,
        // "groups": this.selectedGroups,
        // "language": this.info.language,
        // "userName": this.info.userName,

      }
      this.customersService.updateCustomers(param, this.customerID)
        .subscribe(data => {
          // console.log(data);
          this.loading = false;
          this.toastr.success('Customer has been updated successfully');
          this.goToback()
        }, error => {
          this.loading = false;
        });
    }
  }


  showDialog(value) {
    console.log(value)
    if (value == 1) {
      /**
      this.dialogService.open(ShowcaseDialogComponent, {
        context : 'Do you really want to remove this entity?'
      })
        .onClose.subscribe(res => {
          if (res) {
            console.log('fsdfsfdf');

          } else {

          }
        });
        */
    } else {
      this.dialogService.open(PasswordPromptComponent)
        .onClose.subscribe(res => {

        });
    }
  }
  goToback() {
    this.router.navigate(['/pages/customer/list']);
  }
}
