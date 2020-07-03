import { Component, OnInit } from '@angular/core';
import { QueryBuilderConfig } from 'angular2-query-builder';

@Component({
    selector: 'ngx-promotion',
    templateUrl: './promotion.component.html',
    styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {
    query = {
        condition: 'and',
        rules: [
            { field: 'shippingDistance', operator: '=', value: '10' },
            // { field: 'totalWeight', operator: '>', value: '50' }
        ]
    };
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    config: QueryBuilderConfig = {
        fields: {
            shippingDistance: {
                "name": "Shipping distance",
                "operators": ["=", ">"],
                "type": "string"
            },
            totalWeight: {
                name: 'Total weight	of order',
                type: 'string',
                operators: [">"],
            },
            birthday: {
                name: 'Birthday', type: 'date', operators: ['=', '<=', '>'], defaultValue: (() => new Date())
            }
        }
    }
    constructor() {}
    ngOnInit() {
    }
}
