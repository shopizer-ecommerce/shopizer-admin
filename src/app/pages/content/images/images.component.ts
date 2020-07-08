import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CrudService } from '../../shared/services/crud.service';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../shared/components/showcase-dialog/showcase-dialog.component';
import { Lightbox } from 'ngx-lightbox';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

import { TreeModel, NodeInterface, ConfigInterface } from 'ng6-file-man';
@Component({
  selector: 'images-table',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent {
  uploadedFiles: any[] = [];
  _albums: any[] = [];
  loadingList = false;
  isPopup = false;
  tree: TreeModel;
  // node: NodeInterface;
  appLanguage = 'en';
  constructor(
    private crudService: CrudService,
    public router: Router,
    private sanitization: DomSanitizer,
    private dialogService: NbDialogService,
    private _lightbox: Lightbox,
    private mScrollbarService: MalihuScrollbarService,
  ) {
    const treeConfig: ConfigInterface = {
      baseURL: 'http://localhost:8080/',
      api: {
        listFile: 'api/list',
        uploadFile: 'api/upload',
        downloadFile: 'api/download',
        deleteFile: 'api/remove',
        createFolder: 'api/directory',
        renameFile: 'api/rename',
        searchFiles: 'api/search'
      },
      options: {
        allowFolderDownload: false,
        showFilesInsideTree: true
      }
    };
    this.tree = new TreeModel(treeConfig)
    // this.node = this.tree.nodes;
    this.getImages()
  }
  getImages() {
    // let action = Action.CONTENT + Action.BOXES;
    this.loadingList = true;
    this.crudService.get('/v1/content/images')
      .subscribe(data => {
        this.loadingList = false;
        this.uploadedFiles = data.content;
        for (let i = 0; i < this.uploadedFiles.length; i++) {
          const src = this.uploadedFiles[i].path + this.uploadedFiles[i].name;
          const caption = this.uploadedFiles[i].name;
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
  handleUpload = (files: any) => {
    console.log(files)
    this.loadingList = true;
    files.addedFiles.forEach(element => {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedFiles.push({
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
  openImage(index: number): void {
    this._lightbox.open(this._albums, index);
  }
  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }
  //body: 'Do you really want to remove this entity?'
  removeImage(name) {
    /**
    this.dialogService.open(ShowcaseDialogComponent, {
      context: {
        title: 'Do you really want to remove this entity?'
      },
    })
      .onClose.subscribe(res => {
        if (res) {
          this.loadingList = true;
          this.crudService.delete('/v1/private/content/?contentType=IMAGE&name=' + name)
            .subscribe(data => {
              this.loadingList = false;
              // this.toastr.success('Page deleted successfully');
              this.getImages();
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
    this.mScrollbarService.initScrollbar('.gallery_listing_main', { axis: 'y', theme: 'minimal-dark', scrollButtons: { enable: true } });
  }

  files: File[] = [];

  onSelect(event) {
    console.log(event);
    //this.files.push(...event.addedFiles);
  }

}
