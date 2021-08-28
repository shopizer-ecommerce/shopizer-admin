import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../services/storage.service';
//import { SharedService } from '../../services/';
import { Subscription } from 'rxjs';

/**
 * Accepts from parent 
 * left list (all selections)
 * right list (saved selections)
 * all labels to be displayed
 */

@Component({
  selector: 'app-transferboxes',
  templateUrl: './transferboxes.component.html',
  styleUrls: ['./transferboxes.component.scss']
})
export class TransferBoxesComponent implements OnInit {

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
  shipToCountries: string[] = []; //TODO remove
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
  constructor(
    private toastr: ToastrService, 
    private translate: TranslateService, 
    private storageService: StorageService, 
    //private sharedService: SharedService
    ) {
  }

  /**
   * 
   */
  ngOnInit() {
    this.store = this.storageService.getMerchant();
    this.generateLocalData();

  }

  /** TODO collback */
  saveShipToCountries() {
    let selectedCountries = Array.from(this.rightAreaMap.values());
    selectedCountries.forEach(item => {
      this.shipToCountries.push(item.countryCode);
    });
    let param = {
      "iternationalShipping": true,
      "shipToCountry": this.shipToCountries
    }
    /**
    this.sharedService.saveExpedition(this.store, param)
      .subscribe(data => {
        this.shipToCountries = [];
        this.toastr.success(this.translate.instant('SHIPPING.SHIP_TO_COUNTRIES'));
      }, error => {
        // this.loadingList = false;

      });
    **/

  }

  /**
   * Creates a map based on the array information passed. 
   * adde additional properties required down the line
   */
  generateLocalData() {
    if (this.code == null) { throw Error("code attribute is required") };
    if (this.label == null) { throw Error("label attribute is required") };
    if (this.leftAreaList == null) { throw Error("leftAreaList attribute is required") };
    // console.log(this.leftAreaList)
    this.leftAreaMap = new Map<string, any>();
    this.rightAreaMap = new Map<string, any>();
    // if (this.shipToCountries.length > 0) {

    let availableCountries: any[] = this.leftAreaList;
    this.shipToCountries = this.rightAreaList;


    let leftAreaListData = availableCountries.filter(o => !this.shipToCountries.find((countryCode) => o.countryCode === countryCode));
    let rightAreaListData = availableCountries.filter(o => this.shipToCountries.some((countryCode) => o.countryCode === countryCode));
    //filling available countries
    leftAreaListData.forEach((item) => {
      this.leftAreaMap.set(item[this.code], item);
    });
    //filling selected countries
    rightAreaListData.forEach((item) => {
      this.rightAreaMap.set(item[this.code], item);
    });

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
