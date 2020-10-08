import React from 'react';

// playername: string   from player
// currentScore: number
// player: Player

// <div className="player player-1">
// Player 1
// </div>

const PlayerView = (props) => {
    // constructor(player) {
    //     this.player = player;

        
    // }   
    const player = props.player;
   // render() {
        return (
            <div className={"player player-view " + this.player.playerNumber}>
                <span> name: {this.player.playerName} </span>
                <span> score: {this.player.currentScore} </span>
            </div>
        );
 //   }
}
export default PlayerView;