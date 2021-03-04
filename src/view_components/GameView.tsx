import React from 'react';
import GameBoard from './GameBoard';
import DiceView from './DiceView';
import PlayerView from './PlayerView';



const GameView = (props: any) => {
    const playerViews = [];

    if (props && props.game && props.game.manager && props.game.manager.players) {
        for (var i = 0; i < props.game.manager.players.length; i++) {
            playerViews.push(<PlayerView player={props.game.manager.players[i]} currentPlayer={props.game.manager.currentPlayer} key={i}> </PlayerView>);
         }
    }

    return (
        <div className="wahoo-game">
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
        </div>
    );
}

export default GameView;