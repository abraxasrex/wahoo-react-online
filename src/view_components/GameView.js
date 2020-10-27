import React from 'react';
import GameBoard from './GameBoard';
import DiceView from './DiceView';
// import PlayerViews from './PlayerViews';
import PlayerView from './PlayerView';

// GameView -----------------------
// gameBoard: GameBoard
// diceView: DiceView
// playerViews: PlayerViews []

const GameView = (props) => {
    // constructor(players) { 
    //     super(players);
      //  this.gameBoard = new GameBoard();
       // this.players = props.players;
        // this.diceView = new DiceView();
        // this.playerViews = new PlayerViews(players);
        // const players = props.players;


        const playerViews = [];
    console.log("game view! ", props);

    if (props && props.game && props.game.manager && props.game.manager.players) {
        for (var i = 0; i < props.game.manager.players.length; i++) {
            playerViews.push(<PlayerView player={props.game.manager.players[i]} currentPlayer={props.game.manager.currentPlayer} key={i}> </PlayerView>);
         }


    }




      //  this.playerViews = playerViews;
    

  //  render() {
        return (
            <div className="wahoo-game">
                <div>
                    {playerViews}
                </div>
                <div>
                    <GameBoard game={props.game} manager={props.game.manager} setGame={props.setGame}></GameBoard>
                </div>
                <div>
                    <DiceView manager={props.game.manager} game={props.game} setGame={props.setGame}></DiceView>
                </div> 
            </div>
        );
  //  }
}

export default GameView;