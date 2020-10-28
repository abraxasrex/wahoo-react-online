
import {getRandomInt} from '../helpers/Helpers';
import GamePiece from '../view_components/GamePiece';


class Player {
    constructor(playerNumber, gameColor){
        this.playerNumber = playerNumber;
        this.gameColor = gameColor;
        this._id = getRandomInt(9999).toString();
        this.selectedSlot = false;
        this.selectedPiece = false;
        this.playerName = "Test";
        this.currentScore = 0;
        this.currentTurn = false;

    }

    selectSlot(slot) {
        this.selectedSlot = slot;
        // finish this function
    }

    changeSelectSlot(slot) {
        slot.canMove = (slot.occupied ?  true : false);
    }


}

export default Player;