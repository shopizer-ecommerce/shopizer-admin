import { Component, OnInit } from '@angular/core';
import { QueryBuilderConfig } from 'angular2-query-builder';

import { SharedService } from '../services/shared.service';
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
    config: QueryBuilderConfig = {
        fields: {
            shippingCountry: {
                "name": "Delivery country",
                "type": "category",
                "operators": ["=", "in"],
                "options": [{
                    "name": "Canada",
                    "value": "CA"
                }, {
                    "name": "United states",
                    "value": "US"
                }]
            },
            shippingProvince: {
                "name": "Delivery province",
                "type": "string",
                "operators": ["in"],
                "options": []
            },
            categoryCode: {
                "name": "Order contains category code",
                "type": "string",
                "operators": ["in", "not"],
                "options": []
            },
            sku: {
                "name": "Order contains category code",
                "type": "string",
                "operators": ["in", "not"],
                "defaultValue": "ABCXYZ100",
                "options": []
            },
            orderTotal: {
                "name": "Order total",
                "type": "number",
                "operators": ["=", ">=", ">"],
                "options": []
            },
            quantity: {
                "name": "Quantity of items in order",
                "type": "number",
                "operators": ["=", ">=", ">"],
                "options": []
            },
            shippingDistance: {
                "name": "Shipping distance",
                "type": "number",
                "operators": ["=", ">=", ">"],
                "options": []
            }
        }
    }
    loadingList: boolean = false


    constructor(
        private sharedService: SharedService
    ) {
        this.getShippingCondition()
    }
    ngOnInit() {

    }
    getShippingCondition() {
        this.loadingList = true;
        this.sharedService.getRulesCondition()
            .subscribe(data => {
                console.log(data)
                this.loadingList = false;

                // this.source.load(data);
            }, error => {
                this.loadingList = false;
            });
    }
}
