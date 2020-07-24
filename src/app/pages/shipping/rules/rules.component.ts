import { Component, OnInit } from '@angular/core';
import { QueryBuilderConfig } from 'angular2-query-builder';

import { SharedService } from '../services/shared.service';
import { error } from '@angular/compiler/src/util';
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
    config: QueryBuilderConfig;
    rules_time: boolean = false;
    loadingList: boolean = false
    shippingResult: Array<any> = [];
    selectedResult: any;
    selected_result: any;
    constructor(
        private sharedService: SharedService
    ) {
        this.getShippingCondition()
    }
    ngOnInit() {

    }
    getShippingCondition() {
        this.loadingList = true;
        let fields = {}
        this.sharedService.getRulesCondition()
            .subscribe(data => {
                // console.log(data)

                data.map((value) => {
                    fields[value.code] = {
                        "name": value.name,
                        "type": value.options.length > 0 ? 'category' : value.format == 'DECIMAL' || value.format == 'NUMERIC' ? 'number' : value.format.toLowerCase(),
                        "operators": value.operators,
                        "options": []
                    }
                    value.options.map((opt) => {
                        fields[value.code].options.push({ name: opt.name, value: opt.value })
                    })

                });
                // config: QueryBuilderConfig = { fields: {} }
                // console.log(fields);
                this.config = { fields };
                this.loadingList = false;

                // this.source.load(data);
            }, error => {
                this.loadingList = false;
            });
        this.getShippingResult();
    }
    getShippingResult() {

        this.sharedService.getRulesResult()
            .subscribe(data => {
                // console.log(data);
                this.shippingResult = data;
            }, error => {

            });
    }
    onClickConfigure() {
        // console.log(this.selected_result);
        this.selectedResult = this.selected_result
    }
}
