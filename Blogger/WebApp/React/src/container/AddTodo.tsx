import {connect} from "react-redux";
import {addTodo} from "../store/todo/actions";
import * as React from "react";
import {AddTodoComponent} from "../components/AddTodoComponent";

export const AddTodo = connect<any, any, any>(null, {
    handleAdd: addTodo
})(AddTodoComponent);