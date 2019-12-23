import * as React from "react";
import {VisibilityFilter} from "../store/visibility/types";
import {FilterLink} from "../container/FilterLink";


export const Footer = () => 
    <div>
        <span>Show: </span>
        <FilterLink filter={VisibilityFilter.All}>All</FilterLink>
        <FilterLink filter={VisibilityFilter.Completed}>Completed</FilterLink>
        <FilterLink filter={VisibilityFilter.Active}>Active</FilterLink>
    </div>;
