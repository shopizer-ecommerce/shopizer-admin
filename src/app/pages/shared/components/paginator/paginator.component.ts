import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ngx-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  @Input() currentPage: number;
  @Input() count: number;
  @Input() perPage: number;
  @Input() pagesToShow: number;

  @Output() changePage = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  getMin(): number {
    return ((this.perPage * this.currentPage) - this.perPage) + 1;
  }

  getMax(): number {
    let max = this.perPage * this.currentPage;
    if (max > this.count) {
      max = this.count;
    }
    return max;
  }

  onPage(n: number): void {
    this.changePage.emit({ action: 'onPage', data: n });
  }

  onPrev(): void {
    this.changePage.emit({ action: 'onPrev', data: null });
  }

  onNext(): void {
    this.changePage.emit({ action: 'onNext', data: null });
  }

  totalPages(): number {
    return Math.ceil(this.count / this.perPage) || 0;
  }

  lastPage(): boolean {
    return this.perPage * this.currentPage >= this.count;
  }

  getPages(): number[] {
    const c = Math.ceil(this.count / this.perPage);
    const p = this.currentPage || 1;
    const pagesToShow = this.pagesToShow || 9;
    const pages: number[] = [];
    pages.push(p);
    const times = pagesToShow - 1;
    for (let i = 0; i < times; i++) {
      if (pages.length < pagesToShow) {
        if (Math.min.apply(null, pages) > 1) {
          pages.push(Math.min.apply(null, pages) - 1);
        }
      }
      if (pages.length < pagesToShow) {
        if (Math.max.apply(null, pages) < c) {
          pages.push(Math.max.apply(null, pages) + 1);
        }
      }
    }
    pages.sort((a, b) => a - b);
    return pages;
  }

  onFirst() {
    this.changePage.emit({ action: 'onFirst', data: null });
  }

  onLast() {
    this.changePage.emit({ action: 'onLast', data: this.totalPages() });
  }

}
