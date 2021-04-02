import { Component, forwardRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StoreService } from '../../store-management/services/store.service';

@Component({
    selector: 'ngx-store-autocomplete',
    templateUrl: './store-autocomplete.html',
    styleUrls: ['./store-autocomplete.scss']
})
export class storeAutoCompleteComponent implements OnInit {


    @Output() onStore: EventEmitter<any> = new EventEmitter();
    public merchant: any = '';
    public _stores = [];
    // private _value: any = '';

    constructor(
        private storeService: StoreService) { }

    ngOnInit() {
    }

    searchStore() {
        this.storeService.getListOfStores({ code: 'DEFAULT' })
            .subscribe(res => {
                let storeData = []
                res.data.forEach((store) => {
                    storeData.push(store.code);
                });
                this._stores = storeData;
            });
    }
    onSelectStore(event) {
        console.log(event)
        this.onStore.emit(event);
    }

    //   onValueChange(value) {
    //     // console.log(value)
    //     this.onInputChange.emit(value);
    //   }




}
