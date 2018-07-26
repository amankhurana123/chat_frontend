import React, { Component } from "react";
import { apiInstance } from "../api";
import "../styles.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeForm: true,
      name: "",
      email: "",
      password: "",
      reenterPassword: "",
      error: {
        name: "",
        email: "",
        password: "",
        reenterPassword: ""
      }
    };
  }
  componentDidMount() {
    const user = localStorage.getItem("user");
    if (user) {
      const user_id = JSON.parse(user).data._id;
      this.props.history.push("/home", { user_id });
    }
  }
  onChangeState = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  onRegister = () => {
    console.log("onRegister");
    const { name, email, password } = this.state;
    const headers = {
      "content-type": "application/json",
      Accept: "application/json"
    };
    const options = {
      method: "post",
      url: "/user/create",
      data: { name, email, password },
      headers
    };

    apiInstance(options)
      .then(response => {
        console.log("response", response);
      })
      .catch(error => {
        console.log("error", error);
      });
  };
  onLogin = () => {
    console.log("login");
    const { email, password } = this.state;
    const headers = {
      "content-type": "application/json",
      Accept: "application/json"
    };
    const options = {
      method: "post",
      url: "/user/login",
      data: { email, password },
      headers
    };

    apiInstance(options)
      .then(response => {
        console.log("response", response);
        localStorage.setItem("user", JSON.stringify(response));
        this.props.history.push("/home", { user_id: response._id });
      })
      .catch(error => {
        console.log("error", error);
      });
  };
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
                <div>
                  <input
                    type="text"
                    className="textfield"
                    name="name"
                    value={this.state.name}
                    placeholder="Enter Your name"
                    onChange={this.onChangeState}
                  />
                  <input
                    type="email"
                    name="email"
                    value={this.state.email}
                    className="textfield"
                    placeholder="Enter your email address"
                    onChange={this.onChangeState}
                  />
                  <input
                    type="password"
                    value={this.state.password}
                    name="password"
                    className="textfield"
                    placeholder="Enter your password"
                    onChange={this.onChangeState}
                  />
                  <input
                    type="password"
                    name="reenterPassword"
                    value={this.state.reenterPassword}
                    className="textfield"
                    placeholder="Re-enter your password"
                    onChange={this.onChangeState}
                  />
                  <input
                    type="submit"
                    value="Submit"
                    onClick={this.onRegister}
                    className="buttonSubmit"
                  />
                </div>
              ) : (
                <div>
                  <input
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChangeState}
                    className="textfield"
                    placeholder="Enter your email address"
                  />
                  <input
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangeState}
                    className="textfield"
                    placeholder="Enter your password"
                  />

                  <input
                    type="submit"
                    className="buttonSubmit"
                    value="Submit"
                    onClick={this.onLogin}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
