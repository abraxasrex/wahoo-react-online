import React,{useState} from 'react';
import GameBoard from './view_components/GameBoard';
import GameView from './view_components/GameView';
import logo from './logo.svg';
import './App.css';
import {GameManager} from './helpers/GameManager';


import {Game, iGame} from './classes/Game';
import {colorSet } from './classes/Game';
import {iPlayer, Player} from './classes/Player';

const startGame = async (game: any, gameSetter: any)  => {
  await gameSetter({...game, currentPlayer: game.players[0]});
};

function Oofda(props: any) {
  
 // const stateTest = props.history.location.state

  console.log("props test: ", props);

  const players: iPlayer[] = [];
  const numberOfPlayers = 4;

  for (var i=0; i < numberOfPlayers; i++) {
    players.push(Player((i + 1), colorSet[i]));
  }

  let gameInit: iGame = Game;
  const manager = new GameManager();

  gameInit.players = players;

  const [game, setGame] = useState<iGame>(gameInit);
  
  const triggerSetGame = (newState: iGame):any => {
    let state = {...newState};
    setGame(state);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Oofda
        </p>  
        <div className="wahoo-game">
          <GameView startGame={startGame} players={players} manager={manager}
            _slots={game.slots} _pieces={game.pieces}
            game={game} setGame={triggerSetGame}></GameView>
        </div>
      </header>
    </div>
  );
}

export default Oofda;
