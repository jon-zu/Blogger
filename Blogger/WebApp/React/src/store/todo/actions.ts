import {ADD_TODO, CHANGE_TODO, DELETE_TODO, TodoActionTypes, TOGGLE_TODO} from "./types";

export function addTodo(text: string): TodoActionTypes {
    return {
        type: ADD_TODO,
        payload: text
    }
}

export function deleteTodo(id: number): TodoActionTypes {
    return {
        type: DELETE_TODO,
        meta: {
            id
        }
    }
}

export function toggleTodo(id: number): TodoActionTypes {
    return {
        type: TOGGLE_TODO,
        meta: {
            id
        }
    }
}

export function changeTodo(id: number, text: string): TodoActionTypes {
    return {
        type: CHANGE_TODO,
        meta: {
            id,
            text
        }
    }
}