import React, { Component, Fragment } from "react";

// Login form component
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
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
        // Check for an error
        if (json.error) {
            window.alert(json.error);
        } else {
            // log json response from server
            console.log(json.token); // sanity
            // lift state (callback)
            this.props.logInUser(json.token);
        }
    }

    // Actually render the login form
    render() {
        return (
            <Fragment>
                <h3>Login</h3>
                <form>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" value={this.state.email} onChange={this.handleChange} />
                    <label htmlFor="email">Password</label>
                    <input type="password" name="password" id="password" value={this.state.password} onChange={this.handleChange} />
                    <button onClick={this.handleSubmission}>Login</button>
                </form>
            </Fragment>
        );
    }
}


export default Login;