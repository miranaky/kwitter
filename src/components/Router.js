import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Auth from "router/Auth";
import Home from "router/Home";
import Profile from "router/Profile";
import Navigation from "./Navigation";

const AppRoute = ({ isLoggedIn }) => {
  return (
    <Router>
      <Switch>
        {isLoggedIn ? (
          <>
            <Navigation />
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
          </>
        ) : (
          <Route exact path="/">
            <Auth />
          </Route>
        )}
        ;
      </Switch>
    </Router>
  );
};

export default AppRoute;
