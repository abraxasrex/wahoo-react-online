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
        const players = props.players;
        const playerViews = [];

        for (var i = 0; i < players.length; i++) {
           // playerViews.push(<PlayerView player={players[i]}> </PlayerView>);
        }

      //  this.playerViews = playerViews;
    

  //  render() {
        return (
            <div className="wahoo-game">
                <div>
                    {playerViews}
                </div>
                <div>
                    <GameBoard players={players}></GameBoard>
                </div>
                <div>
                    <DiceView></DiceView>
                </div> 
            </div>
        );
  //  }
}

export default GameView;