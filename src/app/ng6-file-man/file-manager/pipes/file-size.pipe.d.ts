import { PipeTransform } from '@angular/core';
export declare class FileSizePipe implements PipeTransform {
    private units;
    transform(bytes?: number, precision?: number): string;
}
