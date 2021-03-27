import React from "react";
import PropTypes from "prop-types";
import { Route, Switch, useParams } from "react-router-dom";
import Main from "./pages/Main";
import Room from "./pages/Room";
const ROUTES = [
  {
    path: "/",
    key: "APP",
    component: (props) => {
      return <RenderRoutes {...props} />;
    },
    routes: [
      {
        path: "/",
        key: "APP_ROOT",
        exact: true,
        component: Main,
      },
      {
        path: "/room",
        key: "APP_ROOM",
        exact: true,
        component: Room,
      },
    ],
  },
];

export default ROUTES;

function GameArea() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { id } = useParams();

  return (
    <div>
      <h3>game id {id}</h3>
    </div>
  );
}
const RouteWithSubRoutes = (route) => {
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={(props) => <route.component {...props} routes={route.routes} />}
    />
  );
};

export const RenderRoutes = ({ routes }) => {
  return (
    <Switch>
      {routes.map((route, i) => {
        return <RouteWithSubRoutes key={route.key} {...route} />;
      })}
      <Route component={() => <h1>Not Found!</h1>} />
    </Switch>
  );
};

RenderRoutes.propTypes = {
  routes: PropTypes.array.isRequired,
};
