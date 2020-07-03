import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { stringify } from '@angular/compiler/src/util';

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
  constructor() {
  }

  /**
   * 
   */
  ngOnInit() {
    this.generateLocalData();


  }

  /**
   * Creates a map based on the array information passed. addes additional properties required down the line
   */
  generateLocalData() {
    if (this.code == null) { throw Error("code attribute is required") };
    if (this.label == null) { throw Error("label attribute is required") };
    if (this.leftAreaList == null) { throw Error("leftAreaList attribute is required") };
    this.leftAreaMap = new Map<string, any>();
    this.leftAreaList.forEach((item) => {
      item.selected = false;
      this.leftAreaMap.set(item[this.code], item);
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
