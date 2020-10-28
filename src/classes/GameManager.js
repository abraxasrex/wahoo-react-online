
import {getRandomInt} from '../helpers/Helpers';

class GameManager {

    currentRoll = 0;
    currentPlayer;
    currentPiece;
    winner;

    constructor(players) {
        this.players = players;
        this.rollDice = this.rollDice.bind(this);
        this.selectPiece = this.selectPiece.bind(this);

        this.slots = [];
        this.pieces = [];
    }

    startGame(players) {
        this.currentPlayer = players[0];
        return this.currentPlayer;
    }

    rollDice(event) {
        this.currentRoll = getRandomInt(6);
        console.log("dice: ", this.currentRoll);
        return this.currentRoll;
    }

    selectPiece(id) {
        this.currentPiece = id;
        console.log("piece!: ", this.currentPiece);
        // this.highlightSteps();
    }

    async secondaryPathfinding() {

    }

    async highlightSteps () {
        let slots = {...this.slots};
        let currentSlot = this.currentPiece.props.slot;

        // in Start 
        if (currentSlot.slotType === "Start" && (this.currentRoll === 1 || this.currentRoll === 6)) {
            // identify 
        } else {
            return false;
        }

        //on Track

        //in End

        for(var i = 0; i < slots.length; i++) {

            

        }

        // set this.availableSlots
    }

    checkForWin() {

    }

    triggerWinCondition(){

    }
}

export default GameManager;