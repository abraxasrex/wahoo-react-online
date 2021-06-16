import React, {useEffect, useState} from "react";
import LobbyPlayers from './LobbyPlayers';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

import socketIOClient from "socket.io-client"
import { io } from "socket.io-client";


import Oofda from '../Oofda';
import { idText } from "typescript";
import { iLobbyForm } from "../interfaces";
// import { DefaultEventsMap , Socket} from "socket.io-client/build/typed-events";

export interface iLobbyViewProps {
  lobby: any,
  setLobby: any,
  players: any,
  emitter: any,
  clientPlayer: any
}
export function GameLobbyView ({lobby, setLobby, players, emitter, clientPlayer}: iLobbyViewProps) {

  console.log("lobby viee lobby: ", lobby, emitter);

   if(emitter || lobby.emitter) {
      return (
        <div>
          <h2>Game Lobby</h2>
  
          <div className="game-lobby-container">
            <div className="game-lobby-hero">
              <div className="gamecode-display">
                <p>your game code is: </p>
                <p><input value={lobby.gameCode}>
                </input></p>
              </div>
  
              <Link to={lobby.readyToPlay ? `/oofda/${lobby.gameCode}` : '#'}>
                {lobby.readyToPlay ? "Start your new game!" : "waiting on players..."}
              </Link>
  
              lobby player length: {lobby.players?.length}
              player length: {players?.length}
            </div>
    
  
            <LobbyPlayers players={lobby.players} setLobby={setLobby} 
              clientPlayer={clientPlayer}
              lobby={lobby} emitEdit={emitter} emitter={emitter} ></LobbyPlayers>
          </div>
  
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
    } else {
      return <p>loading...</p>
    }
   
  }