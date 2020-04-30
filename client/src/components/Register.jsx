import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Link, Route, Redirect } from 'react-router-dom';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            password: "",
            email: "",
            redirect: false
        }
    }

    // Handle changes to form fields
    handleChange = (evt) => {
        this.setState({ [evt.target.id]: evt.target.value });
        // console.log(`Changed: ${evt.target.id} ${evt.target.value}`); //sanity
    };


    // Handle registration submission
    handleSubmission = async (evt) => {
        evt.preventDefault(); // breaking the chains

        let newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        }

        let response = await fetch('/api/register', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)

        });
        // 
        // pull out json from response
        let json = await response.json();

        if (json.error) {
            window.alert(json.error);
        }
        else {
            console.log(`REGISTRATION RESPONSE: ${JSON.stringify(json)}`);  // Check the response
            // set redirect flag to fwd us to next page
            this.setState({ redirect: true });
        }
    }

    // Actually render the registration form state controlled component
    render() {
        // Conditional render redirect to user comments page or display the Login form
        if (this.state.redirect) {
            console.log(`Redirecting...`);
            return (<Redirect to='/' />);
        } else {
            return (
                <Fragment>
                    <h3>Register!</h3>
                    <form>
                        <div className="form-group">
                            <label htmlFor="email">Email&nbsp;</label>
                            <input type="text" name="email" id="email" value={this.state.email} onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Name&nbsp;</label>
                            <input type="text" name="name" id="name" value={this.state.name} onChange={this.handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Password&nbsp;</label>
                            <input type="password" name="password" id="password" value={this.state.password} onChange={this.handleChange} />
                        </div>
                        <button className="btn btn-primary" onClick={this.handleSubmission}>Register</button>
                    </form>
                </Fragment>
            );
        }
    }
}


export default Register;