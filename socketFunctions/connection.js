

const socketIo = require("socket.io");

function ConnectionHandler (socket, sockets, gameLobbies) {


  
    let _sockets = sockets;
  
    for(let i=0; i < sockets.length; i++) {
      if(sockets[i].id == socket.id) {
        _sockets[i].disconnect();
        _sockets[i] = socket;
        console.log("duplicate client");
        break;
      }
    } 
  
    sockets = _sockets;
  
    sockets.push(socket);
    console.log("New client connected");
  
    socket.on("disconnect", (client) => {
  
  
      let checkSockets = [...sockets];
  
      let removeIndex;
  
      for(let i=0; i < checkSockets.length; i++) {
        console.log("client: ", client);
        if(checkSockets[i].id == socket.id) {
          removeIndex = i;
          console.log("kick out old socket");
          break;
        }
      } 
  
      if(removeIndex) {
        console.log("removing from sockets...");
        checkSockets.splice(removeIndex, 1);
  
        sockets = checkSockets;
      }
  
      console.log("Client disconnected");
    });
  
  
    socket.on("newLobby", (lobby)=> {
      console.log("new lobbyyyy: ", lobby);
      let match = gameLobbies[lobby.gameCode];
      
      if(!lobby.playerId){
        console.log("no player id");
        // socket.disconnect();
        return;
      }
  
      if(match && match.players.length >= 4){
        // room can only have 4 players
        console.log("too many players");
       // socket.disconnect();
          return;
      }
      // there's an existing room
      if(match && match.players && match.players.length < 4) {
        console.log("existing room");
  
           // prevent adding same user
          let deny = false;
  
          for(let j= 0; j < match.players.length; j++) {
              if(match.players[j].playerId == lobby.playerId) {
                console.log("user: adding twice: ", lobby.playerId);
                deny = true;
                break;
              }
          }
  
          if(deny) {
  
            let newInfo = {...gameLobbies[lobby.gameCode]};
  
            console.log("old user info: ", newInfo);
            sockets.forEach((client)=> {
              client.emit("playerJoinedServer", newInfo);
            });
  
          }
  
          // if it's not a rejoining user, add to array
        if(!deny) {
          let length = match.players.length;
  
          gameLobbies[lobby.gameCode].players.push(
              {playerName: "", playerNumber: length, playerId: lobby.playerId}
            )
    
          let newInfo = {...gameLobbies[lobby.gameCode]};
    
          sockets.forEach((client)=> {
            client.emit("playerJoinedServer", newInfo);
          });
  
        }
  
  
      } else if(!match) {
        console.log("new room!");
  
        gameLobbies[lobby.gameCode] = lobby;
        gameLobbies[lobby.gameCode].players.push(
          {playerName: "", playerNumber: 0, playerId: lobby.playerId}
        );
  
        let newInfo = {...gameLobbies[lobby.gameCode]};
        sockets.forEach((client)=> client.emit("playerJoinedServer", newInfo));
  
      }
    });
  
    // TODO: player update
  
    socket.on("playerEditedClient", (editState)=> {
  
      let gameCode = editState.gameCode;
      let player = editState.player;
  
      let lobby = gameLobbies[gameCode];
      if(lobby) {
        // change player at server level
        let changedPlayer = lobby.players.find(eachPlayer=> eachPlayer.playerId == player.playerId);
        let changedIndex = lobby.players.indexOf(changedPlayer);
  
        gameLobbies[gameCode].players[changedIndex] = player;
  
        console.log('edit server: ', gameLobbies[gameCode]);
        //emit the edited player and gameCode
        let emitState = {player: editState.player, gameCode, players: lobby.players};
        sockets.forEach((client)=> {
          client.emit("playerEdited", emitState);
        });
      }
    });
  
    socket.on("onClientGameStart", (gameStartState)=>{
      let clientId = gameStartState.clientId;
      let gameID = gameStartState.gameId;
      // TODO: find lobby for gameId, for all players of that game, emit onServerGameStart
    })
  
  
  };

  module.exports={ConnectionHandler}