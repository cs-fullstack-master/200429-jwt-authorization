import React, { Component, Fragment } from "react";

class ReadComments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commentArray: []
        }
    }

    // Go fetch when mounts
    componentDidMount = () => {
        this.loadData();
    }

    // actually fetch
    loadData = async () => {
        const response = await fetch('/api/comment', {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.props.token
            }
        });
        // wait for the response from request
        const json = await response.json();
        if (json.error) {
            this.setState({commentArray: []});
            window.alert(json.error);
        } else {
            this.setState({commentArray: json});
            console.log(`COMMENTS STATE: ${JSON.stringify(this.state)}`);  // sanity
        }
    }

    render() {
            return( 
            <div>
            <h3>Your Comments</h3>
            <div>
                {
                    this.state.commentArray.map((comment)=> {
                        return (
                            <div key={comment._id}>
                                {comment.commentUser}<br/> 
                                {comment.commentTitle}<br/>
                                {comment.commentBody}<br/>
                                {comment.date}<br/>
                                <hr/>
                            </div>
                        )
                    })
                }
            </div>
            
            
            </div>
            
            );
    }
}

export default ReadComments;