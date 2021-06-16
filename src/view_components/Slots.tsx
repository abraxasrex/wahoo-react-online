import React from 'react';
import { iGame } from '../classes/Game';

import {iSlotsProps} from '../interfaces/index';

function Slots({slots = [], game, manager}: iSlotsProps):JSX.Element {
    return (
        <div className="slots-container">
            {slots.map(slot=> slot)}
        </div>
    );
}

export default Slots;