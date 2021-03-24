import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import ROUTES, { RenderRoutes } from "./routes";

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <RenderRoutes routes={ROUTES} />
        </Router>
      </div>
    );
  }
}
