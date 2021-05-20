import React from 'react';
import PlayerView from './PlayerView';
import {Player, iPlayer} from '../classes/Player';



class PlayerViews extends React.Component<any> {
    
    players: iPlayer[];
    constructor(props: any) {
        super(props);
        this.players = props.players;
    }   
    render() {
        const playerViews: Array<any>= [];

        for (var i = 0; i < this.players?.length; i++) {
            let playerView: any = <PlayerView player={this.players[i]} key={this.players[i]._id}></PlayerView>;
            playerViews.push(playerView);
        }

        return (playerViews);
    }
}
export default PlayerViews;