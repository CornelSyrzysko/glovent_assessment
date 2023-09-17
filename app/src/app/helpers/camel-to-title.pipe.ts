import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelToTitle'
})
export class CamelToTitlePipe implements PipeTransform {
  // pipe to change any camel case text to title case
  transform(value: string): string {
    const result = value.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult
  }

}
