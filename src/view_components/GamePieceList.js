import React from 'react';
import GamePiece from './GamePiece';


function GamePieceList(props) {
    let pieces = props.gamePieces;
    return (
        {pieces}
    );
}

export default GamePieceList;
