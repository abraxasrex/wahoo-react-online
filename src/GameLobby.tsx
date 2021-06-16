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






let sample_id = '1234';
const ENDPOINT = "http://127.0.0.1:4001";

const lobbyTemplate = {
  players: [],
  gameCode: sample_id,
  readyToPlay: false,
  emitter: undefined
}


export function GameLobby({clientPlayer}: any) {

    let match = useRouteMatch();

    let thisPlayerId: any;
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
      
    //  thisPlayerId = getPlayerId();

      socket = socketIOClient(ENDPOINT);
      let socketRef: any = socket;


      socket.on("connect", () =>{
        //on connect: init emitter function, set it to state, and notify server of new lobby
        emitter = getSocketFunction(socketRef);
        // TEST only
      //  emitter = undefined;

        let _lobby = {...lobby, playerId: clientPlayer, emitter};
        setLobby(_lobby);
        socketRef.emit("newLobby", _lobby);
      });




    // socket.on("newLobby", serverLobby => {
    //   // matching codes
    //   if(serverLobby.gameCode == lobby.gameCode) {
    //     // 1. the array is length 'one', and the entry has thisPlayerId
    //     // if(serverLobby.players.length > 1 && serverLobby.playerId == thisPlayerId) {
    //     //   //  setLobby()
    //     // }
    //     // 2. the array is greater than one, and the last item does not equal this playerID
    //     if (serverLobby.players.length > 1 && 
    //           serverLobby.players[serverLobby.players.length - 1].playerId != thisPlayerId
    //         ) {
    //           setLobby({...lobby, ...serverLobby, emitter});
    //     }
    //   }
    // }); 
 

      socket.on("playerJoinedServer", serverLobby => {
       // let serverLobby = JSON.parse(_serverLobby);
        console.log("player joined server: ", serverLobby);

          if(serverLobby.gameCode == lobby.gameCode && lobby.players.length < serverLobby.players.length) {
            setLobby({...lobby, ...serverLobby, emitter});
          }
      });

      socket.on("playerEdited", (serverState: any) => {
        let changedPlayer = serverState.player;
        let gameCode = serverState.gameCode;
        if(gameCode == lobby.gameCode && clientPlayer != changedPlayer.playerId) {
          let updated: any = lobby.players.find((_player: any) => _player.playerId == changedPlayer.playerId);
          let _players: any = lobby.players;
          _players[_players.indexOf(updated)] = changedPlayer;
          setLobby({...lobby, ...players});
        }
      });

      socket.on("playerLeftServer", (something)=>{
        console.log("someone left");
      })  

      players = lobby.players;
    }, []);

    console.log("thisplayerid: ", clientPlayer);
    return (
      <div>
        <GameLobbyView lobby={lobby} setLobby={triggerSetLobby} 
          clientPlayer={clientPlayer}
          players={lobby.players} emitter={emitter || lobby.emitter}></GameLobbyView>
      </div>
    );
  }