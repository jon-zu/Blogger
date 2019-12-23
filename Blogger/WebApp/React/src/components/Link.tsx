import {Component} from "react";
import * as React from "react";
import {VisibilityFilter} from "../store/visibility/types";

export interface LinkProps {
    active: boolean,
    filter: VisibilityFilter,
    onClick: (filter: VisibilityFilter) => void,
    
}

export class LinkComponent extends Component<LinkProps> {
    constructor(props: LinkProps) {
        super(props);
    }
    
    
    render() {
        return <button
            onClick={e => this.props.onClick(this.props.filter)}
            disabled={this.props.active}
            style={{
                marginLeft: '4px'
            }}
        >
            {this.props.children}
        </button>
    }
}