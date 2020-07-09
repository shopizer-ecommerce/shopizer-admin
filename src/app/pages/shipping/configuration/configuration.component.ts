import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../shared/services/crud.service';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'shipping-config',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent {
  leftAreaItems = [];
  rightAreaItems = null;
  leftAreaLabel = "Available";
  rightAreaLabel = "Selected";

  leftAreaId = "Available";
  rightAreaId = "Selected";
  code = "code";
  label = "label";
  loadingList = false;
  expedition: boolean = false;
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  constructor(
    private crudService: CrudService, private sharedService: SharedService
  ) {
    this.getCountry()
  }

  // source: LocalDataSource = new LocalDataSource();
  settings = {
    mode: 'external',
    hideSubHeader: true,
    selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false,
      select: true
    },
    columns: {
      code: {
        title: 'Code',
        type: 'string',
      },
      name: {
        title: 'Name',
        type: 'string'
      }
    },
  };
  getCountry() {
    this.loadingList = true;
    this.crudService.get('/v1/country')
      .subscribe(data => {
        this.loadingList = false;
        let value = [];
        data.forEach((item) => {
          value.push({ 'code': item.id, 'label': item.name, 'countryCode': item.code })
        });
        this.leftAreaItems = value
        // this.source = data;
      }, error => {
        this.loadingList = false;

      });
  }

  saveShipToCountries() {
    this.sharedService.sendClickEvent();
  }

}
