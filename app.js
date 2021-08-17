const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const {ConnectionHandler} = require("./socketFunctions/connection");

const port = process.env.PORT || 4001;

const app = express();

app.get("/", (req, res) => {
    res.send('everything is ok');
  });

const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });
  
// let interval;

let gameLobbies = {};
let sockets = [];


io.on("connection", (socket)=> ConnectionHandler(socket, sockets, gameLobbies));


server.listen(port, () => console.log(`Listening on port ${port}`));