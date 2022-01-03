import { Component, OnInit } from '@angular/core';
import { CustomersService } from '../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../shared/components/showcase-dialog/showcase-dialog.component';
import { PasswordPromptComponent } from '../../shared/components/password-prompt/password-prompt';
import { ConfigService } from '../../shared/services/config.service';
import { Router } from '@angular/router';
import { ErrorService } from '../../shared/services/error.service';
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
    emailAddress: '',
    groups: []
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
  //title: any = 'Create Customer'
  buttonText: any = 'Save'
  selectedItem = '1';
  sidemenuLinks = [
    {
      id: '0',
      title: 'Set credentials',
      key: 'FORGOT_PASSWORD.RESET',
      link: 'customer/set-credentials'
    },
    {
      id: '1',
      title: 'Customer details',
      key: 'CUSTOMERS.DETAILS',
      link: 'customer/add'
    }
  ];
  constructor(
    private customersService: CustomersService,
    private configService: ConfigService,
    private toastr: ToastrService,
    public router: Router,
    private dialogService: NbDialogService,
    private errorService: ErrorService
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
        this.info.groups = data.groups;
        this.billing = data.billing;
        if (data.delivery) {
          this.onShippingChange(data.delivery.country, 0)
          this.shipping = data.delivery;
        }


        this.info.groups.forEach((uGroup) => {
          this.groups.forEach((group) => {

            //check this group if usr has it
            if (uGroup.name === group.name) {
              group.checked = true;
            }

          });
        });


      }, error => {
        this.loading = false;
      });
  }

  ngOnInit() {

    if (localStorage.getItem('customerid')) {
      this.customerID = localStorage.getItem('customerid')
      this.getCustomerDetails();
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
        console.log("GROUPS " + JSON.stringify(data));
        this.groups = data.filter(t => t.type === 'CUSTOMER')
        //this.groups = data;

        this.loading=false;
      }, error => {
        this.loading=false;
        this.errorService.error('COMMON.SYSTEM_ERROR',error);
      });
  }


  onBillingChange(value, flag) {
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
        this.errorService.error('COMMON.SYSTEM_ERROR',error);
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
        this.errorService.error('COMMON.SYSTEM_ERROR',error);
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
          this.errorService.success('COMMON.SUCCESS_ADDED');
          this.goToback()
        }, error => {
          this.loading = false;
          this.errorService.error('COMMON.SYSTEM_ERROR',error);
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
          this.errorService.success('COMMON.SUCCESS_ADDED');
          this.goToback()
        }, error => {
          this.loading = false;
          this.errorService.error('COMMON.SYSTEM_ERROR',error);
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
  onClickRoute(link) {
    this.router.navigate(['pages/' + link]);
  }
  goToback() {
    this.router.navigate(['/pages/customer/list']);
  }
}
