import React from 'react';
import PlayerView from './PlayerView';
import Player from '../classes/Player';


class PlayerViews extends React.Component {
    
    players: Array<any>;
    constructor(players: Array<Player>) {
        super(players);
        this.players = players;
    }   
    render() {
        const playerViews: Array<any>= [];

        for (var i = 0; i < this.players.length; i++) {
           // let playerView: any = new PlayerView(this.players[i]);
            let playerView: any = <PlayerView player={this.players[i]}></PlayerView>;
            playerViews.push(playerView);
        }

        return ({playerViews});
    }
}
export default PlayerViews;