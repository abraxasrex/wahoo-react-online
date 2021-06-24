const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
// const index = require("./src/index");

const app = express();
// var router = express.Router();

// app.use(index);
//app.use('/src', express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.send('everything is ok');
  });

const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });
  
let interval;

let gameLobbies = {};
let sockets = [];


io.on("connection", (socket) => {

  // block room after 4 users
  if(sockets.length > 3) {
    return;
  }
  sockets.push(socket);
  console.log("New client connected");

  socket.on("disconnect", (client) => {
    sockets.splice([sockets.indexOf(client)], 1);
    sockets.forEach((client)=> client.emit('playerLeftServer', client));
    console.log("Client disconnected");
  });


  socket.on("newLobby", (lobby)=> {
    console.log("new lobbyyyy: ", lobby);
    let match = gameLobbies[lobby.gameCode];
    
    console.log("lobbies, ", gameLobbies);
    // there's an existing room
    if(match && match.players && match.players.length < 4) {
      console.log("existing room");

         // prevent adding same user
        let deny = false;
         match.players.forEach((player)=> {
        if(player.playerId == lobby.playerId) {
          console.log("bad user: adding twice: ", lobby.playerId);
          deny = true;
          return;
        }
      });

      if(deny) {
        return;
      }

      let length = match.players.length;
      gameLobbies[lobby.gameCode].players.push({playerName: "", playerNumber: length, playerId: lobby.playerId})
      console.log("working?: ", gameLobbies[lobby.gameCode], lobby);

      let newInfo = {...gameLobbies[lobby.gameCode]};
      sockets.forEach((_client)=> {
        _client.emit("playerJoinedServer", newInfo);
      });

    } else if(!match) {
      console.log("new room!");

      gameLobbies[lobby.gameCode] = lobby;
      gameLobbies[lobby.gameCode].players.push({playerName: "", playerNumber: 0, playerId: lobby.playerId});

      let newInfo = {...gameLobbies[lobby.gameCode]};
      sockets.forEach((_client)=> _client.emit("playerJoinedServer", newInfo));

    }
  });

  // TODO: player update

  socket.on("playerEditedClient", (editState)=> {

    let gameCode = editState.gameCode;
    let player = editState.player;

    let lobby = gameLobbies[gameCode];
    if(lobby) {
      // change player at server level
    //  console.log("Editing players.... ", lobby.players);
     // console.log("with player.... ", player);
      let changedPlayer = lobby.players.find(_player=> _player.playerId == player.playerId);
      let changedIndex = lobby.players.indexOf(changedPlayer);
      gameLobbies[gameCode].players[changedIndex] = player;
      console.log('edit server: ', gameLobbies[gameCode]);
      //emit the edited player and gameCode
      let emitState = {player: editState.player, gameCode, players: lobby.players};
      sockets.forEach((client)=> {
        client.emit("playerEdited", emitState);
      });
      // make sure cleint matches
    }
  });


});


server.listen(port, () => console.log(`Listening on port ${port}`));