import React, { Component } from "react";
import "../styles.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeForm: true
    };
  }
  // onChangeState = (name, event) => {
  //   this.state.name = event.target.value;
  //   this.setState({});
  // };
  render() {
    return (
      <div className="mainContainer">
        <div className="loginComponent">
          <div className="headerComponent">
            <p
              onClick={() => {
                this.setState({ changeForm: true });
              }}
            >
              Register
            </p>
            <p
              onClick={() => {
                this.setState({ changeForm: false });
              }}
            >
              Sign Up
            </p>
          </div>
          <div className="formComponent">
            <div>
              {this.state.changeForm ? (
                <form>
                  <input
                    type="text"
                    className="textfield"
                    placeholder="Enter Your name"
                  />
                  <input
                    type="email"
                    className="textfield"
                    placeholder="Enter your email address"
                  />
                  <input
                    type="password"
                    className="textfield"
                    placeholder="Enter your password"
                  />
                  <input
                    type="password"
                    className="textfield"
                    placeholder="Re-enter your password"
                  />
                  <input type="submit" className="buttonSubmit" />
                </form>
              ) : (
                <form>
                  <input
                    type="email"
                    className="textfield"
                    placeholder="Enter your email address"
                  />
                  <input
                    type="password"
                    className="textfield"
                    placeholder="Enter your password"
                  />
                  <input type="submit" className="buttonSubmit" />
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
