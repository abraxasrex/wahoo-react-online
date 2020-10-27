import React from 'react';

// GamePiece------------
// currentSlot: Slot
// player: Player
// color: player.gameColor

// game-slot game-piece

// <div style={{ height: 10 }}>
//   Hello World!
// </div>
const y_offset = 15;
const x_offset = 15;

function  GamePiece (props) {
    // componentDidMount()  {
    //   //  super(props);
    //    // player={slots[i].owner} color = {slots[i].owner.gameColor

    //     // this.state.player = initialSlot.owner;
    //     // this.state.currentSlot = initialSlot;
    // }
    // render(){
        // console.log("pieces slot: ", props.slot);
        let slot = props.slot.props;

        function selectPiece(props){
            // debugger;
            // const newRoll = props.game.manager.rollDice();
            const id = props._id;
            console.log("calling a parent: ", props.manager.selectPiece(id));

            const managerState = props.manager;
            managerState.currentPiece = id;
            props.setGame({manager: managerState});
            props.selectPiece();
        }

        console.log("BIG  CHUNGUS");
        return (

            
            <div className="game-piece" 
                onClick={(e) => selectPiece(props)}
                style={{ backgroundColor: slot.owner.gameColor || "purple", 
                        left: slot.x + x_offset,
                        bottom: slot.y + y_offset
                    }} >
                <span>
                   pc: {props.manager.currentPiece || 0} 
                </span>
            </div>
        );
    // }
}

export default GamePiece;