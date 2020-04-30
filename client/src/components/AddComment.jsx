import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Link, Route, Redirect } from 'react-router-dom';

// Component for adding a new comment
class AddComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commentUser: "",
            commentTitle: "",
            commentBody: "",
            redirect: false
        }
    }

    // Handle changes to form fields
    handleChange = (evt) => {
        this.setState({ [evt.target.id]: evt.target.value });
        // console.log(`Changed: ${evt.target.id} ${evt.target.value}`);
    };

    // Do the fetch to add comment
    handleSubmission = async (evt) => {
        evt.preventDefault(); // break the chain

        // comment for submission
        let formSubmission = {
            commentUser: this.props.tokenUser.email,
            commentTitle: this.state.commentTitle,
            commentBody: this.state.commentBody
        }
        // console.log(`FORM STUFF JSON.st:
        // submit fetch to add comment 
        const response = await fetch('/api/comment', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            },
            body: JSON.stringify(formSubmission)
        });
        // extract json 
        let json = await response.json();

        // check for error
        if (json.error) {
            window.alert(json.error);
        } // TODO: If add successful, redirect to their comments page
        else {
            console.log(`NEW COMMENT: ${JSON.stringify(json)}`);
            // set redirect flag to fwd us to next page
            this.setState({ redirect: true });
        }

    };

    // Actually render the Add comment form state controlled component
    render() {
        // Conditional render redirect to user comments page or display the Login form
        if (this.state.redirect) {
            console.log(`Redirecting...`);
            return (<Redirect to='/comments' />);
        } else {
            return (
                <Fragment>
                    <h3>Add a New Comment</h3>
                    <form>
                        <div className="form-group">
                            <label htmlFor="commentTitle">Title&nbsp;</label>
                            <input type="text" name="commentTitle" id="commentTitle" value={this.state.commentTitle} onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="commentBody">Body&nbsp;</label>
                            <input type="text" name="commentBody" id="commentBody" value={this.state.commentBody} onChange={this.handleChange} />
                        </div>
                        <button onClick={this.handleSubmission}>Add Comment</button>
                    </form>
                </Fragment>
            );
        }
    }
}

export default AddComment;