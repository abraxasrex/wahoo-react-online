import React from 'react';
import {iGame} from '../classes/Game';
import { iSlotType } from '../classes/Slot';
const y_offset = 15;
const x_offset = 15;

function  GamePiece (props: any) {

        let piece = props.piece;

        function selectPiece(e: any){
            const id = piece._id;
            const gameState = props.game;

            // if enemy piece: kickHome
            if(gameState.availableSlots[piece.slot.key]
                && piece.owner != gameState.currentPlayer) {           
                props.manager.kickHome(gameState, props.setGame, props.moveToSlot, piece, props.manager, true);
            } else if(piece.slot.slotType == iSlotType.End) {
                // you can't move this anymore!
                return;
            }

            // allow to deselect piece
            else if(gameState.currentPiece.key == id) {
                props.cancelSelect(props.manager, props.game, props.setGame);
              //  return;
            }

            // don't select the wrong player's piece or select anything if there's no roll
            else if((piece.owner.playerNumber !== gameState.currentPlayer.playerNumber)
                || (!gameState.hasRolled)) {
                    console.log("Selecting wrong piece!");
              //  return;
            } else {
                props.setGame(gameState);
                props.selectPiece(id, props.game, props.setGame, props.manager);
            }
     
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