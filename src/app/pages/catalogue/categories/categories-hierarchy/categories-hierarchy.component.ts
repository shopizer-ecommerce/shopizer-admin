import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../shared/services/storage.service';

@Component({
  selector: 'ngx-categories-hierarchy',
  templateUrl: './categories-hierarchy.component.html',
  styleUrls: ['./categories-hierarchy.component.scss']
})
export class CategoriesHierarchyComponent implements OnInit {
  @ViewChild('tree', { static: false }) tree;
  nodes = [];
  options = {
    allowDrag: true
  }
  loader = false;
  loading: boolean = false;
  params = this.loadParams();

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private storageService: StorageService,
  ) {
  }

  loadParams() {
    return {
      lang: this.storageService.getLanguage(),
      store: this.storageService.getMerchant(),
      page: 0
    };
  }

  ngOnInit() {
    this.getList();
  }

  getList() {
    // TODO need possibility to get all items at once
    this.loader = true;
    this.categoryService.getListOfCategories(this.params)
      .subscribe(res => {
        res.categories.forEach((el) => {
          this.transformList(el);
        });
        this.nodes = res.categories
        this.loader = false;
      });
  }

  transformList(node) {
    node.name = node.description.name;
    node.title = node.description.title;
    node.description = node.description.description;
    if (node.children && node.children.length !== 0) {
      node.children.forEach((el) => {
        this.transformList(el);
      });
    }
  }

  onMoveNode(event) {
    //console.log(event);
    // const someNode = this.tree.treeModel.getNodeById(event.to.parent.id);
    // someNode.expand();
    var parentId = event.to.parent.id;

    if (event.to.parent.name === undefined) {
      parentId = -1;
    }

    this.categoryService.updateHierarchy(event.node.id, parentId)
      .subscribe(res => {
        this.toastr.success(this.translate.instant('CATEGORY.HIERARCHY_UPDATED'));
      });
  }

}
