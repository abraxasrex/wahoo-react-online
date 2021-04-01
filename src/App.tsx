import React,{useState} from 'react';
import GameBoard from './view_components/GameBoard';
// import Game from './classes/Game';
import GameView from './view_components/GameView';
import logo from './logo.svg';
import './App.css';
import {GameManager} from './helpers/GameManager';


import {Game, iGame} from './classes/Game';
import {colorSet } from './classes/Game';
import {iPlayer, Player} from './classes/Player';

const startGame = async (game: any, gameSetter: any)  => {
  
  const players: iPlayer[] = [];
  const numberOfPlayers = 4;

  for (var i=0; i < numberOfPlayers; i++) {
    players.push(Player((i + 1), colorSet[i]));
  }
  await gameSetter({...game, players: players});

  return players;
};

function App() {
  
  const players: iPlayer[] = [];
  const numberOfPlayers = 4;

  for (var i=0; i < numberOfPlayers; i++) {
    players.push(Player((i + 1), colorSet[i]));
  }

  let gameInit: iGame = Game;
  const manager = new GameManager();

  gameInit.players = players;

  const [game, setGame] = useState<iGame>(gameInit);
  
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Wahoo
        </p>  
        <div className="wahoo-game">
          <GameView startGame={startGame} players={players} manager={manager}
            game={game} setGame={setGame}></GameView>
        </div>
      </header>
    </div>
  );
}

{/* <div className="wahoo-game">
<div>
    {playerViews}
</div>
<div>
    <GameBoard game={props.game} manager={props.game.manager} setGame={props.setGame}></GameBoard>
</div>
<div>
    <DiceView manager={props.game.manager} currentRoll={props.currentRoll}
    game={props.game} setGame={props.setGame}></DiceView>
</div> 
</div> */}

export default App;
