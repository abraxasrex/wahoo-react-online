import React from 'react';

const y_offset = 15;
const x_offset = 15;

function  GamePiece (props) {

        let slot = props.slot.props;

        function selectPiece(e){
            const id = props._id;
            const managerState = props.manager;
            // allow to deselect piece
            if(managerState.currentPieceId === id) {
                props.cancelSelect();
                return;
            }
            // don't select the wrong player's piece or select anything if there's no roll
            if((props.player.playerNumber !== managerState.currentPlayer.playerNumber)
                || (!managerState.hasRolled)) {
                return;
            }
            managerState.currentPieceId = id;
            props.setGame({manager: managerState});
         //   props.manager.selectPiece(id);
            props.selectPiece(id);
        }

        return (
            <div className={"game-piece " + (props.manager.currentPieceId === props._id ? 'selected-piece' : '')}
                onClick={(e) => selectPiece(e)}
                style={{ backgroundColor: props.player.gameColor || "purple", 
                        left: slot.x + x_offset,
                        bottom: slot.y + y_offset
                    }} >
                <span>
                   pc: {props._id} 
                </span>
            </div>
        );
}

export default GamePiece;