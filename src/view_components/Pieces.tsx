import React from 'react';
import { iGame } from '../classes/Game';

interface iPiecesProps {
    game: iGame,
    pieces: JSX.Element[],
    manager: any
}

function Pieces({pieces, game, manager}: iPiecesProps): JSX.Element {

    return (
        <span>
            {pieces.map(piece=> piece)}
        </span>
    )
}

export default Pieces;