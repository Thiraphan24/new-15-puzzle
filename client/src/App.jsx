import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Register from "./component/Register";
import Board from "./component/board";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Register} />
          <Route path="/board" component={Board} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
