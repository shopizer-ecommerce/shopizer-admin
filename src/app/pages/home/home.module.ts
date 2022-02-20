import { NgModule } from '@angular/core';

//import { NgxEchartsModule } from 'ngx-echarts';
//import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

/** orders - carts - transactions */
/**
import { ECommerceLegendChartComponent } from '../shared/wigets/e-commerce/legend-chart/legend-chart.component';


import { ECommerceChartsPanelComponent } from '../shared/wigets/e-commerce/charts-panel/charts-panel.component';
import { OrdersChartComponent } from '../shared/wigets/e-commerce/charts-panel/charts/orders-chart.component';
import { ProfitChartComponent } from '../shared/wigets/e-commerce/charts-panel/charts/profit-chart.component';
import { ChartPanelHeaderComponent } from '../shared/wigets/e-commerce/charts-panel/chart-panel-header/chart-panel-header.component';
import { ChartPanelSummaryComponent } from '../shared/wigets/e-commerce/charts-panel/chart-panel-summary/chart-panel-summary.component';
**/
/** price chart */

/**
import { ProfitCardComponent } from '../shared/wigets/e-commerce/profit-card/profit-card.component';
import { StatsCardFrontComponent } from '../shared/wigets/e-commerce/profit-card/front-side/stats-card-front.component';
import { StatsCardBackComponent } from '../shared/wigets/e-commerce/profit-card/back-side/stats-card-back.component';
import { StatsBarAnimationChartComponent } from '../shared/wigets/e-commerce/profit-card/front-side/stats-bar-animation-chart.component';
import { StatsAreaChartComponent } from '../shared/wigets/e-commerce/profit-card/back-side/stats-area-chart.component';
**/


/** traffic list */

/**
import { TrafficRevealCardComponent } from '../shared/wigets/e-commerce/traffic-reveal-card/traffic-reveal-card.component';
import { TrafficBarComponent } from '../shared/wigets/e-commerce/traffic-reveal-card/front-side/traffic-bar/traffic-bar.component';
import { TrafficFrontCardComponent } from '../shared/wigets/e-commerce/traffic-reveal-card/front-side/traffic-front-card.component';
import { TrafficCardsHeaderComponent } from '../shared/wigets/e-commerce/traffic-reveal-card/traffic-cards-header/traffic-cards-header.component';
import { TrafficBackCardComponent } from '../shared/wigets/e-commerce/traffic-reveal-card/back-side/traffic-back-card.component';
import { TrafficBarChartComponent } from '../shared/wigets/e-commerce/traffic-reveal-card/back-side/traffic-bar-chart.component';
**/

import {
  NbButtonModule,
  NbCardModule,
  NbProgressBarModule,
  NbTabsetModule,
  NbUserModule,
  NbIconModule,
  NbSelectModule,
  NbListModule,
} from '@nebular/theme';

@NgModule({
  declarations: [
    HomeComponent
    /**
    ProfitCardComponent,
    ECommerceLegendChartComponent,
    OrdersChartComponent,
    ProfitChartComponent,    
    StatsCardFrontComponent,
    StatsCardBackComponent,
    StatsBarAnimationChartComponent,
    StatsAreaChartComponent,
    TrafficRevealCardComponent,
    TrafficBarChartComponent,
    TrafficFrontCardComponent,
    TrafficBackCardComponent,
    TrafficBarComponent,
    TrafficCardsHeaderComponent,
    ECommerceChartsPanelComponent,
    ChartPanelHeaderComponent,
    ChartPanelSummaryComponent
    **/

  ],
  imports: [
    SharedModule,
    ChartModule,
    //NgxEchartsModule,
    //NgxChartsModule,
    HomeRoutingModule,
    NbButtonModule,
    NbCardModule,
    NbProgressBarModule,
    NbTabsetModule,
    NbUserModule,
    NbIconModule,
    NbSelectModule,
    NbListModule
  ]
})
export class HomeModule { }
