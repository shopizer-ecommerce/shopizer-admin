import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { StoreService } from '../../../../store-management/services/store.service';
import { ConfigService } from '../../../../shared/services/config.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { InventoryService } from '../../services/inventory.service';
import * as moment from 'moment';

@Component({
  selector: 'ngx-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss']
})
export class InventoryFormComponent implements OnInit {
  @Input() inventory;
  form: FormGroup;
  stores = [];
  loader = false;
  languages = [];
  productId;
  prices = [];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    // private router: Router,
    private translate: TranslateService,
    private storeService: StoreService,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private inventoryService: InventoryService
  ) {
  }

  ngOnInit() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId');
    this.createForm();
    this.storeService.getListOfStores({})
      .subscribe(res => {
        res.data.forEach((store) => {
          this.stores.push({ value: store.code, label: store.code });
        });
      });
    this.loader = true;
    this.configService.getListOfSupportedLanguages()
      .subscribe(res => {
        this.languages = [...res];
        this.createForm();
        if (this.inventory.id) {
          this.fillForm();
        }
        this.loader = false;
      });
  }

  private createForm() {
    this.form = this.fb.group({
      store: ['DEFAULT', [Validators.required]],
      owner: ['', [Validators.required]],
      dateAvailable: [new Date()],
      quantity: [0, [Validators.required]]
    });
  }

  fillForm() {
    this.form.patchValue({
      store: this.inventory.store.code,
      owner: this.inventory.owner,
      dateAvailable: this.inventory.dateAvailable,
      quantity: this.inventory.quantity,
    });
  }


  save() {
    const inventoryObj = this.form.value;
    inventoryObj.dateAvailable =
      inventoryObj.dateAvailable ? moment(inventoryObj.dateAvailable).format('YYYY-MM-DD') : '';
    inventoryObj.prices = [...this.prices];
    inventoryObj.productId = this.productId;
    if (this.inventory.id) {
      inventoryObj.id = this.inventory.id;
      this.inventoryService.updateInventory(this.productId, this.inventory.id, inventoryObj).subscribe((res) => {
        this.toastr.success(this.translate.instant('INVENTORY.INVENTORY_UPDATED'));
      });
    } else {
      this.inventoryService.createInventory(inventoryObj).subscribe((res) => {
        this.toastr.success(this.translate.instant('INVENTORY.INVENTORY_CREATED'));
        this.inventory = res;
      });
    }
  }

}
