import {connect} from "react-redux";
import {TodoList} from "../components/TodoList";
import {RootState} from "../store";
import {Todo, TodoState} from "../store/todo/types";
import {TodoVisibilityState, VisibilityFilter} from "../store/visibility/types";
import {changeVisibility} from "../store/visibility/actions";
import {LinkComponent} from "../components/Link";


type OwnProps = {
    filter: VisibilityFilter,
    children: React.ReactNode
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
    active: state.visibility.filter == ownProps.filter,
    filter: ownProps.filter,
    children: ownProps.children
});

const dispatchProps = {
    onClick: changeVisibility
};


export const FilterLink = connect(
    mapStateToProps,
    dispatchProps
)(LinkComponent);