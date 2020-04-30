import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Link, Route, Redirect } from 'react-router-dom';

// Login form component
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            redirect: false
        }
    }

    // Handle changes to form fields
    handleChange = (evt) => {
        this.setState({ [evt.target.id]: evt.target.value });
        // console.log(`Changed: ${evt.target.id} ${evt.target.value}`);
    };

    // Handle submission of form
    handleSubmission = async (event) => {
        event.preventDefault(); // keep page from reloading
        console.log(this.state);  // sanity
        // Fetch/hit login endpoint
        let user = {
            email: this.state.email,
            password: this.state.password
        }
        // actually fetch
        let response = await fetch('/api/login', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        // pull out json from response
        let json = await response.json();
        // Check if an error occurred
        if (json.error) {
            window.alert(json.error);
        } else {
            // log json response from server
            console.log(json.token); // sanity
            // set redirect flag to fwd us to next page
            this.setState({ redirect: true });
            // lift state (callback)
            this.props.logInUser(json.token);
        }
    }

    // Actually render the login form
    render() {
        // Conditional render redirect to user comments page or display the Login form
        if (this.state.redirect) {
            console.log(`Redirecting...`);
            return (<Redirect to='/' />);
        } else {
            return (
                <Fragment>
                    <h3>Login</h3>
                    <form>
                        <div className="form-group">
                            <label htmlFor="email">Email&nbsp;</label>
                            <input type="text" name="email" id="email" value={this.state.email} onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Password&nbsp;</label>
                            <input type="password" name="password" id="password" value={this.state.password} onChange={this.handleChange} />
                        </div>
                        <button onClick={this.handleSubmission}>Login</button>
                    </form>
                </Fragment>
            );
        }
    }
}


export default Login;