import { Injectable } from '@angular/core';
import { ListState } from '../classes/lists/list-state';
  
@Injectable({
  providedIn: 'root'
})
export class ListingService {
  
  private state:ListState;
   
  constructor() {
      this.state = new ListState(false, false, '');
  }
  
  filterDetect(originparams: any, source: any, loadList, resetList: () => void)
  {
    if(source==null) {
        return;
    }

    if(source.filter==null) {
        return;
    }

    var params = this.filter(source);

    if(params === null) {
        return;
    }

    var filterValues = '';

    //if empty array and filer values reset list
    if (params.length != 0) {
    
      console.log('Parameters are ' + JSON.stringify(params));
      params.forEach(function (entry) {
        //console.log('Field ' + entry.field);
        //console.log('Value ' + entry.value);
        originparams[entry.field] = entry.value;
        originparams['page'] = 0;
        filterValues = filterValues + entry.value;
      });

      //preFilter
      if(this.state.filterString != filterValues) {
        this.state.filterChange = true; //block reload
        this.state.filterString = filterValues;
      }

      //console.log('Filter change A ? ' + this.state.filterChange);
      //filter
      if(this.state.filterChange) {
        //console.log('Filter search ' + JSON.stringify(params));
        //callback
        loadList(originparams);
        
        //reset filters
        this.state.filterChange = false;
        this.state.filterResetable = true;
        //console.log('Filter change B ? ' + this.filterChange);
      }

    } else { //nothing in filter

      //console.log('event ' + this.state.filterChange + ' ' + this.state.filterString);
      //reset
      this.state.filterString = '';
      //console.log('Parameters reset ' + JSON.stringify(this.params));
      //console.log('Filter change B ? ' + this.state.filterResetable);
      if(this.state.filterResetable) {
        //reset filters
        this.state.filterResetable = false;
        this.state.filterChange = false;
        //this.getList();//load with filters
        resetList();
      }
    }
  }

    /**
   * 
   * @param change returns parameters and values
   */
  private filter(change) {
    let filters = change.filter;
    
    if(filters != null) {
      let requestParam = null;
      let params = [];
      
      var self = this;

      if(filters.filters == null) {
          //console.log('Everything is null');
          return null;
      }
      //console.log(JSON.stringify(filters));

      filters.filters.forEach(function (filter) {

        if(!self.isNullOrWhiteSpace(filter.search)) {
          //console.log('---> name ' + filter.field);
          //console.log('---> value ' + filter.search);
          params.push({
            field: filter.field, 
            value:  filter.search
          });
        } 
      });

     return params;
    }
  }


  private isNullOrWhiteSpace(value) {
    return (!value || value.length === 0 || /^\s*$/.test(value)) 
  }

}