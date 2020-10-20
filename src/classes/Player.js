
import {getRandomInt} from '../helpers/Helpers';
import GamePiece from '../view_components/GamePiece';
// Player-----------------------
// GamePieces: GamePiece []
// selectedSlot: Slot
// selectedPiece: GamePiece
// _id: string
// playerNumber: 1 | 2 | 3 | 4
// name
// gameColor: string (red | yellow | green | blue)

// selectSlot(slot) ---->
// // if slot.occupied ==== player
// // 
// //
// //
// //
//     Slot.isOccupied && ()
// changeSelectSlot() ---> 
//     slot.occupied? slot.canMove = true : slot.canMove  = false;
// selectSlot() ---->
//     slot.selectedSlot 
// ---------------------------------------

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
        // setup game pieces
        const gamePieces = [];
        // for (let i = 0; i < 4; i++) {
        //     gamePieces.push(new GamePiece(this, undefined));
        // }   
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