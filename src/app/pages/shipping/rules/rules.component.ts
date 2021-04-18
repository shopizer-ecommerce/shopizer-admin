import { Component, OnInit } from '@angular/core';
import { QueryBuilderConfig } from 'angular2-query-builder';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { error } from '@angular/compiler/src/util';
import { StoreService } from '../../store-management/services/store.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
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
    codeExits: boolean;
    rules = {
        id: '',
        enabled: false,
        code: '',
        name: '',
        // timeBased: '',
        startDate: new Date(),
        endDate: new Date(),
        order: 0,
        store: '',
        selected_result: '',
    }
    actionsData: Array<any> = [];
    selectedActionsData: Array<any> = [];
    config: QueryBuilderConfig;

    rules_time: boolean = false;
    loadingList: boolean = false
    shippingResult: Array<any> = [];
    resultData: Array<any> = [];
    selectedResult: any;
    title: any = 'Add Rules'
    buttonText: any = 'Submit'
    constructor(
        private sharedService: SharedService,
        private storeService: StoreService,
        public router: Router,
        private toastr: ToastrService
    ) {
        this.getStoreList();
        //this.getShippingCondition()
        this.getRulesCriterias()
        this.getRulesActions()

    }
    ngOnInit() {

        if (localStorage.getItem('rulesCode')) {
            // setTimeout(() => {
            this.sharedService.getShippingRulesDetails(localStorage.getItem('rulesCode'))
                .subscribe(rulesData => {

                    // let rulesData = JSON.parse(localStorage.getItem('rulesCode'))
                    console.log(rulesData)
                    this.title = 'Update Rules'
                    this.buttonText = 'Update'
                    let j = this.stores.find(x => x.code === rulesData.store);
                    this.rules = rulesData
                    setTimeout(() => {
                        console.log(rulesData.store)
                        this.rules.store = rulesData.store
                    }, 3000);

                    this.rules.endDate = rulesData.endDate && new Date(rulesData.endDate)
                    this.rules.startDate = rulesData.startDate && new Date(rulesData.startDate)
                    this.query = rulesData.ruleSets[0];

                    // console.log(this.actionsData);\
                    let array1 = this.actionsData
                    var array3 = array1.filter(function (obj) {
                        return rulesData.actions.find((a) => {
                            if (a.value) {
                                obj.value = a.value
                                return a.code === obj.code
                            }
                        });
                    });
                    this.selectedActionsData = array3;
                }, error => {

                });

            // }, 3000);
        }
    }
    getStoreList() {
        this.storeService.getListOfMerchantStoreNames({ 'store': '' })
            .subscribe(res => {
                // console.log(res);
                res.forEach((store) => {
                    this.stores.push({ value: store.code, label: store.code });
                });
            });
    }
    onChangeCode(e) {
        this.sharedService.checkCode(e.target.value)
            .subscribe(res => {
                console.log(res);
                this.codeExits = true;
            }, error => {
                console.log(error);
                this.codeExits = false;
            });
    }
    getRulesCriterias() {
        let fields = {}
        this.sharedService.getRulesCriterias()
            .subscribe(data => {
                // console.log(data)
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
                // console.log(data);
                this.actionsData = data
            });
    }
    goToback() {
        this.router.navigate(['/pages/shipping/rules']);
    }
    onAddActions(actions) {
        console.log('onAddActions')
        console.log(actions)
        actions.value = ''
        this.selectedActionsData.push(actions)
    }
    onDeleteIcon(index) {
        this.selectedActionsData.splice(index, 1);
    }
    onSubmit() {
        this.loadingList = true;
        console.log(this.query)
        let actions = [];
        this.actionsData.map((value) => {
            actions.push({ code: value.code, value: value.value })
        });
        let querys = { condition: this.query.condition, rules: [] };
        this.query.rules.map((q) => {
            if (typeof q.value === 'string' || q.value instanceof String) {
                querys.rules.push({ field: q.field, operator: q.operator, value: [q.value] })
            } else {
                querys.rules.push({ field: q.field, operator: q.operator, value: q.value })
            }
        });
        let param = {
            "name": this.rules.name,
            "code": this.rules.code,
            "store": this.rules.store,
            "enabled": this.rules.enabled,
            "startDate": moment(this.rules.startDate).utc(),
            "endDate": moment(this.rules.endDate).utc(),
            "actions": actions,
            "ruleSets": [
                querys
            ]
        }
        console.log(param);
        if (this.buttonText === 'Submit') {
            this.sharedService.createShippingRules(param)
                .subscribe(data => {
                    console.log(data);
                    this.loadingList = false;
                    this.toastr.success('Rules has been added successfully');
                    this.goToback()
                }, error => {
                    this.toastr.error('Rules has been added fail.');
                    this.loadingList = false;
                });
        } else {
            this.sharedService.updateShippingRules(this.rules.id, param)
                .subscribe(data => {
                    console.log(data);
                    this.loadingList = false;
                    this.toastr.success('Rules has been updated successfully');
                    this.goToback()
                }, error => {
                    this.toastr.error('Rules has been updated fail.');
                    this.loadingList = false;
                });
        }
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
