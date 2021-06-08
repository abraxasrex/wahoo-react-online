import React from 'react';
// import PlayerView from './PlayerView';
import {Player, iPlayer} from '../classes/Player';
import { iGame } from '../classes/Game';

import LobbyPlayer from './LobbyPlayer';

class LobbyPlayers extends React.Component<any> {
    
    // players: iPlayer[];
    players: any[];
    // game: iGame;
    constructor(props: any) {
        super(props);
        this.players = props.players;
      //  this.game = props.game;
      console.log(" a player viewssss has rendered! ", props);

    }   
    render() {
        const playerViews: Array<any>= [];
        let players = this.props.players;

        for (var i = 0; i < players?.length; i++) {
            let playerView: any = <LobbyPlayer player={players[i]} key={i} 
            index={i}
            setLobby={this.props.setLobby} lobby={this.props.lobby}></LobbyPlayer>;
            playerViews.push(playerView);
        }

        return (playerViews);
    }
}
export default LobbyPlayers;