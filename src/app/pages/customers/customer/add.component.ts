import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { ToastrService } from 'ngx-toastr';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../shared/components/showcase-dialog/showcase-dialog.component';
import { PasswordPromptComponent } from '../../shared/components/password-prompt/password-prompt';

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
  loadingList = false;
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
  languages: Array<any> = [{ 'code': 'en', 'name': 'English' }, { 'code': 'fr', 'name': 'French' }]
  constructor(private crudService: CrudService, private toastr: ToastrService,
    private dialogService: NbDialogService) {
    this.getCountry();
    this.getStore();

  }
  getCustomerDetails() {
    this.loadingList = true;
    this.crudService.get('/v1/private/customer/' + this.customerID)
      .subscribe(data => {
        this.loadingList = false;
        this.onBillingChange(data.billing.country)


        this.info.emailAddress = data.emailAddress;
        this.info.language = data.language;
        this.info.userName = data.userName;
        this.billing = data.billing;
        if (data.delivery) {
          this.onShippingChange(data.delivery.country)
          this.shipping = data.delivery;
        }

      }, error => {
        this.loadingList = false;
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
    this.crudService.get('/v1/country')
      .subscribe(data => {
        this.shippingCountry = data;
        this.billingCountry = data;
      }, error => {

      });
  }
  getStore() {
    this.crudService.get('/v1/sec/private/groups')
      .subscribe(data => {
        this.groups = data;
      }, error => {
      });
  }
  onBillingChange(value) {
    this.crudService.get('/v1/zones?code=' + value)
      .subscribe(data => {
        this.billingStateData = data;
      }, error => {

      });
  }
  onShippingChange(value) {
    this.crudService.get('/v1/zones?code=' + value)
      .subscribe(data => {
        this.shippingStateData = data;
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
      this.loadingList = true;
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
      this.crudService.post('/v1/private/customer', param)
        .subscribe(data => {
          console.log(data);
          this.loadingList = false;
          this.toastr.success('Customer has been added successfully');
          // this.router.navigate(['/pages/content/pages/list']);
        }, error => {
          this.loadingList = false;
        });
    } else {
      this.loadingList = true;
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
      this.crudService.put('/v1/private/customer/' + this.customerID, param)
        .subscribe(data => {
          console.log(data);
          this.loadingList = false;
          this.toastr.success('Customer has been updated successfully');
          // this.router.navigate(['/pages/content/pages/list']);
        }, error => {
          this.loadingList = false;
        });
    }
  }

  /**
   *   //context: {
        //  title: 'Are you sure!',
        //  body: 'Do you really want to remove this entity?'
        //},
   */
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
}
