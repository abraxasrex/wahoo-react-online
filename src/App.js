import React,{useState} from 'react';
import GameBoard from './view_components/GameBoard';
import Game from './classes/Game';
import GameView from './view_components/GameView';
import logo from './logo.svg';
import './App.css';

// <div className="player player-1">
// Player 1
// </div>
// <div className="player player-2">
// Player 2
// </div>
// <div className="player player-3">
// Player 3
// </div>
// <div className="player player-4">
// Player 4
// </div>

function startGame(game, setGame) {
  // this.currentPlayer = players[0];
  // return this.currentPlayer;
  if (game && game.players && game.players.length > 0) {
      const player = game.players[0];
      const manager = game.manager;
      manager.currentPlayer = player;
      setGame({manager: manager});
  }
}

function App() {

  // const [game, setGame] = useState([]);

  // setGame(new Game());

  const gameInit = new Game(4);


  const [game, setGame] = useState(gameInit);



startGame(game, setGame);


 console.log("GAME!!!! ", game);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Wahoo
        </p>
          <GameView game={game} setGame={setGame} />
      </header>
    </div>
  );
}

export default App;
