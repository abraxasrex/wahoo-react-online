import GameManager from '../helpers/GameManager';
import {iPlayer} from './Player';

export const colorSet = ["Red", "Blue", "Green", "Yellow"];

export interface iGame {
    players: iPlayer[],
    slots: object,
    pieces: object,
    currentPiece: object,
    availableSlots: object,
    hasRolled: boolean,
    currentPlayer?: iPlayer,
    currentSlot?: object,
    currentRound: number,
    currentRoll?: number,
    specialSlots?: any, 
    winner?: iPlayer
} 

export const Game: iGame = {

    players: [],
    slots:{},
    pieces: {},
    currentPiece: {key: undefined},
    availableSlots: {},
    hasRolled: false,
    currentPlayer: undefined,
    currentSlot: undefined,
    currentRound: 0,
    currentRoll: undefined,
    specialSlots: {},
    winner: undefined
}