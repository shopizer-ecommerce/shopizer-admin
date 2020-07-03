/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as ACTIONS from './actions.action';
/** @type {?} */
const initialState = {
    path: '',
    isLoading: true,
    selectedNode: null
};
/**
 * @param {?=} state
 * @param {?=} action
 * @return {?}
 */
export function stateReducer(state = initialState, action) {
    // console.log('Previous state: ', state);
    // console.log('ACTION type: ', action.type);
    // console.log('ACTION payload: ', action.payload);
    switch (action.type) {
        case ACTIONS.SET_PATH:
            if (state.path === action.payload) {
                return state;
            }
            return Object.assign({}, state, { path: action.payload, isLoading: true });
        case ACTIONS.SET_LOADING_STATE:
            return Object.assign({}, state, { isLoading: action.payload });
        case ACTIONS.SET_SELECTED_NODE:
            return Object.assign({}, state, { selectedNode: action.payload });
        default:
            return initialState;
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVSZWR1Y2VyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmc2LWZpbGUtbWFuLyIsInNvdXJjZXMiOlsiZmlsZS1tYW5hZ2VyL3JlZHVjZXJzL3N0YXRlUmVkdWNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsT0FBTyxLQUFLLE9BQU8sTUFBTSxrQkFBa0IsQ0FBQzs7QUFFNUMsTUFBTSxZQUFZLEdBQW1CO0lBQ25DLElBQUksRUFBRSxFQUFFO0lBQ1IsU0FBUyxFQUFFLElBQUk7SUFDZixZQUFZLEVBQUUsSUFBSTtDQUNuQixDQUFDOzs7Ozs7QUFFRixNQUFNLHVCQUF1QixRQUF3QixZQUFZLEVBQUUsTUFBdUI7Ozs7SUFLeEYsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEIsS0FBSyxPQUFPLENBQUMsUUFBUTtZQUNuQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxNQUFNLENBQUMsS0FBSyxDQUFDO2FBQ2Q7WUFDRCxNQUFNLG1CQUFLLEtBQUssSUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxJQUFFO1FBQzNELEtBQUssT0FBTyxDQUFDLGlCQUFpQjtZQUM1QixNQUFNLG1CQUFLLEtBQUssSUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLE9BQU8sSUFBRTtRQUMvQyxLQUFLLE9BQU8sQ0FBQyxpQkFBaUI7WUFDNUIsTUFBTSxtQkFBSyxLQUFLLElBQUUsWUFBWSxFQUFFLE1BQU0sQ0FBQyxPQUFPLElBQUU7UUFDbEQ7WUFDRSxNQUFNLENBQUMsWUFBWSxDQUFDO0tBQ3ZCO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1N0YXRlSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL3N0YXRlLmludGVyZmFjZSc7XHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi9hY3Rpb25zLmFjdGlvbic7XHJcblxyXG5jb25zdCBpbml0aWFsU3RhdGU6IFN0YXRlSW50ZXJmYWNlID0ge1xyXG4gIHBhdGg6ICcnLFxyXG4gIGlzTG9hZGluZzogdHJ1ZSxcclxuICBzZWxlY3RlZE5vZGU6IG51bGxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdGF0ZVJlZHVjZXIoc3RhdGU6IFN0YXRlSW50ZXJmYWNlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb246IEFDVElPTlMuQWN0aW9ucyk6IFN0YXRlSW50ZXJmYWNlIHtcclxuICAvLyBjb25zb2xlLmxvZygnUHJldmlvdXMgc3RhdGU6ICcsIHN0YXRlKTtcclxuICAvLyBjb25zb2xlLmxvZygnQUNUSU9OIHR5cGU6ICcsIGFjdGlvbi50eXBlKTtcclxuICAvLyBjb25zb2xlLmxvZygnQUNUSU9OIHBheWxvYWQ6ICcsIGFjdGlvbi5wYXlsb2FkKTtcclxuXHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSBBQ1RJT05TLlNFVF9QQVRIIDpcclxuICAgICAgaWYgKHN0YXRlLnBhdGggPT09IGFjdGlvbi5wYXlsb2FkKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUsIHBhdGg6IGFjdGlvbi5wYXlsb2FkLCBpc0xvYWRpbmc6IHRydWV9O1xyXG4gICAgY2FzZSBBQ1RJT05TLlNFVF9MT0FESU5HX1NUQVRFIDpcclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgaXNMb2FkaW5nOiBhY3Rpb24ucGF5bG9hZH07XHJcbiAgICBjYXNlIEFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUgOlxyXG4gICAgICByZXR1cm4gey4uLnN0YXRlLCBzZWxlY3RlZE5vZGU6IGFjdGlvbi5wYXlsb2FkfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBpbml0aWFsU3RhdGU7XHJcbiAgfVxyXG59XHJcbiJdfQ==