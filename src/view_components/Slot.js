import React from 'react';


function highlightSlots(x, y, slotType, specialSlotType) {

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
        return "Grey"
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
                backgroundColor: highlightSlots(props.x, props.y, props.slotType, props.specialSlotType)}}>
            <span> { props.x + "," + props.y } </span> 
            </div>
        );
}

export default Slot;