import React,{useState} from 'react';
import GameBoard from './view_components/GameBoard';
import Game from './classes/Game';
import GameView from './view_components/GameView';
import logo from './logo.svg';
import './App.css';



function startGame(game, setGame) {

  if (game && game.players && game.players.length > 0) {
      const player = game.players[0];
      const manager = game.manager;
      manager.currentPlayer = player;
      setGame({manager: manager});
  }
}

function App() {

  const gameInit = new Game(4);
  const [game, setGame] = useState(gameInit);
  startGame(game, setGame);

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
