import {iPlayer} from "./Player";
import { iSlot } from "./Slot";


export interface iPiece {
    slot?: iSlot;
    key?: any;
    _id?: string;
    owner?: iPlayer;

}