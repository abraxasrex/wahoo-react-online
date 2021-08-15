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
import { GameLobbyView, iLobbyViewProps } from "./lobby/GameLobbyView";

let sample_id = '1234';
const ENDPOINT = "http://127.0.0.1:4001";

export interface iLobby {
 players: any  [],
 gameCode: string,
 readyToPlay: boolean,
 emitter?: any
}

const lobbyTemplate: iLobby = {
  players: [],
  gameCode: sample_id,
  readyToPlay: false,
  emitter: undefined
}

export function GameLobby({clientPlayerId}: any) {

    let socket;
    let players: any = [];
    let emitter: any;

    const [lobby, setLobby] = useState(lobbyTemplate);

    const triggerSetLobby = (newState: any) => {
      let state = {...newState};
      setLobby(state);
    }

    const getSocketFunction = (_socket: any) => {
      return function(emitState: any){
        _socket.emit("playerEditedClient", emitState);
      }
    };

    useEffect(() => {
      
      socket = socketIOClient(ENDPOINT);
      let socketRef: any = socket;


      socket.on("connect", () =>{
        //on connect: init emitter function, set it to state, and notify server of new lobby
        emitter = lobby.emitter || getSocketFunction(socketRef);
        // TEST only
      //  emitter = undefined;

        let _lobby = {...lobby, playerId: clientPlayerId, emitter};
        setLobby(_lobby);
        socketRef.emit("newLobby", _lobby);
      });
 

      socket.on("playerJoinedServer", serverLobby => {
        console.log("servr lobby: ", serverLobby);  
          if(serverLobby.gameCode == lobby.gameCode && lobby.players.length < serverLobby.players.length) {
            setLobby({...lobby, ...serverLobby, emitter});
          }
      });

      socket.on("playerEdited", (serverState: any) => {
        let changedPlayer = serverState.player;
        let gameCode = serverState.gameCode;
        let serverPlayers: any [] = serverState.players;

        if(gameCode == lobby.gameCode && clientPlayerId != changedPlayer.playerId) {

          let updatedIndex: any = serverPlayers.findIndex((_player: any) => {
            return _player.playerId == changedPlayer.playerId
          });

          serverPlayers[updatedIndex] = {...serverPlayers[updatedIndex], changedPlayer};
          setLobby({...lobby, players: serverPlayers, emitter: emitter || lobby.emitter});
        }
      });

      socket.on("playerLeftServer", (something)=>{
        console.log("someone left");
      }) ;

      socket.on("onServerGameStart", (socketGameEntity)=> {
        // TODO:
        // 1. separate function to save player and game id in localstorage
        // 2. navigate to game functionally with params to setup initial game
      });


      players = lobby.players;
    }, []);

    return (
      <div>
        <GameLobbyView lobby={lobby} setLobby={triggerSetLobby} 
          clientPlayerId={clientPlayerId}
          players={lobby.players} emitter={emitter || lobby.emitter}></GameLobbyView>
      </div>
    );
  }