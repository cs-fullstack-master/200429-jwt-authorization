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

    // Logout the user by removing the token/user info from state
    logOutUser = () => {
        console.log(`Logout/Free token`);
        this.setState({ token: "", tokenUser: {} });
        window.alert(`You Have Been Logged Out`);
    };

    // Actually render the parent container containing wired child components
    // top container
    render() {
        // We need to render different navbar options depending on if user signed in or not
        if (this.state.token) { // User LOGGED IN
            return (
                <div>
                    <h1>Comment Manager</h1>
                    <h5>Welcome {this.state.tokenUser.name}</h5>
                    {/* Could display other info from current token payload */}
                    {/* <h6>{this.state.tokenUser.email}</h6> */}
                    <Router>
                        <hr />
                        <Link to="/">Home</Link>&nbsp;|&nbsp;
                    {/* <Link to="/login">Login</Link>&nbsp;|&nbsp; */}
                    <Link to="/logout" onClick={this.logOutUser}>Logout</Link>&nbsp;|&nbsp;
                    {/* <Link to="/register">Register</Link>&nbsp;|&nbsp; */}
                    <Link to="/comments">Your Comments</Link>&nbsp;|&nbsp;
                    <Link to="/add">Add Comment</Link>&nbsp;|&nbsp;
                    <hr />
                        {/* setup our routes */}
                        {/* <Route path="/login" component={() => <Login logInUser={this.logInUser} />} /> */}
                        {/* <Route path="/register" component={() => <Register />} /> */}
                        <Route path="/add" component={() => <AddComment token={this.state.token} tokenUser={this.state.tokenUser} />} />
                        <Route path="/comments" component={() => <ReadComments token={this.state.token} />} />
                    </Router>
                </div>
            );
        } else { // User LOGGED OUT
            return (
                <div>
                    <h1>Comment Manager</h1>
                    <h5>Welcome!</h5>
                    <h4>{this.state.tokenUser.email}</h4>
                    <Router>
                        <hr />
                        <Link to="/">Home</Link>&nbsp;|&nbsp;
                        <Link to="/login">Login</Link>&nbsp;|&nbsp;
                        {/* <Link to="/logout" onClick={this.logOutUser}>Logout</Link>&nbsp;|&nbsp; */}
                        <Link to="/register">Register</Link>&nbsp;|&nbsp;
                        {/* <Link to="/comments">Your Comments</Link>&nbsp;|&nbsp; */}
                        {/* <Link to="/add">Add Comment</Link>&nbsp;|&nbsp; */}
                        <hr />
                        {/* setup our routes */}
                        <Route path="/login" component={() => <Login logInUser={this.logInUser} />} />
                        <Route path="/register" component={() => <Register />} />
                        {/* <Route path="/add" component={() => <AddComment token={this.state.token} tokenUser={this.state.tokenUser} />} /> */}
                        {/* <Route path="/comments" component={() => <ReadComments token={this.state.token} />} /> */}
                    </Router>
                </div>
            );
        }

    }
}

export default AppContainer;