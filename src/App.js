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

function App() {

  // const [game, setGame] = useState([]);

  // setGame(new Game());
  const game = new Game();

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Wahoo
        </p>
          <GameView players={game.players}/>
      </header>
    </div>
  );
}

export default App;
