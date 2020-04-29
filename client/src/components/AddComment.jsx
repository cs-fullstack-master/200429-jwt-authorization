import React, { Component, Fragment } from "react";

class AddComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commentUser: "",
            commentTitle: "",
            commentBody: ""
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
            body:JSON.stringify(formSubmission)
        });
        // extract json 
        let json = await response.json();

        // check for error
        if (json.error) {
            window.alert(json.error);
        } // TODO: If add successful, redirect to their comments page
        else
        {
            console.log(`NEW COMMENT: ${JSON.stringify(json)}`);
        }

    };

    // 
    render() {
        return (
            <Fragment>
            <h3>Add a New Comment</h3>
            <form>
                <label htmlFor="commentTitle">Title</label>
                <input type="text" name="commentTitle" id="commentTitle" value={this.state.commentTitle} onChange={this.handleChange} />
                <label htmlFor="commentBody">Body</label>
                <input type="text" name="commentBody" id="commentBody" value={this.state.commentBody} onChange={this.handleChange} />
                <button onClick={this.handleSubmission}>Add Comment</button>
            </form>
        </Fragment>
        );
    }
}

export default AddComment;