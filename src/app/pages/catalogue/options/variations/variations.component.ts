import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VariationService } from '../services/variation.service';
// import { OptionService } from '../services/option.service';
import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { ShowcaseDialogComponent } from '../../../shared/components/showcase-dialog/showcase-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'ngx-variations-list',
  templateUrl: './variations.component.html',
  styleUrls: ['./variations.component.scss']
})
export class VariationsListComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  loadingList = false;
  settings = {};

  constructor(
    private variationService: VariationService,
    private translate: TranslateService,
    private router: Router,
    private dialogService: NbDialogService,
    private toastr: ToastrService,

  ) {
  }

  ngOnInit() {
    // this.setSettings();
    this.getList();
  }

  getList() {

    this.loadingList = true;
    this.variationService.getListOfVariations().subscribe((res) => {
      this.source.load(res.items);
      this.loadingList = false;
    });
    this.setSettings();
    this.translate.onLangChange.subscribe((lang) => {
      this.setSettings();
    });
  }

  setSettings() {
    this.settings = {
      mode: 'external',
      hideSubHeader: true,
      actions: {
        columnTitle: this.translate.instant('ORDER.ACTIONS'),
        add: false,
        edit: false,
        delete: false,
        position: 'right',
        custom: [
          {
            name: 'edit',
            title: '<i class="nb-edit"></i>'
          },
          {
            name: 'delete',
            title: '<i class="nb-trash"></i>'
          },
          // {
          //   name: 'delete',
          //   title: '<i class="nb-info"></i>'
          // }
        ]
      },
      columns: {
        id: {
          title: this.translate.instant('COMMON.ID'),
          type: 'number',
          filter: false,

        },
        code: {
          title: this.translate.instant('COMMON.CODE'),
          type: 'string',
          filter: false,
        },
        option: {
          title: this.translate.instant('PRODUCT_ATTRIBUTES.OPTION_NAME'),
          type: 'string',
          filter: true,
          valuePrepareFunction: (value) => {
            return value.name;
          }
        },
        values: {
          title: this.translate.instant('COMPONENTS.OPTIONS_VALUE'),
          type: 'string',
          filter: false,
          valuePrepareFunction: (data) => {
            if (data != null) {
              let value = data.map(a => a.name).join(", ");
              return value;
            }
          }
        },
        // productTypes: {
        //   title: this.translate.instant('COMPONENTS.PRODUCT_TYPES'),
        //   type: 'string',
        //   filter: false,
        //   valuePrepareFunction: (data) => {
        //     if (data != null) {
        //       let value = data.map(a => a.name).join(", ");
        //       return value;
        //     }
        //   }
        // }
      },
    };
  }

  deleteRecord(event) {
    //console.log(event);
    // this.dialogService.open(ShowcaseDialogComponent, {})
    //   .onClose.subscribe(res => {
    //     if (res) {
    //       // event.confirm.resolve();
    //       this.optionService.deleteOptionSet(event.data.id)
    //         .subscribe(result => {
    //           this.toastr.success(this.translate.instant('OPTION.SET_OPTION_REMOVED'));
    //           this.getList();
    //         });
    //     } else {
    //       //TODO generic error page
    //       // event.confirm.reject();
    //     }
    //   });
  }


  onClickAction(event) {
    switch (event.action) {
      case 'edit':
        this.onEdit(event);
        break;
      case 'remove':
        this.deleteRecord(event)
        break
    }
  }
  onEdit(event) {
    // this.router.navigate(['/pages/catalogue/options/option-set/' + event.data.id]);
  }
}
