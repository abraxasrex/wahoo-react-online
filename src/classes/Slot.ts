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
    Start,
    Center
}

export interface iSlot {
    x: number;
    y: number;
    occupied: boolean;
    slotType: iSlotType;
    specialSlotType?: iSpecialSlotType;
    orderId: number;
    key: any;
    owner?: iPlayer;
}

// TODO: 
// move game, setGame & moveToSlot to being passed through props and not the object model

// <Slot x={slot.x} y={slot.y} occupied={slot.occupied} 
//                 slotType={slot.slotType} specialSlotType={slot.specialSlotType}
//                 game={this.props.game} 
//                 availableSlots={this.props.game.manager.availableSlots}
//                 setGame={this.props.setGame} 
//                 manager={this.props.game.manager}
//                 moveToSlot={this.moveToSlot}
//                 order={slot.order} 
//                 _key={newKey} 
//                 key={newKey}
//                 owner={slot.owner}>
//             </Slot>