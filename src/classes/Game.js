
// Game --------------------------
// gameView: GameView
// players: Players[]
// gameManager: GameManager;

import GameManager from './GameManager';
import GameView from '../view_components/GameView';
import Player from './Player';
// game view?

const colorSet = ["Red", "Blue", "Green", "Yellow"];


class Game {
    constructor(playerNumber) {
        const players = [];
        
        
        for (var i=0; i < 4; i++) {
            players.push(new Player((i + 1), colorSet[i]));
        }
        
        this.players = players;
        this.manager = new GameManager(players);

     //   this.gameView = new GameView(this.players);
    }
}

export default Game;