import React from 'react';

// playername: string   from player
// currentScore: number
// player: Player
// currentTurn

// <div className="player player-1">
// Player 1
// </div>

const PlayerView = (props) => {
    // constructor(player) {
    //     this.player = player;

        
    // }   
    // const player = props.player;
   // render() {
        return (
            <div className={"player player-view player-" + props.player.playerNumber + ' ' +
                (props.currentPlayer === props.player ? 'current-player' : '')}>
                <span> name: {props.player.playerName} </span>
                <span> score: {props.player.currentScore} </span>
                <span> #: {props.player.playerNumber}</span>
            </div>
        );
}
export default PlayerView;