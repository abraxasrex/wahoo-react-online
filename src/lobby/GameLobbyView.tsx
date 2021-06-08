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
// import { DefaultEventsMap , Socket} from "socket.io-client/build/typed-events";

const getPlayerId = ()=> {
  return Math.floor(Math.random() * 10000);
}


export function GameLobbyView ({lobby, setLobby, _players}: any) {
    let match = useRouteMatch();
    
    let sample_id = '1234';
    const ENDPOINT = "http://127.0.0.1:4001";

 
    let thisPlayerId: any;
    let socket;
    let players: any = [];

    useEffect(() => {
      
      thisPlayerId = getPlayerId();

      socket = socketIOClient(ENDPOINT);
      socket.emit("newLobby", {...lobby, playerId: thisPlayerId});
      // 1. if the server lobby code matches the client one,
      // 2. send lobby info ????
      // 3. ???

    socket.on("newLobby", serverLobby => {
      console.log("new lobby: ", serverLobby);
      if(serverLobby.gameCode == lobby.gameCode) {
        // 1. the array is length 'one', and the entry has thisPlayerId
        if(serverLobby.players.length > 1 && serverLobby.playerId == thisPlayerId) {
          //  setLobby()
        }
        // 2. the array is greater than one, and the last item does not equal this playerID
        if (serverLobby.players.length > 1 && 
              serverLobby.players[serverLobby.players.length - 1].playerId != thisPlayerId
            ) {
              setLobby({...serverLobby});
        }

      }
    }); 


      socket.on("playerJoined", serverLobby => {
        console.log("player joined: ", serverLobby, lobby, thisPlayerId);
        //  if(serverLobby.gameCode == lobby.gameCode && thisPlayerId != serverLobby.playerId) {
          if(serverLobby.gameCode == lobby.gameCode && lobby.players.length < serverLobby.players.length) {
            setLobby({...serverLobby});
          }
      });

      socket.on("FromAPI", data => {
        console.log("socket data: ", data);
      });

      console.log("PLAYERS: ", lobby.players);

     players = lobby.players;
    }, []);


    return (
      <div>
        <h2>Game Lobby</h2>

        <Link to={lobby.readyToPlay ? `/oofda/${lobby.gameCode}` : '#'}>
          {lobby.readyToPlay ? "Start your new game!" : "waiting on players..."}
        </Link>
        lobby player length: {lobby.players?.length}
        player length: {players?.length}
        <LobbyPlayers players={lobby.players} setLobby={setLobby} lobby={lobby}></LobbyPlayers>


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