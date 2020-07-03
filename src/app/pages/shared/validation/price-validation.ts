import { CurrencyPipe } from '@angular/common';

export function formatMoney(value) {
  const temp = `${value}`.replace(/\,/g, '');
  return new CurrencyPipe('en').transform(temp).replace('$', '');
}
