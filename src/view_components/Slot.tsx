import React from 'react';
import {iPlayer, Player} from '../classes/Player';
import { iSlot, iSlotType, iSpecialSlotType } from '../classes/Slot';

function moveHere(props: any, e: any){
    e.preventDefault();
    const key = props.slot.key;
   // debugger;
    const gameState = props.game;

    if(gameState.availableSlots[key]) {
      //  managerState.currentSlot = props;
        let lastSlot = gameState.currentPiece.slot;
        props.moveToSlot(props.slot, lastSlot, props.manager, props.game, props.setGame);
    }
}

function highlightSlots(x: number, y: number, slotType: iSlotType, specialSlotType: iSpecialSlotType, owner: iPlayer) {

   
  
    if(owner) {
        return owner?.gameColor;
    }

    if(specialSlotType === iSpecialSlotType.Entry) {
        return "brown"
    }

    if(specialSlotType && specialSlotType === iSpecialSlotType.Jump) {
        return "turquoise"
    } 

    // slot types for testing mainly
    if(x === 0 && y === 125) {
        return "orange";
    } 
    // else if (slotType === "End" || slotType === "Start") {
    //     return owner.gameColor || "Grey"
    // } else if (slotType === "Center"){
    //     return "Blue"
    // } 
    return "lightgrey";
}

function Slot (props: any) {

    const y_offset = 15;
    const x_offset = 15;
    const x: number = props.slot?.x || 0;
    const y: number = props.slot?.y || 0;

        return (
            <div className={"game-slot" + (props?.availableSlots[props.slot.key] ? ' available-slot' : '')} 
                style={{left: x + x_offset, bottom: y + y_offset, 
                backgroundColor: highlightSlots(x, y, props.slot.slotType, props.slot.specialSlotType, props.slot.owner)}}
                onClick={(e) => moveHere(props, e)}>
                <span> 
                    { props.slot.orderId }
                </span> 
            </div>
        );
}

export default Slot;