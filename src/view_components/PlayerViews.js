import React from 'react';
import PlayerView from './PlayerView';


class PlayerViews extends React.Component {
    constructor(players) {
        super(players);
        this.players = players;
    }   
    render() {
        const players = [];

        for (var i = 0; i < this.players.length; i++) {
            players.push(new PlayerView(this.players[i]));
        }

        return ({players});
    }
}
export default PlayerViews;