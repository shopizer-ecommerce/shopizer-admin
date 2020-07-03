import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../shared/services/crud.service';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../shared/components/showcase-dialog/showcase-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

@Component({
  selector: 'page-table',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent {
  search_text: string = '';
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
        }
        // {
        //   name: 'delete',
        //   title: '<i class="nb-info"></i>'
        // }
      ]
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      code: {
        title: 'Page Code',
        type: 'string',
      },
      name: {
        title: 'Page Name',
        type: 'string',
      },
      path: {
        title: 'Page Url',
        type: 'string'
      }
    },
  };

  source: any = new LocalDataSource();
  tempData: Array<any> = [];
  loadingList = false;
  constructor(
    private crudService: CrudService,
    public router: Router,
    private dialogService: NbDialogService,
    private toastr: ToastrService,
    private mScrollbarService: MalihuScrollbarService
  ) {
    this.getPages()
  }
  getPages() {
    console.log('Content constructor');
    this.loadingList = true;
    this.crudService.get('/v1/content/pages')
      .subscribe(data => {
        console.log(data, '************')
        this.source = data;
        this.tempData = data;
        this.loadingList = false;
      }, error => {
        this.loadingList = false;
      });
  }
  search() {
    const val = this.search_text.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val ||
        d.code.toLowerCase().indexOf(val) !== -1 || !val ||
        d.path.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.source = temp;
  }
  addPages() {
    localStorage.setItem('contentpageid', '');
    this.router.navigate(['/pages/content/pages/add']);
  }
  onClickAction(event) {
    switch (event.action) {
      case 'edit':
        this.onEdit(event);
        break;
      case 'delete':
        this.onDelete(event);

    }

  }
  onEdit(event) {
    localStorage.setItem('contentpageid', event.data.code);
    this.router.navigate(['/pages/content/pages/add']);
  }
  onDelete(event) {

    console.log(event);
    /** 
    this.dialogService.open(ShowcaseDialogComponent, {
      context : 'Do you really want to remove this entity?'
      //context: {
      //  title: 'Are you sure!',
      //  body: 'Do you really want to remove this entity?'
      //},
    })
      .onClose.subscribe(res => {
        if (res) {
          this.loadingList = true;
          this.crudService.delete('/v1/private/content/page/' + event.data.id + '?id=' + event.data.id)
            .subscribe(data => {
              this.loadingList = false;
              this.toastr.success('Page deleted successfully');
              this.getPages();
            }, error => {
              this.loadingList = false;
            });
        } else {
          this.loadingList = false;
        }
      });
      **/
  }
  ngAfterViewInit() {
    this.mScrollbarService.initScrollbar('.custom_scroll', { axis: 'y', theme: 'minimal-dark', scrollButtons: { enable: true } });
  }
}
