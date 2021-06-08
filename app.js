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
  if(sockets.length == 4) {
    return;
  }

  sockets.push(socket);
  // boilerplate stuff
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });

  // cases:
  // 1. client component is emitting newLobby with empty data
  //   if this is the case, and it matches an existing room,
  //   the new player needs to get added to the array,
  //   and a playerJoined with the matching gameLobby should be emitted
  // 
  socket.on("newLobby", (lobby)=> {

    let match = gameLobbies[lobby.gameCode];

    // there's an existing room
    if(match && match.players.length < 4) {
      console.log("existing room");

      gameLobbies[lobby.gameCode].players.push({playerName: "", playerNumber: match.players.length, playerId: lobby.playerId})
      sockets.forEach(_socket=> _socket.emit("playerJoined", {...gameLobbies[lobby.gameCode], playerId: lobby.playerId, recast: true }));

    //  socket.emit("playerJoined", recaster);
      // there's not an existing room
    } else if(!match) {
      console.log("new room!");

      gameLobbies[lobby.gameCode] = lobby;
      gameLobbies[lobby.gameCode].players.push({playerName: "", playerNumber: gameLobbies[lobby.gameCode].players.length, playerId: lobby.playerId})

      // let recaster = gameLobbies[lobby.gameCode];
      // recaster.recast = true;
      sockets.forEach(_socket => _socket.emit("playerJoined", {...gameLobbies[lobby.gameCode], playerId: lobby.playerId, recast: false}));

    }
  });

  // socket.on("playerJoined", (lobby)=> {
  //   if(lobby.recast) {
  //     let no_recast = lobby;
  //     no_recast.recast = false;
  //     console.log("recast");
  //     socket.emit('playerJoined', lobby);
  //   }
  // });

});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));