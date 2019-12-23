import {Todo, TodoActionTypes, TodoState} from "./types";

const initialState: TodoState = {
    todos: [],
    nextId: 1
};

export function todoReducer(
    state = initialState,
    action: TodoActionTypes
): TodoState {
    switch (action.type) {
        case "ADD_TODO":
            return {
                todos: [...state.todos, {
                    id: state.nextId,
                    text: action.payload,
                    completed: false
                }],
                nextId: state.nextId + 1
            };
        case "DELETE_TODO":
            return {
                todos: state.todos.filter(todo => todo.id == action.meta.id),
                nextId: state.nextId
            };
        case "TOGGLE_TODO":
            return {
                todos: state.todos.map((item, _) => {
                    if (item.id != action.meta.id)
                        return item;
                    else
                        return {
                            id: item.id,
                            text: item.text,
                            completed: !item.completed
                        }
                }),
                nextId: state.nextId
            };
        case "CHANGE_TODO":
            return {
                todos: state.todos.map((item, _) => {
                    if (item.id != action.meta.id)
                        return item;
                    else
                        return {
                            id: item.id,
                            text: action.meta.text,
                            completed: item.completed
                        }
                }),
                nextId: state.nextId
            };

        default:
            return state
    }
}