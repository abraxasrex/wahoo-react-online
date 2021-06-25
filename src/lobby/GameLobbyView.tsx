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
import { iLobby } from "../GameLobby";

export interface iLobbyViewProps {
  lobby: iLobby,
  setLobby: any,
  players: any [],
  emitter: any,
  clientPlayerId: any
}
export function GameLobbyView ({lobby, setLobby, players, emitter, clientPlayerId}: iLobbyViewProps) {


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
            </div>
    
            <LobbyPlayers players={lobby.players} setLobby={setLobby} 
              clientPlayerId={clientPlayerId}
              lobby={lobby} emitEdit={emitter} emitter={emitter} ></LobbyPlayers>
          </div>
        </div>
      );
    } else {
      return <p>loading...</p>
    }
   
  }