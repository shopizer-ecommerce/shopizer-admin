import { Component, OnInit } from '@angular/core';
import { QueryBuilderConfig } from 'angular2-query-builder';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { error } from '@angular/compiler/src/util';
import { StoreService } from '../../store-management/services/store.service';
import * as moment from 'moment';
@Component({
    selector: 'ngx-rules',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
    query = {
        condition: 'and',
        rules: [

        ]
    };
    stores = [];
    rules = {
        enabled: false,
        code: '',
        name: '',
        timeBased: '',
        startDate: new Date(),
        endDate: new Date(),
        order: '',
        store: '',
        selected_result: '',
    }
    actionsData: Array<any> = [];
    config: QueryBuilderConfig;

    rules_time: boolean = false;
    loadingList: boolean = false
    shippingResult: Array<any> = [];
    resultData: Array<any> = [];
    selectedResult: any;
    constructor(
        private sharedService: SharedService,
        private storeService: StoreService,
        public router: Router
    ) {
        this.getStoreList();
        //this.getShippingCondition()
        this.getRulesCriterias()
        this.getRulesActions()

    }
    ngOnInit() {
    }
    getStoreList() {
        this.storeService.getListOfMerchantStoreNames({ 'store': '' })
            .subscribe(res => {
                console.log(res);
                res.forEach((store) => {
                    this.stores.push({ value: store.code, label: store.code });
                });
            });
    }
    getRulesCriterias() {
        let fields = {}
        this.sharedService.getRulesCriterias()
            .subscribe(data => {
                console.log(data)
                data.map((value) => {
                    fields[value.code] = {
                        "name": value.name,
                        // "type": value.options.length > 0 ? 'category' : value.format == 'DECIMAL' || value.format == 'NUMERIC' ? 'number' : value.format.toLowerCase(),
                        "type": value.criteriaType == 'text' ? 'string' : 'string',
                        "operators": value.operators,
                        "options": []
                    }
                    // value.options.map((opt) => {
                    //     fields[value.code].options.push({ name: opt.name, value: opt.value })
                    // })

                });

                this.config = { fields };
            });
    }
    getRulesActions() {
        this.sharedService.getRulesActions()
            .subscribe(data => {
                console.log(data);
                this.actionsData = data
            });
    }
    goToback() {
        this.router.navigate(['/pages/shipping/rules']);
    }
    onSubmit() {
        // console.log(this.query)
        let actions = [];
        this.actionsData.map((value) => {
            actions.push({ code: value.code, value: value.value })
        });
        let param = {
            "name": this.rules.name,
            "code": this.rules.code,
            "store": this.rules.store,
            "enabled": this.rules.enabled,
            "startDate": moment(this.rules.startDate).utc(),
            "action": actions,
            "ruleSets": [
                this.query
            ]
        }
        console.log(param);
        this.sharedService.createShippingRules(param)
            .subscribe(data => {
                console.log(data);
            });
    }
    // getShippingCondition() {
    //     this.loadingList = true;
    //     let fields = {}
    //     this.sharedService.getRulesCondition()
    //         .subscribe(data => {
    //             // console.log(data)

    //             data.map((value) => {
    //                 fields[value.code] = {
    //                     "name": value.name,
    //                     "type": value.options.length > 0 ? 'category' : value.format == 'DECIMAL' || value.format == 'NUMERIC' ? 'number' : value.format.toLowerCase(),
    //                     "operators": value.operators,
    //                     "options": []
    //                 }
    //                 value.options.map((opt) => {
    //                     fields[value.code].options.push({ name: opt.name, value: opt.value })
    //                 })

    //             });
    //             // config: QueryBuilderConfig = { fields: {} }
    //             // console.log(fields);
    //             this.config = { fields };
    //             this.loadingList = false;

    //             // this.source.load(data);
    //         }, error => {
    //             this.loadingList = false;
    //         });
    //     this.getShippingResult();
    // }
    // getShippingResult() {

    //     this.sharedService.getRulesResult()
    //         .subscribe(data => {
    //             // console.log(data);
    //             this.shippingResult = data;
    //         }, error => {

    //         });
    //     this.getShippingRulesDetails()
    // }
    // getShippingRulesDetails() {
    //     if (localStorage.getItem('rulesCode')) {
    //         this.sharedService.getShippingRulesDetails(localStorage.getItem('rulesCode'))
    //             .subscribe(data => {
    //                 console.log(data)
    //                 this.rules = data;
    //                 this.rules.startDate = new Date(data.startDate)
    //                 this.rules.endDate = new Date(data.endDate)
    //                 this.resultData = data.results;
    //                 this.query = data.conditions[0]
    //             }, error => {

    //             });
    //     }

    // }
    onClickConfigure() {
        // console.log(this.selected_result);
        this.selectedResult = this.rules.selected_result
    }
}
