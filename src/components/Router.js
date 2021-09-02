import React, { useState } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Auth from "../router/Auth";
import Home from "../router/Home";

const AppRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <Home />
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
