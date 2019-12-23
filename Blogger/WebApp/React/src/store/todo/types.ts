export interface Todo {
    id: number,
    completed: boolean,
    text: string
}

export interface TodoState {
    todos: Todo[],
    nextId: number
}

export const ADD_TODO = 'ADD_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const CHANGE_TODO = 'CHANGE_TODO';

interface AddTodoAction {
    type: typeof ADD_TODO
    payload: string
}

interface DeleteTodoAction {
    type: typeof DELETE_TODO
    meta: {
        id: number
    }
}

interface ToggleTodoAction {
    type: typeof TOGGLE_TODO
    meta: {
        id: number
    }
}

interface ChangeTodoAction {
    type: typeof CHANGE_TODO
    meta: {
        id: number
        text: string
    }
}

export type TodoActionTypes = AddTodoAction | DeleteTodoAction | ToggleTodoAction | ChangeTodoAction;