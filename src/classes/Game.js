


import GameManager from './GameManager';
import Player from './Player';

const colorSet = ["Red", "Blue", "Green", "Yellow"];


class Game {
    constructor(playerNumber) {
        const players = [];
        
        
        for (var i=0; i < 4; i++) {
            players.push(new Player((i + 1), colorSet[i]));
        }
        
        this.players = players;
        this.manager = new GameManager(players);
    }
}

export default Game;