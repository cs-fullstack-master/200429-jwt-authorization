import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Link, Route } from 'react-router-dom' // imports to use Router
import Login from "./Login";
import ReadComments from "./ReadComments";
import AddComment from "./AddComment";
import Register from "./Register";

// Top level container for application
class AppContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            tokenUser: {}
        }
    }


    // Callback to lift JWT token up to parent state so can be passed down to any components 
    // who will need to send fetch requests to protected endpoints/
    logInUser = async (token) => {
        // hold on to JWToken
        this.setState({ token: token });
        // Go fetch token payload from server api/jwtpayload        
        const response = await fetch('/api/jwtpayload', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.state.token
            }
        });
        // wait for the response from request
        const json = await response.json();
        // check for error
        if (json.error) {
            this.setState({ token: "" });
            window.alert(json.error);
        }
        else { // put payload response into state
            this.setState({ tokenUser: json.message });
        }


        console.log(`TOP LEVEL STATE: ${JSON.stringify(this.state)}`);  // sanity

    }

    // Actually render the parent container containing wired child components
    // top container
    render() {
        return (
            <div>
                <h1>Comment Manager</h1>
                <h4>Welcome {this.state.tokenUser.name}</h4>
                <h4>{this.state.tokenUser.email}</h4>
                <Router>
                    <Link to="/">Home</Link> |
                    <Link to="/login">Login</Link> |
                    <Link to="/logout">Logout</Link> |
                    <Link to="/register">Register</Link> |
                    <Link to="/comments">Your Comments</Link> |
                    <Link to="/add">Add Comment</Link>
                    {/* setup our routes */}
                    <Route path="/login" component={() => <Login logInUser={this.logInUser} />} />
                    <Route path="/register" component={() => <Register />} />
                    <Route path="/add" component={() => <AddComment token={this.state.token} tokenUser={this.state.tokenUser} />} />
                    <Route path="/comments" component={() => <ReadComments token={this.state.token} />} />
                </Router>
            </div>
        );
    }
}

export default AppContainer;