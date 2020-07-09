import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { stringify } from '@angular/compiler/src/util';
import { CrudService } from '../../shared/services/crud.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../shared/services/storage.service';
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-transferlistbox',
  templateUrl: './transferlistbox.component.html',
  styleUrls: ['./transferlistbox.component.scss']
})
export class TransferlistboxComponent implements OnInit {

  @Input("leftAreaList") leftAreaList: any[];
  @Input("rightAreaList") rightAreaList: any[];
  @Input("code") code: string;
  @Input("label") label: string;
  @Input("leftAreaLabel") leftAreaLabel: string;
  @Input("rightAreaLabel") rightAreaLabel: string;
  @Input("leftAreaId") leftAreaId: string;
  @Input("rightAreaId") rightAreaId: string;
  toggleButtonClicked = new EventEmitter<Object>();
  leftAreaMap: Map<string, any>;
  rightAreaMap: Map<string, any> = new Map<string, any>();
  shipToCountries: string[] = [];
  store: string;
  clickEventsubscription: Subscription;

  /**
   *alerts component params 
   */
  isSrOnly: boolean = true;
  message: string = "";
  ariaLive: string = "polite";
  alertsClass = "default";
  alertAriaLive: string = "polite";
  /**
     *end of alerts component params 
     */
  showDelete: boolean = true;
  constructor(private crudService: CrudService, private toastr: ToastrService, private translate: TranslateService, private storageService: StorageService, private sharedService: SharedService) {
    this.clickEventsubscription = this.sharedService.getClickEvent().subscribe(() => {
      this.saveShipToCountries();
    })
  }

  /**
   * 
   */
  ngOnInit() {
    this.store = this.storageService.getMerchant();
    this.fetchShipToCountries();
    //this.generateLocalData();


  }
  // Method to fetch selected shipToCountries
  fetchShipToCountries() {
    this.crudService.get('/v1/private/expedition?store=' + this.store)
      .subscribe(data => {
        this.shipToCountries = data.shipToCountry;
        console.log(this.shipToCountries);
        this.generateLocalData();
      });

  }
  //save shipToCountries
  saveShipToCountries() {
    let selectedCountries = Array.from(this.rightAreaMap.values());
    selectedCountries.forEach(item => {
      this.shipToCountries.push(item.countryCode);
    });
    let payload = {
      "iternationalShipping": true,
      "shipToCountry": this.shipToCountries
    }
    this.crudService.post('/v1/private/expedition?store=' + this.store, payload).subscribe(res => {
      this.toastr.success(this.translate.instant('SHIPPING.SHIP_TO_COUNTRIES'));
    });
    this.shipToCountries = [];
  }

  /**
   * Creates a map based on the array information passed. addes additional properties required down the line
   */
  generateLocalData() {
    if (this.code == null) { throw Error("code attribute is required") };
    if (this.label == null) { throw Error("label attribute is required") };
    if (this.leftAreaList == null) { throw Error("leftAreaList attribute is required") };
    this.leftAreaMap = new Map<string, any>();
    if (this.shipToCountries.length > 0) {
      let availableCountries: any[] = this.leftAreaList;

      this.leftAreaList = availableCountries.filter(o => !this.shipToCountries.find((countryCode) => o.countryCode === countryCode));
      this.rightAreaList = availableCountries.filter(o => this.shipToCountries.some((countryCode) => o.countryCode === countryCode));
      //filling available countries
      this.leftAreaList.forEach((item) => {
        this.leftAreaMap.set(item[this.code], item);
      });
      //filling selected countries
      this.rightAreaList.forEach((item) => {
        this.rightAreaMap.set(item[this.code], item);
      });
      console.log(this.leftAreaList);
      console.log(this.rightAreaList);
      this.shipToCountries = [];
    } else {
      this.leftAreaList.forEach((item) => {
        console.log(item);
        item.selected = false;
        this.leftAreaMap.set(item[this.code], item);
      });
    }
  }
  /**
   * Sets the items into map 
   * @param wrapperItem 
   */
  itemSelectedOrUnSelected(wrapperItem: any) {
    if (wrapperItem == null) {
      return;
    }
    let item = wrapperItem.item;
    switch (wrapperItem.componentId) {
      case this.leftAreaId:
        this.leftAreaMap.set(item.key, item.value);
        break;
      case this.rightAreaId:
        this.rightAreaMap.set(item.key, item.value);
        break;
      default:
        return;
    }
  }

  /**
   * Toggles items from left to right
   */
  toggleLeftToRight() {
    let counter = 0;
    this.leftAreaMap.forEach((item: any, key: string) => {
      if (item.selected == true) {
        item.selected = false;
        this.rightAreaMap.set(key, item);
        this.leftAreaMap.delete(key);
        ++counter;
      }
    });
    this.updateMessage(this.leftAreaLabel, this.rightAreaLabel, counter);
    this.toggleButtonClicked.emit({ "componentId": this.leftAreaId });

  }
  /**
     * Toggles items from Right to Left
     */
  toggleRightToLeft() {
    let counter = 0;
    this.rightAreaMap.forEach((item: any, key: string) => {
      if (item.selected == true) {
        item.selected = false;
        this.leftAreaMap.set(key, item);
        this.rightAreaMap.delete(key);
        ++counter;
      }
    });
    this.updateMessage(this.rightAreaLabel, this.leftAreaLabel, counter);
    this.toggleButtonClicked.emit({ "componentId": this.rightAreaId });
  }

  updateMessage(from: String, to: string, counter: number) {
    this.message = counter + " item(s) moved from " + from + " to " + to;
  }

}
