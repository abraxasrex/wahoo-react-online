import React from 'react';


function highlightSlots(x, y, slotType) {
    if(x === 0 && y === 125) {
        return "orange";
    } else if (slotType === "End" || slotType === "Start") {
        return "Grey"
    } else if (slotType === "Center"){
        return "Blue"
    } else {
        return "lightGrey"
    }
}
function Slot (props) {
 // 15 by 15 wth gaps
 // gaps are 12px
 // slots are 14px
 // place them by 19px each
  //  render () {
    console.log("PUNGUS!");

    const y_offset = 15;
    const x_offset = 15;
        return (
            <div className={"game-slot " + (props.availableSlot ? ' available-slot' : '')} style={{left: props.x + x_offset, bottom: props.y + y_offset, 
                backgroundColor: highlightSlots(props.x, props.y, props.slotType)}}>
            <span> {props.manager.currentPiece || 0 }</span>
            </div>
        );
//   }
}

export default Slot;