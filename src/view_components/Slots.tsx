import React from 'react';
import { iGame } from '../classes/Game';

interface iSlotsProps {
    game: iGame,
    slots: JSX.Element[],
    manager: any
}

function Slots({slots = [], game, manager}: iSlotsProps):JSX.Element {
  //  console.log("slots component slots: ", slots);
    return (
        <div className="slots-container">
            {slots.map(slot=> slot)}
        </div>
    );
}

export default Slots;