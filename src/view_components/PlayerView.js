import React from 'react';


const PlayerView = (props) => {
        console.log("player: ", props.player);
        return (
            <div className={"player player-view player-" + props.player.playerNumber +
                (props.currentPlayer.playerNumber === props.player.playerNumber ? ' current-player' : '')}>
                <span> name: {props.player.playerName} </span>
                <span> score: {props.player.currentScore} </span>
                <span> #: {props.player.playerNumber}</span>
            </div>
        );
}
export default PlayerView;