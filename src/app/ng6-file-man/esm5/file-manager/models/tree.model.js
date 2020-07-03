/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var TreeModel = /** @class */ (function () {
    function TreeModel(config) {
        // this._currentPath = config.startingFolder; // todo implement (config.interfce.ts)
        this._currentPath = '';
        this.config = config;
        this.nodes = /** @type {?} */ ({
            id: 0,
            pathToNode: '',
            pathToParent: null,
            isFolder: true,
            isExpanded: true,
            stayOpen: true,
            name: 'root',
            children: {}
        });
    }
    Object.defineProperty(TreeModel.prototype, "currentPath", {
        get: /**
         * @return {?}
         */
        function () {
            return this._currentPath;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._currentPath = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeModel.prototype, "nodes", {
        get: /**
         * @return {?}
         */
        function () {
            return this._nodes;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._nodes = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeModel.prototype, "selectedNodeId", {
        get: /**
         * @return {?}
         */
        function () {
            return this._selectedNodeId;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._selectedNodeId = value;
        },
        enumerable: true,
        configurable: true
    });
    return TreeModel;
}());
export { TreeModel };
if (false) {
    /** @type {?} */
    TreeModel.prototype._currentPath;
    /** @type {?} */
    TreeModel.prototype._nodes;
    /** @type {?} */
    TreeModel.prototype._selectedNodeId;
    /** @type {?} */
    TreeModel.prototype.config;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nNi1maWxlLW1hbi8iLCJzb3VyY2VzIjpbImZpbGUtbWFuYWdlci9tb2RlbHMvdHJlZS5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBR0EsSUFBQTtJQU1FLG1CQUFZLE1BQXVCOztRQUVqQyxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixJQUFJLENBQUMsS0FBSyxxQkFBa0I7WUFDMUIsRUFBRSxFQUFFLENBQUM7WUFDTCxVQUFVLEVBQUUsRUFBRTtZQUNkLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFFBQVEsRUFBRSxJQUFJO1lBQ2QsVUFBVSxFQUFFLElBQUk7WUFDaEIsUUFBUSxFQUFFLElBQUk7WUFDZCxJQUFJLEVBQUUsTUFBTTtZQUNaLFFBQVEsRUFBRSxFQUFFO1NBQ2IsQ0FBQSxDQUFDO0tBQ0g7SUFFRCxzQkFBSSxrQ0FBVzs7OztRQUFmO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7U0FDMUI7Ozs7O1FBRUQsVUFBZ0IsS0FBYTtZQUMzQixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztTQUMzQjs7O09BSkE7SUFNRCxzQkFBSSw0QkFBSzs7OztRQUFUO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDcEI7Ozs7O1FBRUQsVUFBVSxLQUFvQjtZQUM1QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztTQUNyQjs7O09BSkE7SUFNRCxzQkFBSSxxQ0FBYzs7OztRQUFsQjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO1NBQzdCOzs7OztRQUVELFVBQW1CLEtBQWE7WUFDOUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7U0FDOUI7OztPQUpBO29CQTVDSDtJQTBEQyxDQUFBO0FBdkRELHFCQXVEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7Q29uZmlnSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL2NvbmZpZy5pbnRlcmZhY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyZWVNb2RlbCB7XHJcbiAgcHJpdmF0ZSBfY3VycmVudFBhdGg6IHN0cmluZztcclxuICBwcml2YXRlIF9ub2RlczogTm9kZUludGVyZmFjZTtcclxuICBwcml2YXRlIF9zZWxlY3RlZE5vZGVJZDogc3RyaW5nO1xyXG4gIHB1YmxpYyBjb25maWc6IENvbmZpZ0ludGVyZmFjZTtcclxuXHJcbiAgY29uc3RydWN0b3IoY29uZmlnOiBDb25maWdJbnRlcmZhY2UpIHtcclxuICAgIC8vIHRoaXMuX2N1cnJlbnRQYXRoID0gY29uZmlnLnN0YXJ0aW5nRm9sZGVyOyAvLyB0b2RvIGltcGxlbWVudCAoY29uZmlnLmludGVyZmNlLnRzKVxyXG4gICAgdGhpcy5fY3VycmVudFBhdGggPSAnJztcclxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG5cclxuICAgIHRoaXMubm9kZXMgPSA8Tm9kZUludGVyZmFjZT57XHJcbiAgICAgIGlkOiAwLFxyXG4gICAgICBwYXRoVG9Ob2RlOiAnJyxcclxuICAgICAgcGF0aFRvUGFyZW50OiBudWxsLFxyXG4gICAgICBpc0ZvbGRlcjogdHJ1ZSxcclxuICAgICAgaXNFeHBhbmRlZDogdHJ1ZSxcclxuICAgICAgc3RheU9wZW46IHRydWUsXHJcbiAgICAgIG5hbWU6ICdyb290JyxcclxuICAgICAgY2hpbGRyZW46IHt9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2V0IGN1cnJlbnRQYXRoKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFBhdGg7XHJcbiAgfVxyXG5cclxuICBzZXQgY3VycmVudFBhdGgodmFsdWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5fY3VycmVudFBhdGggPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGdldCBub2RlcygpOiBOb2RlSW50ZXJmYWNlIHtcclxuICAgIHJldHVybiB0aGlzLl9ub2RlcztcclxuICB9XHJcblxyXG4gIHNldCBub2Rlcyh2YWx1ZTogTm9kZUludGVyZmFjZSkge1xyXG4gICAgdGhpcy5fbm9kZXMgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGdldCBzZWxlY3RlZE5vZGVJZCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkTm9kZUlkO1xyXG4gIH1cclxuXHJcbiAgc2V0IHNlbGVjdGVkTm9kZUlkKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuX3NlbGVjdGVkTm9kZUlkID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICAvLyB0b2RvIGltcGxlbWVudCAoY29uZmlnLmludGVyZmNlLnRzKVxyXG4gIC8vIGdldCBpc0NhY2hlKCk6IGJvb2xlYW4ge1xyXG4gIC8vICAgcmV0dXJuIHRoaXMuY29uZmlnLm9mZmxpbmVNb2RlO1xyXG4gIC8vIH1cclxuICAvL1xyXG4gIC8vIHNldCBpc0NhY2hlKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgLy8gICB0aGlzLmNvbmZpZy5vZmZsaW5lTW9kZSA9IHZhbHVlO1xyXG4gIC8vIH1cclxufVxyXG4iXX0=