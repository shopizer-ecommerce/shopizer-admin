/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import * as ACTIONS from './actions.action';
/** @type {?} */
var initialState = {
    path: '',
    isLoading: true,
    selectedNode: null
};
/**
 * @param {?=} state
 * @param {?=} action
 * @return {?}
 */
export function stateReducer(state, action) {
    if (state === void 0) { state = initialState; }
    // console.log('Previous state: ', state);
    // console.log('ACTION type: ', action.type);
    // console.log('ACTION payload: ', action.payload);
    switch (action.type) {
        case ACTIONS.SET_PATH:
            if (state.path === action.payload) {
                return state;
            }
            return tslib_1.__assign({}, state, { path: action.payload, isLoading: true });
        case ACTIONS.SET_LOADING_STATE:
            return tslib_1.__assign({}, state, { isLoading: action.payload });
        case ACTIONS.SET_SELECTED_NODE:
            return tslib_1.__assign({}, state, { selectedNode: action.payload });
        default:
            return initialState;
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVSZWR1Y2VyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmc2LWZpbGUtbWFuLyIsInNvdXJjZXMiOlsiZmlsZS1tYW5hZ2VyL3JlZHVjZXJzL3N0YXRlUmVkdWNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLE9BQU8sS0FBSyxPQUFPLE1BQU0sa0JBQWtCLENBQUM7O0FBRTVDLElBQU0sWUFBWSxHQUFtQjtJQUNuQyxJQUFJLEVBQUUsRUFBRTtJQUNSLFNBQVMsRUFBRSxJQUFJO0lBQ2YsWUFBWSxFQUFFLElBQUk7Q0FDbkIsQ0FBQzs7Ozs7O0FBRUYsTUFBTSx1QkFBdUIsS0FBb0MsRUFBRSxNQUF1QjtJQUE3RCxzQkFBQSxFQUFBLG9CQUFvQzs7OztJQUsvRCxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNwQixLQUFLLE9BQU8sQ0FBQyxRQUFRO1lBQ25CLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDZDtZQUNELE1BQU0sc0JBQUssS0FBSyxJQUFFLElBQUksRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLElBQUU7UUFDM0QsS0FBSyxPQUFPLENBQUMsaUJBQWlCO1lBQzVCLE1BQU0sc0JBQUssS0FBSyxJQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsT0FBTyxJQUFFO1FBQy9DLEtBQUssT0FBTyxDQUFDLGlCQUFpQjtZQUM1QixNQUFNLHNCQUFLLEtBQUssSUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFDLE9BQU8sSUFBRTtRQUNsRDtZQUNFLE1BQU0sQ0FBQyxZQUFZLENBQUM7S0FDdkI7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7U3RhdGVJbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvc3RhdGUuaW50ZXJmYWNlJztcclxuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuL2FjdGlvbnMuYWN0aW9uJztcclxuXHJcbmNvbnN0IGluaXRpYWxTdGF0ZTogU3RhdGVJbnRlcmZhY2UgPSB7XHJcbiAgcGF0aDogJycsXHJcbiAgaXNMb2FkaW5nOiB0cnVlLFxyXG4gIHNlbGVjdGVkTm9kZTogbnVsbFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN0YXRlUmVkdWNlcihzdGF0ZTogU3RhdGVJbnRlcmZhY2UgPSBpbml0aWFsU3RhdGUsIGFjdGlvbjogQUNUSU9OUy5BY3Rpb25zKTogU3RhdGVJbnRlcmZhY2Uge1xyXG4gIC8vIGNvbnNvbGUubG9nKCdQcmV2aW91cyBzdGF0ZTogJywgc3RhdGUpO1xyXG4gIC8vIGNvbnNvbGUubG9nKCdBQ1RJT04gdHlwZTogJywgYWN0aW9uLnR5cGUpO1xyXG4gIC8vIGNvbnNvbGUubG9nKCdBQ1RJT04gcGF5bG9hZDogJywgYWN0aW9uLnBheWxvYWQpO1xyXG5cclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIEFDVElPTlMuU0VUX1BBVEggOlxyXG4gICAgICBpZiAoc3RhdGUucGF0aCA9PT0gYWN0aW9uLnBheWxvYWQpIHtcclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgcGF0aDogYWN0aW9uLnBheWxvYWQsIGlzTG9hZGluZzogdHJ1ZX07XHJcbiAgICBjYXNlIEFDVElPTlMuU0VUX0xPQURJTkdfU1RBVEUgOlxyXG4gICAgICByZXR1cm4gey4uLnN0YXRlLCBpc0xvYWRpbmc6IGFjdGlvbi5wYXlsb2FkfTtcclxuICAgIGNhc2UgQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSA6XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUsIHNlbGVjdGVkTm9kZTogYWN0aW9uLnBheWxvYWR9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIGluaXRpYWxTdGF0ZTtcclxuICB9XHJcbn1cclxuIl19