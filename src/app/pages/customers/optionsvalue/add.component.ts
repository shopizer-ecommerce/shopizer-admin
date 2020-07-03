import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../shared/services/crud.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'ngx-value-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class ValueAddComponent implements OnInit {
  displayText: Array<any> = [{ 'name': 'text' }, { 'name': 'select' }, { 'name': 'radio' }, { 'name': 'Checkbox' }]
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  constructor(
    private crudService: CrudService,
    private toastr: ToastrService
  ) {

  }
  ngOnInit() {

  }
}
