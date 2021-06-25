import React from 'react';
import {Player, iPlayer} from '../classes/Player';
import { iGame } from '../classes/Game';

import LobbyPlayer from './LobbyPlayer';

class LobbyPlayers extends React.Component<any> {
    

    clientPlayerId: any;

    constructor(props: any) {
       super(props);
       this.clientPlayerId = props.clientPlayerId;
    }

    render() {
        const playerViews: Array<any>= [];
        let players = [...this.props.players];

        for (var i = 0; i < players?.length; i++) {
            let playerView: any = 
                (<LobbyPlayer 
                    key={i} 
                    player={players[i]} 
                    index={i}
                    clientPlayerId={this.clientPlayerId}
                    emitter={this.props.lobby.emitter || this.props.emitter}
                    setLobby={this.props.setLobby} 
                    lobby={this.props.lobby}></LobbyPlayer>);

                playerViews.push(playerView);
        }

        return (playerViews);
    }
}
export default LobbyPlayers;