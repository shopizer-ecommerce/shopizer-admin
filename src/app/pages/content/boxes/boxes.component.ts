import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../shared/services/crud.service';
import { Router } from '@angular/router';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

@Component({
  selector: 'boxes-table',
  templateUrl: './boxes.component.html',
  styleUrls: ['./boxes.component.scss'],
})
export class BoxesComponent {
  settings = {
    mode: 'external',
    hideSubHeader: true,
    actions: {
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
        {
          name: 'delete',
          title: '<i class="nb-info"></i>'
        }
      ]
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      code: {
        title: 'Code',
        type: 'string',
      },
      name: {
        title: 'Name',
        type: 'string',
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private crudService: CrudService,
    public router: Router,
    private mScrollbarService: MalihuScrollbarService
  ) {
    this.getBox()
  }
  getBox() {
    // let action = Action.CONTENT + Action.BOXES;

    this.crudService.get('/v1/content/boxes')
      .subscribe(data => {
        this.source = data;
      }, error => {
        // this.router.navigate(['/error']);
      });
  }
  addBoxes() {
    this.router.navigate(['/pages/content/boxes/add']);
  }

  // onDeleteConfirm(event): void {
  //   if (window.confirm('Are you sure you want to delete?')) {
  //     event.confirm.resolve();
  //   } else {
  //     event.confirm.reject();
  //   }
  // }
  ngAfterViewInit() {
    this.mScrollbarService.initScrollbar('.custom_scroll', { axis: 'y', theme: 'minimal-dark', scrollButtons: { enable: true } });
  }
}
