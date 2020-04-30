import React, { Component, Fragment } from "react";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            password: "",
            email: ""
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
        }
    }

    // Actually render the registration form state controlled component
    render() {
        return (
            <Fragment>
                <h3>Register!</h3>
                <form>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" value={this.state.email} onChange={this.handleChange} />
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" value={this.state.name} onChange={this.handleChange} />
                    <label htmlFor="email">Password</label>
                    <input type="password" name="password" id="password" value={this.state.password} onChange={this.handleChange} />
                    <button onClick={this.handleSubmission}>Register</button>
                </form>
            </Fragment>
        );
    }
}


export default Register;