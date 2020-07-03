import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CategoryService } from '../services/category.service';

@Component({
  selector: 'ngx-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {
  category: any = {};
  loadingInfo = false;

  constructor(
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.loadingInfo = true;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.categoryService.getCategoryById(id)
      .subscribe(res => {
        this.category = res;
        this.loadingInfo = false;
      });
  }

}
