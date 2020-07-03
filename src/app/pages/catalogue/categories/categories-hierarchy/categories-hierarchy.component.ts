import { Component, OnInit, ViewChild } from '@angular/core';

import { CategoryService } from '../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-categories-hierarchy',
  templateUrl: './categories-hierarchy.component.html',
  styleUrls: ['./categories-hierarchy.component.scss']
})
export class CategoriesHierarchyComponent implements OnInit {
  @ViewChild('tree', { static: false }) tree;
  nodes = [];
  options = {
    allowDrag: (node) => {
      return node.data.parent;
    },
    allowDrop: (element, { parent, index }) => {
      if (parent.data.hasOwnProperty('virtual')) {
        return !parent.data.virtual;
      } else {
        return !parent.isRoot;

      }
    },
  };

  loader = false;

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {
  }

  ngOnInit() {
    this.loader = true;
    this.getList();
  }

  getList() {
    // TODO need possibility to get all items at once
    this.categoryService.getListOfCategories().subscribe(res => {
      this.categoryService.getListOfCategories({ count: res.totalPages })
        .subscribe(categories => {
          categories.categories.forEach((el) => {
            this.transformList(el);
          });
          const rootObject = {
            id: 0,
            name: 'root',
            children: [...categories.categories]
          };
          this.nodes.push(rootObject);
          this.loader = false;
        });
    });
  }

  transformList(node) {
    node.name = node.description.name;
    if (node.children && node.children.length !== 0) {
      node.children.forEach((el) => {
        this.transformList(el);
      });
    }
  }

  onMoveNode(event) {
    const someNode = this.tree.treeModel.getNodeById(event.to.parent.id);
    someNode.expand();

    this.categoryService.updateHierarchy(event.node.id, event.to.parent.id)
      .subscribe(res => {
        this.toastr.success(this.translate.instant('CATEGORY.HIERARCHY_UPDATED'));
      });
  }

}
