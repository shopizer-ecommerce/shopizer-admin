/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Pipe } from '@angular/core';
var MapToIterablePipe = /** @class */ (function () {
    function MapToIterablePipe() {
    }
    /**
     * @param {?} dict
     * @return {?}
     */
    MapToIterablePipe.prototype.transform = /**
     * @param {?} dict
     * @return {?}
     */
    function (dict) {
        /** @type {?} */
        var a = [];
        for (var key in dict) {
            if (dict.hasOwnProperty(key)) {
                a.push({ key: key, val: dict[key] });
            }
        }
        return a;
    };
    MapToIterablePipe.decorators = [
        { type: Pipe, args: [{
                    name: 'mapToIterablePipe'
                },] },
    ];
    return MapToIterablePipe;
}());
export { MapToIterablePipe };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLXRvLWl0ZXJhYmxlLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzYtZmlsZS1tYW4vIiwic291cmNlcyI6WyJmaWxlLW1hbmFnZXIvcGlwZXMvbWFwLXRvLWl0ZXJhYmxlLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxJQUFJLEVBQWdCLE1BQU0sZUFBZSxDQUFDOzs7Ozs7OztJQU1oRCxxQ0FBUzs7OztJQUFULFVBQVUsSUFBWTs7UUFDcEIsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2IsR0FBRyxDQUFDLENBQUMsSUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN2QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUM7YUFDcEM7U0FDRjtRQUVELE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDVjs7Z0JBYkYsSUFBSSxTQUFDO29CQUNKLElBQUksRUFBRSxtQkFBbUI7aUJBQzFCOzs0QkFKRDs7U0FLYSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1BpcGUsIFBpcGVUcmFuc2Zvcm19IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AUGlwZSh7XG4gIG5hbWU6ICdtYXBUb0l0ZXJhYmxlUGlwZSdcbn0pXG5leHBvcnQgY2xhc3MgTWFwVG9JdGVyYWJsZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgdHJhbnNmb3JtKGRpY3Q6IE9iamVjdCkge1xuICAgIGNvbnN0IGEgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBkaWN0KSB7XG4gICAgICBpZiAoZGljdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGEucHVzaCh7a2V5OiBrZXksIHZhbDogZGljdFtrZXldfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGE7XG4gIH1cbn1cbiJdfQ==