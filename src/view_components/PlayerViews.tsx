import React from 'react';
import PlayerView from './PlayerView';
import {Player, iPlayer} from '../classes/Player';
import { iGame } from '../classes/Game';



class PlayerViews extends React.Component<any> {
    
    players: iPlayer[];
    game: iGame;
    constructor(props: any) {
        super(props);
        this.players = props.players;
        this.game = props.game;
    }   
    render() {
        const playerViews: Array<any>= [];

        for (var i = 0; i < this.players?.length; i++) {
            let playerView: any = <PlayerView player={this.players[i]} key={this.players[i]._id} 
                currentPlayer={this.game.currentPlayer}></PlayerView>;
            playerViews.push(playerView);
        }

        return (playerViews);
    }
}
export default PlayerViews;