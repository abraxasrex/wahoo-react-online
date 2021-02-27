import React from 'react';

function moveHere(props, e){
    e.preventDefault();
    const key = props._key;
    const managerState = props.manager;

    if(managerState.availableSlots[key]) {
      //  managerState.currentSlot = props;
        props.moveToSlot(key);
    }
}

function highlightSlots(x, y, slotType, specialSlotType, owner) {

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

function Slot (props) {

    const y_offset = 15;
    const x_offset = 15;

        return (
            <div className={"game-slot" + (props.manager.availableSlots[props._key] ? ' available-slot' : '')} 
                style={{left: props.x + x_offset, bottom: props.y + y_offset, 
                backgroundColor: highlightSlots(props.x, props.y, props.slotType, props.specialSlotType, props.owner)}}
                onClick={(e) => moveHere(props, e)}>
                <span> 
                    {/* props.x + "," + props.y */} 
                    {props.count}
                </span> 
            </div>
        );
}

export default Slot;