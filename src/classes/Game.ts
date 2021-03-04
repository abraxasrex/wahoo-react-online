import GameManager from './GameManager';
import Player from './Player';

const colorSet = ["Red", "Blue", "Green", "Yellow"];

// export interface IGame {
//     players: Array<IPlayer>;

// }
export class Game {

    players: Array<Player>;
    manager: GameManager;

    constructor(playerNumber: number) {
        const players = [];
        
        
        for (var i=0; i < playerNumber; i++) {
            players.push(new Player((i + 1), colorSet[i]));
        }
        
        this.players = players;
        this.manager = new GameManager(players);
    }
}

export default Game;