import React from 'react';


function highlightFirst(x, y) {
    if(x === 0 && y === 125) {
        return true;
    }
}
function Slot (props) {
 // 15 by 15 wth gaps
 // gaps are 12px
 // slots are 14px
 // place them by 19px each
  //  render () {
    const y_offset = 15;
    const x_offset = 15;
        return (
            <div className="game-slot" style={{left: props.x + x_offset, bottom: props.y + y_offset, 
                backgroundColor: highlightFirst(props.x, props.y) ? "red" : 'lightGrey'}}>
            
            </div>
        );
//   }
}

export default Slot;