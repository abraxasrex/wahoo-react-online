import {Game, iGame} from './Game';
import {iPlayer} from './Player';

export enum iSpecialSlotType {
    Entry,
    Exit,
    Jump
}

export enum iSlotType {
    Track,
    End,
    Center,
    Start
}

export interface iSlot {
    x?: number;
    y?: number;
    occupied?: iPlayer;
    slotType?: iSlotType;
    specialSlotType?: iSpecialSlotType;
    orderId?: number;
    key?: any;
    owner?: iPlayer;
}