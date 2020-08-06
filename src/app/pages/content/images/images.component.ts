import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CrudService } from '../../shared/services/crud.service';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Lightbox } from 'ngx-lightbox';
import { environment } from '../../../../environments/environment';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { TokenService } from '../../auth/services/token.service';
import { TreeModel, DownloadModeEnum, ConfigInterface } from 'ng6-file-man';
import xhook from 'xhook';

@Component({
  selector: 'images-table',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})

export class ImagesComponent implements OnInit {
  url = environment.apiUrl;
  uploadedFiles: any[] = [];
  _albums: any[] = [];
  loadingList = false;
  isPopup = false;
  tree: TreeModel;
  appLanguage = 'en';
  constructor(
    private tokenService: TokenService,
    //private crudService: CrudService,
    public router: Router,
    // private sanitization: DomSanitizer,
    // private dialogService: NbDialogService,
    //private _lightbox: Lightbox,
    private mScrollbarService: MalihuScrollbarService,
  ) {
    const treeConfig: ConfigInterface = {
      baseURL: this.url,
      api: {
        listFile: '/v1/private/content/list',
        uploadFile: '/v1/private/content/images/add',
        downloadFile: '/v1/content/images/download',
        deleteFile: '/v1/private/content/images/remove',
        createFolder: 'api/directory',//not supported
        renameFile: '/v1/private/content/images/rename',
        searchFiles: 'api/search'//not supported
      },
      options: {
        allowFolderDownload: DownloadModeEnum.DOWNLOAD_DISABLED,
        showFilesInsideTree: true
      }
    };
    this.tree = new TreeModel(treeConfig)


  }


  ngOnInit() {
    console.log('ngOnInit');
    const token: string = this.tokenService.getToken();

    if (token) {
      xhook.before(function (request) {
        request.headers['Authorization'] = 'Bearer ' + token;
      });
    }
  }

  ngAfterViewInit() {
    this.mScrollbarService.initScrollbar('.gallery_listing_main', { axis: 'y', theme: 'minimal-dark', scrollButtons: { enable: true } });

  }


}
