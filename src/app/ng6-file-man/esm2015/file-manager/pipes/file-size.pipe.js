/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Pipe } from '@angular/core';
export class FileSizePipe {
    constructor() {
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
    transform(bytes = 0, precision = 2) {
        if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes))
            return '?';
        /** @type {?} */
        let unit = 0;
        while (bytes >= 1024) {
            bytes /= 1024;
            unit++;
        }
        return bytes.toFixed(+precision) + ' ' + this.units[unit];
    }
}
FileSizePipe.decorators = [
    { type: Pipe, args: [{ name: 'fileSize' },] },
];
if (false) {
    /** @type {?} */
    FileSizePipe.prototype.units;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1zaXplLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvcGlwZXMvZmlsZS1zaXplLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBWXBELE1BQU07O3FCQUVZO1lBQ2QsT0FBTztZQUNQLElBQUk7WUFDSixJQUFJO1lBQ0osSUFBSTtZQUNKLElBQUk7WUFDSixJQUFJO1NBQ0w7Ozs7Ozs7SUFFRCxTQUFTLENBQUMsUUFBZ0IsQ0FBQyxFQUFFLFlBQW9CLENBQUM7UUFDaEQsRUFBRSxDQUFDLENBQUUsS0FBSyxDQUFFLFVBQVUsQ0FBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUUsQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFFLEtBQUssQ0FBRyxDQUFDO1lBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQzs7UUFFN0UsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBRWIsT0FBUSxLQUFLLElBQUksSUFBSSxFQUFHLENBQUM7WUFDdkIsS0FBSyxJQUFJLElBQUksQ0FBQztZQUNkLElBQUksRUFBRyxDQUFDO1NBQ1Q7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxDQUFFLFNBQVMsQ0FBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFFLElBQUksQ0FBRSxDQUFDO0tBQ2hFOzs7WUF2QkYsSUFBSSxTQUFDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLypcbiAqIENvbnZlcnQgYnl0ZXMgaW50byBsYXJnZXN0IHBvc3NpYmxlIHVuaXQuXG4gKiBUYWtlcyBhbiBwcmVjaXNpb24gYXJndW1lbnQgdGhhdCBkZWZhdWx0cyB0byAyLlxuICogVXNhZ2U6XG4gKiAgIGJ5dGVzIHwgZmlsZVNpemU6cHJlY2lzaW9uXG4gKiBFeGFtcGxlOlxuICogICB7eyAxMDI0IHwgIGZpbGVTaXplfX1cbiAqICAgZm9ybWF0cyB0bzogMSBLQlxuKi9cbkBQaXBlKHtuYW1lOiAnZmlsZVNpemUnfSlcbmV4cG9ydCBjbGFzcyBGaWxlU2l6ZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICBwcml2YXRlIHVuaXRzID0gW1xuICAgICdieXRlcycsXG4gICAgJ0tCJyxcbiAgICAnTUInLFxuICAgICdHQicsXG4gICAgJ1RCJyxcbiAgICAnUEInXG4gIF07XG5cbiAgdHJhbnNmb3JtKGJ5dGVzOiBudW1iZXIgPSAwLCBwcmVjaXNpb246IG51bWJlciA9IDIgKSA6IHN0cmluZyB7XG4gICAgaWYgKCBpc05hTiggcGFyc2VGbG9hdCggU3RyaW5nKGJ5dGVzKSApKSB8fCAhIGlzRmluaXRlKCBieXRlcyApICkgcmV0dXJuICc/JztcblxuICAgIGxldCB1bml0ID0gMDtcblxuICAgIHdoaWxlICggYnl0ZXMgPj0gMTAyNCApIHtcbiAgICAgIGJ5dGVzIC89IDEwMjQ7XG4gICAgICB1bml0ICsrO1xuICAgIH1cblxuICAgIHJldHVybiBieXRlcy50b0ZpeGVkKCArIHByZWNpc2lvbiApICsgJyAnICsgdGhpcy51bml0c1sgdW5pdCBdO1xuICB9XG59XG4iXX0=