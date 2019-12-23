import {connect} from "react-redux";
import {TodoList} from "../components/TodoList";
import {RootState} from "../store";
import {Todo, TodoState} from "../store/todo/types";
import {TodoVisibilityState, VisibilityFilter} from "../store/visibility/types";
import {toggleTodo} from "../store/todo/actions";

const getVisibleTodos = (todo: TodoState, vis: TodoVisibilityState) => {
    switch (vis.filter) {
        case VisibilityFilter.Active:
            return todo.todos.filter((todo) => todo.completed);
            case VisibilityFilter.Completed:
            return todo.todos.filter((todo) => !todo.completed);
        case VisibilityFilter.All:
            return todo.todos;
    }
    return todo.todos;
};

const mapStateToProps = (state: RootState) => ({
  todos: getVisibleTodos(state.todo, state.visibility)  
});

const mapDispatchToProps = {
    onTodoClicked: toggleTodo
};


export const VisibleTodoList = connect<any, any, any>(
    mapStateToProps,
    mapDispatchToProps
)(TodoList);