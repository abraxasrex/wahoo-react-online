
import {getRandomInt} from '../helpers/Helpers';
// GameManager -----------------------
// currentRoll: int
// currentPlayer: Player
// winner: Player

// setupGame() --->
// setPlayer(0) ---->
// checkforWin () ---->
//     currentPlayer.homeSlotCount === 4 ? triggerwinCondition(currentPlayer)
// triggerWinCondition(player)
// --------------------------------------------

class GameManager {

    currentRoll = 0;
    currentPlayer;
    winner;

    constructor(players) {
        this.players = players;
        this.rollDice = this.rollDice.bind(this);

    }

    setupGame() {

    }

    startGame(players) {
        this.currentPlayer = players[0];
        return this.currentPlayer;
    }

    setPlayer() {

    }

    checkForWin() {

    }

    triggerWinCondition(){

    }

    rollDice(event) {
        this.currentRoll = 
        (6);
        console.log("dice: ", this.currentRoll);
        return this.currentRoll;
        // state...
    }

}

export default GameManager;