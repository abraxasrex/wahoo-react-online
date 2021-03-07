import React from 'react';

const y_offset = 15;
const x_offset = 15;

function  GamePiece (props: any) {

        let slot = props.slot.props;

        function selectPiece(e: any){
            const id = props._id;
            const managerState = props.manager;
            // allow to deselect piece
            if(managerState.currentPiece.key == id) {
                props.cancelSelect();
                return;
            }
            // don't select the wrong player's piece or select anything if there's no roll
            if((props.player.playerNumber !== managerState.currentPlayer.playerNumber)
                || (!managerState.hasRolled)) {
                return;
            }
            props.setGame({manager: managerState});
            props.selectPiece(id);
        }

        return (
            <div className={"game-piece " + (props.manager.currentPiece.key === props._id ? 'selected-piece' : '')}
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