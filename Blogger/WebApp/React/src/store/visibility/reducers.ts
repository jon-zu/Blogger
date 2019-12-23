import {TodoVisibilityState, VisibilityActionTypes, VisibilityFilter} from "./types";

const initialState: TodoVisibilityState = {
    filter: VisibilityFilter.All
};

export function visibilityReducer(
    state = initialState,
    action: VisibilityActionTypes
): TodoVisibilityState {
    switch (action.type) {
        case "CHANGE_VISIBILITY":
            return  {
                filter: action.payload
            };
        default:
            return state
    }
}