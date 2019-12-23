export enum VisibilityFilter {
    All,
    Active,
    Completed
}

export interface TodoVisibilityState {
    filter: VisibilityFilter
} 

export const CHANGE_VISIBILITY = 'CHANGE_VISIBILITY';

interface ChangeVisibilityAction {
    type: typeof CHANGE_VISIBILITY
    payload: VisibilityFilter
}

export type VisibilityActionTypes = ChangeVisibilityAction;