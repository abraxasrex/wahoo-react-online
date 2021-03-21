import {iPlayer} from "./Player";
import { iSlot } from "./Slot";


export interface iPiece {
    slot: iSlot;
    key: any;
    _id: string;
    owner: iPlayer;

}

// let piece: any = <GamePiece slot={slots[i]} key={i} _id={i} 
// game={game} manager={game.manager} player={slots[i].props.owner}
// setGame={setGame} cancelSelect={this.cancelSelect}
// selectPiece={this.selectPiece}></GamePiece>;