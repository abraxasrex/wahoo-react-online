import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { GameLobby } from "./GameLobby";

import Oofda from './Oofda';
import {Home} from './view_components/Home';

import {getPlayerId} from './helpers/Helpers';


export default function App() {

  const clientId = getPlayerId();

  return (
    <Router>
      <div className="app-background">
        <nav>
          <ul className={'oofda-nav-bar'}>
            <li className={'oofda-nav-item'}>
              <Link to="/">Home</Link>
            </li>
            <li className={'oofda-nav-item'}>
              <Link to="/about">About</Link>
            </li>
            <li className={'oofda-nav-item'}>
              <Link to="/gameLobby">Game Lobby</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/oofda" >
            <Oofda />
          </Route>
          <Route path = "/gameLobby"> 
              <GameLobby clientPlayerId={clientId} />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}



function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}