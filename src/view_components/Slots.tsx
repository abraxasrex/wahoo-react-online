import React from 'react';
import { iGame } from '../classes/Game';

interface iSlotsProps {
    game: iGame,
    slots: JSX.Element[],
    manager: any
}

function Slots({slots, game, manager}: iSlotsProps):JSX.Element {

    return (
        <span>
            {slots.map(slot=> slot)}
        </span>
    );
}

export default Slots;