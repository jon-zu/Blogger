import * as React from "react";
import {TodoComponent} from "./Todo";
import {Todo} from "../store/todo/types";

export interface TodoListProps { 
    todos: Todo[],
    onTodoClicked: (id: number) => void
}

export const TodoList = (props: TodoListProps) =>   <ul>
    {props.todos.map(todo => (
        <TodoComponent todo={todo} onTodoClicked={props.onTodoClicked}/>
    ))}
</ul>;