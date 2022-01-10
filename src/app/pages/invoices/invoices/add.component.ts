import { Component, OnInit } from '@angular/core';
import { InvoicesService } from '../services/invoices.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NbDialogService } from '@nebular/theme';
import { PasswordPromptComponent } from '../../shared/components/password-prompt/password-prompt';
import { ConfigService } from '../../shared/services/config.service';
import { Router } from '@angular/router';
import { ErrorService } from '../../shared/services/error.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'ngx-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  title = 'FormArray Example in Angular Reactive forms';
 
  invoiceForm: FormGroup;
  buttonText = 'Save';
 
  constructor(private fb:FormBuilder) {
    this.invoiceForm = this.fb.group({
      customer: ['', [Validators.required]],
      lineItems: this.fb.array([]),
    });
  
  }
 
  lineItems() : FormArray {
    return this.invoiceForm.get("lineItems") as FormArray
  }
 
  newLineItem(): FormGroup {
    return this.fb.group({
      name: '',
      quantity: 1,
      price: 0,
      subtotal: ''
    })
  }

  ngOnInit() {

  }
 
  addLineItem() {
    this.lineItems().push(this.newLineItem());
  }
 
  removeLineItem(i:number) {
    this.lineItems().removeAt(i);
  }
 
  onSubmit() {
    console.log(this.invoiceForm.value);
  }
 
}
 
 
export class country {
  id: string;
  name: string;
 
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

