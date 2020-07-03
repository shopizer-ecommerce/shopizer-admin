import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../shared/services/crud.service';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../shared/components/showcase-dialog/showcase-dialog.component';
import { Lightbox } from 'ngx-lightbox';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

@Component({
  selector: 'files-content',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent {
  name: string;
  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  files: File[] = [];
  _albums: any[] = [];
  onSelect(event) {
  }
  // onRemove(event) {
  //   this.files.splice(this.files.indexOf(event), 1);
  // }
  data: Array<any> = [];
  loadingList = false;
  isDisbaled = false;
  // settings = {
  //   mode: 'external',
  //   hideSubHeader: true,
  //   actions: {
  //     add: false,
  //     edit: false,
  //     delete: false,
  //     position: 'right',
  //     custom: [
  //       {
  //         name: 'delete',
  //         title: '<i class="nb-trash"></i>'
  //       }
  //     ]
  //   },
  //   columns: {
  //     name: {
  //       title: 'Name',
  //       type: 'string',
  //     },
  //     path: {
  //       title: 'URL',
  //       type: 'string',
  //       valuePrepareFunction: (cell, row) => {
  //         return row.path + row.name
  //       }
  //     }
  //   },
  // };

  // source: LocalDataSource = new LocalDataSource();

  constructor(
    private crudService: CrudService,
    private dialogService: NbDialogService,
    private _lightbox: Lightbox,
    private mScrollbarService: MalihuScrollbarService,
  ) {
    this.getFiles()
  }
  // onClickAction(event) {
  //   switch (event.action) {
  //     case 'delete':
  //       this.onDelete(event);
  //   }
  // }
  getFiles() {
    this.loadingList = true;
    this.crudService.get('/v1/content/folder')
      .subscribe(data => {
        this.loadingList = false;
        this.data = data.content;
        for (let i = 0; i < this.data.length; i++) {
          const src = this.data[i].path + this.data[i].name;
          const caption = this.data[i].name;
          // const thumb = this.uploadedFiles[i].path + this.uploadedFiles[i].name;
          const album = {
            src: src,
            caption: caption,
            // thumb: thumb
          };
          this._albums.push(album);
        }
      }, error => {
        this.loadingList = false;

      });
  }
  // onChange(event) {
  //   this.isDisbaled = true;
  //   this.files = event.srcElement.files;
  // }
  handleUpload = (files: any) => {
    console.log(files)
    this.loadingList = true;
    files.addedFiles.forEach(element => {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.data.push({
          name: element.name,
          contentType: 1,
          path: e.target.result
        });
      }
      reader.readAsDataURL(element);
    });
    for (var i = 0; i < files.addedFiles.length; i++) {

      let formData = new FormData();
      formData.append('file', files.addedFiles[i]);
      this.crudService.post('/v1/private/file', formData)
        .subscribe(data => {
          this.loadingList = false;
          // this.uploadedFiles = data.content;
        }, error => {
          this.loadingList = false;

        });
    }

  }
  // uploadFiles() {
  //   for (var i = 0; i < this.files.length; i++) {
  //     let formData = new FormData();
  //     formData.append('file', this.files[i]);
  //     this.crudService.post('/v1/private/file', formData)
  //       .subscribe(data => {
  //         console.log(data);
  //         this.loadingList = false;
  //         this.getFiles();
  //         // this.uploadedFiles = data.content;
  //       }, error => {
  //         this.loadingList = false;

  //       });
  //   }
  // }
        //context: {
      //  title: 'Are you sure!',
      //  body: 'Do you really want to remove this entity?'
      //},
  removeImage(e) {
    // this.loadingList = true;
    /**
    this.dialogService.open(ShowcaseDialogComponent, {
      context : {title: 'Do you really want to remove this entity?'}
    })
      .onClose.subscribe(res => {
        if (res) {
          this.loadingList = true;
          this.crudService.delete('/v1/private/content/?contentType=IMAGE&name=' + e)
            .subscribe(data => {
              this.loadingList = false;
              // this.toastr.success('Page deleted successfully');
              this.getFiles();
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
    this.mScrollbarService.initScrollbar('.file_listing_scroll', { axis: 'y', theme: 'minimal-dark', scrollButtons: { enable: true } });
  }
  openImage(index: number): void {
    this._lightbox.open(this._albums, index);
  }
  close(): void {
    this._lightbox.close();
  }
}
