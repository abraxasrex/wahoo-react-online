
import {getRandomInt} from '../helpers/Helpers';
import { iSpecialSlot } from '../interfaces/index';
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
    specialSlots: any;
    key?: any;
    endSlotKeys?: any[];
    startSlotKeys: any[];
    endCounter: number;
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
        key: undefined,
        endSlotKeys: [],
        startSlotKeys: [],
        endCounter: 0
    }
}