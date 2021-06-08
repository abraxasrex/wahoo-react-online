import React, {useEffect, useState} from "react";
import LobbyPlayers from './lobby/LobbyPlayers';
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



import Oofda from './Oofda';
import { GameLobbyView } from "./lobby/GameLobbyView";


export function GameLobby() {
    let match = useRouteMatch();
    
    let sample_id = '1234';
    const ENDPOINT = "http://127.0.0.1:4001";

    const lobbyTemplate = {
      players: [],
      gameCode: sample_id,
      readyToPlay: false
    }

    const [lobby, setLobby] = useState(lobbyTemplate);

    const triggerSetLobby = (newState: any) => {
      let state = {...newState};
      setLobby(state);
    }

    return (
      <div>
        <GameLobbyView lobby={lobby} setLobby={triggerSetLobby} players={lobby.players}></GameLobbyView>
      </div>
    );
  }