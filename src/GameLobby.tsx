import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

import Oofda from './Oofda';


export function GameLobby() {
    let match = useRouteMatch();
    
    let sample_id = '1234';

    return (
      <div>
        <h2>Game Lobby</h2>

        <Link to={`/oofda/${sample_id}`}>Start your new game</Link>
        {/* The Topics page has its own <Switch> with more routes
            that build on the /topics URL path. You can think of the
            2nd <Route> here as an "index" page for all topics, or
            the page that is shown when no topic is selected */}
        {/* <Switch>
          <Route path={`${match.path}/:topicId`}>
            <Oofda />
          </Route>
          <Route path={match.path}>
            <h3>Please select a topic.</h3>
          </Route>
        </Switch> */}
      </div>
    );
  }