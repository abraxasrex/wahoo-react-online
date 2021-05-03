import React from 'react';
import {iPlayer, Player} from '../classes/Player';
import { iSlot } from '../classes/Slot';

function moveHere(props: any, e: any){
    e.preventDefault();
    const key = props._key;
   // debugger;
    const managerState = props.manager;

    if(managerState.availableSlots[key]) {
      //  managerState.currentSlot = props;
        let lastSlot = managerState.currentPiece.props.slot;
        props.moveToSlot(props, lastSlot);
    }
}

function highlightSlots(x: number, y: number, slotType: string, specialSlotType: string, owner: iPlayer) {



    if(specialSlotType && specialSlotType === "Entry") {
        return "brown"
    }
    if(specialSlotType && specialSlotType === "Exit") {
        return "pink"
    }
    if(specialSlotType && specialSlotType === "Jump") {
        return "turquoise"
    }
    // slot types for testing mainly
    if(x === 0 && y === 125) {
        return "orange";
    } else if (slotType === "End" || slotType === "Start") {
        return owner.gameColor || "Grey"
    } else if (slotType === "Center"){
        return "Blue"
    } 
    return "lightgrey";
}

function Slot (props: any) {

    const y_offset = 15;
    const x_offset = 15;
    console.log("props SLOTTTTTT: ", props.slot);
    const x: number = props.slot?.x || 0;
    const y: number = props.slot?.y || 0;

        return (
            <div className={"game-slot" + (props.availableSlots[props._key] ? ' available-slot' : '')} 
                style={{left: x + x_offset, bottom: y + y_offset, 
                backgroundColor: highlightSlots(x, y, props.slotType, props.specialSlotType, props.owner)}}
                onClick={(e) => moveHere(props, e)}>
                <span> 
                    { /* props.x + "," + props.y */} 
                    { props.order }
                </span> 
            </div>
        );
}

export default Slot;