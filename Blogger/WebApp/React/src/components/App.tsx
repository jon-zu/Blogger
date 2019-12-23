import * as React from "react";
import {Footer} from "./Footer";
import {VisibilityFilter} from "../store/visibility/types";
import {AddTodo} from "../container/AddTodo";
import {VisibleTodoList} from "../container/VisibleTodoList";


export const App = () =>
    <div>
        <VisibleTodoList/>
        <AddTodo />
        <Footer/>
    </div>