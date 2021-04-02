import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { validators } from '../../../shared/validation/validators';
import { CatalogService } from '../services/catalog.service';
import { ShowcaseDialogComponent } from '../../../shared/components/showcase-dialog/showcase-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Description } from '../../../shared/models/description';

@Component({
  selector: 'ngx-catalogue-form',
  templateUrl: './catalogue-form.component.html',
  styleUrls: ['./catalogue-form.component.scss']
})
export class CatalogueFormComponent implements OnInit {
  @ViewChild('tree', { static: false }) tree;
  form: FormGroup;
  loader: boolean = false;
  isCodeUnique = true;
  nodes = [];
  category = [];
  catalog;
  options = {
    allowDrag: true,
    levelPadding: 10,
    useVirtualScroll: true,
    animateExpand: true,
    scrollOnActivate: true,
    animateSpeed: 30,
    animateAcceleration: 1.2,
    //displayField: 'description.name'
  }

  constructor(
    //https://github.com/khan4019/tree-grid-directive
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private dialogService: NbDialogService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    const catalogId = this.activatedRoute.snapshot.paramMap.get('catalogId');
    this.createForm();
    if (catalogId) {
      this.catalogService.getCatalogById(catalogId).subscribe(res => {
        this.catalog = res;
        this.nodes = res.category;
        //filter entry
        this.filterEntry();
        this.fillForm();
      });
    }
  }

  filterEntry() {
    let productsArray = [];
    let categoryArray = [];
    if (this.nodes.length > 0) {
      this.nodes.forEach(function (entry) {
        console.log(JSON.stringify(entry));
        //if(entry.category != null) {
        //  categoryArray.push(entry.category)
        //}
      })
    }

    //console.log('ProductsArray => ' + JSON.stringify(productsArray));
    this.category = categoryArray;


  }

  get code() {
    return this.form.get('code');
  }

  private createForm() {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(validators.alphanumeric)]],
      visible: [false]
    });
  }

  private fillForm() {
    this.form.patchValue({
      code: this.catalog.code,
      visible: this.catalog.visible,
    });
  }

  checkCode(event) {
    const code = event.target.value.trim();
    this.catalogService.checkCatalogCode(code)
      .subscribe(res => {
        this.isCodeUnique = !(res.exists && (this.catalog.code !== code));
      });
  }

  save() {
    if (this.catalog) {
      this.catalogService.updateCatalog(this.catalog.id, this.form.value).subscribe(res => {
        this.toastr.success(this.translate.instant('CATALOG.CATALOG_UPDATED'));
      });
    } else {
      this.catalogService.createCatalog(this.form.value).subscribe(res => {
        this.toastr.success(this.translate.instant('CATALOG.CATALOG_CREATED'));
      });
    }
  }

  remove() {
    this.dialogService.open(ShowcaseDialogComponent, {})
      .onClose.subscribe(res => {
        if (res) {
          this.catalogService.deleteCatalog(this.catalog.id)
            .subscribe(data => {
              this.toastr.success(this.translate.instant('CATALOG.CATALOG_REMOVED'));
              this.router.navigate(['pages/catalogue/catalogues/catalogues-list']);
            });
        }
      });
  }
  goToback() {
    this.router.navigate(['pages/catalogue/catalogues/catalogues-list']);
  }
}
