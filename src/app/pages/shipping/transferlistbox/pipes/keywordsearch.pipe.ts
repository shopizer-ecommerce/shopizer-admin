import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keywordsearch'
})
export class KeywordsearchPipe implements PipeTransform {

  public transform(value:any, key: string, term: string) {
    if(value==null){
      return;
    }
    return value.filter((item) => {
      if (item.value.hasOwnProperty(key)) {
        if (term) {
          let regExp = new RegExp('\\b' + term, 'gi');
          return regExp.test(item.value[key]);
        } else {
          return true;
        }
      } else {
        return false;
      }
    });
  }


}
