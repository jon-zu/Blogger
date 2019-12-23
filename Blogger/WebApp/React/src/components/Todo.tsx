import * as React from "react";
import {Component} from "react";
import {Todo} from "../store/todo/types";

export interface TodoProps { 
    todo: Todo,
    onTodoClicked: (id: number) => void
}

export class TodoComponent extends Component<TodoProps> {
    constructor(props: TodoProps) {
        super(props);
        
        this.handleToggleClick = this.handleToggleClick.bind(this);
    }
    
    handleToggleClick(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        this.props.onTodoClicked(this.props.todo.id);
    }
    
    render() {
        return <li
            onClick={this.handleToggleClick}
            style={{
                textDecoration: this.props.todo.completed ? "line-through" : "none"
            }}
        >
            {this.props.todo.text}
        </li>;
    }
}