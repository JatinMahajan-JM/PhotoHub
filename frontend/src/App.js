import React from "react";
import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainNavigation from "./components/Layout/MainNavigation";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/Signup";

class App extends React.Component {
  state = {
    isAuth: false,
    token: null,
    userId: null,
  };
  signUp(name, email, password) {
    // fetch("http://localhost:8080/signup", {
    fetch("/signup", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    }).then((res) => {
      if (res.status === 200) this.setState({ isAuth: true });
    });
  }
  login(email, password) {
    // fetch("http://localhost:8080/login", {
    fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Login failed");
        }
        return res.json();
      })
      .then((res) => {
        this.setState({ isAuth: true, token: res.token });
        localStorage.setItem("token", res.token);
        localStorage.setItem("userId", res.userId);
        // localStorage.setItem("status", res.status);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        this.autoLogout(remainingMilliseconds);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  logout() {
    this.setState({ isAuth: false, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("status");
    localStorage.removeItem("expiryDate");
  }

  autoLogout(ms) {
    setTimeout(() => {
      this.logout();
    }, ms);
  }

  componentDidMount() {
    const expiryDate = localStorage.getItem("expiryDate");
    const token = localStorage.getItem("token");
    if (!token || !expiryDate) return;
    if (new Date(expiryDate) <= new Date()) {
      this.logout();
      return;
    }
    const userId = localStorage.getItem("userId");
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    this.setState({ isAuth: true, token: token, userId: userId });
    this.autoLogout(remainingMilliseconds);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isAuth !== this.state.isAuth) {
      const token = localStorage.getItem("token");
      if (!token) return;
      const userId = localStorage.getItem("userId");
      this.setState({ isAuth: true, token: token, userId: userId });
      // const expiryDate = localStorage.getItem("expiryDate");
      // const token = localStorage.getItem("token");
      // if (!token || !expiryDate) return;
      // if (new Date(expiryDate) <= new Date()) {
      //   this.logout();
      //   return;
      // }
      // const userId = localStorage.getItem("userId");
      // const remainingMilliseconds =
      //   new Date(expiryDate).getTime() - new Date().getTime();
      // this.setState({ isAuth: true, token: token, userId: userId });
      // this.autoLogout(remainingMilliseconds);
    }
  }
  render() {
    let routes = (
      <Routes>
        <Route path="/" element={<Login onLogin={this.login.bind(this)} />} />
        <Route
          path="/signup"
          element={<SignUp onSignUp={this.signUp.bind(this)} />}
        />
        <Route render={() => <Navigate to="/" />} />
      </Routes>
    );

    if (this.state.isAuth) {
      routes = (
        <Routes>
          <Route
            path="/"
            element={
              <Home userId={this.state.userId} token={this.state.token} />
            }
          />
          <Route render={() => <Navigate to="/" />} />
        </Routes>
      );
    }
    return (
      <BrowserRouter>
        <MainNavigation
          isAuth={this.state.isAuth}
          onLogout={this.logout.bind(this)}
        >
          {/* <Routes>
            <Route path="/" element={<Home />} />
          </Routes> */}
          {routes}
        </MainNavigation>
      </BrowserRouter>
    );
  }
}

export default App;
