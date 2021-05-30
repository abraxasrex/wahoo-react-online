import React from 'react';

const y_offset = 15;
const x_offset = 15;

function  GamePiece (props: any) {

        let piece = props.piece;

        // TODO: change to use game state object, not manager
        function selectPiece(e: any){
            const id = piece._id;
            const gameState = props.game;
            // allow to deselect piece
            if(gameState.currentPiece.key == id) {
                props.cancelSelect(props.manager, props.game, props.setGame);
                return;
            }
            // don't select the wrong player's piece or select anything if there's no roll
            if((piece.owner.playerNumber !== gameState.currentPlayer.playerNumber)
                || (!gameState.hasRolled)) {
                    console.log("Selecting wrong piece!");
                return;
            }
          //  debugger;
             // TODO: is the line below necessary?
            props.setGame(gameState);
            props.selectPiece(id, props.game, props.setGame, props.manager);
        }

        return (
            <div className={"game-piece " + (props.game.currentPiece.key == piece._id ? 'selected-piece' : '')}
                onClick={(e) => selectPiece(e)}
                style={{ backgroundColor: piece.owner.gameColor || "purple", 
                        left: piece.slot.x + x_offset,
                        bottom: piece.slot.y + y_offset
                    }} >
                <span>
                   pc: {piece._id} 
                </span>
            </div>
        );
}

export default GamePiece;