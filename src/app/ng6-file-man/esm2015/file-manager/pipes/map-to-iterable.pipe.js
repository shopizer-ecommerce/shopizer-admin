/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Pipe } from '@angular/core';
export class MapToIterablePipe {
    /**
     * @param {?} dict
     * @return {?}
     */
    transform(dict) {
        /** @type {?} */
        const a = [];
        for (const key in dict) {
            if (dict.hasOwnProperty(key)) {
                a.push({ key: key, val: dict[key] });
            }
        }
        return a;
    }
}
MapToIterablePipe.decorators = [
    { type: Pipe, args: [{
                name: 'mapToIterablePipe'
            },] },
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXRvLWl0ZXJhYmxlLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvcGlwZXMvbWFwLXRvLWl0ZXJhYmxlLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxJQUFJLEVBQWdCLE1BQU0sZUFBZSxDQUFDO0FBS2xELE1BQU07Ozs7O0lBQ0osU0FBUyxDQUFDLElBQVk7O1FBQ3BCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNiLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxDQUFDO2FBQ3BDO1NBQ0Y7UUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQ1Y7OztZQWJGLElBQUksU0FBQztnQkFDSixJQUFJLEVBQUUsbUJBQW1CO2FBQzFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtQaXBlLCBQaXBlVHJhbnNmb3JtfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQFBpcGUoe1xuICBuYW1lOiAnbWFwVG9JdGVyYWJsZVBpcGUnXG59KVxuZXhwb3J0IGNsYXNzIE1hcFRvSXRlcmFibGVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG4gIHRyYW5zZm9ybShkaWN0OiBPYmplY3QpIHtcbiAgICBjb25zdCBhID0gW107XG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGljdCkge1xuICAgICAgaWYgKGRpY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBhLnB1c2goe2tleToga2V5LCB2YWw6IGRpY3Rba2V5XX0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhO1xuICB9XG59XG4iXX0=