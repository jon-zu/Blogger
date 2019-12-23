import {addTodo} from "../store/todo/actions";
import * as React from "react";
import {FormEvent} from "react";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;

interface Props {
    handleAdd: (text: string) => void
}


interface State {
    text: string
}

export class AddTodoComponent extends  React.Component<Props, State> {
    constructor (props: Props) {
        super(props);
        this.updateValue = this.updateValue.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {text: ""};
    }
    
    handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        //if(this.state.text.trim())
         //   return;
        
        this.props.handleAdd(this.state.text);
        this.setState({text: ""});
    }
    
    updateValue(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({text: e.target.value});
    }
    
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input value={this.state.text} onChange={this.updateValue}  />
                    <button type="submit">Add Todo</button>
                </form>
            </div>
        )
    }
}