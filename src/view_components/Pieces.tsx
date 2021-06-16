import React from 'react';
import { iGame } from '../classes/Game';

import {iPiecesProps} from '../interfaces/index';

function Pieces({pieces, game, manager}: iPiecesProps): JSX.Element {

    return (
        <span>
            {pieces.map(piece=> piece)}
        </span>
    )
}

export default Pieces;