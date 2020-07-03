/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Pipe } from '@angular/core';
var FileSizePipe = /** @class */ (function () {
    function FileSizePipe() {
        this.units = [
            'bytes',
            'KB',
            'MB',
            'GB',
            'TB',
            'PB'
        ];
    }
    /**
     * @param {?=} bytes
     * @param {?=} precision
     * @return {?}
     */
    FileSizePipe.prototype.transform = /**
     * @param {?=} bytes
     * @param {?=} precision
     * @return {?}
     */
    function (bytes, precision) {
        if (bytes === void 0) { bytes = 0; }
        if (precision === void 0) { precision = 2; }
        if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes))
            return '?';
        /** @type {?} */
        var unit = 0;
        while (bytes >= 1024) {
            bytes /= 1024;
            unit++;
        }
        return bytes.toFixed(+precision) + ' ' + this.units[unit];
    };
    FileSizePipe.decorators = [
        { type: Pipe, args: [{ name: 'fileSize' },] },
    ];
    return FileSizePipe;
}());
export { FileSizePipe };
if (false) {
    /** @type {?} */
    FileSizePipe.prototype.units;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1zaXplLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvcGlwZXMvZmlsZS1zaXplLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDOzs7cUJBY2xDO1lBQ2QsT0FBTztZQUNQLElBQUk7WUFDSixJQUFJO1lBQ0osSUFBSTtZQUNKLElBQUk7WUFDSixJQUFJO1NBQ0w7Ozs7Ozs7SUFFRCxnQ0FBUzs7Ozs7SUFBVCxVQUFVLEtBQWlCLEVBQUUsU0FBcUI7UUFBeEMsc0JBQUEsRUFBQSxTQUFpQjtRQUFFLDBCQUFBLEVBQUEsYUFBcUI7UUFDaEQsRUFBRSxDQUFDLENBQUUsS0FBSyxDQUFFLFVBQVUsQ0FBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUUsQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFFLEtBQUssQ0FBRyxDQUFDO1lBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQzs7UUFFN0UsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBRWIsT0FBUSxLQUFLLElBQUksSUFBSSxFQUFHLENBQUM7WUFDdkIsS0FBSyxJQUFJLElBQUksQ0FBQztZQUNkLElBQUksRUFBRyxDQUFDO1NBQ1Q7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxDQUFFLFNBQVMsQ0FBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFFLElBQUksQ0FBRSxDQUFDO0tBQ2hFOztnQkF2QkYsSUFBSSxTQUFDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBQzs7dUJBWHhCOztTQVlhLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qXG4gKiBDb252ZXJ0IGJ5dGVzIGludG8gbGFyZ2VzdCBwb3NzaWJsZSB1bml0LlxuICogVGFrZXMgYW4gcHJlY2lzaW9uIGFyZ3VtZW50IHRoYXQgZGVmYXVsdHMgdG8gMi5cbiAqIFVzYWdlOlxuICogICBieXRlcyB8IGZpbGVTaXplOnByZWNpc2lvblxuICogRXhhbXBsZTpcbiAqICAge3sgMTAyNCB8ICBmaWxlU2l6ZX19XG4gKiAgIGZvcm1hdHMgdG86IDEgS0JcbiovXG5AUGlwZSh7bmFtZTogJ2ZpbGVTaXplJ30pXG5leHBvcnQgY2xhc3MgRmlsZVNpemVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgcHJpdmF0ZSB1bml0cyA9IFtcbiAgICAnYnl0ZXMnLFxuICAgICdLQicsXG4gICAgJ01CJyxcbiAgICAnR0InLFxuICAgICdUQicsXG4gICAgJ1BCJ1xuICBdO1xuXG4gIHRyYW5zZm9ybShieXRlczogbnVtYmVyID0gMCwgcHJlY2lzaW9uOiBudW1iZXIgPSAyICkgOiBzdHJpbmcge1xuICAgIGlmICggaXNOYU4oIHBhcnNlRmxvYXQoIFN0cmluZyhieXRlcykgKSkgfHwgISBpc0Zpbml0ZSggYnl0ZXMgKSApIHJldHVybiAnPyc7XG5cbiAgICBsZXQgdW5pdCA9IDA7XG5cbiAgICB3aGlsZSAoIGJ5dGVzID49IDEwMjQgKSB7XG4gICAgICBieXRlcyAvPSAxMDI0O1xuICAgICAgdW5pdCArKztcbiAgICB9XG5cbiAgICByZXR1cm4gYnl0ZXMudG9GaXhlZCggKyBwcmVjaXNpb24gKSArICcgJyArIHRoaXMudW5pdHNbIHVuaXQgXTtcbiAgfVxufVxuIl19