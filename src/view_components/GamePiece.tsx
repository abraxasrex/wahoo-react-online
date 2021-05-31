import React from 'react';
import {iGame} from '../classes/Game';
import { iSlotType } from '../classes/Slot';
const y_offset = 15;
const x_offset = 15;

function  GamePiece (props: any) {

        let piece = props.piece;

        // TODO: change to use game state object, not manager

        // if(gameState.availableSlots[piece.slot.key]
        //     && piece.owner != gameState.currentPlayer) {           
        //  //   kickHome(gameState, id);

        // function kickHome (gameState: any, currentId: any, setGame: any, moveToSlot: any) {
        //     let thisPiece = piece;
        //     let thisSlot = thisPiece.slot;

        //    for(let i = 0; i < piece.owner.startSlotKeys.length; i++) {
        //      //   for(let i = 0; i < 5; i++) {
        //         let key = piece.owner.startSlotKeys[i];
        //         if(!gameState.slots[key].occupied) {

        //            // thisPiece.slot = piece;
        //            // thisSlot.owner = undefined;
        //             thisPiece.slot = gameState.slots[key];
        //             thisSlot.occupied = undefined;

        //             let newState = gameState;

        //             newState.pieces[thisPiece._id] = thisPiece;
        //             newState.slots[thisSlot.key] = thisSlot;

        //             props.setGame(newState);

        //             props.moveToSlot(thisSlot, newState.currentPiece.slot, props.manager, newState, props.setGame);
        //             return;
        //         }
        //     }
        // }

        function selectPiece(e: any){
            const id = piece._id;
            const gameState = props.game;

            // if enemy piece: kickHome
            if(gameState.availableSlots[piece.slot.key]
                && piece.owner != gameState.currentPlayer) {           
             //   kickHome(gameState, id);
           //  ameState: any, setGame: any, moveToSlot: any, piece: any, manager:any
                    props.manager.kickHome(gameState, props.setGame, props.moveToSlot, piece, props.manager, true);
                  //  gameState: any, currentId: any, setGame: any, moveToSlot: any, piece: any, manager:any
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