import {CHANGE_VISIBILITY, VisibilityActionTypes, VisibilityFilter} from "./types";

export function changeVisibility(filter: VisibilityFilter): VisibilityActionTypes {
    return {
        type: CHANGE_VISIBILITY,
        payload: filter
    }
}