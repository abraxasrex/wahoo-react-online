
import {getRandomInt} from '../helpers/Helpers';
import GamePiece from '../view_components/GamePiece';
import { iPiece } from './Piece';
import { iSlot } from './Slot';


export interface iPlayer {
    playerNumber: number;
    gameColor: string;
    _id: string;
    selectedSlot?: iSlot;
    selectedPiece?: iPiece;
    playerName?: string;
    currentScore: number;
    currentTurn?: boolean;
    specialSlots: object;
    key?: any;
}

export const  Player = (playerNumber: number, gameColor: string):iPlayer => {
    
    return {
        playerNumber: playerNumber,
        gameColor: gameColor,
        _id: getRandomInt(9999).toString(),
        selectedSlot: undefined,
        selectedPiece: undefined,
        playerName: undefined,
        currentScore: 0,
        currentTurn: undefined,
        specialSlots: {},
        key: undefined
    }
}

// class Player {

//     playerNumber: number;
//     gameColor: string;
//     _id: string;
//     selectedSlot: any;
//     selectedPiece: any;
//     playerName: string;
//     currentScore: number;
//     currentTurn: any;
//     specialSlots: any;

//     constructor(playerNumber: number, gameColor: string){
//         this.playerNumber = playerNumber;
//         this.gameColor = gameColor;
//         this._id = getRandomInt(9999).toString();
//         this.selectedSlot = undefined;
//         this.selectedPiece = undefined;
//         this.playerName = "Test";
//         this.currentScore = 0;
//         this.currentTurn = undefined;
//         this.specialSlots = {};

//     }

//     selectSlot(slot: any) {
//         this.selectedSlot = slot;
//         // finish this function
//     }

//     changeSelectSlot(slot: any) {
//         slot.canMove = (slot.occupied ?  true : false);
//     }


// }

// export default Player;